<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || $request->user()->rol->nombre !== 'Administrador') {
            return response()->json(['message' => 'Acceso denegado: Se requiere rol de Administrador para gestionar respaldos.'], 403);
        }
        return $next($request);
    }
}
