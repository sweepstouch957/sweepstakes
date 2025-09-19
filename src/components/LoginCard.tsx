"use client";

import React from "react";
import { Typography } from "@mui/material";

const PINK = "#ff0080";

export interface LoginCardProps {
  form: { username: string; password: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLoginSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean;
}

export default function LoginCard({
  form,
  handleChange,
  handleLoginSubmit,
  loading,
}: Readonly<LoginCardProps>) {
  return (
    <form
      onSubmit={handleLoginSubmit}
      className="w-full max-w-md rounded-3xl"
      style={{
        background: "linear-gradient(180deg, #ff0080 0%, #ff4da6 100%)",
        boxShadow: "0 18px 42px rgba(255,0,128,0.22)",
        padding: 20,
      }}
    >
      <Typography
        variant="h5"
        sx={{ color: "#fff", textAlign: "center", fontWeight: 900, mb: 1 }}
      >
        Iniciar sesión
      </Typography>

      <div className="w-full">
        <label className="block text-white/90 text-sm mb-1.5 font-medium">
          Usuario
        </label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Correo o usuario"
          className="w-full h-12 px-4 rounded-xl border text-base focus:outline-none"
          style={{
            background: "#fff",
            color: PINK,
            borderColor: "rgba(255,255,255,.8)",
            fontWeight: 600,
          }}
        />
      </div>

      <div className="w-full mt-3">
        <label className="block text-white/90 text-sm mb-1.5 font-medium">
          Contraseña
        </label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          className="w-full h-12 px-4 rounded-xl border text-base focus:outline-none"
          style={{
            background: "#fff",
            color: PINK,
            borderColor: "rgba(255,255,255,.8)",
            fontWeight: 600,
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-full font-extrabold text-lg mt-4 disabled:opacity-70"
        style={{
          background: "#fff",
          color: PINK,
          boxShadow: "0 14px 34px rgba(255,0,128,.35)",
        }}
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
