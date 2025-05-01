"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import ImageBackgroundMobile from "@public/Carro.webp";
import ImageLabrDay from "@public/LaborDay.webp";

import Image from "next/image";
interface FormState {
  phone: string;
}

export default function RegisterSweepstake() {
  const searchParams = useSearchParams();
  const storeId = searchParams.get("store");

  const [form, setForm] = useState<FormState>({ phone: "" });
  const [success, setSuccess] = useState<boolean>(false);

  const validatePhone = (phone: string) =>
    /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);

  const formatPhone = (input: string) => {
    const digits = input.replace(/\D/g, "").substring(0, 10);
    const match = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return input;

    return [
      match[1] ? `(${match[1]}` : "",
      match[2] ? `) ${match[2]}` : "",
      match[3] ? `-${match[3]}` : "",
    ]
      .join("")
      .trim();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const formatted = formatPhone(value);
      setForm((prev) => ({ ...prev, phone: formatted }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting form with data:", storeId);

    if (!validatePhone(form.phone)) {
      toast.error("Phone number must match (123) 456-7890 format");
      return;
    }
    toast.success("🎉 Successfully registered!");
    setSuccess(true);
    setForm({ phone: "" });
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: "linear-gradient(to bottom, #1b3fac 0%, #000029 100%)",
      }}
    >
      <Toaster position="top-center" />

      <section className="w-full max-w-2xl flex flex-col items-center justify-center pt-8 md:pt-20 px-4 space-y-8">
        {/* Banner top */}
        <Image
          src={ImageLabrDay.src}
          alt="Labor Day"
          width={ImageLabrDay.width}
          height={ImageLabrDay.height}
          priority
          className="w-full max-w-[440px] h-auto"
        />

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
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
              🎉 You're successfully registered!
            </p>
          )}
        </form>

        {/* Imagen del carro */}
        <Image
          src={ImageBackgroundMobile.src}
          alt="Nissan Versa"
          width={ImageBackgroundMobile.width}
          height={ImageBackgroundMobile.height}
          priority
          className="w-full max-w-[460px] h-auto"
        />
      </section>
    </div>
  );
}
