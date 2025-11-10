<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\TransaksiApiController;
use App\Http\Controllers\Api\CategoryController;


// ====================
// AUTH
// ====================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/profile', [AuthController::class, 'profile'])->middleware('auth:sanctum');

// ====================
// MEMBER
// ====================
Route::get('/members', [MemberController::class, 'index']);
Route::post('/members/login', [MemberController::class, 'login']);
Route::post('/members/register', [MemberController::class, 'register']);

// ====================
// PRODUCT
// ====================
Route::apiResource('products', ProductController::class);
Route::apiResource('categories', CategoryController::class);
Route::get('/categories', [CategoryController::class, 'index']);
// ====================
// TRANSAKSI
// ====================
Route::get('/transaksis', [TransaksiApiController::class, 'index']);
Route::get('/transaksis/{id}', [TransaksiApiController::class, 'show']);
Route::put('/transaksis/{id}/validasi', [TransaksiApiController::class, 'validasi']);
Route::post('/checkout', [App\Http\Controllers\Api\TransaksiApiController::class, 'store']);
Route::put('/transaksis/{id}/validasi', [TransaksiApiController::class, 'validasi']);
Route::get('/admin/backup/daily', [TransaksiController::class, 'backupDaily'])->name('admin.backup.daily');
Route::get('/admin/backup/monthly', [TransaksiController::class, 'backupMonthly'])->name('admin.backup.monthly');
