<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SimulationTransaction;

class SimulationTransactionSeeder extends Seeder
{
    public function run(): void
    {
        $transactions = [
            [
                'hash'             => '0x742d35cc6634c0532925a3b844bc9e7595f0e721',
                'from_entity'      => 'PT Maju Jaya',
                'to_entity'        => 'PT Sejahtera Mandiri',
                'amount'           => 25000000,
                'block_number'     => '15678234',
                'gas_used'         => 21000,
                'status'           => 'success',
                'transaction_date' => '2024-12-02 14:23:15',
            ],
            [
                'hash'             => '0x8f3e2a1b9c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
                'from_entity'      => 'CV Digital Teknologi',
                'to_entity'        => 'Yayasan Pendidikan Nusantara',
                'amount'           => 150000000,
                'block_number'     => '15678233',
                'gas_used'         => 21000,
                'status'           => 'success',
                'transaction_date' => '2024-12-02 14:18:42',
            ],
            [
                'hash'             => '0x5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e',
                'from_entity'      => 'Toko Elektronik Jaya',
                'to_entity'        => 'Supplier ABC',
                'amount'           => 500000,
                'block_number'     => '15678232',
                'gas_used'         => 21000,
                'status'           => 'success',
                'transaction_date' => '2024-12-02 13:55:28',
            ],
            [
                'hash'             => '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
                'from_entity'      => 'PT Investasi Global',
                'to_entity'        => 'Dana Pensiun Mandiri',
                'amount'           => 9999900000,
                'block_number'     => '15678231',
                'gas_used'         => 21000,
                'status'           => 'success',
                'transaction_date' => '2024-12-02 13:42:10',
            ],
            [
                'hash'             => '0x9c8b7a6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
                'from_entity'      => 'Koperasi Sejahtera',
                'to_entity'        => 'Anggota Koperasi - Ahmad',
                'amount'           => 50250000,
                'block_number'     => '15678230',
                'gas_used'         => 21000,
                'status'           => 'success',
                'transaction_date' => '2024-12-02 13:30:55',
            ],
            [
                'hash'             => '0x3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e',
                'from_entity'      => 'Yayasan Amal Sejahtera',
                'to_entity'        => 'Pembangunan Sekolah Desa',
                'amount'           => 10000000000,
                'block_number'     => '15678229',
                'gas_used'         => 21000,
                'status'           => 'success',
                'transaction_date' => '2024-12-02 13:15:33',
            ],
            [
                'hash'             => '0x7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d',
                'from_entity'      => 'Warung Makan Bu Siti',
                'to_entity'        => 'Supplier Sayuran Organik',
                'amount'           => 1000000,
                'block_number'     => '15678228',
                'gas_used'         => 21000,
                'status'           => 'pending',
                'transaction_date' => '2024-12-02 12:58:20',
            ],
            [
                'hash'             => '0x2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f',
                'from_entity'      => 'PT Konstruksi Megah',
                'to_entity'        => 'Pemerintah Daerah Jakarta',
                'amount'           => 7500000000,
                'block_number'     => '15678227',
                'gas_used'         => 21000,
                'status'           => 'success',
                'transaction_date' => '2024-12-02 12:45:12',
            ],
        ];

        foreach ($transactions as $tx) {
            SimulationTransaction::firstOrCreate(
                ['hash' => $tx['hash']],
                $tx
            );
        }

        $this->command->info('Seeded ' . count($transactions) . ' simulation transactions.');
    }
}
