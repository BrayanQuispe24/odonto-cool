<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class RealEmailDeliverable implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_string($value) || !filter_var($value, FILTER_VALIDATE_EMAIL)) {
            $fail('El correo electrónico no tiene un formato válido.');
            return;
        }

        $parts = explode('@', strtolower(trim($value)));
        $domain = end($parts);

        // 1. Verificar registros MX
        $mxHosts = [];
        if (!getmxrr($domain, $mxHosts) || empty($mxHosts)) {
            $fail('El dominio del correo no existe o no tiene capacidad de recibir correos.');
            return;
        }

        // 2. Verificar existencia del buzón mediante handshake SMTP directo
        $mailHost = $mxHosts[0];
        $errno = 0;
        $errstr = '';

        $socket = @fsockopen($mailHost, 25, $errno, $errstr, 4);
        if (!$socket) {
            return;
        }

        try {
            stream_set_timeout($socket, 4);
            fgets($socket, 512);

            fputs($socket, "HELO odontocool.com\r\n");
            fgets($socket, 512);

            $fromEmail = config('mail.from.address') ?: 'no-reply@odontocool.com';
            fputs($socket, "MAIL FROM:<{$fromEmail}>\r\n");
            fgets($socket, 512);

            fputs($socket, "RCPT TO:<{$value}>\r\n");
            $rcpt = fgets($socket, 512);

            fputs($socket, "QUIT\r\n");
            @fclose($socket);

            if ($rcpt) {
                $code = (int) substr(trim($rcpt), 0, 3);
                if ($code >= 550 && $code <= 554) {
                    $fail('El correo electrónico ingresado no existe o no puede recibir mensajes.');
                    return;
                }
            }
        } catch (\Throwable $e) {
            @fclose($socket);
        }
    }
}
