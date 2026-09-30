<?php

namespace App\DTOs\Auth;

use App\Http\Requests\Auth\RegisterRequest;

readonly class RegisterDTO
{

    public function __construct(
        public string $email,
        public string $password,
        public string $rol_id
    ) {}

    public static function fromRequest(RegisterRequest $request): self
    {
        return new self(
            email: $request->email,
            password: $request->password,
            rol_id: $request->rol_id,
        );
    }
}
