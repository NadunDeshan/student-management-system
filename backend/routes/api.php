<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LecturerController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\AdminDashboardController;
use Illuminate\Support\Facades\Route;




/*
|--------------------------------------------------------------------------
| Public route
|--------------------------------------------------------------------------
|
| Users do not need a token to access login.
|
*/
Route::post('/login', [AuthController::class, 'login']);
/*
|--------------------------------------------------------------------------
| Protected routes
|--------------------------------------------------------------------------
| A valid Sanctum token is required.
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware('role:admin')->group(function () {
        Route::apiResource('students', StudentController::class);
        Route::apiResource('lecturers', LecturerController::class);
        Route::get('/admin/dashboard/statistics', [AdminDashboardController::class, 'statistics']
        );
    });
});
