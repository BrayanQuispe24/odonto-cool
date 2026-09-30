<?php

namespace App\Http\Controllers\Api;

use App\Actions\Sucursal\AssignDoctorSucursalAction;
use App\Actions\Sucursal\DeleteSucursalAction;
use App\Actions\Sucursal\ListSucursalesAction;
use App\Actions\Sucursal\ShowSucursalAction;
use App\Actions\Sucursal\StoreSucursalAction;
use App\Actions\Sucursal\UpdateSucursalAction;
use App\DTOs\Sucursal\AssignDoctorDTO;
use App\DTOs\Sucursal\StoreSucursalDTO;
use App\DTOs\Sucursal\UpdateSucursalDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Sucursal\AssignDoctorRequest;
use App\Http\Requests\Sucursal\StoreSucursalRequest;
use App\Http\Requests\Sucursal\UpdateSucursalRequest;
use App\Models\Sucursal;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class SucursalController extends Controller
{
    public function index(ListSucursalesAction $action): JsonResponse
    {
        Gate::authorize('viewAny', Sucursal::class);

        $sucursales = $action->execute();

        return response()->json([
            'sucursales' => $sucursales
        ], 200);
    }

    public function store(StoreSucursalRequest $request, StoreSucursalAction $action): JsonResponse
    {
        Gate::authorize('create', Sucursal::class);

        $dto = StoreSucursalDTO::fromRequest($request);
        $sucursal = $action->execute($dto);

        return response()->json([
            'message' => 'Sucursal registrada exitosamente',
            'sucursal' => $sucursal
        ], 201);
    }

    public function show(Sucursal $sucursale, ShowSucursalAction $action): JsonResponse
    {
        Gate::authorize('view', $sucursale);

        $sucursal = $action->execute($sucursale);

        return response()->json([
            'sucursal' => $sucursal
        ], 200);
    }

    public function update(UpdateSucursalRequest $request, Sucursal $sucursale, UpdateSucursalAction $action): JsonResponse
    {
        Gate::authorize('update', $sucursale);

        $dto = UpdateSucursalDTO::fromRequest($request);
        $sucursalActualizada = $action->execute($sucursale, $dto);

        return response()->json([
            'message' => 'Sucursal actualizada exitosamente',
            'sucursal' => $sucursalActualizada
        ], 200);
    }

    public function destroy(Sucursal $sucursale, DeleteSucursalAction $action): JsonResponse
    {
        Gate::authorize('delete', $sucursale);

        $action->execute($sucursale);

        return response()->json([
            'message' => 'Sucursal eliminada exitosamente'
        ], 200);
    }

    public function assignDoctor(AssignDoctorRequest $request, Sucursal $sucursale, AssignDoctorSucursalAction $action): JsonResponse
    {
        Gate::authorize('assignDoctor', $sucursale);

        $dto = AssignDoctorDTO::fromRequest($request, $sucursale->id);
        $doctor = $action->execute($sucursale, $dto);

        return response()->json([
            'message' => 'Doctor asignado a la sucursal exitosamente',
            'doctor' => $doctor
        ], 200);
    }
}
