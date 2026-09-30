import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#001C3D] via-[#0840A8] to-[#002D5E] flex flex-col justify-between p-4 sm:p-6 md:p-8 font-sans text-white relative overflow-hidden">
      {/* Background Cyan Glow Accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 glow-cyan rounded-full blur-3xl opacity-50 pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-10 w-96 h-96 glow-cyan rounded-full blur-3xl opacity-40 pointer-events-none -z-0" />

      {/* Header Link */}
      <header className="max-w-[1200px] w-full mx-auto flex items-center justify-between py-2 z-10">
        <Link to="/" className="flex items-center gap-3 font-display text-xl sm:text-2xl font-extrabold text-white">
          <div className="p-1 rounded-xl bg-white/15 border border-[#00C2E0]/30 backdrop-blur-xs">
            <img 
              src="/assets/images/image.png" 
              alt="ODONTO COOL Logo" 
              className="h-9 w-auto object-contain rounded-lg"
            />
          </div>
          <span>ODONTO COOL</span>
        </Link>

        <Link
          to="/"
          className="text-xs sm:text-sm font-bold text-[#00C2E0] hover:text-white transition-colors flex items-center gap-1.5"
        >
          ← Volver al Inicio
        </Link>
      </header>

      {/* Book-Style Main Card Container */}
      <main className="w-full max-w-[1000px] mx-auto my-auto py-4 sm:py-6 z-10">
        <div className="bg-[#002D5E] rounded-2xl sm:rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.4)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[540px] border border-[#00C2E0]/25 relative">
          
          {/* Left Column: Dental Record Book Illustration & Wave Banner */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0840A8] to-[#0077D4] text-white p-6 sm:p-10 relative flex flex-col justify-between overflow-hidden">
            {/* Background Wave Accent SVG */}
            <div className="absolute top-0 right-0 bottom-0 left-0 opacity-15 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 400 600" fill="none">
                <path d="M-50 0C100 150 250 50 450 200V600H-50V0Z" fill="currentColor"/>
              </svg>
            </div>

            {/* Top Text / Badge */}
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold bg-white/15 text-[#00C2E0] border border-[#00C2E0]/30">
                ✦ Historial Clínico Digital
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-3 leading-tight">
                Expediente Odontológico
              </h2>
              <p className="text-xs sm:text-sm text-cyan-100 mt-2 leading-relaxed font-medium">
                Gestión segura de pacientes y tratamientos en ODONTO COOL.
              </p>
            </div>

            {/* Center 3D Book Artwork */}
            <div className="relative z-10 my-4 sm:my-6 flex justify-center">
              <div className="relative w-full max-w-[260px] sm:max-w-[290px] rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.35)] border border-white/20 animate-float hover:scale-105 transition-transform duration-500">
                <img
                  src="/assets/images/dental_login_book.png"
                  alt="Libro de Expedientes Odontológicos ODONTO COOL"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Bottom Security Info */}
            <div className="relative z-10 flex items-center justify-center lg:justify-start gap-2 text-xs text-cyan-100 font-semibold pt-3 border-t border-white/15">
              <span className="w-2 h-2 rounded-full bg-[#00C2E0] animate-pulse"></span>
              <span>Encriptación Médica Certificada 256-bit</span>
            </div>
          </div>

          {/* Right Column: Form Side */}
          <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-center bg-[#002D5E] relative">
            {/* Header Icons Avatar Bubble */}
            <div className="flex justify-center mb-3">
              <div className="relative flex items-center justify-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0840A8] text-white flex items-center justify-center text-xl shadow-md z-10 border-2 border-[#002D5E]">
                  👤
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0077D4] text-white flex items-center justify-center text-sm shadow-sm -ml-3 z-0">
                  💬
                </div>
              </div>
            </div>

            <div className="text-center mb-6 sm:mb-8">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Inicio de Sesión
              </h2>
              <p className="text-xs sm:text-sm text-[#00C2E0] mt-1 font-semibold">
                Ingresa tus datos para acceder a tu cuenta
              </p>
            </div>

            {children}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-cyan-100/80 font-medium py-2 z-10">
        © 2026 ODONTO COOL Clínica Odontológica. Sistema de Gestión Clínica.
      </footer>
    </div>
  );
};
