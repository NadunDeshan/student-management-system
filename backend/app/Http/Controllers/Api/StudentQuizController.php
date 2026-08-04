<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\AssessmentQuestion;
use App\Models\QuestionOption;
use App\Models\QuizAttempt;
use App\Models\StudentAnswer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentQuizController extends Controller
{
    /**
     * Start or continue the logged-in student's quiz.
     */
    public function start(
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

        $this->ensureQuizAccess(
            $student,
            $assessment
        );

        $assessment->load([
            'subject',
            'questions.options',
        ]);

        if ($assessment->questions->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' =>
                    'This quiz does not contain any questions yet.',
            ], 422);
        }

        $questionMarks = (int) $assessment
            ->questions
            ->sum('marks');

        if (
            $questionMarks !==
            (int) $assessment->total_marks
        ) {
            return response()->json([
                'success' => false,
                'message' =>
                    'The quiz question marks do not match the assessment total marks.',
            ], 422);
        }

        $attempt = QuizAttempt::query()
            ->where(
                'assessment_id',
                $assessment->id
            )
            ->where(
                'student_id',
                $student->id
            )
            ->first();

        if ($attempt?->status === 'submitted') {
            return response()->json([
                'success' => false,
                'message' =>
                    'You have already submitted this quiz.',
                'attempt' => $this->formatSubmittedAttempt(
                    $attempt
                ),
            ], 422);
        }

        if (!$attempt) {
            $attempt = QuizAttempt::create([
                'assessment_id' =>
                    $assessment->id,

                'student_id' =>
                    $student->id,

                'started_at' =>
                    now(),

                'total_marks' =>
                    $assessment->total_marks,

                'status' =>
                    'in_progress',
            ]);
        }

        return response()->json([
            'success' => true,

            'assessment' => [
                'id' => $assessment->id,
                'title' => $assessment->title,
                'type' => $assessment->type,
                'description' =>
                    $assessment->description,
                'total_marks' =>
                    $assessment->total_marks,
                'available_from' =>
                    $assessment->available_from
                        ?->toISOString(),
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

            'attempt' => [
                'id' => $attempt->id,
                'started_at' =>
                    $attempt->started_at
                        ?->toISOString(),
                'status' => $attempt->status,
            ],

            /*
             * Correct answers are intentionally hidden.
             */
            'questions' => $assessment
                ->questions
                ->sortBy('order_number')
                ->values()
                ->map(function ($question) {
                    return [
                        'id' => $question->id,
                        'question_text' =>
                            $question->question_text,
                        'marks' =>
                            $question->marks,
                        'order_number' =>
                            $question->order_number,

                        'options' => $question
                            ->options
                            ->sortBy('order_number')
                            ->values()
                            ->map(function ($option) {
                                return [
                                    'id' => $option->id,
                                    'option_text' =>
                                        $option->option_text,
                                    'order_number' =>
                                        $option->order_number,
                                ];
                            }),
                    ];
                }),
        ]);
    }

    /**
     * Submit all quiz answers and calculate marks.
     */
    public function submit(
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

        $this->ensureQuizAccess(
            $student,
            $assessment
        );

        $validated = $request->validate([
            'answers' => [
                'required',
                'array',
            ],

            'answers.*.question_id' => [
                'required',
                'integer',
                'distinct',
                'exists:assessment_questions,id',
            ],

            'answers.*.selected_option_id' => [
                'nullable',
                'integer',
                'exists:question_options,id',
            ],
        ], [
            'answers.required' =>
                'Please provide the quiz answers.',

            'answers.array' =>
                'The answers must be an array.',

            'answers.*.question_id.required' =>
                'Each answer must contain a question.',

            'answers.*.selected_option_id.exists' =>
                'One of the selected options does not exist.',
        ]);

        $assessment->load([
            'questions.options',
        ]);

        $attempt = QuizAttempt::query()
            ->where(
                'assessment_id',
                $assessment->id
            )
            ->where(
                'student_id',
                $student->id
            )
            ->first();

        if (!$attempt) {
            return response()->json([
                'success' => false,
                'message' =>
                    'Start the quiz before submitting answers.',
            ], 422);
        }

        if ($attempt->status === 'submitted') {
            return response()->json([
                'success' => false,
                'message' =>
                    'This quiz has already been submitted.',
            ], 422);
        }

        $answersByQuestion = collect(
            $validated['answers']
        )->keyBy('question_id');

        $score = 0;

        DB::transaction(function () use (
            $assessment,
            $attempt,
            $answersByQuestion,
            &$score
        ) {
            foreach ($assessment->questions as $question) {
                $answerData =
                    $answersByQuestion->get(
                        $question->id
                    );

                $selectedOptionId =
                    $answerData[
                        'selected_option_id'
                    ] ?? null;

                $selectedOption = null;

                if ($selectedOptionId !== null) {
                    $selectedOption =
                        QuestionOption::query()
                            ->where(
                                'id',
                                $selectedOptionId
                            )
                            ->where(
                                'question_id',
                                $question->id
                            )
                            ->first();

                    if (!$selectedOption) {
                        abort(
                            422,
                            'One selected option does not belong to its question.'
                        );
                    }
                }

                $isCorrect =
                    $selectedOption?->is_correct
                    ?? false;

                $marksAwarded = $isCorrect
                    ? (float) $question->marks
                    : 0;

                $score += $marksAwarded;

                StudentAnswer::updateOrCreate(
                    [
                        'quiz_attempt_id' =>
                            $attempt->id,

                        'question_id' =>
                            $question->id,
                    ],
                    [
                        'selected_option_id' =>
                            $selectedOptionId,

                        'is_correct' =>
                            $isCorrect,

                        'marks_awarded' =>
                            $marksAwarded,
                    ]
                );
            }

            $attempt->update([
                'submitted_at' =>
                    now(),

                'score' =>
                    $score,

                'status' =>
                    'submitted',
            ]);
        });

        $attempt->load([
            'assessment.subject',
            'answers.question',
            'answers.selectedOption',
        ]);

        return response()->json([
            'success' => true,
            'message' =>
                'Quiz submitted successfully.',

            'result' =>
                $this->formatSubmittedAttempt(
                    $attempt
                ),
        ]);
    }

    /**
     * Show the student's submitted result.
     */
    public function result(
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

        $this->ensureStudentRegistered(
            $student,
            $assessment
        );

        $attempt = QuizAttempt::query()
            ->with([
                'assessment.subject',
                'answers.question',
                'answers.selectedOption',
            ])
            ->where(
                'assessment_id',
                $assessment->id
            )
            ->where(
                'student_id',
                $student->id
            )
            ->where(
                'status',
                'submitted'
            )
            ->first();

        if (!$attempt) {
            return response()->json([
                'success' => false,
                'message' =>
                    'No submitted quiz result was found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'result' =>
                $this->formatSubmittedAttempt(
                    $attempt
                ),
        ]);
    }

    /**
     * Validate that the student can start or submit.
     */
    private function ensureQuizAccess(
        $student,
        Assessment $assessment
    ): void {
        if ($assessment->type !== 'mcq') {
            abort(
                422,
                'This assessment is not an MCQ quiz.'
            );
        }

        $this->ensureStudentRegistered(
            $student,
            $assessment
        );

        if ($assessment->status !== 'published') {
            abort(
                403,
                'This quiz is not open.'
            );
        }

        if (
            $assessment->available_from !== null &&
            $assessment->available_from->isFuture()
        ) {
            abort(
                403,
                'This quiz is not available yet.'
            );
        }

        if (
            $assessment->due_date !== null &&
            $assessment->due_date->isPast()
        ) {
            abort(
                403,
                'The quiz due date has passed.'
            );
        }
    }

    /**
     * Check subject registration.
     */
    private function ensureStudentRegistered(
        $student,
        Assessment $assessment
    ): void {
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
    }

    /**
     * Format a submitted quiz result.
     */
    private function formatSubmittedAttempt(
        QuizAttempt $attempt
    ): array {
        $attempt->loadMissing([
            'assessment.subject',
            'answers.question',
            'answers.selectedOption',
        ]);

        $correctAnswers = $attempt
            ->answers
            ->where(
                'is_correct',
                true
            )
            ->count();

        $totalQuestions =
            $attempt->answers->count();

        return [
            'attempt_id' => $attempt->id,

            'assessment_id' =>
                $attempt->assessment_id,

            'title' =>
                $attempt->assessment->title,

            'subject' => [
                'subject_code' =>
                    $attempt->assessment
                        ->subject
                        ->subject_code,

                'subject_name' =>
                    $attempt->assessment
                        ->subject
                        ->subject_name,
            ],

            'started_at' =>
                $attempt->started_at
                    ?->toISOString(),

            'submitted_at' =>
                $attempt->submitted_at
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
                $attempt->total_marks > 0
                    ? round(
                        (
                            (float) $attempt->score /
                            (float) $attempt->total_marks
                        ) * 100,
                        2
                    )
                    : 0,

            'status' =>
                $attempt->status,
        ];
    }
}