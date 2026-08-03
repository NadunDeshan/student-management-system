<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SubjectResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentMySubjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $student = $request->user()->student;

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student profile not found.',
            ], 404);
        }

        $subjects = $student
            ->subjects()
            ->with('lecturer')
            ->orderBy('subject_code')
            ->get();

        return response()->json([
            'success' => true,
            'subjects' => SubjectResource::collection($subjects),
        ]);
    }
}