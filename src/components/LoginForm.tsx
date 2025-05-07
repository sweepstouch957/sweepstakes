import React from "react";

interface Props {
  form: { username: string; password: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}

export default function LoginForm({ form, handleChange, handleSubmit, loading }: Props) {
  return (
    <form onSubmit={handleSubmit} className="w-full px-4 flex flex-col gap-4 items-center">
      <h2 className="text-white text-3xl text-center font-semibold">
        Iniciar sesión
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
        className="bg-[#08C7F7] hover:bg-[#08C7F795] text-white rounded-full px-6 py-3 font-bold text-2xl md:text-3xl w-full"
        disabled={loading}
      >
        {loading ? "Cargando..." : "Login"}
      </button>
    </form>
  );
}
