<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAssessmentQuestionRequest;
use App\Http\Requests\UpdateAssessmentQuestionRequest;
use App\Http\Resources\AssessmentQuestionResource;
use App\Models\Assessment;
use App\Models\AssessmentQuestion;
use App\Models\QuestionOption;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class AssessmentQuestionController extends Controller
{
    /**
     * List questions for one MCQ assessment.
     */
    public function index(
        Request $request,
        Assessment $assessment
    ) {
        $this->ensureAssessmentAccess(
            $request,
            $assessment
        );

        $this->ensureMcqAssessment(
            $assessment
        );

        $questions = $assessment
            ->questions()
            ->with('options')
            ->orderBy('order_number')
            ->get();

        return AssessmentQuestionResource::collection(
            $questions
        );
    }

    /**
     * Create a new MCQ question.
     */
    public function store(
        StoreAssessmentQuestionRequest $request,
        Assessment $assessment
    ): JsonResponse {
        $this->ensureAssessmentAccess(
            $request,
            $assessment
        );

        $this->ensureMcqAssessment(
            $assessment
        );

        try {
            $validated = $request->validated();

            $question = DB::transaction(
                function () use (
                    $assessment,
                    $validated
                ) {
                    $question = AssessmentQuestion::create([
                        'assessment_id' =>
                            $assessment->id,

                        'question_text' =>
                            $validated['question_text'],

                        'marks' =>
                            $validated['marks'],

                        'order_number' =>
                            $validated['order_number']
                            ?? $this->getNextOrderNumber(
                                $assessment
                            ),
                    ]);

                    foreach (
                        $validated['options']
                        as $index => $option
                    ) {
                        $question->options()->create([
                            'option_text' =>
                                $option['option_text'],

                            'is_correct' =>
                                $option['is_correct'],

                            'order_number' =>
                                $option['order_number']
                                ?? $index + 1,
                        ]);
                    }

                    return $question;
                }
            );

            $question->load('options');

            return response()->json([
                'success' => true,

                'message' =>
                    'MCQ question created successfully.',

                'data' =>
                    new AssessmentQuestionResource(
                        $question
                    ),
            ], 201);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'success' => false,
                'message' =>
                    'Unable to create the MCQ question.',
            ], 500);
        }
    }

    /**
     * Display one MCQ question.
     */
    public function show(
        Request $request,
        Assessment $assessment,
        AssessmentQuestion $question
    ): JsonResponse {
        $this->ensureAssessmentAccess(
            $request,
            $assessment
        );

        $this->ensureMcqAssessment(
            $assessment
        );

        $this->ensureQuestionBelongsToAssessment(
            $assessment,
            $question
        );

        $question->load('options');

        return response()->json([
            'success' => true,

            'data' =>
                new AssessmentQuestionResource(
                    $question
                ),
        ]);
    }

    /**
     * Update a question and its options.
     */
    public function update(
        UpdateAssessmentQuestionRequest $request,
        Assessment $assessment,
        AssessmentQuestion $question
    ): JsonResponse {
        $this->ensureAssessmentAccess(
            $request,
            $assessment
        );

        $this->ensureMcqAssessment(
            $assessment
        );

        $this->ensureQuestionBelongsToAssessment(
            $assessment,
            $question
        );

        try {
            $validated = $request->validated();

            DB::transaction(
                function () use (
                    $question,
                    $validated
                ) {
                    $question->update([
                        'question_text' =>
                            $validated['question_text'],

                        'marks' =>
                            $validated['marks'],

                        'order_number' =>
                            $validated['order_number']
                            ?? $question->order_number,
                    ]);

                    $existingOptionIds = [];

                    foreach (
                        $validated['options']
                        as $index => $optionData
                    ) {
                        if (!empty($optionData['id'])) {
                            $option = QuestionOption::query()
                                ->where(
                                    'id',
                                    $optionData['id']
                                )
                                ->where(
                                    'question_id',
                                    $question->id
                                )
                                ->firstOrFail();

                            $option->update([
                                'option_text' =>
                                    $optionData[
                                        'option_text'
                                    ],

                                'is_correct' =>
                                    $optionData[
                                        'is_correct'
                                    ],

                                'order_number' =>
                                    $optionData[
                                        'order_number'
                                    ] ?? $index + 1,
                            ]);

                            $existingOptionIds[] =
                                $option->id;
                        } else {
                            $newOption =
                                $question
                                    ->options()
                                    ->create([
                                        'option_text' =>
                                            $optionData[
                                                'option_text'
                                            ],

                                        'is_correct' =>
                                            $optionData[
                                                'is_correct'
                                            ],

                                        'order_number' =>
                                            $optionData[
                                                'order_number'
                                            ] ?? $index + 1,
                                    ]);

                            $existingOptionIds[] =
                                $newOption->id;
                        }
                    }

                    $question
                        ->options()
                        ->whereNotIn(
                            'id',
                            $existingOptionIds
                        )
                        ->delete();
                }
            );

            $question->load('options');

            return response()->json([
                'success' => true,

                'message' =>
                    'MCQ question updated successfully.',

                'data' =>
                    new AssessmentQuestionResource(
                        $question
                    ),
            ]);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'success' => false,
                'message' =>
                    'Unable to update the MCQ question.',
            ], 500);
        }
    }

    /**
     * Delete one MCQ question.
     */
    public function destroy(
        Request $request,
        Assessment $assessment,
        AssessmentQuestion $question
    ): JsonResponse {
        $this->ensureAssessmentAccess(
            $request,
            $assessment
        );

        $this->ensureMcqAssessment(
            $assessment
        );

        $this->ensureQuestionBelongsToAssessment(
            $assessment,
            $question
        );

        try {
            $question->delete();

            return response()->json([
                'success' => true,
                'message' =>
                    'MCQ question deleted successfully.',
            ]);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'success' => false,
                'message' =>
                    'Unable to delete the MCQ question.',
            ], 500);
        }
    }

    /**
     * Admin can access all assessments.
     * Lecturer can access only assigned subjects.
     */
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
                'You are not allowed to manage MCQ questions.'
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
                'You can manage questions only for your assigned subjects.'
            );
        }
    }

    /**
     * Ensure the assessment type is MCQ.
     */
    private function ensureMcqAssessment(
        Assessment $assessment
    ): void {
        if ($assessment->type !== 'mcq') {
            abort(
                422,
                'This assessment is not an MCQ quiz.'
            );
        }
    }

    /**
     * Prevent access to a question from another assessment.
     */
    private function ensureQuestionBelongsToAssessment(
        Assessment $assessment,
        AssessmentQuestion $question
    ): void {
        if (
            $question->assessment_id !==
            $assessment->id
        ) {
            abort(
                404,
                'The question does not belong to this assessment.'
            );
        }
    }

    /**
     * Automatically choose the next question order.
     */
    private function getNextOrderNumber(
        Assessment $assessment
    ): int {
        return (
            (int) $assessment
                ->questions()
                ->max('order_number')
        ) + 1;
    }
}