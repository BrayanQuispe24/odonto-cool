<?php

namespace App\Http\Controllers;

use App\Models\Consejo;
use Illuminate\Http\Request;

class ConsejoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $consejos = Consejo::where('estado', true)->get();
        return response()->json(['consejos' => $consejos], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
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
     * Display the specified resource.
     */
    public function show(Consejo $consejo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Consejo $consejo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
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
            // Delete old image if exists
            if ($consejo->imagen_url) {
                $oldPath = str_replace('/storage/', '', $consejo->imagen_url);
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
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
    public function destroy($id)
    {
        $consejo = Consejo::find($id);
        if (!$consejo) {
            return response()->json(['message' => 'Consejo no encontrado'], 404);
        }

        $consejo->delete();
        return response()->json(['message' => 'Consejo eliminado con éxito'], 200);
    }
}
