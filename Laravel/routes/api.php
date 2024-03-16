<?php

use App\Http\Controllers\AuthenticatedSessionController;
use App\Http\Controllers\TareaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::post('/login', [AuthenticatedSessionController::class, 'apiStore']);
Route::post('/verify_token', [AuthenticatedSessionController::class, 'apiVerifyToken']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

    Route::resource('tarea', TareaController::class)->only([
                                                               'index',
                                                               'update',
                                                               'store',
                                                               'destroy',
                                                               'edit',

                                                           ]);

