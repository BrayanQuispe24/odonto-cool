<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LandingSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LandingSettingController extends Controller
{
    /**
     * Get all landing settings merged with defaults.
     */
    public function index(): JsonResponse
    {
        $defaults = LandingSetting::defaults();
        $stored = LandingSetting::all()->pluck('value', 'key')->toArray();

        $merged = array_replace_recursive($defaults, $stored);

        return response()->json([
            'settings' => $merged,
        ], 200);
    }

    /**
     * Update landing settings.
     */
    public function update(Request $request): JsonResponse
    {
        $defaults = LandingSetting::defaults();
        $current = LandingSetting::all()->pluck('value', 'key')->toArray();
        $merged = array_replace_recursive($defaults, $current);

        // Handle Hero Image Upload if present
        if ($request->hasFile('hero_imagen')) {
            $request->validate([
                'hero_imagen' => 'image|max:10240', // 10MB Max
            ]);

            $path = $request->file('hero_imagen')->store('landing', 'public');
            $heroData = $request->input('hero', $merged['hero'] ?? []);
            if (is_string($heroData)) {
                $heroData = json_decode($heroData, true) ?? [];
            }
            $heroData['imagen_url'] = '/storage/' . $path;
            LandingSetting::updateOrCreate(['key' => 'hero'], ['value' => $heroData]);
        }

        // Handle other structured groups
        $keys = ['hero', 'contacto', 'secciones_visibles', 'anuncio_top'];
        foreach ($keys as $key) {
            if ($request->has($key)) {
                $value = $request->input($key);
                if (is_string($value)) {
                    $value = json_decode($value, true) ?? $value;
                }
                if (is_array($value) && isset($merged[$key]) && is_array($merged[$key])) {
                    $value = array_replace_recursive($merged[$key], $value);
                }
                LandingSetting::updateOrCreate(['key' => $key], ['value' => $value]);
            }
        }

        // Return updated full settings
        $stored = LandingSetting::all()->pluck('value', 'key')->toArray();
        $response = array_replace_recursive($defaults, $stored);

        return response()->json([
            'message' => 'Configuración de la landing page actualizada con éxito',
            'settings' => $response,
        ], 200);
    }
}
