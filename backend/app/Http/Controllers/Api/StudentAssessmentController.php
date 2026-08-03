<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AssessmentResource;
use App\Models\Assessment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentAssessmentController extends Controller
{
    /**
     * Display assessments for the logged-in student.
     */
    public function index(Request $request)
    {
        $student = $request->user()->student;

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student profile not found.',
            ], 404);
        }

        $search = trim(
            (string) $request->query('search', '')
        );

        $type = trim(
            (string) $request->query('type', '')
        );

        $subjectId = $request->query('subject_id');

        /*
         * Get the IDs of subjects registered
         * to the current student.
         */
        $registeredSubjectIds = $student
            ->subjects()
            ->pluck('subjects.id');

        $assessments = Assessment::query()
            ->with([
                'subject',
                'creator',
            ])

            /*
             * Student can only see assessments belonging
             * to their registered subjects.
             */
            ->whereIn(
                'subject_id',
                $registeredSubjectIds
            )

            /*
             * Draft and cancelled assessments
             * are hidden from students.
             */
            ->whereIn('status', [
                'published',
                'closed',
            ])

            /*
             * Do not display the assessment before
             * its available date.
             */
            ->where(function ($query) {
                $query
                    ->whereNull('available_from')
                    ->orWhere(
                        'available_from',
                        '<=',
                        now()
                    );
            })

            /*
             * Search by assessment title,
             * subject code, or subject name.
             */
            ->when(
                $search !== '',
                function ($query) use ($search) {
                    $query->where(
                        function ($assessmentQuery) use (
                            $search
                        ) {
                            $assessmentQuery
                                ->where(
                                    'title',
                                    'like',
                                    "%{$search}%"
                                )
                                ->orWhereHas(
                                    'subject',
                                    function (
                                        $subjectQuery
                                    ) use ($search) {
                                        $subjectQuery
                                            ->where(
                                                'subject_code',
                                                'like',
                                                "%{$search}%"
                                            )
                                            ->orWhere(
                                                'subject_name',
                                                'like',
                                                "%{$search}%"
                                            );
                                    }
                                );
                        }
                    );
                }
            )

            ->when(
                $type !== '',
                fn ($query) =>
                    $query->where('type', $type)
            )

            ->when(
                !empty($subjectId),
                fn ($query) =>
                    $query->where(
                        'subject_id',
                        $subjectId
                    )
            )

            ->latest()
            ->paginate(10)
            ->withQueryString();

        return AssessmentResource::collection(
            $assessments
        );
    }

    /**
     * Display one assessment for the logged-in student.
     */
    public function show(
        Request $request,
        Assessment $assessment
    ): JsonResponse {
        $student = $request->user()->student;

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student profile not found.',
            ], 404);
        }

        $isRegistered = $student
            ->subjects()
            ->where(
                'subjects.id',
                $assessment->subject_id
            )
            ->exists();

        if (!$isRegistered) {
            return response()->json([
                'success' => false,
                'message' =>
                    'You are not registered for this subject.',
            ], 403);
        }

        if (
            !in_array(
                $assessment->status,
                ['published', 'closed'],
                true
            )
        ) {
            return response()->json([
                'success' => false,
                'message' =>
                    'This assessment is not available.',
            ], 403);
        }

        if (
            $assessment->available_from !== null &&
            $assessment->available_from->isFuture()
        ) {
            return response()->json([
                'success' => false,
                'message' =>
                    'This assessment is not available yet.',
            ], 403);
        }

        $assessment->load([
            'subject',
            'creator',
        ]);

        return response()->json([
            'success' => true,
            'data' => new AssessmentResource(
                $assessment
            ),
        ]);
    }
}