<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SubjectResource;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentSubjectController extends Controller
{
    /**
     * Show one student and all available subjects.
     */
    public function show(Student $student): JsonResponse
    {
        $student->load('subjects.lecturer');

        $subjects = Subject::with('lecturer')
            ->orderBy('subject_code')
            ->get();

        return response()->json([
            'success' => true,

            'student' => [
                'id' => $student->id,
                'student_number' => $student->student_number,
                'full_name' => trim(
                    $student->first_name . ' ' . $student->last_name
                ),
            ],

            'registered_subject_ids' => $student->subjects
                ->pluck('id')
                ->values(),

            'subjects' => SubjectResource::collection($subjects),
        ]);
    }

    /**
     * Replace the student's current subject registrations.
     */
    public function update(
        Request $request,
        Student $student
    ): JsonResponse {
        $validated = $request->validate([
            'subject_ids' => [
                'required',
                'array',
            ],

            'subject_ids.*' => [
                'integer',
                'distinct',
                'exists:subjects,id',
            ],
        ], [
            'subject_ids.required' =>
                'Please provide the selected subjects.',

            'subject_ids.array' =>
                'The selected subjects must be an array.',

            'subject_ids.*.exists' =>
                'One of the selected subjects does not exist.',

            'subject_ids.*.distinct' =>
                'The same subject cannot be selected more than once.',
        ]);

        $syncData = [];

        foreach ($validated['subject_ids'] as $subjectId) {
            $syncData[$subjectId] = [
                'registered_at' => now()->toDateString(),
            ];
        }

        $student->subjects()->sync($syncData);

        $student->load('subjects.lecturer');

        return response()->json([
            'success' => true,
            'message' =>
                'Student subjects updated successfully.',

            'subjects' =>
                SubjectResource::collection(
                    $student->subjects
                ),
        ]);
    }
}