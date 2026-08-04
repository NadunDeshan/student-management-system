<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AssignmentSubmissionResource;
use App\Models\Assessment;
use App\Http\Requests\GradeAssignmentSubmissionRequest;
use App\Models\AssignmentSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LecturerAssignmentSubmissionController extends Controller
{
    /**
     * Display all students and submissions
     * for one assignment.
     */
    public function index(
        Request $request,
        Assessment $assessment
    ): JsonResponse {
        $user = $request->user();

        $this->ensureLecturerAccess(
            $request,
            $assessment
        );

        if ($assessment->type !== 'assignment') {
            return response()->json([
                'success' => false,
                'message' =>
                'This assessment is not an assignment.',
            ], 422);
        }

        /*
         * Load the students registered for the
         * assignment subject.
         */
        $assessment->load([
            'subject.students',
            'submissions.student',
        ]);

        /*
         * Convert the submission collection into
         * an easier lookup using student_id.
         */
        $submissionsByStudent = $assessment
            ->submissions
            ->keyBy('student_id');

        $students = $assessment
            ->subject
            ->students
            ->map(function ($student) use (
                $submissionsByStudent
            ) {
                $submission =
                    $submissionsByStudent->get(
                        $student->id
                    );

                return [
                    'id' => $student->id,

                    'student_number' =>
                    $student->student_number,

                    'full_name' => trim(
                        $student->first_name
                            . ' '
                            . $student->last_name
                    ),

                    'email' => $student->email,

                    'course' => $student->course,

                    'profile_image_url' =>
                    $student->profile_image
                        ? asset(
                            'storage/' .
                                ltrim(
                                    $student->profile_image,
                                    '/'
                                )
                        )
                        : null,

                    'has_submitted' =>
                    $submission !== null,

                    'submission' =>
                    $submission
                        ? new AssignmentSubmissionResource(
                            $submission
                        )
                        : null,
                ];
            })
            ->values();

        return response()->json([
            'success' => true,

            'assessment' => [
                'id' => $assessment->id,
                'title' => $assessment->title,
                'type' => $assessment->type,
                'total_marks' =>
                $assessment->total_marks,

                'due_date' =>
                $assessment->due_date
                    ?->toISOString(),

                'subject' => [
                    'id' =>
                    $assessment->subject->id,

                    'subject_code' =>
                    $assessment
                        ->subject
                        ->subject_code,

                    'subject_name' =>
                    $assessment
                        ->subject
                        ->subject_name,
                ],
            ],

            'students' => $students,

            'summary' => [
                'total_students' =>
                $students->count(),

                'submitted_count' =>
                $students
                    ->where(
                        'has_submitted',
                        true
                    )
                    ->count(),

                'not_submitted_count' =>
                $students
                    ->where(
                        'has_submitted',
                        false
                    )
                    ->count(),

                'graded_count' =>
                $assessment
                    ->submissions
                    ->where(
                        'status',
                        'graded'
                    )
                    ->count(),
            ],
        ]);
    }

    /**
     * Ensure that the lecturer owns the subject.
     * Admin can also access every assignment.
     */
    private function ensureLecturerAccess(
        Request $request,
        Assessment $assessment
    ): void {
        $user = $request->user();

        if ($user->role === 'admin') {
            return;
        }

        if ($user->role !== 'lecturer') {
            abort(
                403,
                'You are not allowed to view assignment submissions.'
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
                'You can view submissions only for your assigned subjects.'
            );
        }
    }
    /**
     * Display one submission for grading.
     */
    public function show(
        Request $request,
        Assessment $assessment,
        AssignmentSubmission $submission
    ): JsonResponse {
        $this->ensureLecturerAccess(
            $request,
            $assessment
        );

        if ($assessment->type !== 'assignment') {
            return response()->json([
                'success' => false,
                'message' =>
                'This assessment is not an assignment.',
            ], 422);
        }

        if (
            $submission->assessment_id !==
            $assessment->id
        ) {
            return response()->json([
                'success' => false,
                'message' =>
                'This submission does not belong to the selected assignment.',
            ], 404);
        }

        $submission->load([
            'student',
            'assessment.subject',
        ]);

        return response()->json([
            'success' => true,

            'submission' =>
            new AssignmentSubmissionResource(
                $submission
            ),
        ]);
    }

    /**
     * Grade or update the grade for one submission.
     */
    public function grade(
        GradeAssignmentSubmissionRequest $request,
        Assessment $assessment,
        AssignmentSubmission $submission
    ): JsonResponse {
        $this->ensureLecturerAccess(
            $request,
            $assessment
        );

        if ($assessment->type !== 'assignment') {
            return response()->json([
                'success' => false,
                'message' =>
                'This assessment is not an assignment.',
            ], 422);
        }

        if (
            $submission->assessment_id !==
            $assessment->id
        ) {
            return response()->json([
                'success' => false,
                'message' =>
                'This submission does not belong to the selected assignment.',
            ], 404);
        }

        $validated = $request->validated();

        if (
            (float) $validated['marks'] >
            (float) $assessment->total_marks
        ) {
            return response()->json([
                'success' => false,

                'errors' => [
                    'marks' => [
                        'The marks cannot exceed the total assessment marks of '
                            . $assessment->total_marks
                            . '.',
                    ],
                ],
            ], 422);
        }

        $submission->update([
            'marks' => $validated['marks'],
            'feedback' =>
            $validated['feedback'] ?? null,
            'status' => 'graded',
        ]);

        $submission->load([
            'student',
            'assessment.subject',
        ]);

        return response()->json([
            'success' => true,
            'message' =>
            'Assignment graded successfully.',

            'submission' =>
            new AssignmentSubmissionResource(
                $submission
            ),
        ]);
    }
}
