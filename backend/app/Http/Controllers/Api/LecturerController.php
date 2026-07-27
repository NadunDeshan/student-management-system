<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLecturerRequest;
use App\Http\Requests\UpdateLecturerRequest;
use App\Http\Resources\LecturerResource;
use App\Models\Lecturer;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class LecturerController extends Controller
{
    /**
     * Display lecturers with search and pagination.
     */
    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));

        $lecturers = Lecturer::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($lecturerQuery) use ($search) {
                    $lecturerQuery
                        ->where(
                            'lecturer_number',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhere(
                            'first_name',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhere(
                            'last_name',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhere(
                            'email',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhere(
                            'department',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhere(
                            'specialization',
                            'like',
                            "%{$search}%"
                        );
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return LecturerResource::collection($lecturers);
    }

    /**
     * Create a lecturer and login account.
     */
    public function store(
        StoreLecturerRequest $request
    ): JsonResponse {
        $uploadedImage = null;

        try {
            $lecturer = DB::transaction(function () use (
                $request,
                &$uploadedImage
            ) {
                $validated = $request->validated();

                if ($request->hasFile('profile_image')) {
                    $uploadedImage = $request
                        ->file('profile_image')
                        ->store(
                            'lecturers/profile-images',
                            'public'
                        );

                    $validated['profile_image'] =
                        $uploadedImage;
                } else {
                    $validated['profile_image'] =
                        'lecturers/profile-images/default-avatar.png';
                }

                $user = User::create([
                    'name' => $validated['first_name']
                        . ' '
                        . $validated['last_name'],

                    'email' => $validated['email'],
                    'password' => $validated['password'],
                    'role' => 'lecturer',
                    'status' => $validated['status'],
                ]);

                unset($validated['password']);

                $validated['user_id'] = $user->id;

                return Lecturer::create($validated);
            });

            return response()->json([
                'success' => true,
                'message' => 'Lecturer created successfully.',
                'data' => new LecturerResource($lecturer),
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
                'message' => 'Unable to create the lecturer.',
            ], 500);
        }
    }

    /**
     * Display one lecturer.
     */
    public function show(Lecturer $lecturer): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new LecturerResource($lecturer),
        ]);
    }

    /**
     * Update lecturer profile and login account.
     */
    public function update(
        UpdateLecturerRequest $request,
        Lecturer $lecturer
    ): JsonResponse {
        $oldImage = $lecturer->profile_image;
        $newImage = null;

        try {
            $validated = $request->validated();

            if ($request->hasFile('profile_image')) {
                $newImage = $request
                    ->file('profile_image')
                    ->store(
                        'lecturers/profile-images',
                        'public'
                    );

                $validated['profile_image'] = $newImage;
            }

            DB::transaction(function () use (
                $lecturer,
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
                    $userData['password'] =
                        $validated['password'];
                }

                $lecturer->user->update($userData);

                unset($validated['password']);

                $lecturer->update($validated);
            });

            if (
                $newImage !== null &&
                $oldImage !== null &&
                $oldImage !==
                'lecturers/profile-images/default-avatar.png' &&
                Storage::disk('public')->exists($oldImage)
            ) {
                Storage::disk('public')->delete($oldImage);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lecturer updated successfully.',
                'data' => new LecturerResource(
                    $lecturer->fresh()
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
                'message' => 'Unable to update the lecturer.',
            ], 500);
        }
    }

    /**
     * Delete lecturer and linked login account.
     */
    public function destroy(
        Lecturer $lecturer
    ): JsonResponse {
        try {
            $imagePath = $lecturer->profile_image;

            DB::transaction(function () use ($lecturer) {
                $lecturer->user->delete();
            });

            if (
                $imagePath !== null &&
                $imagePath !==
                'lecturers/profile-images/default-avatar.png' &&
                Storage::disk('public')->exists($imagePath)
            ) {
                Storage::disk('public')->delete($imagePath);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lecturer deleted successfully.',
            ]);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'success' => false,
                'message' => 'Unable to delete the lecturer.',
            ], 500);
        }
    }
}
