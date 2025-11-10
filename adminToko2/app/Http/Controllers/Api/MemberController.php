<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Member;

class MemberController extends Controller
{
    // LOGIN
    public function index(Request $request)
    {
        // kalau ada parameter email di URL
        if ($request->has('email')) {
            $member = Member::where('email', $request->email)->first();

            if ($member) {
                return response()->json([
                    'success' => true,
                    'data' => $member
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Member tidak ditemukan'
                ], 404);
            }
        }
        // kalau tidak ada email, kembalikan semua data member
        $members = Member::all();
        return response()->json([
            'success' => true,
            'data' => $members
        ]);
    }


    // SIGN UP (REGISTER)
    public function register(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:100|unique:members,nama',
            'email' => 'required|email|unique:members,email',
            'telepon' => 'required|string|max:15',
        ]);

        $member = Member::create($request->only('nama', 'email', 'telepon'));

        return response()->json([
            'message' => 'Registrasi berhasil!',
            'data' => $member
        ]);
    }
}
