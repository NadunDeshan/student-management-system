<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LecturerController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\StudentProfileController;
use App\Http\Controllers\Api\SubjectController;
use Illuminate\Support\Facades\Route;


Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware('role:admin')->group(function () {
        Route::apiResource('students', StudentController::class);
        Route::apiResource('lecturers', LecturerController::class);
        Route::apiResource('subjects', SubjectController::class);
        Route::get('/admin/dashboard/statistics', [AdminDashboardController::class, 'statistics']
        );
    });
    Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
        Route::get('/student/profile', [StudentProfileController::class, 'show']);
    });
});
