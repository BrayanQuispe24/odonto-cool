<?php

namespace App\Actions\Proforma;

use App\Models\Proforma;

class DeleteProformaAction
{
    public function execute(Proforma $proforma): bool
    {
        return (bool) $proforma->delete();
    }
}
