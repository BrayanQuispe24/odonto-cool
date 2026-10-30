<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user') ? $this->route('user')->id : null;

        $rules = [
            'email' => 'required|email|string|max:255|unique:users,email,' . $userId,
            'password' => 'nullable|string|min:6|max:20',
        ];

        if ($this->user() && $this->user()->rol && $this->user()->rol->nombre === 'Administrador') {
            $rules['rol_id'] = 'nullable|exists:roles,id';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Ingrese un correo electrónico válido.',
            'email.unique' => 'Este correo electrónico ya está en uso por otro usuario.',
            'password.min' => 'La contraseña debe tener al menos 6 caracteres.',
            'rol_id.exists' => 'El rol seleccionado no existe.',
        ];
    }
}
