<?php

namespace App\Actions\Doctor;

use App\Models\Doctor;
use Illuminate\Database\Eloquent\Collection;

class ListDoctorsAction
{
    public function execute(): Collection
    {
        return Doctor::with(['usuario', 'sucursal'])->latest()->get();
    }
}
