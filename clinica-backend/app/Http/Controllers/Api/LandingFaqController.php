<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LandingFaq;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LandingFaqController extends Controller
{
    /**
     * Display a listing of FAQs.
     */
    public function index(Request $request): JsonResponse
    {
        // Seed initial default FAQs if table is empty
        if (LandingFaq::count() === 0) {
            foreach (LandingFaq::defaultFaqs() as $defaultFaq) {
                LandingFaq::create($defaultFaq);
            }
        }

        $query = LandingFaq::query();

        if (!$request->boolean('all')) {
            $query->where('estado', true);
        }

        $faqs = $query->orderBy('orden', 'asc')->orderBy('id', 'asc')->get();

        return response()->json([
            'faqs' => $faqs,
        ], 200);
    }

    /**
     * Store a newly created FAQ.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pregunta' => 'required|string|max:255',
            'respuesta' => 'required|string',
            'orden' => 'nullable|integer',
            'estado' => 'nullable|boolean',
        ]);

        if (!isset($validated['orden'])) {
            $maxOrder = LandingFaq::max('orden') ?? 0;
            $validated['orden'] = $maxOrder + 1;
        }

        if (!isset($validated['estado'])) {
            $validated['estado'] = true;
        }

        $faq = LandingFaq::create($validated);

        return response()->json([
            'message' => 'Pregunta frecuente creada con éxito',
            'faq' => $faq,
        ], 201);
    }

    /**
     * Display the specified FAQ.
     */
    public function show($id): JsonResponse
    {
        $faq = LandingFaq::find($id);
        if (!$faq) {
            return response()->json(['message' => 'Pregunta frecuente no encontrada'], 404);
        }

        return response()->json(['faq' => $faq], 200);
    }

    /**
     * Update the specified FAQ.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $faq = LandingFaq::find($id);
        if (!$faq) {
            return response()->json(['message' => 'Pregunta frecuente no encontrada'], 404);
        }

        $validated = $request->validate([
            'pregunta' => 'sometimes|string|max:255',
            'respuesta' => 'sometimes|string',
            'orden' => 'sometimes|integer',
            'estado' => 'sometimes|boolean',
        ]);

        $faq->update($validated);

        return response()->json([
            'message' => 'Pregunta frecuente actualizada con éxito',
            'faq' => $faq,
        ], 200);
    }

    /**
     * Remove the specified FAQ.
     */
    public function destroy($id): JsonResponse
    {
        $faq = LandingFaq::find($id);
        if (!$faq) {
            return response()->json(['message' => 'Pregunta frecuente no encontrada'], 404);
        }

        $faq->delete();

        return response()->json([
            'message' => 'Pregunta frecuente eliminada con éxito',
        ], 200);
    }
}
