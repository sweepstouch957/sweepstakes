/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import ImageBackgroundMobile from "@public/Carro.webp";
import ImageLabrDay from "@public/LaborDay.webp";
import { useAuth } from "@/lib/context/auth";
import { formatPhone, validatePhone } from "@/lib/utils/formatPhone";

export default function CombinedSweepstakePage() {
  const searchParams = useSearchParams();
  const storeIdFromUrl = searchParams.get("store");

  const { user, login, loading, isLoaded } = useAuth();

  const [form, setForm] = useState({ phone: "", username: "", password: "" });
  const [success, setSuccess] = useState(false);

  const showRegisterForm = !!user || !!storeIdFromUrl;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const formatted = formatPhone(value);
      setForm((prev) => ({ ...prev, phone: formatted }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePhone(form.phone)) {
      toast.error("Phone number must match (123) 456-7890 format");
      return;
    }

    toast.success("🎉 Successfully registered!");
    setSuccess(true);
    setForm((prev) => ({ ...prev, phone: "" }));

    setTimeout(() => setSuccess(false), 3000);
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      toast.error("Por favor completa usuario y contraseña.");
      return;
    }

    try {
      await login(form.username, form.password);
      toast.success("¡Inicio de sesión exitoso!");
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Error al iniciar sesión";
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: "linear-gradient(to bottom, #1b3fac 0%, #000029 100%)",
      }}
    >
      <Toaster position="top-center" />
      <section className="w-full max-w-2xl flex flex-col items-center justify-center pt-8 space-y-4">
        <Image
          src={ImageLabrDay.src}
          alt="Labor Day"
          width={ImageLabrDay.width}
          height={ImageLabrDay.height}
          priority
          className="w-full max-w-[500px] h-auto"
        />

        {isLoaded ? (
          <>
            {showRegisterForm ? (
              <form
                onSubmit={handleRegisterSubmit}
                className="w-full flex flex-col items-center gap-4 px-2 md:px-12"
              >
                <h1 className="text-white text-center leading-tight text-5xl md:text-6xl font-light">
                  Participate &<br />
                  <span className="text-[#08C7F7] font-bold text-5xl md:text-6xl">
                    Win a Car!
                  </span>
                </h1>

                <input
                  type="tel"
                  name="phone"
                  placeholder="(555) 123-4567"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="rounded-[40px] border text-xl md:text-2xl bg-white px-6 py-3 w-full max-w-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#08C7F7] focus:border-transparent"
                />

                <button
                  type="submit"
                  className="bg-[#08C7F7] hover:bg-[#08C7F795] text-white rounded-full px-6 py-3 font-bold text-xl md:text-2xl w-full max-w-lg"
                >
                  Submit
                </button>

                {success && (
                  <p className="text-center text-green-400 font-medium animate-bounce">
                    🎉 You are successfully registered!
                  </p>
                )}
              </form>
            ) : (
              <form
                onSubmit={handleLoginSubmit}
                className="w-full px-4 flex flex-col gap-4"
              >
                <h2 className="text-white text-3xl text-center font-semibold">
                  Iniciar sesión del supermercado
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
                  className="bg-[#08C7F7] hover:bg-[#08C7F795] text-white rounded-full px-6 py-3 font-bold text-xl md:text-2xl w-full max-w-lg"
                  disabled={loading}
                >
                  {loading ? "Cargando..." : "Login"}
                </button>
              </form>
            )}
          </>
        ) : (
          <div className="flex justify-center items-center">
            <div className="w-40 h-40 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <Image
          src={ImageBackgroundMobile.src}
          alt="Nissan Versa"
          width={ImageBackgroundMobile.width}
          height={ImageBackgroundMobile.height}
          priority
          className="w-full max-w-[520px] h-auto"
        />
      </section>
    </div>
  );
}
