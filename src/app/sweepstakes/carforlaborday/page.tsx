"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import ImageBackgroundMobile from "@public/Carro.webp";
import ImageLabrDay from "@public/LaborDay.webp";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      toast.error("Por favor completa todos los campos.");
      return;
    }

    toast.success("¡Inicio de sesión exitoso! Redirigiendo...");
    setTimeout(() => {
      router.push("/sweepstakes/carlaborday");
    }, 1000);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: "linear-gradient(to bottom, #1b3fac 0%, #000029 100%)",
      }}
    >
      <Toaster position="top-center" />
      <section className="w-full max-w-xl pt-6 space-y-4 flex flex-col items-center">
        <Image
          src={ImageLabrDay.src}
          alt="Banner"
          width={ImageLabrDay.width}
          height={ImageLabrDay.height}
          priority
          className="w-full max-w-[400px]"
        />

        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full px-4">
          <h2 className="text-white text-center text-3xl font-semibold">
            Iniciar Sesión 
          </h2>

          <input
            type="text"
            name="username"
            placeholder="Usuario"
            value={form.username}
            onChange={handleChange}
            required
            className="rounded-[40px] border text-lg bg-white px-6 py-3 w-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#08C7F7]"
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
            className="rounded-[40px] border text-lg bg-white px-6 py-3 w-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#08C7F7]"
          />

          <button
            type="submit"
            className="bg-[#08C7F7] hover:bg-[#08C7F795] text-white rounded-full px-6 py-3 text-xl font-bold"
          >
            Iniciar sesión
          </button>
        </form>

        <Image
          src={ImageBackgroundMobile.src}
          alt="Carro"
          width={ImageBackgroundMobile.width}
          height={ImageBackgroundMobile.height}
          priority
          className="w-full max-w-[400px]"
        />
      </section>
    </div>
  );
}
