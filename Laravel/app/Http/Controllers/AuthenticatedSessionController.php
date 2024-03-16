<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;

class AuthenticatedSessionController extends Controller
{

    /**
     * Handle an incoming api authentication request.
     *
     * @param LoginRequest $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function apiStore(LoginRequest $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect']
            ]);
        }


        $user = User::where('email', $request->email)->first();
        $user->token = auth()->user()->createToken('authToken')->plainTextToken;

        return response()->json($user);
    }

    /**
     * Verifies user token.
     *
     * @param Request $request
     *
     * @return Response
     */
    public function apiVerifyToken(Request $request)
    {
        $request->validate([
            'api_token' => 'required'
        ]);

        $user = User::where('api_token', $request->api_token)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'token' => ['Invalid token']
            ]);
        }
        return response($user);
    }

}
