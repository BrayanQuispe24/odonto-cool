<?php

namespace App\Actions\Rol;

use App\Models\Rol;
use Illuminate\Database\Eloquent\Collection;

class ListRolesAction
{
    public function execute(): Collection
    {
        return Rol::orderBy('id', 'asc')->get();
    }
}
