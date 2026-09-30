<?php

namespace App\DTOs\Auth;

use App\Http\Requests\Auth\LoginRequest;

class LoginDTO
{
    public function __construct(public string $email, public string $password) {}

    public static function fromRequest(LoginRequest $request): self
    {
        return new self(
            email: $request->email,
            password: $request->password,
        );
    }
}
