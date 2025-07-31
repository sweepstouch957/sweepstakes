"use client";

import { useAuth } from '@/lib/context/auth';
import { LoginForm } from '@/components/LoginForm';
import { PromoterDashboard } from '@/components/PromoterDashboard';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { CircularProgress, Box } from '@mui/material';

export default function Home() {
  const { user, isLoaded, logout } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (!isLoaded) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <CircularProgress size={60} sx={{ color: "white" }} />
      </Box>
    );
  }

  // Si no está logueado, mostrar el formulario de login
  if (!user) {
    return <LoginForm />;
  }

  // Si es promotor y está logueado, mostrar el dashboard
  if (user.role === 'promotor') {
    return <PromoterDashboard />;
  }

  // Si es otro tipo de usuario, mostrar la página de inicio normal con opción de logout
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#16286a] font-sans overflow-x-hidden flex flex-col">
      <Head>
        <title>Sweepstouch</title>
      </Head>

      <header className="w-full flex justify-between items-center px-8 py-6 bg-white/95 shadow-sm z-10 relative">
        <Link href="/">
          <Image src="https://ext.same-assets.com/3080761563/3620442631.png" alt="Brand Logo" width={100} height={40} />
        </Link>
        <nav className="hidden md:flex space-x-8 text-lg font-medium">
          <Link className="text-[#b64991] font-bold" href="/">Home</Link>
          <a className="text-[#16286a] hover:text-[#b64991] transition" href="/about">About</a>
          <a className="text-[#16286a] hover:text-[#b64991] transition" href="/features">Features</a>
          <a className="text-[#16286a] hover:text-[#b64991] transition" href="/pricing">Pricing</a>
          <a className="text-[#16286a] hover:text-[#b64991] transition" href="/contact">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Hola, {user.firstName} {user.lastName}
          </span>
          <button 
            onClick={logout}
            className="bg-[#d32f2f] hover:bg-[#c62828] text-white text-sm md:text-base rounded-full px-6 py-2 font-semibold transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-20 py-12 md:py-24 pt-16 max-w-[1160px] mx-auto w-full">
          <div className="flex-1 flex flex-col gap-6 md:gap-10 z-10">
            <div className="w-fit inline-block bg-[#e6bd25]/20 text-[#e6bd25] font-bold px-4 py-1 rounded-full uppercase text-xs tracking-wider mb-3">Grow your reach today</div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-3">
              Effortless <span className="text-[#b64991]">campaigns</span>.<br />
              For every brand.
            </h1>
            <p className="max-w-lg text-lg text-[#16286a]/80">
              Run, manage, and automate digital campaigns and promotions seamlessly. Save time and engage your audience with the ultimate campaigns platform.
            </p>
            <div className="flex gap-3 mt-4">
              <button className="bg-[#b64991] hover:bg-[#16286a] transition text-white rounded-full px-8 py-3 font-semibold text-lg shadow">Get Started</button>
              <button className="bg-[#48a1e3] hover:bg-[#16286a] transition text-white rounded-full px-8 py-3 font-semibold text-lg shadow">See Demo</button>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative w-full h-[420px] md:h-[520px] mb-8 md:mb-0">
            <Image src="https://ext.same-assets.com/3080761563/3118651228.svg" alt="BG SVG" fill className="absolute top-0 left-1/2 -translate-x-1/2 max-w-[490px] max-h-[489px] pointer-events-none select-none opacity-90" />
            <Image src="https://ext.same-assets.com/3080761563/205850681.png" alt="Mockup 1" width={200} height={200} className="absolute left-0 bottom-0 w-[38%] max-w-[200px] z-10" />
            <Image src="https://ext.same-assets.com/3080761563/2804760724.png" alt="Mockup 2" width={200} height={200} className="absolute right-0 bottom-0 w-[38%] max-w-[200px] z-10" />
            <Image src="https://ext.same-assets.com/3080761563/1572181790.png" alt="Phone" width={270} height={270} className="relative z-20 w-[54%] max-w-[270px] drop-shadow-xl" />
          </div>
        </section>
      </main>

      <footer className="w-full py-8 bg-[#16286a] text-[#fafafa] mt-16 text-center text-sm opacity-90">
        © 2025 CampaignsPlatform. All rights reserved.
      </footer>
    </div>
  );
}
