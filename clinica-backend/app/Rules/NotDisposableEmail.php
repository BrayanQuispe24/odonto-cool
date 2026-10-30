<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class NotDisposableEmail implements ValidationRule
{
    /**
     * Lista de dominios de correos temporales o desechables comunes.
     */
    protected array $disposableDomains = [
        'mailinator.com',
        'yopmail.com',
        'guerrillamail.com',
        'guerrillamail.net',
        'guerrillamail.biz',
        '10minutemail.com',
        'tempmail.com',
        'temp-mail.org',
        'throwawaymail.com',
        'sharklasers.com',
        'dispostable.com',
        'getairmail.com',
        'mohmal.com',
        'trashmail.com',
        'fakeinbox.com',
        'nada.ltd',
        'generator.email',
    ];

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_string($value) || !str_contains($value, '@')) {
            return;
        }

        $parts = explode('@', strtolower(trim($value)));
        $domain = end($parts);

        if (in_array($domain, $this->disposableDomains, true)) {
            $fail('No se permiten correos electrónicos temporales o desechables.');
        }
    }
}
