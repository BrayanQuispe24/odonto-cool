<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sus Credenciales de Acceso - Odonto Cool Pro</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .header {
            background: linear-gradient(135deg, #0840A8 0%, #0077D4 100%);
            padding: 32px 24px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 22px;
            font-weight: 800;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .header p {
            margin: 6px 0 0 0;
            font-size: 13px;
            opacity: 0.9;
        }
        .content {
            padding: 32px 28px;
        }
        .greeting {
            font-size: 16px;
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 12px;
        }
        .text {
            font-size: 14px;
            line-height: 1.6;
            color: #475569;
            margin: 0 0 20px 0;
        }
        .credentials-card {
            background-color: #f8fafc;
            border: 1px solid #cbd5e1;
            border-left: 4px solid #0077D4;
            border-radius: 6px;
            padding: 18px 20px;
            margin: 24px 0;
        }
        .credentials-title {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #0077D4;
            margin-bottom: 14px;
        }
        .credential-item {
            margin-bottom: 12px;
            font-size: 13px;
        }
        .credential-item:last-child {
            margin-bottom: 0;
        }
        .credential-label {
            font-weight: 700;
            color: #334155;
            display: inline-block;
            min-width: 140px;
        }
        .credential-value {
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
            background: #e2e8f0;
            padding: 3px 8px;
            border-radius: 4px;
            color: #0f172a;
            font-weight: 600;
            font-size: 13px;
            display: inline-block;
        }
        .cta-section {
            text-align: center;
            margin: 30px 0 20px 0;
        }
        .btn {
            display: inline-block;
            background-color: #0077D4;
            color: #ffffff !important;
            text-decoration: none;
            font-weight: 700;
            font-size: 14px;
            padding: 12px 28px;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 119, 212, 0.25);
            transition: background-color 0.2s ease;
        }
        .btn:hover {
            background-color: #0840A8;
        }
        .security-notice {
            background-color: #fffbeb;
            border: 1px solid #fef3c7;
            border-left: 4px solid #f59e0b;
            border-radius: 6px;
            padding: 12px 16px;
            font-size: 12px;
            line-height: 1.5;
            color: #92400e;
            margin-top: 24px;
        }
        .footer {
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 20px 24px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            line-height: 1.5;
        }
        .footer a {
            color: #0077D4;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Odonto Cool Pro</h1>
            <p>Sistema Integral de Gestión Clínica Dental</p>
        </div>

        <!-- Body Content -->
        <div class="content">
            <div class="greeting">
                ¡Bienvenido(a) a la plataforma!
            </div>
            
            <p class="text">
                Se ha dado de alta su cuenta de usuario en <strong>Odonto Cool Pro</strong> con el perfil de 
                <span style="color: #0077D4; font-weight: 700;">{{ $user->rol->nombre ?? 'Especialista' }}</span>.
                A continuación encontrará sus credenciales personales para acceder al sistema:
            </p>

            <!-- Credentials Box -->
            <div class="credentials-card">
                <div class="credentials-title">🔐 Credenciales de Acceso</div>
                
                <div class="credential-item">
                    <span class="credential-label">Código de Usuario:</span>
                    <span class="credential-value">{{ $user->codigo_usuario }}</span>
                </div>
                
                <div class="credential-item">
                    <span class="credential-label">Correo Electrónico:</span>
                    <span class="credential-value">{{ $user->email }}</span>
                </div>
                
                <div class="credential-item">
                    <span class="credential-label">Contraseña Inicial:</span>
                    <span class="credential-value" style="background-color: #e0f2fe; color: #0369a1; border: 1px dashed #38bdf8;">{{ $plainPassword }}</span>
                </div>
            </div>

            <!-- CTA Button -->
            <div class="cta-section">
                <a href="{{ $loginUrl }}" class="btn" target="_blank">
                    Iniciar Sesión en Odonto Cool &rarr;
                </a>
            </div>

            <!-- Security Recommendation -->
            <div class="security-notice">
                <strong>⚠️ Recomendación de Seguridad:</strong><br>
                Por motivos de confidencialidad y protección de los registros médicos de la clínica, le recomendamos cambiar esta contraseña temporal una vez haya iniciado sesión por primera vez desde su perfil de usuario.
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p style="margin: 0 0 6px 0;">
                Este es un mensaje automático generado por <strong>Odonto Cool Pro</strong>. Por favor, no responda a este correo.
            </p>
            <p style="margin: 0;">
                &copy; {{ date('Y') }} Odonto Cool Pro. Todos los derechos reservados.
            </p>
        </div>
    </div>
</body>
</html>
