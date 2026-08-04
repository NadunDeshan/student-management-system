<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LecturerController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\StudentProfileController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\StudentSubjectController;
use App\Http\Controllers\Api\StudentMySubjectController;
use App\Http\Controllers\Api\LecturerMySubjectController;
use App\Http\Controllers\Api\AssessmentController;
use App\Http\Controllers\Api\StudentAssessmentController;
use App\Http\Controllers\Api\StudentAssignmentSubmissionController;
use App\Http\Controllers\Api\LecturerAssignmentSubmissionController;
use Illuminate\Support\Facades\Route;


Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware('role:admin')->group(function () {
        Route::apiResource('students', StudentController::class);
        Route::apiResource('lecturers', LecturerController::class);
        Route::apiResource('subjects', SubjectController::class);
        Route::get('/students/{student}/subjects', [StudentSubjectController::class, 'show']);
        Route::put('/students/{student}/subjects', [StudentSubjectController::class, 'update']);

        Route::get('/admin/dashboard/statistics', [AdminDashboardController::class, 'statistics']);
    });
    /*
     * Admin and lecturer assessment management
     */
    Route::middleware('role:admin,lecturer')->group(function () {
        Route::apiResource('assessments', AssessmentController::class);
        Route::get('/assessments/{assessment}/submissions', [LecturerAssignmentSubmissionController::class, 'index',]);
        Route::get('/assessments/{assessment}/submissions/{submission}',[LecturerAssignmentSubmissionController::class,'show',]);
        Route::put('/assessments/{assessment}/submissions/{submission}/grade',[LecturerAssignmentSubmissionController::class,'grade',]);
    });

    Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
        Route::get('/student/profile', [StudentProfileController::class, 'show']);
        Route::get('/student/subjects', [StudentMySubjectController::class, 'index']);
        Route::get('/student/assessments', [StudentAssessmentController::class, 'index']);
        Route::get('/student/assessments/{assessment}', [StudentAssessmentController::class, 'show']);
        Route::get('/student/assignments/{assessment}/submission', [StudentAssignmentSubmissionController::class, 'show']);
        Route::post('/student/assignments/{assessment}/submission', [StudentAssignmentSubmissionController::class, 'store',]);
    });

    Route::middleware(['auth:sanctum', 'role:lecturer',])->group(function () {
        Route::get('/lecturer/subjects', [LecturerMySubjectController::class, 'index']);
        Route::get('/lecturer/subjects/{subject}', [LecturerMySubjectController::class, 'show']);
    });
});
