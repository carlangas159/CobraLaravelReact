<?php
declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Ejemplos de uso (en español):
     * 1) Ejecutar migraciones normales: php artisan migrate
     * 2) Ejecutar migraciones con seed o insertar demo manualmente: php artisan migrate --seed
     * 3) Para depuración, volver a ejecutar migraciones: php artisan migrate:refresh
     *
     * Este método crea la tabla 'users' y, justo después de su creación, inserta o actualiza
     * de forma idempotente un usuario demo con email demo@demo.com y contraseña 123456789.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        // Insertar o actualizar el usuario demo inmediatamente después de crear la tabla.
        // Se usa updateOrInsert para que la operación sea idempotente.
        DB::table('users')->updateOrInsert(
            ['email' => 'demo@demo.com'],
            [
                'name' => 'demo',
                'email' => 'demo@demo.com',
                'password' => Hash::make('123456789'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }

    /**
     * Reverse the migrations.
     *
     * Ejemplos de uso (en español):
     * 1) Revertir la última migración: php artisan migrate:rollback
     * 2) Revertir todas y volver a ejecutar: php artisan migrate:refresh
     * 3) Para pruebas locales: php artisan migrate:fresh
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
