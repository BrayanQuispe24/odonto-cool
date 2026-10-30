<?php

namespace App\Actions\Proforma;

use App\DTOs\Proforma\StoreProformaDTO;
use App\Models\DetalleProforma;
use App\Models\Proforma;
use App\Models\Servicio;
use Illuminate\Support\Facades\DB;

class StoreProformaAction
{
    public function execute(StoreProformaDTO $dto): Proforma
    {
        return DB::transaction(function () use ($dto) {
            // Generate unique code PRF-XXXXXX
            $codigo = 'PRF-' . strtoupper(substr(md5(uniqid((string) mt_rand(), true)), 0, 6));

            $montoTotal = 0.0;
            $detallesToInsert = [];

            foreach ($dto->detalles as $item) {
                $servicioId = (int) $item['servicio_id'];
                $servicio = Servicio::find($servicioId);
                $nombreServicio = $item['nombre_servicio'] ?? ($servicio ? $servicio->nombre : 'Servicio Odontológico');
                $precio = isset($item['precio']) ? (float) $item['precio'] : ($servicio ? (float) $servicio->precio_base : 0.0);
                $descuento = isset($item['descuento']) ? max(0, (float) $item['descuento']) : 0.0;
                $subtotal = max(0, $precio - $descuento);

                $montoTotal += $subtotal;

                $detallesToInsert[] = [
                    'servicio_id' => $servicioId,
                    'nombre_servicio' => $nombreServicio,
                    'precio' => $precio,
                    'descuento' => $descuento,
                    'subtotal' => $subtotal,
                ];
            }

            $proforma = Proforma::create([
                'codigo_proforma' => $codigo,
                'paciente_id' => $dto->paciente_id,
                'doctor_id' => $dto->doctor_id,
                'sucursal_id' => $dto->sucursal_id,
                'nombre' => $dto->nombre,
                'apellido' => $dto->apellido,
                'edad' => $dto->edad,
                'sexo' => $dto->sexo,
                'celular' => $dto->celular,
                'fecha_nacimiento' => $dto->fecha_nacimiento,
                'domicilio_actual' => $dto->domicilio_actual,
                'fecha_emision' => $dto->fecha_emision,
                'dias_validez' => $dto->dias_validez,
                'monto_total' => $montoTotal,
                'estado' => 'Borrador',
                'observaciones' => $dto->observaciones,
            ]);

            foreach ($detallesToInsert as $det) {
                DetalleProforma::create(array_merge($det, [
                    'proforma_id' => $proforma->id,
                ]));
            }

            return $proforma->load([
                'paciente',
                'doctor.usuario',
                'sucursal',
                'detalles.servicio',
            ]);
        });
    }
}
