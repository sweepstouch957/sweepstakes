/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import ImageBackgroundMobile from "@public/Carro.webp";
import ImageLabrDay from "@public/LaborDay.webp";
import { Typography } from "@mui/material";
import { FC, useState } from "react";
import { formatPhone, validatePhone } from "@/lib/utils/formatPhone";
import { createSweepstakeDefault } from "@/lib/services/sweeptakes";

export const RegisterSweepstake: FC<{ sweepstakeId?: string }> = ({
  sweepstakeId = `${process.env.NEXT_PUBLIC_SWEEPSTAKE_ID}`,
}) => {
  const [value, setValue] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue(formatPhone(value));
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // solo números
    if (rawValue.length <= 5) {
      setZipCode(rawValue);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validatePhone(value)) {
      toast.error("Phone number must match (123) 456-7890 format");
      return;
    }

    try {
      await createSweepstakeDefault({
        sweepstakeId,
        customerPhone: value.replace(/[^0-9]/g, ""),
        customerName: "",
        method: "qr",
        createdBy: "",
        storeId: "",
        zipCode,
      });

      toast.success("🎉 Successfully registered!");
      setSuccess(true);
      setValue("");
      setZipCode("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      toast.error(`${error}` || "Error al registrar participación");
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
        <form
          onSubmit={handleRegisterSubmit}
          className="w-full flex flex-col items-center gap-6 px-2 md:px-12"
        >
          <h1 className="text-white text-center leading-tight text-5xl md:text-6xl font-light !my-1">
            Participate &<br />
            <span className="text-[#08C7F7] font-bold text-5xl md:text-6xl">
              Win a Car!
            </span>
          </h1>

          <div className="w-full max-w-lg">
            <input
              type="tel"
              name="phone"
              placeholder="(555) 123-4567"
              value={value}
              onChange={handleChange}
              required
              className="rounded-[40px] !mb-2 border shadow-md text-xl md:text-2xl bg-white px-6 py-3 w-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#08C7F7] focus:border-transparent"
            />

            <input
              type="text"
              name="zipCode"
              inputMode="numeric"
              placeholder="ZIP Code (USA)"
              value={zipCode}
              onChange={handleZipChange}
              required
              className="rounded-[40px] border shadow-md text-xl md:text-2xl bg-white px-6 py-3 w-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#08C7F7] focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="bg-[#08C7F7] hover:bg-[#08C7F795] text-white rounded-full px-6 py-3 font-bold text-xl md:text-2xl w-full max-w-lg shadow-lg"
          >
            Submit
          </button>

          {success && (
            <Typography className="text-center text-green-400 font-medium animate-bounce">
              🎉 You are successfully registered!
            </Typography>
          )}
        </form>

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
};
