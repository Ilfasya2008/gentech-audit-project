<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SimulationTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SimulationTransactionController extends Controller
{
    public function index()
    {
        $transactions = SimulationTransaction::latest('transaction_date')->get();
        return response()->json(['success' => true, 'data' => $transactions]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'hash'             => 'nullable|string|unique:simulation_transactions,hash',
            'from_entity'      => 'required|string|max:255',
            'to_entity'        => 'required|string|max:255',
            'amount'           => 'required|numeric|min:0',
            'block_number'     => 'nullable|string',
            'gas_used'         => 'nullable|integer',
            'status'           => 'nullable|in:success,pending,failed',
            'transaction_date' => 'nullable|date',
        ]);

        // Auto-generate hash if not provided
        if (empty($validated['hash'])) {
            $validated['hash'] = '0x' . Str::random(40);
        }
        if (empty($validated['block_number'])) {
            $validated['block_number'] = (string) rand(15000000, 16000000);
        }
        if (empty($validated['transaction_date'])) {
            $validated['transaction_date'] = now();
        }

        $tx = SimulationTransaction::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil ditambahkan!',
            'data'    => $tx,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $tx = SimulationTransaction::find($id);
        if (!$tx) {
            return response()->json(['success' => false, 'message' => 'Transaksi tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'from_entity'      => 'required|string|max:255',
            'to_entity'        => 'required|string|max:255',
            'amount'           => 'required|numeric|min:0',
            'block_number'     => 'nullable|string',
            'gas_used'         => 'nullable|integer',
            'status'           => 'nullable|in:success,pending,failed',
            'transaction_date' => 'nullable|date',
        ]);

        $tx->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil diupdate!',
            'data'    => $tx,
        ]);
    }

    public function destroy($id)
    {
        $tx = SimulationTransaction::find($id);
        if (!$tx) {
            return response()->json(['success' => false, 'message' => 'Transaksi tidak ditemukan'], 404);
        }

        $tx->delete();

        return response()->json(['success' => true, 'message' => 'Transaksi berhasil dihapus!']);
    }
}
