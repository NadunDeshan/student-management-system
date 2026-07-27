<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Http\Resources\StudentResource;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class StudentController extends Controller
{
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

    public function store(
        StoreStudentRequest $request
    ): JsonResponse {
        $uploadedImage = null;

        try {
            $student = DB::transaction(function () use (
                $request,
                &$uploadedImage
            ) {
                $validated = $request->validated();

                if ($request->hasFile('profile_image')) {
                    $uploadedImage = $request
                        ->file('profile_image')
                        ->store(
                            'students/profile-images',
                            'public'
                        );

                    $validated['profile_image'] = $uploadedImage;
                } else {
                    $validated['profile_image'] =
                        'students/profile-images/default-avatar.png';
                }

                $user = User::create([
                    'name' => $validated['first_name']
                        . ' '
                        . $validated['last_name'],

                    'email' => $validated['email'],
                    'password' => $validated['password'],
                    'role' => 'student',
                    'status' => $validated['status'],
                ]);

                unset($validated['password']);

                $validated['user_id'] = $user->id;

                return Student::create($validated);
            });

            return response()->json([
                'success' => true,
                'message' => 'Student created successfully.',
                'data' => new StudentResource($student),
            ], 201);
        } catch (Throwable $exception) {
            if (
                $uploadedImage !== null &&
                Storage::disk('public')->exists($uploadedImage)
            ) {
                Storage::disk('public')->delete($uploadedImage);
            }

            report($exception);

            return response()->json([
                'success' => false,
                'message' => 'Unable to create the student.',
            ], 500);
        }
    }

    public function show(Student $student): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new StudentResource($student),
        ]);
    }

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
                $userData = [
                    'name' => $validated['first_name']
                        . ' '
                        . $validated['last_name'],

                    'email' => $validated['email'],
                    'status' => $validated['status'],
                ];

                if (!empty($validated['password'])) {
                    $userData['password'] = $validated['password'];
                }

                $student->user->update($userData);

                unset($validated['password']);

                $student->update($validated);
            });

            if (
                $newImage !== null &&
                $oldImage !== null &&
                $oldImage !==
                'students/profile-images/default-avatar.png' &&
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

    public function destroy(Student $student): JsonResponse
    {
        try {
            $imagePath = $student->profile_image;

            DB::transaction(function () use ($student) {
                $student->user->delete();
            });

            if (
                $imagePath !== null &&
                $imagePath !==
                'students/profile-images/default-avatar.png' &&
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
