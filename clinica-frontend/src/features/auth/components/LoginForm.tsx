import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../components/ui/Button';
import { useLogin } from '../hooks/useLogin';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es obligatorio')
    .email('Ingresa un correo electrónico válido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-[380px] w-full mx-auto">
      {error && (
        <div className="p-3.5 rounded-lg bg-red-50 text-red-600 border border-red-200 text-xs sm:text-sm font-medium leading-relaxed text-center">
          ⚠️ {error}
        </div>
      )}

      {/* Email Input Field with Envelope Icon */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-extrabold text-white uppercase tracking-wider">
          Correo Electrónico
        </label>
        <div className="relative flex items-center bg-[#001C3D] border-2 border-[#00C2E0]/40 rounded-xl px-3.5 py-2.5 focus-within:border-[#0077D4] focus-within:ring-2 focus-within:ring-[#0077D4]/20 transition-all">
          <span className="text-base text-[#00C2E0] mr-2.5 shrink-0">
            ✉️
          </span>
          <input
            type="email"
            placeholder="admin@admin.com"
            {...register('email')}
            className="w-full bg-transparent text-sm font-semibold text-white placeholder:text-white/50 focus:outline-none"
          />
        </div>
        {errors.email && (
          <span className="text-xs text-red-500 font-bold mt-0.5">
            {errors.email.message}
          </span>
        )}
      </div>

      {/* Password Input Field with Lock Icon */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-extrabold text-white uppercase tracking-wider">
          Contraseña
        </label>
        <div className="relative flex items-center bg-[#001C3D] border-2 border-[#00C2E0]/40 rounded-xl px-3.5 py-2.5 focus-within:border-[#0077D4] focus-within:ring-2 focus-within:ring-[#0077D4]/20 transition-all">
          <span className="text-base text-[#00C2E0] mr-2.5 shrink-0">
            🔒
          </span>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('password')}
            className="w-full bg-transparent text-sm font-semibold text-white placeholder:text-white/50 focus:outline-none pr-14"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-xs font-extrabold text-[#00C2E0] hover:underline cursor-pointer"
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        {errors.password && (
          <span className="text-xs text-red-500 font-bold mt-0.5">
            {errors.password.message}
          </span>
        )}
      </div>

      {/* Right-aligned Link */}
      <div className="flex justify-end text-xs">
        <a
          href="#"
          className="font-bold text-[#00C2E0] hover:underline transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      {/* Styled Button */}
      <div className="flex justify-center mt-2">
        <Button
          type="submit"
          variant="teal"
          size="lg"
          disabled={isLoading}
          className="w-full justify-center py-3.5 shadow-lg shadow-[#0077D4]/30 hover:shadow-xl hover:shadow-[#00C2E0]/40 rounded-xl text-base font-extrabold active:scale-97 transition-all duration-200"
        >
          {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
        </Button>
      </div>
    </form>
  );
};
