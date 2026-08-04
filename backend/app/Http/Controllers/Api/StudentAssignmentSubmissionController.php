<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAssignmentSubmissionRequest;
use App\Http\Resources\AssignmentSubmissionResource;
use App\Models\Assessment;
use App\Models\AssignmentSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class StudentAssignmentSubmissionController extends Controller
{
    /**
     * Display the logged-in student's submission
     * for one assignment.
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

        /*
         * Viewing remains allowed after the due date.
         */
        $this->ensureAssignmentViewAccess(
            $student,
            $assessment
        );

        $submission = AssignmentSubmission::query()
            ->with([
                'assessment.subject',
                'student',
            ])
            ->where(
                'assessment_id',
                $assessment->id
            )
            ->where(
                'student_id',
                $student->id
            )
            ->first();

        return response()->json([
            'success' => true,

            'submission' => $submission
                ? new AssignmentSubmissionResource(
                    $submission
                )
                : null,

            /*
             * React can use this to hide the upload form
             * after the due date or when the assignment is closed.
             */
            'can_submit' =>
                $this->canSubmitAssignment(
                    $assessment
                ),

            'submission_message' =>
                $this->getSubmissionMessage(
                    $assessment
                ),
        ]);
    }

    /**
     * Create or replace the logged-in student's
     * assignment submission.
     */
    public function store(
        StoreAssignmentSubmissionRequest $request,
        Assessment $assessment
    ): JsonResponse {
        $student = $request->user()->student;

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student profile not found.',
            ], 404);
        }

        /*
         * Uploading and replacing require the assignment
         * to be open and before the deadline.
         */
        $this->ensureAssignmentSubmissionAccess(
            $student,
            $assessment
        );

        $oldFile = null;
        $newFile = null;

        try {
            $existingSubmission =
                AssignmentSubmission::query()
                    ->where(
                        'assessment_id',
                        $assessment->id
                    )
                    ->where(
                        'student_id',
                        $student->id
                    )
                    ->first();

            if (
                $existingSubmission &&
                $existingSubmission->status === 'graded'
            ) {
                return response()->json([
                    'success' => false,
                    'message' =>
                        'A graded submission cannot be replaced.',
                ], 422);
            }

            if ($existingSubmission) {
                $oldFile =
                    $existingSubmission->submission_file;
            }

            $newFile = $request
                ->file('submission_file')
                ->store(
                    'assignment-submissions/' .
                    'assessment-' .
                    $assessment->id .
                    '/student-' .
                    $student->id,
                    'public'
                );

            $submission = DB::transaction(
                function () use (
                    $assessment,
                    $student,
                    $existingSubmission,
                    $newFile
                ) {
                    if ($existingSubmission) {
                        $existingSubmission->update([
                            'submission_file' => $newFile,
                            'submitted_at' => now(),
                            'status' => 'submitted',
                            'marks' => null,
                            'feedback' => null,
                        ]);

                        return $existingSubmission;
                    }

                    return AssignmentSubmission::create([
                        'assessment_id' =>
                            $assessment->id,

                        'student_id' =>
                            $student->id,

                        'submission_file' =>
                            $newFile,

                        'submitted_at' =>
                            now(),

                        'status' =>
                            'submitted',
                    ]);
                }
            );

            /*
             * Delete the previous file only after the
             * database operation succeeds.
             */
            if (
                $oldFile !== null &&
                $oldFile !== $newFile &&
                Storage::disk('public')->exists(
                    $oldFile
                )
            ) {
                Storage::disk('public')->delete(
                    $oldFile
                );
            }

            $submission->load([
                'assessment.subject',
                'student',
            ]);

            return response()->json([
                'success' => true,

                'message' => $existingSubmission
                    ? 'Assignment submission replaced successfully.'
                    : 'Assignment submitted successfully.',

                'submission' =>
                    new AssignmentSubmissionResource(
                        $submission
                    ),

                'can_submit' => true,
            ], $existingSubmission ? 200 : 201);
        } catch (Throwable $exception) {
            /*
             * Remove the newly uploaded file when the
             * database operation fails.
             */
            if (
                $newFile !== null &&
                Storage::disk('public')->exists(
                    $newFile
                )
            ) {
                Storage::disk('public')->delete(
                    $newFile
                );
            }

            report($exception);

            return response()->json([
                'success' => false,
                'message' =>
                    'Unable to submit the assignment.',
            ], 500);
        }
    }

    /**
     * Check whether the student can view the assignment
     * and their existing submission.
     *
     * The due date is intentionally not checked here.
     */
    private function ensureAssignmentViewAccess(
        $student,
        Assessment $assessment
    ): void {
        if ($assessment->type !== 'assignment') {
            abort(
                422,
                'This assessment is not an assignment.'
            );
        }

        $isRegistered = $student
            ->subjects()
            ->where(
                'subjects.id',
                $assessment->subject_id
            )
            ->exists();

        if (!$isRegistered) {
            abort(
                403,
                'You are not registered for this subject.'
            );
        }

        /*
         * Students may view published and closed
         * assignments, including their marks and feedback.
         */
        if (
            !in_array(
                $assessment->status,
                ['published', 'closed'],
                true
            )
        ) {
            abort(
                403,
                'This assignment is not available.'
            );
        }
    }

    /**
     * Check whether the student can upload or replace
     * an assignment submission.
     */
    private function ensureAssignmentSubmissionAccess(
        $student,
        Assessment $assessment
    ): void {
        $this->ensureAssignmentViewAccess(
            $student,
            $assessment
        );

        if ($assessment->status !== 'published') {
            abort(
                403,
                'This assignment is not open for submission.'
            );
        }

        if (
            $assessment->available_from !== null &&
            $assessment->available_from->isFuture()
        ) {
            abort(
                403,
                'This assignment is not available yet.'
            );
        }

        if (
            $assessment->due_date !== null &&
            $assessment->due_date->isPast()
        ) {
            abort(
                403,
                'The assignment due date has passed.'
            );
        }
    }

    /**
     * Return whether React should display the upload form.
     */
    private function canSubmitAssignment(
        Assessment $assessment
    ): bool {
        if ($assessment->status !== 'published') {
            return false;
        }

        if (
            $assessment->available_from !== null &&
            $assessment->available_from->isFuture()
        ) {
            return false;
        }

        if (
            $assessment->due_date !== null &&
            $assessment->due_date->isPast()
        ) {
            return false;
        }

        return true;
    }

    /**
     * Return a clear message for the student interface.
     */
    private function getSubmissionMessage(
        Assessment $assessment
    ): ?string {
        if ($assessment->status === 'closed') {
            return 'This assignment is closed.';
        }

        if (
            $assessment->available_from !== null &&
            $assessment->available_from->isFuture()
        ) {
            return 'This assignment is not available yet.';
        }

        if (
            $assessment->due_date !== null &&
            $assessment->due_date->isPast()
        ) {
            return 'The assignment due date has passed.';
        }

        return null;
    }
}