<?php

namespace App\Actions\User;

use App\DTOs\User\UpdateUserDTO;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UpdateUserAction
{
    public function execute(User $user, UpdateUserDTO $dto): User
    {
        $data = [
            'email' => $dto->email,
        ];

        if (!empty($dto->password)) {
            $data['password'] = Hash::make($dto->password);
        }

        if ($dto->rol_id !== null) {
            $data['rol_id'] = $dto->rol_id;
        }

        $user->update($data);

        return $user->fresh()->load('rol');
    }
}
