<?php

namespace App\DTOs\User;

use App\Http\Requests\User\UpdateUserRequest;

readonly class UpdateUserDTO
{
    public function __construct(
        public string $email,
        public ?string $password = null,
        public ?int $rol_id = null
    ) {}

    public static function fromRequest(UpdateUserRequest $request): self
    {
        return new self(
            email: $request->email,
            password: $request->password,
            rol_id: $request->rol_id ? (int) $request->rol_id : null,
        );
    }
}
