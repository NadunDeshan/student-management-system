<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSubjectRequest;
use App\Http\Requests\UpdateSubjectRequest;
use App\Http\Resources\SubjectResource;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class SubjectController extends Controller
{
    /**
     * Display subjects with search and pagination.
     */
    public function index(Request $request)
    {
        $search = trim(
            (string) $request->query('search', '')
        );

        $subjects = Subject::query()
            ->with('lecturer')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($subjectQuery) use ($search) {
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
                        )
                        ->orWhere(
                            'description',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhereHas(
                            'lecturer',
                            function ($lecturerQuery) use ($search) {
                                $lecturerQuery
                                    ->where(
                                        'first_name',
                                        'like',
                                        "%{$search}%"
                                    )
                                    ->orWhere(
                                        'last_name',
                                        'like',
                                        "%{$search}%"
                                    );
                            }
                        );
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return SubjectResource::collection($subjects);
    }

    /**
     * Create a new subject.
     */
    public function store(StoreSubjectRequest $request): JsonResponse {

        try {
            $subject = Subject::create(
                $request->validated()
            );

            $subject->load('lecturer');

            return response()->json([
                'success' => true,
                'message' => 'Subject created successfully.',
                'data' => new SubjectResource($subject),
            ], 201);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'success' => false,
                'message' => 'Unable to create the subject.',
            ], 500);
        }
    }

    /**
     * Display one subject.
     */
    public function show(Subject $subject): JsonResponse {
        $subject->load('lecturer');

        return response()->json([
            'success' => true,
            'data' => new SubjectResource($subject),
        ]);
    }

    /**
     * Update a subject.
     */
    public function update(UpdateSubjectRequest $request, Subject $subject): JsonResponse {
        try {
            $subject->update(
                $request->validated()
            );

            $subject->load('lecturer');

            return response()->json([
                'success' => true,
                'message' => 'Subject updated successfully.',
                'data' => new SubjectResource(
                    $subject->fresh('lecturer')
                ),
            ]);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'success' => false,
                'message' => 'Unable to update the subject.',
            ], 500);
        }
    }

    /**
     * Delete a subject.
     */
    public function destroy(
        Subject $subject
    ): JsonResponse {
        try {
            $subject->delete();

            return response()->json([
                'success' => true,
                'message' => 'Subject deleted successfully.',
            ]);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'success' => false,
                'message' => 'Unable to delete the subject.',
            ], 500);
        }
    }
}
