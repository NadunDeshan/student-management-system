<?php

use App\Http\Controllers\Api\StudentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'Laravel API is working',
    ]);
});
/*
| Student CRUD routes
*/
Route::apiResource('students', StudentController::class);


/*
|--------------------------------------------------------------------------
| Authenticated user route
|--------------------------------------------------------------------------
|
| Authentication will be implemented later.
|
*/
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
