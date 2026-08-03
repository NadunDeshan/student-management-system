<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SubjectResource;
use Illuminate\Http\JsonResponse;
use App\Models\Subject;
use Illuminate\Http\Request;

class LecturerMySubjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $lecturer = $request->user()->lecturer;

        if (!$lecturer) {
            return response()->json([
                'success' => false,
                'message' => 'Lecturer profile not found.',
            ], 404);
        }

        $subjects = $lecturer
            ->subjects()
            ->withCount('students')
            ->orderBy('subject_code')
            ->get();

        return response()->json([
            'success' => true,
            'subjects' => SubjectResource::collection($subjects),
        ]);
    }
    public function show(Request $request,Subject $subject): JsonResponse {
        $lecturer = $request->user()->lecturer;

        if (!$lecturer) {
            return response()->json([
                'success' => false,
                'message' => 'Lecturer profile not found.',
            ], 404);
        }

        if ($subject->lecturer_id !== $lecturer->id) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to view this subject.',
            ], 403);
        }

        $subject->load([
            'students' => function ($query) {
                $query
                    ->orderBy('student_number')
                    ->select([
                        'students.id',
                        'student_number',
                        'first_name',
                        'last_name',
                        'email',
                        'course',
                        'status',
                        'profile_image',
                    ]);
            },
        ]);

        return response()->json([
            'success' => true,

            'subject' => [
                'id' => $subject->id,
                'subject_code' => $subject->subject_code,
                'subject_name' => $subject->subject_name,
                'description' => $subject->description,
                'credits' => $subject->credits,
                'semester' => $subject->semester,
            ],

            'students' => $subject->students->map(function ($student) {
                return [
                    'id' => $student->id,
                    'student_number' => $student->student_number,
                    'full_name' => trim(
                        $student->first_name . ' ' . $student->last_name
                    ),
                    'email' => $student->email,
                    'course' => $student->course,
                    'status' => $student->status,
                    'profile_image_url' => $student->profile_image
                        ? asset(
                            'storage/' .
                                ltrim($student->profile_image, '/')
                        )
                        : null,
                    'registered_at' =>
                    $student->pivot?->registered_at,
                ];
            }),
        ]);
    }
}
