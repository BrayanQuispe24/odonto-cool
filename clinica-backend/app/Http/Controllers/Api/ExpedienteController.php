<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ExpedienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $expedientes = \App\Models\Expediente::with('paciente')->orderBy('created_at', 'desc')->get();
        return response()->json($expedientes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'paciente_id' => 'required|exists:pacientes,id',
            'titulo' => 'required|string|max:255',
            'tipo_documento' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'archivo' => 'required|file|mimes:pdf|max:10240', // max 10MB
        ]);

        if (!$request->hasFile('archivo')) {
            return response()->json(['message' => 'No file uploaded'], 400);
        }

        $path = $request->file('archivo')->store('expedientes', 'public');

        $expediente = \App\Models\Expediente::create([
            'paciente_id' => $request->paciente_id,
            'titulo' => $request->titulo,
            'tipo_documento' => $request->tipo_documento,
            'descripcion' => $request->descripcion,
            'archivo_path' => $path,
        ]);

        return response()->json($expediente->load('paciente'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $expediente = \App\Models\Expediente::with('paciente')->findOrFail($id);
        return response()->json($expediente);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $expediente = \App\Models\Expediente::findOrFail($id);
        
        if (\Illuminate\Support\Facades\Storage::disk('public')->exists($expediente->archivo_path)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($expediente->archivo_path);
        }
        
        $expediente->delete();

        return response()->json(['message' => 'Expediente eliminado correctamente']);
    }
}
