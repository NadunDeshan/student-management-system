<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\QuizAttempt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssessmentQuizAttemptController extends Controller
{
    public function index(
        Request $request,
        Assessment $assessment
    ): JsonResponse {
        $this->ensureAssessmentAccess(
            $request,
            $assessment
        );

        if ($assessment->type !== 'mcq') {
            return response()->json([
                'success' => false,
                'message' =>
                    'This assessment is not an MCQ quiz.',
            ], 422);
        }

        $assessment->load([
            'subject.students',
            'quizAttempts.student',
        ]);

        $attemptsByStudent = $assessment
            ->quizAttempts
            ->keyBy('student_id');

        $students = $assessment
            ->subject
            ->students
            ->map(function ($student) use (
                $attemptsByStudent
            ) {
                $attempt = $attemptsByStudent
                    ->get($student->id);

                $percentage = null;

                if (
                    $attempt &&
                    $attempt->status === 'submitted' &&
                    $attempt->total_marks > 0
                ) {
                    $percentage = round(
                        (
                            (float) $attempt->score /
                            (float) $attempt->total_marks
                        ) * 100,
                        2
                    );
                }

                return [
                    'id' => $student->id,

                    'student_number' =>
                        $student->student_number,

                    'full_name' => trim(
                        $student->first_name .
                        ' ' .
                        $student->last_name
                    ),

                    'email' =>
                        $student->email,

                    'course' =>
                        $student->course,

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

                    'has_attempted' =>
                        $attempt !== null,

                    'attempt' => $attempt
                        ? [
                            'id' =>
                                $attempt->id,

                            'status' =>
                                $attempt->status,

                            'started_at' =>
                                $attempt
                                    ->started_at
                                    ?->toISOString(),

                            'submitted_at' =>
                                $attempt
                                    ->submitted_at
                                    ?->toISOString(),

                            'score' =>
                                $attempt->score,

                            'total_marks' =>
                                $attempt->total_marks,

                            'percentage' =>
                                $percentage,
                        ]
                        : null,
                ];
            })
            ->values();

        return response()->json([
            'success' => true,

            'assessment' => [
                'id' =>
                    $assessment->id,

                'title' =>
                    $assessment->title,

                'total_marks' =>
                    $assessment->total_marks,

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

                'attempted_count' =>
                    $students
                        ->where(
                            'has_attempted',
                            true
                        )
                        ->count(),

                'submitted_count' =>
                    $assessment
                        ->quizAttempts
                        ->where(
                            'status',
                            'submitted'
                        )
                        ->count(),

                'not_attempted_count' =>
                    $students
                        ->where(
                            'has_attempted',
                            false
                        )
                        ->count(),
            ],
        ]);
    }

    private function ensureAssessmentAccess(
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
                'You are not allowed to view quiz results.'
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
                'You can view quiz results only for your assigned subjects.'
            );
        }
    }
    public function show(
    Request $request,
    Assessment $assessment,
    QuizAttempt $attempt
): JsonResponse {
    $this->ensureAssessmentAccess(
        $request,
        $assessment
    );

    if ($assessment->type !== 'mcq') {
        return response()->json([
            'success' => false,
            'message' =>
                'This assessment is not an MCQ quiz.',
        ], 422);
    }

    if (
        $attempt->assessment_id !==
        $assessment->id
    ) {
        return response()->json([
            'success' => false,
            'message' =>
                'This quiz attempt does not belong to the selected assessment.',
        ], 404);
    }

    if ($attempt->status !== 'submitted') {
        return response()->json([
            'success' => false,
            'message' =>
                'This quiz attempt has not been submitted yet.',
        ], 422);
    }

    $attempt->load([
        'student',
        'assessment.subject',
        'answers.question.options',
        'answers.selectedOption',
    ]);

    $correctAnswers = $attempt
        ->answers
        ->where('is_correct', true)
        ->count();

    $totalQuestions =
        $attempt->answers->count();

    $percentage =
        $attempt->total_marks > 0
            ? round(
                (
                    (float) $attempt->score /
                    (float) $attempt->total_marks
                ) * 100,
                2
            )
            : 0;

    $answers = $attempt
        ->answers
        ->sortBy(
            fn ($answer) =>
                $answer->question->order_number
        )
        ->values()
        ->map(function ($answer) {
            $correctOption = $answer
                ->question
                ->options
                ->firstWhere(
                    'is_correct',
                    true
                );

            return [
                'id' => $answer->id,

                'question' => [
                    'id' =>
                        $answer->question->id,

                    'question_text' =>
                        $answer
                            ->question
                            ->question_text,

                    'marks' =>
                        $answer
                            ->question
                            ->marks,

                    'order_number' =>
                        $answer
                            ->question
                            ->order_number,
                ],

                'selected_option' =>
                    $answer->selectedOption
                        ? [
                            'id' =>
                                $answer
                                    ->selectedOption
                                    ->id,

                            'option_text' =>
                                $answer
                                    ->selectedOption
                                    ->option_text,
                        ]
                        : null,

                'correct_option' =>
                    $correctOption
                        ? [
                            'id' =>
                                $correctOption->id,

                            'option_text' =>
                                $correctOption
                                    ->option_text,
                        ]
                        : null,

                'is_correct' =>
                    $answer->is_correct,

                'marks_awarded' =>
                    $answer->marks_awarded,
            ];
        });

    return response()->json([
        'success' => true,

        'assessment' => [
            'id' =>
                $assessment->id,

            'title' =>
                $assessment->title,

            'total_marks' =>
                $assessment->total_marks,

            'subject' => [
                'id' =>
                    $assessment
                        ->subject
                        ->id,

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

        'student' => [
            'id' =>
                $attempt->student->id,

            'student_number' =>
                $attempt
                    ->student
                    ->student_number,

            'full_name' => trim(
                $attempt
                    ->student
                    ->first_name
                . ' '
                . $attempt
                    ->student
                    ->last_name
            ),

            'email' =>
                $attempt->student->email,

            'course' =>
                $attempt->student->course,

            'profile_image_url' =>
                $attempt
                    ->student
                    ->profile_image
                    ? asset(
                        'storage/' .
                        ltrim(
                            $attempt
                                ->student
                                ->profile_image,
                            '/'
                        )
                    )
                    : null,
        ],

        'attempt' => [
            'id' =>
                $attempt->id,

            'started_at' =>
                $attempt
                    ->started_at
                    ?->toISOString(),

            'submitted_at' =>
                $attempt
                    ->submitted_at
                    ?->toISOString(),

            'score' =>
                $attempt->score,

            'total_marks' =>
                $attempt->total_marks,

            'correct_answers' =>
                $correctAnswers,

            'total_questions' =>
                $totalQuestions,

            'percentage' =>
                $percentage,

            'status' =>
                $attempt->status,
        ],

        'answers' => $answers,
    ]);
}
}