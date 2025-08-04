"use client";

import React from "react";
import { Typography } from "@mui/material";
import Image from "next/image";
import { Store } from "@/lib/context/store";
import ImageBackgroundMobile from "@public/Carro.webp";

interface Props {
  form: { phone: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  success: boolean;
  store: Store | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sweepstake: any;
  image: {
    src: string;
    width: number;
    height: number;
  };
  prizeImage?: {
    src: string;
    width: number;
    height: number;
  };
}

export default function RegisterForm({
  form,
  handleChange,
  handleSubmit,
  success,
  store,
  sweepstake,
  image,
  prizeImage,
}: Props) {
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col items-center gap-4 px-4 md:px-12"
    >
      {/* Imagen superior del sorteo */}
      <Image
        src={image.src}
        alt={sweepstake?.name || "Sweepstake"}
        width={image.width}
        height={image.height}
        priority
        className="w-full max-w-[500px] h-auto"
      />

      {/* Título, sorteo y tienda */}
      <h1 className="text-white text-center leading-tight text-5xl md:text-6xl font-light !my-1">
        <span className="text-[#08C7F7] font-bold text-5xl md:text-6xl">
          {sweepstake?.name || "Sweepstake Name"}
        </span>
        <br />
        <p className="text-white text-center text-lg font-light mt-1 mb-0">
          {store?.name}
        </p>
      </h1>

      {/* Teléfono */}
      <input
        type="tel"
        name="phone"
        placeholder="(555) 123-4567"
        value={form.phone}
        onChange={handleChange}
        required
        className="rounded-[40px] border text-xl md:text-2xl bg-white px-6 py-3 w-full max-w-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#08C7F7] focus:border-transparent"
      />

      {/* Botón */}
      <button
        type="submit"
        className="bg-[#08C7F7] hover:bg-[#08C7F795] text-white rounded-full px-6 py-3 font-bold text-xl md:text-2xl w-full max-w-lg"
      >
        Submit
      </button>

      {/* Mensaje de éxito */}
      {success && (
        <Typography className="text-center text-green-400 font-medium animate-bounce">
          🎉 You are successfully registered!
        </Typography>
      )}

      {/* Imagen inferior (premio) */}
      <Image
        src={prizeImage?.src || ImageBackgroundMobile.src}
        alt="Premio"
        width={prizeImage?.width || ImageBackgroundMobile.width}
        height={prizeImage?.height || ImageBackgroundMobile.height}
        priority
        className="w-full max-w-[520px] h-auto mt-4"
      />
    </form>
  );
}
