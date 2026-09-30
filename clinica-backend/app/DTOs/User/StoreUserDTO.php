<?php

namespace App\DTOs\User;

use App\Http\Requests\User\StoreUserRequest;

readonly class StoreUserDTO
{
    public function __construct(
        public string $email,
        public string $password,
        public int $rol_id
    ) {}

    public static function fromRequest(StoreUserRequest $request): self
    {
        return new self(
            email: $request->email,
            password: $request->password,
            rol_id: (int) $request->rol_id,
        );
    }
}
