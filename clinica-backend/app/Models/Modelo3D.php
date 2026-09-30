<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Modelo3D extends Model
{
    protected $table = 'modelo_3ds';

    protected $fillable = [
        'nombre',
        'descripcion',
        'archivo_path',
        'tamanio_bytes',
        'mime_type',
        'user_id',
        'activo',
    ];

    protected $appends = ['url'];

    /**
     * Get the full public URL for the .glb model file
     */
    public function getUrlAttribute(): string
    {
        return url('/api/modelos-3d/' . $this->id . '/file');
    }

    /**
     * User relationship
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
