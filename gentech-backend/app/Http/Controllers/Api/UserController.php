<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        $users = User::latest()->get()->map(function ($u) {
            return [
                'id'         => $u->id,
                'name'       => $u->name,
                'email'      => $u->email,
                'role'       => $u->role ?? 'user',
                'created_at' => $u->created_at,
            ];
        });

        return response()->json(['success' => true, 'data' => $users]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => 'nullable|in:admin,user',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => $validated['role'] ?? 'user',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil ditambahkan!',
            'data'    => $user,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => ['required', 'email', Rule::unique('users')->ignore($id)],
            'role'     => 'nullable|in:admin,user',
            'password' => 'nullable|string|min:6',
        ]);

        $user->name  = $validated['name'];
        $user->email = $validated['email'];
        $user->role  = $validated['role'] ?? $user->role ?? 'user';

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'User berhasil diupdate!',
            'data'    => $user,
        ]);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User tidak ditemukan'], 404);
        }

        $user->delete();

        return response()->json(['success' => true, 'message' => 'User berhasil dihapus!']);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Email atau Password salah!',
            ], 401);
        }

        $passwordMatches = false;

        try {
            $passwordMatches = Hash::check($validated['password'], $user->password);
        } catch (\RuntimeException $e) {
            // Jika password di database bukan format bcrypt (mungkin plain-text warisan XAMPP)
            if ($user->password === $validated['password']) {
                $passwordMatches = true;
                // Rehash password secara otomatis agar aman di database
                $user->password = Hash::make($validated['password']);
                $user->save();
            }
        }

        if (!$passwordMatches) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Email atau Password salah!',
            ], 401);
        }

        return response()->json([
            'status' => 'success',
            'name'   => $user->name,
            'role'   => $user->role ?? 'user',
            'email'  => $user->email,
        ]);
    }

    public function changeProfile(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'name'  => 'required|string|max:255',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'User tidak ditemukan!',
            ], 404);
        }

        $user->name = $validated['name'];
        $user->save();

        return response()->json([
            'status'  => 'success',
            'message' => 'Profil berhasil diperbarui!',
            'name'    => $user->name
        ]);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => 'user',
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Pendaftaran Berhasil!',
            'data'    => $user,
        ], 201);
    }

    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'email'        => 'required|email',
            'old_password' => 'required|string',
            'new_password' => 'required|string|min:6',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'User tidak ditemukan.',
            ], 404);
        }

        // Verifikasi password lama
        $passwordMatches = false;
        try {
            $passwordMatches = Hash::check($validated['old_password'], $user->password);
        } catch (\RuntimeException $e) {
            if ($user->password === $validated['old_password']) {
                $passwordMatches = true;
            }
        }

        if (!$passwordMatches) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Password lama tidak cocok!',
            ], 401);
        }

        // Simpan password baru
        $user->password = Hash::make($validated['new_password']);
        $user->save();

        return response()->json([
            'status'  => 'success',
            'message' => 'Password berhasil diubah!',
        ]);
    }
}
