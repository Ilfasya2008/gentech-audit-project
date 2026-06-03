<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    public function index()
    {
        $quizzes = Quiz::withCount('questions')->latest()->get();
        return response()->json(['success' => true, 'data' => $quizzes]);
    }

    public function show($id)
    {
        $quiz = Quiz::with('questions')->find($id);
        if (!$quiz) {
            return response()->json(['success' => false, 'message' => 'Quiz tidak ditemukan'], 404);
        }
        return response()->json(['success' => true, 'data' => $quiz]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'             => 'required|string|max:255',
            'description'       => 'nullable|string',
            'difficulty'        => 'nullable|in:Pemula,Menengah,Lanjutan',
            'estimated_minutes' => 'nullable|integer|min:1',
            'icon'              => 'nullable|string',
            'color'             => 'nullable|string',
            'is_active'         => 'nullable|boolean',
        ]);

        $quiz = Quiz::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Quiz berhasil ditambahkan!',
            'data'    => $quiz,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $quiz = Quiz::find($id);
        if (!$quiz) {
            return response()->json(['success' => false, 'message' => 'Quiz tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'title'             => 'required|string|max:255',
            'description'       => 'nullable|string',
            'difficulty'        => 'nullable|in:Pemula,Menengah,Lanjutan',
            'estimated_minutes' => 'nullable|integer|min:1',
            'icon'              => 'nullable|string',
            'color'             => 'nullable|string',
            'is_active'         => 'nullable|boolean',
        ]);

        $quiz->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Quiz berhasil diupdate!',
            'data'    => $quiz,
        ]);
    }

    public function destroy($id)
    {
        $quiz = Quiz::find($id);
        if (!$quiz) {
            return response()->json(['success' => false, 'message' => 'Quiz tidak ditemukan'], 404);
        }

        $quiz->delete(); // cascades to questions

        return response()->json(['success' => true, 'message' => 'Quiz berhasil dihapus!']);
    }
}
