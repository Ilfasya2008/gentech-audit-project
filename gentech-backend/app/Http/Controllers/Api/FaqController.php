<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = Faq::latest()->get();
        return response()->json(['success' => true, 'data' => $faqs]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer'   => 'required|string',
        ]);

        $faq = Faq::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'FAQ berhasil ditambahkan!',
            'data'    => $faq,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $faq = Faq::find($id);
        if (!$faq) {
            return response()->json(['success' => false, 'message' => 'FAQ tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'question' => 'required|string',
            'answer'   => 'required|string',
        ]);

        $faq->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'FAQ berhasil diupdate!',
            'data'    => $faq,
        ]);
    }

    public function destroy($id)
    {
        $faq = Faq::find($id);
        if (!$faq) {
            return response()->json(['success' => false, 'message' => 'FAQ tidak ditemukan'], 404);
        }

        $faq->delete();

        return response()->json(['success' => true, 'message' => 'FAQ berhasil dihapus!']);
    }
}
