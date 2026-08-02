<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lecturer;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    public function statistics(): JsonResponse
    {
        return response()->json([
            'total_students' => Student::count(),
            'total_lecturers' => Lecturer::count(),

            'active_students' => User::where('role', 'student')
                ->where('status', 'active')
                ->count(),

            'active_lecturers' => User::where('role', 'lecturer')
                ->where('status', 'active')
                ->count(),
        ]);
    }
}
