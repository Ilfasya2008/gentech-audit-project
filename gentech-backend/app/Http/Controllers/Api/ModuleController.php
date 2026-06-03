<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    // Mengambil semua modul
    public function index()
    {
        $modules = Module::latest()->get(); 
        
        return response()->json([
            'success' => true, 
            'data' => $modules
        ], 200);
    }

    // Menyimpan modul baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'duration' => 'nullable|string',
            'status' => 'nullable|in:draft,published',
            'topics' => 'nullable', // Di Laravel, array bisa divalidasi dengan 'array'
            'content' => 'nullable'
        ]);

        $module = Module::create($validated);

        return response()->json([
            'success' => true, 
            'message' => 'Modul berhasil ditambahkan!',
            'data' => $module
        ], 201);
    }

    // Memperbarui modul yang ada (EDIT)
    public function update(Request $request, $id)
    {
        $module = Module::find($id);

        if (!$module) {
            return response()->json(['success' => false, 'message' => 'Modul tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'duration' => 'nullable|string',
            'status' => 'nullable|in:draft,published',
            'topics' => 'nullable',
            'content' => 'nullable'
        ]);

        $module->update($validated);

        return response()->json([
            'success' => true, 
            'message' => 'Modul berhasil diupdate!',
            'data' => $module
        ], 200);
    }

    // Menghapus modul (DELETE)
    public function destroy($id)
    {
        $module = Module::find($id);

        if (!$module) {
            return response()->json(['success' => false, 'message' => 'Modul tidak ditemukan'], 404);
        }

        $module->delete();

        return response()->json([
            'success' => true, 
            'message' => 'Modul berhasil dihapus!'
        ], 200);
    }
}