<?php


use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductViewController;
use App\Http\Controllers\BackupController;

use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\Api\AuthController;

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/transaksi', [TransaksiController::class, 'index'])->name('transaksi.index');
    Route::get('/transaksi/{transaksi}', [TransaksiController::class, 'show'])->name('transaksi.show');
    Route::post('/transaksi/{id}/validasi', [TransaksiController::class, 'validatePayment'])->name('transaksi.validasi');
    Route::get('/backup/daily', [TransaksiController::class, 'backupDaily'])->name('backup.daily');
    Route::get('/backup/monthly', [TransaksiController::class, 'backupMonthly'])->name('backup.monthly');
});



// tambahkan route dashboard
Route::get('/dashboard', function () {
    return view('welcome'); // atau ganti dengan view dashboard kamu
})->name('dashboard');

//Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');


Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/', function () {
        return view('admin.index');
    })->name('index');

    Route::resource('produk', ProductViewController::class);
    
    Route::get('/account', function () {
        return view('admin.account');
    })->name('account');

    Route::get('/support', function () {
        return view('admin.support');
    })->name('support');
});

Route::resource('produk', ProductViewController::class);
Route::get('/', function () {
    return view('welcome');
});
Route::get('products', [ProductController::class, 'index']);

