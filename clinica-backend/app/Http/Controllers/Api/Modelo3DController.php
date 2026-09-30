<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Modelo3D;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class Modelo3DController extends Controller
{
    /**
     * List all active 3D GLB models
     */
    public function index()
    {
        $modelos = Modelo3D::where('activo', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($modelos);
    }

    /**
     * Stream the .glb file with proper CORS and Content-Type headers
     */
    public function getFile($id)
    {
        $modelo = Modelo3D::findOrFail($id);

        if (!Storage::disk('public')->exists($modelo->archivo_path)) {
            abort(404, 'Archivo de modelo 3D no encontrado');
        }

        $fullPath = Storage::disk('public')->path($modelo->archivo_path);

        return response()->file($fullPath, [
            'Content-Type' => 'model/gltf-binary',
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, OPTIONS',
            'Access-Control-Allow-Headers' => 'Origin, Content-Type, Accept, Authorization, X-Requested-With',
        ]);
    }

    /**
     * Upload a new .glb 3D model
     */
    public function store(Request $request)
    {
        @ini_set('upload_max_filesize', '100M');
        @ini_set('post_max_size', '100M');
        @ini_set('memory_limit', '512M');
        @ini_set('max_execution_time', '300');

        if (!$request->hasFile('archivo') && empty($_FILES) && empty($_POST)) {
            return response()->json([
                'message' => 'El archivo sobrepasa el límite máximo permitido por el servidor web (post_max_size / upload_max_filesize).',
            ], 413);
        }

        $request->validate([
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string|max:255',
            'archivo' => [
                'required',
                'file',
                'max:102400', // Max 100MB
                function ($attribute, $value, $fail) {
                    $ext = strtolower($value->getClientOriginalExtension());
                    if ($ext !== 'glb') {
                        $fail('El archivo debe ser exclusivamente un modelo 3D en formato .glb');
                    }
                },
            ],
        ]);

        $file = $request->file('archivo');
        $path = $file->store('modelos_3d', 'public');

        $modelo = Modelo3D::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'archivo_path' => $path,
            'tamanio_bytes' => $file->getSize(),
            'mime_type' => $file->getClientMimeType() ?? 'model/gltf-binary',
            'user_id' => auth()->id(),
            'activo' => true,
        ]);

        return response()->json([
            'message' => 'Modelo 3D (.glb) guardado correctamente',
            'data' => $modelo,
        ], 201);
    }

    /**
     * Delete a 3D model record and its physical file
     */
    public function destroy($id)
    {
        $modelo = Modelo3D::findOrFail($id);

        if (Storage::disk('public')->exists($modelo->archivo_path)) {
            Storage::disk('public')->delete($modelo->archivo_path);
        }

        $modelo->delete();

        return response()->json([
            'message' => 'Modelo 3D eliminado exitosamente',
        ]);
    }
}
