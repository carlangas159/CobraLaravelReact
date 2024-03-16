<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::post('/sanctum/token', function (Request $request) {
    $request->validate([
                           'email' => 'required|email',
                           'password' => 'required',
                           'device_name' => 'required',
                       ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
                                                    'email' => ['The provided credentials are incorrect.'],
                                                ]);
    }

    return $user->createToken($request->device_name)->plainTextToken;
});
