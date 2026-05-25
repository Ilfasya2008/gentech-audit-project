<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ModuleController;

// Endpoint untuk mengambil & menyimpan modul
Route::get('/modules', [ModuleController::class, 'index']);
Route::post('/modules', [ModuleController::class, 'store']);
Route::put('/modules/{id}', [ModuleController::class, 'update']);      // Tambahkan ini
Route::delete('/modules/{id}', [ModuleController::class, 'destroy']);  // Tambahkan ini