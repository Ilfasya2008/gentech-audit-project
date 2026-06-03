<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SimulationTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'hash',
        'from_entity',
        'to_entity',
        'amount',
        'block_number',
        'gas_used',
        'status',
        'transaction_date',
    ];

    protected $casts = [
        'amount' => 'float',
        'gas_used' => 'integer',
        'transaction_date' => 'datetime',
    ];
}
