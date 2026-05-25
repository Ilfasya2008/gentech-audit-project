<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    // 1. Daftarkan kolom yang boleh diisi dari form (Mass Assignment)
    protected $fillable = [
        'title', 
        'description', 
        'duration', 
        'status', 
        'topics', 
        'content'
    ];

    // 2. Wajib! Biar kolom JSON otomatis jadi Array saat dikirim ke React
    protected $casts = [
        'topics' => 'array',
        'content' => 'array',
    ];
}