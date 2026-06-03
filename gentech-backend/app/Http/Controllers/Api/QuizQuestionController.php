<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use Illuminate\Http\Request;

class QuizQuestionController extends Controller
{
    public function index($quizId)
    {
        $quiz = Quiz::find($quizId);
        if (!$quiz) {
            return response()->json(['success' => false, 'message' => 'Quiz tidak ditemukan'], 404);
        }

        $questions = $quiz->questions;
        return response()->json(['success' => true, 'data' => $questions]);
    }

    public function store(Request $request, $quizId)
    {
        $quiz = Quiz::find($quizId);
        if (!$quiz) {
            return response()->json(['success' => false, 'message' => 'Quiz tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'question'       => 'required|string',
            'options'        => 'required|array|min:2',
            'options.*'      => 'required|string',
            'correct_answer' => 'required|integer|min:0',
            'explanation'    => 'nullable|string',
            'order'          => 'nullable|integer',
        ]);

        $maxOrder = $quiz->questions()->max('order') ?? 0;

        $question = QuizQuestion::create([
            'quiz_id'        => $quiz->id,
            'question'       => $validated['question'],
            'options'        => $validated['options'],
            'correct_answer' => $validated['correct_answer'],
            'explanation'    => $validated['explanation'] ?? null,
            'order'          => $validated['order'] ?? $maxOrder + 1,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Soal berhasil ditambahkan!',
            'data'    => $question,
        ], 201);
    }

    public function update(Request $request, $quizId, $questionId)
    {
        $question = QuizQuestion::where('quiz_id', $quizId)->find($questionId);
        if (!$question) {
            return response()->json(['success' => false, 'message' => 'Soal tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'question'       => 'required|string',
            'options'        => 'required|array|min:2',
            'options.*'      => 'required|string',
            'correct_answer' => 'required|integer|min:0',
            'explanation'    => 'nullable|string',
            'order'          => 'nullable|integer',
        ]);

        $question->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Soal berhasil diupdate!',
            'data'    => $question,
        ]);
    }

    public function destroy($quizId, $questionId)
    {
        $question = QuizQuestion::where('quiz_id', $quizId)->find($questionId);
        if (!$question) {
            return response()->json(['success' => false, 'message' => 'Soal tidak ditemukan'], 404);
        }

        $question->delete();

        return response()->json(['success' => true, 'message' => 'Soal berhasil dihapus!']);
    }
}
