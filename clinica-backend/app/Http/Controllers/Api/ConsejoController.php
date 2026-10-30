<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consejo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ConsejoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Consejo::query();
        if (!$request->boolean('all')) {
            $query->where('estado', true);
        }
        $consejos = $query->orderBy('id', 'desc')->get();
        return response()->json(['consejos' => $consejos], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'categoria' => 'nullable|string|max:255',
            'descripcion' => 'required|string',
            'imagen' => 'nullable|image|max:5120', // 5MB Max
        ]);

        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('consejos', 'public');
            $validated['imagen_url'] = '/storage/' . $path;
        }

        $consejo = Consejo::create($validated);

        return response()->json([
            'message' => 'Consejo creado con éxito',
            'consejo' => $consejo
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $consejo = Consejo::find($id);
        if (!$consejo) {
            return response()->json(['message' => 'Consejo no encontrado'], 404);
        }

        $validated = $request->validate([
            'titulo' => 'sometimes|string|max:255',
            'categoria' => 'nullable|string|max:255',
            'descripcion' => 'sometimes|string',
            'imagen' => 'nullable|image|max:5120',
            'estado' => 'sometimes|boolean',
        ]);

        if ($request->hasFile('imagen')) {
            if ($consejo->imagen_url) {
                $oldPath = str_replace('/storage/', '', $consejo->imagen_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('imagen')->store('consejos', 'public');
            $validated['imagen_url'] = '/storage/' . $path;
        }

        $consejo->update($validated);

        return response()->json([
            'message' => 'Consejo actualizado con éxito',
            'consejo' => $consejo
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): JsonResponse
    {
        $consejo = Consejo::find($id);
        if (!$consejo) {
            return response()->json(['message' => 'Consejo no encontrado'], 404);
        }

        if ($consejo->imagen_url) {
            $oldPath = str_replace('/storage/', '', $consejo->imagen_url);
            Storage::disk('public')->delete($oldPath);
        }

        $consejo->delete();
        return response()->json(['message' => 'Consejo eliminado con éxito'], 200);
    }
}
