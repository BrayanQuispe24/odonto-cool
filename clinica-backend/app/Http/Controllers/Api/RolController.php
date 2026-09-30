<?php

namespace App\Http\Controllers\Api;

use App\Actions\Rol\ListRolesAction;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class RolController extends Controller
{
    public function index(ListRolesAction $action): JsonResponse
    {
        $roles = $action->execute();

        return response()->json([
            'roles' => $roles
        ], 200);
    }
}
