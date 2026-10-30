<?php

namespace App\Http\Controllers\Api;

use App\Actions\Doctor\DeleteDoctorAction;
use App\Actions\Doctor\ListDoctorsAction;
use App\Actions\Doctor\ShowDoctorAction;
use App\Actions\Doctor\StoreDoctorAction;
use App\Actions\Doctor\UpdateDoctorAction;
use App\DTOs\Doctor\StoreDoctorDTO;
use App\DTOs\Doctor\UpdateDoctorDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Doctor\StoreDoctorRequest;
use App\Http\Requests\Doctor\UpdateDoctorRequest;
use App\Models\Doctor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class DoctorController extends Controller
{
    public function publicIndex(): JsonResponse
    {
        $doctores = Doctor::with(['usuario', 'sucursal'])
            ->where('destacado_en_landing', true)
            ->get();

        return response()->json([
            'doctores' => $doctores
        ], 200);
    }

    public function toggleLanding(Request $request, $id): JsonResponse
    {
        $doctor = Doctor::with(['usuario', 'sucursal'])->findOrFail($id);
        $doctor->destacado_en_landing = $request->has('destacado_en_landing')
            ? $request->boolean('destacado_en_landing')
            : !$doctor->destacado_en_landing;

        if ($request->has('bio_landing')) {
            $doctor->bio_landing = $request->input('bio_landing');
        }

        $doctor->save();

        return response()->json([
            'message' => $doctor->destacado_en_landing ? 'Doctor visible en la vitrina de la landing' : 'Doctor retirado de la vitrina',
            'doctor' => $doctor,
        ], 200);
    }

    public function index(ListDoctorsAction $action): JsonResponse
    {
        Gate::authorize('viewAny', Doctor::class);

        $doctores = $action->execute();

        return response()->json([
            'doctores' => $doctores
        ], 200);
    }

    public function store(StoreDoctorRequest $request, StoreDoctorAction $action): JsonResponse
    {
        Gate::authorize('create', Doctor::class);

        $dto = StoreDoctorDTO::fromRequest($request);
        $doctor = $action->execute($dto);

        return response()->json([
            'message' => 'Doctor registrado exitosamente',
            'doctor' => $doctor
        ], 201);
    }

    public function show(Doctor $doctore, ShowDoctorAction $action): JsonResponse
    {
        Gate::authorize('view', $doctore);

        $doctor = $action->execute($doctore);

        return response()->json([
            'doctor' => $doctor
        ], 200);
    }

    public function update(UpdateDoctorRequest $request, Doctor $doctore, UpdateDoctorAction $action): JsonResponse
    {
        Gate::authorize('update', $doctore);

        $dto = UpdateDoctorDTO::fromRequest($request);
        $doctorActualizado = $action->execute($doctore, $dto);

        return response()->json([
            'message' => 'Doctor actualizado exitosamente',
            'doctor' => $doctorActualizado
        ], 200);
    }

    public function destroy(Doctor $doctore, DeleteDoctorAction $action): JsonResponse
    {
        Gate::authorize('delete', $doctore);

        $action->execute($doctore);

        return response()->json([
            'message' => 'Doctor eliminado exitosamente'
        ], 200);
    }
}
