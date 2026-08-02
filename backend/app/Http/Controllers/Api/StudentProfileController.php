<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $student = $user->student;

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student profile not found.',
            ], 404);
        }

        $fullName = $student->full_name;

        if (!$fullName) {
            $fullName = trim(
                ($student->first_name ?? '') . ' ' .
                ($student->last_name ?? '')
            );
        }

        if (!$fullName) {
            $fullName = $user->name;
        }

        return response()->json([
            'success' => true,

            'student' => [
                'id' => $student->id,
                'student_number' => $student->student_number,
                'full_name' => $fullName,
                'course' => $student->course,
                'enrollment_date' => $student->enrollment_date,
                'status' => $user->status,

                'profile_image' => $student->profile_image
                    ? asset(
                        'storage/' .
                        ltrim($student->profile_image, '/')
                    )
                    : null,
            ],
        ]);
    }
}
