<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email or password.',
            ], 401);
        }

        if ($user->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Your account is inactive. Please contact the administrator.',
            ], 403);
        }

        $user->load(['student', 'lecturer']);

        $avatar = $this->getAvatarUrl($user);

        $token = $user
            ->createToken('system-login-token')
            ->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful.',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
                'avatar' => $avatar,
            ],
        ]);
    }

    /**
     * Current logged-in user
     */
    public function me(Request $request)
    {
        $user = $request->user();

        $user->load(['student', 'lecturer']);

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
                'avatar' => $this->getAvatarUrl($user),
            ],
        ]);
    }

    /**
     * Logout
     */
    public function logout(Request $request)
    {
        $request->user()
            ->currentAccessToken()
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);
    }

    /**
     * Build profile image URL
     */
    private function getAvatarUrl(User $user): ?string
    {
        $profileImage = null;

        if ($user->role === 'student') {
            $profileImage = $user->student?->profile_image;
        }

        if ($user->role === 'lecturer') {
            $profileImage = $user->lecturer?->profile_image;
        }

        if (!$profileImage) {
            return null;
        }

        return asset(
            'storage/' . ltrim($profileImage, '/')
        );
    }
}
