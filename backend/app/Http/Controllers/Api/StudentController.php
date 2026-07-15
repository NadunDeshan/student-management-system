<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Http\Resources\StudentResource;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class StudentController extends Controller
{
    /**
     * Display students with search and pagination.
     *
     * Example:
     * GET /api/students?search=nimal
     */
    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));

        $students = Student::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($studentQuery) use ($search) {
                    $studentQuery
                        ->where('student_number', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('course', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return StudentResource::collection($students);
    }

    /**
     * Store a newly created student.
     */
    public function store(
        StoreStudentRequest $request
    ): JsonResponse {
        try {
            $student = DB::transaction(function () use ($request) {
                $validated = $request->validated();

                if ($request->hasFile('profile_image')) {
                    $validated['profile_image'] = $request
                        ->file('profile_image')
                        ->store(
                            'students/profile-images',
                            'public'
                        );
                }

                return Student::create($validated);
            });

            return response()->json([
                'success' => true,
                'message' => 'Student created successfully.',
                'data' => new StudentResource($student),
            ], 201);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'success' => false,
                'message' => 'Unable to create the student.',
            ], 500);
        }
    }

    /**
     * Display one student.
     *
     * Route model binding automatically returns 404
     * when the student ID does not exist.
     */
    public function show(Student $student): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new StudentResource($student),
        ]);
    }

    /**
     * Update an existing student.
     */
    public function update(
        UpdateStudentRequest $request,
        Student $student
    ): JsonResponse {
        $oldImage = $student->profile_image;
        $newImage = null;

        try {
            $validated = $request->validated();

            if ($request->hasFile('profile_image')) {
                $newImage = $request
                    ->file('profile_image')
                    ->store(
                        'students/profile-images',
                        'public'
                    );

                $validated['profile_image'] = $newImage;
            }

            DB::transaction(function () use (
                $student,
                $validated
            ) {
                $student->update($validated);
            });

            /*
             * Delete the previous image only after the
             * database update completes successfully.
             */
            if (
                $newImage !== null &&
                $oldImage !== null &&
                Storage::disk('public')->exists($oldImage)
            ) {
                Storage::disk('public')->delete($oldImage);
            }

            return response()->json([
                'success' => true,
                'message' => 'Student updated successfully.',
                'data' => new StudentResource(
                    $student->fresh()
                ),
            ]);
        } catch (Throwable $exception) {
            /*
             * Remove the new image if the database update failed.
             */
            if (
                $newImage !== null &&
                Storage::disk('public')->exists($newImage)
            ) {
                Storage::disk('public')->delete($newImage);
            }

            report($exception);

            return response()->json([
                'success' => false,
                'message' => 'Unable to update the student.',
            ], 500);
        }
    }

    /**
     * Delete a student and their profile image.
     */
    public function destroy(Student $student): JsonResponse
    {
        try {
            $imagePath = $student->profile_image;

            DB::transaction(function () use ($student) {
                $student->delete();
            });

            if (
                $imagePath !== null &&
                Storage::disk('public')->exists($imagePath)
            ) {
                Storage::disk('public')->delete($imagePath);
            }

            return response()->json([
                'success' => true,
                'message' => 'Student deleted successfully.',
            ]);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'success' => false,
                'message' => 'Unable to delete the student.',
            ], 500);
        }
    }
}
