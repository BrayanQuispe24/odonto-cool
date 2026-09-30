<?php

use App\Http\Controllers\Api\AntecedenteController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BoletaServicioPrestadoController;
use App\Http\Controllers\Api\CitaController;
use App\Http\Controllers\Api\DienteController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\Modelo3DController;
use App\Http\Controllers\Api\PacienteController;
use App\Http\Controllers\Api\ReporteController;
use App\Http\Controllers\Api\RolController;
use App\Http\Controllers\Api\ServicioController;
use App\Http\Controllers\Api\SucursalController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ExpedienteController;
use App\Http\Controllers\Api\BackupController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

// Public or CORS-enabled file stream for 3D GLB models
Route::get('/modelos-3d/{id}/file', [Modelo3DController::class, 'getFile']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/register', [AuthController::class, 'register']);

    Route::get('/dashboard/admin-stats', [DashboardController::class, 'adminStats']);
    Route::get('/dashboard/doctor-stats', [DashboardController::class, 'doctorStats']);

    Route::get('/reportes/financiero', [ReporteController::class, 'financiero']);

    Route::get('/me', [UserController::class, 'me']);
    Route::apiResource('users', UserController::class);
    Route::get('/roles', [RolController::class, 'index']);

    Route::apiResource('doctores', DoctorController::class);
    Route::apiResource('pacientes', PacienteController::class);
    Route::get('/citas/disponibilidad', [CitaController::class, 'disponibilidad']);
    Route::apiResource('citas', CitaController::class);
    Route::apiResource('servicios', ServicioController::class);
    Route::apiResource('dientes', DienteController::class);

    Route::apiResource('boletas', BoletaServicioPrestadoController::class);
    Route::post('/boletas/{boleta}/cuotas', [BoletaServicioPrestadoController::class, 'storeCuota']);
    Route::put('/boletas/{boleta}/cuotas/{cuota}', [BoletaServicioPrestadoController::class, 'updateCuota']);
    Route::delete('/boletas/{boleta}/cuotas/{cuota}', [BoletaServicioPrestadoController::class, 'destroyCuota']);
    Route::post('/boletas/{boleta}/cuotas/{cuota}/pagar', [BoletaServicioPrestadoController::class, 'pagarCuota']);

    Route::get('/pacientes/{paciente}/antecedentes', [AntecedenteController::class, 'show']);
    Route::put('/pacientes/{paciente}/antecedentes', [AntecedenteController::class, 'update']);

    Route::apiResource('sucursales', SucursalController::class);
    Route::post('/sucursales/{sucursale}/asignar-doctor', [SucursalController::class, 'assignDoctor']);

    Route::apiResource('modelos-3d', Modelo3DController::class)->only(['index', 'store', 'destroy']);

    Route::apiResource('expedientes', ExpedienteController::class);

    // Módulo de Backups (Solo Administradores)
    Route::middleware([\App\Http\Middleware\EnsureIsAdmin::class])->group(function () {
        Route::get('/backups', [BackupController::class, 'index']);
        Route::post('/backups/create', [BackupController::class, 'store']);
        Route::post('/backups/upload', [BackupController::class, 'upload']);
        Route::post('/backups/restore', [BackupController::class, 'restore']);
        Route::get('/backups/download/{filename}', [BackupController::class, 'download']);
        Route::delete('/backups/{filename}', [BackupController::class, 'destroy']);
    });
});
