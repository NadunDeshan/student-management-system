<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAssessmentRequest;
use App\Http\Requests\UpdateAssessmentRequest;
use App\Http\Resources\AssessmentResource;
use App\Models\Assessment;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class AssessmentController extends Controller
{
    /**
     * List assessments.
     *
     * Admin:
     * - Can see all assessments.
     *
     * Lecturer:
     * - Can see only assessments belonging to their subjects.
     */
    public function index(Request $request)
    {
        $search = trim(
            (string) $request->query('search', '')
        );

        $type = trim(
            (string) $request->query('type', '')
        );

        $status = trim(
            (string) $request->query('status', '')
        );

        $user = $request->user();

        $assessments = Assessment::query()
            ->with([
                'subject',
                'creator',
            ])

            /*
             * Lecturer can only view assessments for
             * subjects assigned to that lecturer.
             */
            ->when(
                $user->role === 'lecturer',
                function ($query) use ($user) {
                    $lecturerId = $user->lecturer?->id;

                    $query->whereHas(
                        'subject',
                        function ($subjectQuery) use (
                            $lecturerId
                        ) {
                            $subjectQuery->where(
                                'lecturer_id',
                                $lecturerId
                            );
                        }
                    );
                }
            )

            /*
             * Search by assessment title,
             * subject code or subject name.
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
                                ->orWhere(
                                    'description',
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
                $status !== '',
                fn ($query) =>
                    $query->where('status', $status)
            )

            ->latest()
            ->paginate(10)
            ->withQueryString();

        return AssessmentResource::collection(
            $assessments
        );
    }

    /**
     * Create an assessment.
     */
    public function store(
        StoreAssessmentRequest $request
    ): JsonResponse {
        $uploadedAttachment = null;

        try {
            $validated = $request->validated();

            /*
             * Check whether the current user is allowed
             * to create an assessment for the subject.
             */
            $this->ensureSubjectAccess(
                $request,
                (int) $validated['subject_id']
            );

            if ($request->hasFile('attachment')) {
                $uploadedAttachment = $request
                    ->file('attachment')
                    ->store(
                        'assessments/attachments',
                        'public'
                    );

                $validated['attachment'] =
                    $uploadedAttachment;
            }

            $validated['created_by'] =
                $request->user()->id;

            $assessment = DB::transaction(
                fn () => Assessment::create(
                    $validated
                )
            );

            $assessment->load([
                'subject',
                'creator',
            ]);

            return response()->json([
                'success' => true,
                'message' =>
                    'Assessment created successfully.',
                'data' =>
                    new AssessmentResource(
                        $assessment
                    ),
            ], 201);
        } catch (Throwable $exception) {
            if (
                $uploadedAttachment !== null &&
                Storage::disk('public')->exists(
                    $uploadedAttachment
                )
            ) {
                Storage::disk('public')->delete(
                    $uploadedAttachment
                );
            }

            /*
             * Do not hide authorization exceptions.
             */
            if (
                method_exists($exception, 'getStatusCode') &&
                in_array(
                    $exception->getStatusCode(),
                    [403, 404],
                    true
                )
            ) {
                throw $exception;
            }

            report($exception);

            return response()->json([
                'success' => false,
                'message' =>
                    'Unable to create the assessment.',
            ], 500);
        }
    }

    /**
     * Display one assessment.
     */
    public function show(
        Request $request,
        Assessment $assessment
    ): JsonResponse {
        $assessment->load([
            'subject',
            'creator',
        ]);

        $this->ensureAssessmentAccess(
            $request,
            $assessment
        );

        return response()->json([
            'success' => true,
            'data' =>
                new AssessmentResource(
                    $assessment
                ),
        ]);
    }

    /**
     * Update an assessment.
     */
    public function update(
        UpdateAssessmentRequest $request,
        Assessment $assessment
    ): JsonResponse {
        $oldAttachment =
            $assessment->attachment;

        $newAttachment = null;

        try {
            $this->ensureAssessmentAccess(
                $request,
                $assessment
            );

            $validated = $request->validated();

            /*
             * Lecturer must also own the newly selected
             * subject when changing subject_id.
             */
            $this->ensureSubjectAccess(
                $request,
                (int) $validated['subject_id']
            );

            if ($request->hasFile('attachment')) {
                $newAttachment = $request
                    ->file('attachment')
                    ->store(
                        'assessments/attachments',
                        'public'
                    );

                $validated['attachment'] =
                    $newAttachment;
            }

            DB::transaction(function () use (
                $assessment,
                $validated
            ) {
                $assessment->update($validated);
            });

            /*
             * Delete the old PDF only after the database
             * update succeeds.
             */
            if (
                $newAttachment !== null &&
                $oldAttachment !== null &&
                Storage::disk('public')->exists(
                    $oldAttachment
                )
            ) {
                Storage::disk('public')->delete(
                    $oldAttachment
                );
            }

            return response()->json([
                'success' => true,
                'message' =>
                    'Assessment updated successfully.',
                'data' =>
                    new AssessmentResource(
                        $assessment->fresh([
                            'subject',
                            'creator',
                        ])
                    ),
            ]);
        } catch (Throwable $exception) {
            /*
             * Remove the new PDF when update fails.
             */
            if (
                $newAttachment !== null &&
                Storage::disk('public')->exists(
                    $newAttachment
                )
            ) {
                Storage::disk('public')->delete(
                    $newAttachment
                );
            }

            if (
                method_exists($exception, 'getStatusCode') &&
                in_array(
                    $exception->getStatusCode(),
                    [403, 404],
                    true
                )
            ) {
                throw $exception;
            }

            report($exception);

            return response()->json([
                'success' => false,
                'message' =>
                    'Unable to update the assessment.',
            ], 500);
        }
    }

    /**
     * Delete an assessment.
     */
    public function destroy(
        Request $request,
        Assessment $assessment
    ): JsonResponse {
        try {
            $this->ensureAssessmentAccess(
                $request,
                $assessment
            );

            $attachment =
                $assessment->attachment;

            DB::transaction(function () use (
                $assessment
            ) {
                $assessment->delete();
            });

            if (
                $attachment !== null &&
                Storage::disk('public')->exists(
                    $attachment
                )
            ) {
                Storage::disk('public')->delete(
                    $attachment
                );
            }

            return response()->json([
                'success' => true,
                'message' =>
                    'Assessment deleted successfully.',
            ]);
        } catch (Throwable $exception) {
            if (
                method_exists($exception, 'getStatusCode') &&
                in_array(
                    $exception->getStatusCode(),
                    [403, 404],
                    true
                )
            ) {
                throw $exception;
            }

            report($exception);

            return response()->json([
                'success' => false,
                'message' =>
                    'Unable to delete the assessment.',
            ], 500);
        }
    }

    /**
     * Check whether the current user can use a subject.
     */
    private function ensureSubjectAccess(
        Request $request,
        int $subjectId
    ): void {
        $user = $request->user();

        /*
         * Admin can access every subject.
         */
        if ($user->role === 'admin') {
            return;
        }

        if ($user->role !== 'lecturer') {
            abort(
                403,
                'You are not allowed to manage assessments.'
            );
        }

        $lecturer = $user->lecturer;

        if (!$lecturer) {
            abort(
                404,
                'Lecturer profile not found.'
            );
        }

        $subjectBelongsToLecturer =
            Subject::where('id', $subjectId)
                ->where(
                    'lecturer_id',
                    $lecturer->id
                )
                ->exists();

        if (!$subjectBelongsToLecturer) {
            abort(
                403,
                'You can manage assessments only for your assigned subjects.'
            );
        }
    }

    /**
     * Check whether the current user can access
     * one assessment.
     */
    private function ensureAssessmentAccess(
        Request $request,
        Assessment $assessment
    ): void {
        $user = $request->user();

        /*
         * Admin can access every assessment.
         */
        if ($user->role === 'admin') {
            return;
        }

        if ($user->role !== 'lecturer') {
            abort(
                403,
                'You are not allowed to manage this assessment.'
            );
        }

        $lecturer = $user->lecturer;

        if (!$lecturer) {
            abort(
                404,
                'Lecturer profile not found.'
            );
        }

        $assessment->loadMissing('subject');

        if (
            $assessment->subject->lecturer_id !==
            $lecturer->id
        ) {
            abort(
                403,
                'You can manage assessments only for your assigned subjects.'
            );
        }
    }
}