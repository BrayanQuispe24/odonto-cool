<?php

namespace App\Actions\Proforma;

use App\Models\Antecedente;
use App\Models\Paciente;
use App\Models\Proforma;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class CambiarEstadoProformaAction
{
    /**
     * Cambia el estado de una proforma ('Borrador', 'Aprobado', 'Rechazado').
     * Si pasa a 'Aprobado' y no tiene paciente, permite vincular o registrar al paciente.
     */
    public function execute(
        Proforma $proforma,
        string $nuevoEstado,
        ?int $pacienteId = null,
        bool $registrarNuevoPaciente = false,
        array $datosPacienteExtra = []
    ): Proforma {
        $validEstados = ['Borrador', 'Aprobado', 'Rechazado'];
        if (!in_array($nuevoEstado, $validEstados, true)) {
            throw new InvalidArgumentException("Estado no válido: {$nuevoEstado}. Estados permitidos: Borrador, Aprobado, Rechazado.");
        }

        return DB::transaction(function () use ($proforma, $nuevoEstado, $pacienteId, $registrarNuevoPaciente, $datosPacienteExtra) {
            // Si el estado es 'Aprobado'
            if ($nuevoEstado === 'Aprobado') {
                if ($pacienteId) {
                    // Vincular a paciente existente
                    $proforma->paciente_id = $pacienteId;
                } elseif (!$proforma->paciente_id && $registrarNuevoPaciente) {
                    // Generar nuevo paciente con los datos de la proforma
                    $maxId = (int) (Paciente::max('id') ?? 0);
                    $nextNum = $maxId + 1;
                    $codigoPaciente = 'PAC-' . str_pad((string) $nextNum, 3, '0', STR_PAD_LEFT);
                    while (Paciente::where('codigo_paciente', $codigoPaciente)->exists()) {
                        $nextNum++;
                        $codigoPaciente = 'PAC-' . str_pad((string) $nextNum, 3, '0', STR_PAD_LEFT);
                    }

                    $fechaNac = $proforma->fecha_nacimiento 
                        ? $proforma->fecha_nacimiento->format('Y-m-d')
                        : ($datosPacienteExtra['fecha_nacimiento'] ?? date('Y-m-d', strtotime('-' . ($proforma->edad ?: 20) . ' years')));

                    $nuevoPaciente = Paciente::create([
                        'codigo_paciente' => $codigoPaciente,
                        'sucursal_id' => $proforma->sucursal_id,
                        'nombre' => $proforma->nombre,
                        'apellido' => $proforma->apellido,
                        'edad' => $proforma->edad,
                        'sexo' => $proforma->sexo,
                        'ocupacion' => $datosPacienteExtra['ocupacion'] ?? null,
                        'estado_civil' => $datosPacienteExtra['estado_civil'] ?? null,
                        'celular' => $proforma->celular,
                        'domicilio_actual' => $proforma->domicilio_actual,
                        'fecha_nacimiento' => $fechaNac,
                        'telefono_emergencia' => $datosPacienteExtra['telefono_emergencia'] ?? null,
                        'nombre_contacto_emergencia' => $datosPacienteExtra['nombre_contacto_emergencia'] ?? null,
                        'apellido_contacto_emergencia' => $datosPacienteExtra['apellido_contacto_emergencia'] ?? null,
                        'parentesco_contacto_emergencia' => $datosPacienteExtra['parentesco_contacto_emergencia'] ?? null,
                    ]);

                    Antecedente::firstOrCreate(['paciente_id' => $nuevoPaciente->id]);

                    $proforma->paciente_id = $nuevoPaciente->id;
                }
            }

            $proforma->estado = $nuevoEstado;
            $proforma->save();

            return $proforma->load([
                'paciente',
                'doctor.usuario',
                'sucursal',
                'detalles.servicio',
            ]);
        });
    }
}
