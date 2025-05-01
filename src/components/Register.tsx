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
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(to bottom, #1b3fac 0%, #000029 100%)",
      }}
    >
      <Toaster position="top-center" />
      <section
        style={{
          background: "linear-gradient(to bottom, #1b3fac 0%, #000029 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
        className="w-full max-w-lg flex flex-col"
      >
        <Image
          src={ImageLabrDay.src}
          alt="Labor Day"
          width={ImageLabrDay.width}
          height={ImageLabrDay.height}
          priority
          className="max-w-[85%] w-[85%] h-auto"
        />
        <div className="animate-fade-in-up px-10 w-full">
          <form
            className="flex flex-col space-y-1 gap-2"
            onSubmit={handleSubmit}
          >
            <p className="text-[52px] leading-[48px] text-center">
              <span className="text-white font-light">
                Participate & <br />
              </span>
              <span className="font-bold text-[#08C7F7]">Win a Car!</span>
            </p>

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="rounded-[40px] border text-[28px] bg-white rounded px-6 py-2 focus:outline-none"
            />

            <button
              type="submit"
              className="bg-[#08C7F7] hover:bg-[#08C7F795] text-white rounded-full px-4 py-2 font-bold text-[28px]"
            >
              Submit
            </button>
          </form>

          {success && (
            <p className="text-center text-green-600 font-medium animate-bounce">
              🎉 You re successfully registered!
            </p>
          )}
        </div>
        <Image
          src={ImageBackgroundMobile.src}
          alt="Labor Day"
          width={ImageBackgroundMobile.width}
          height={ImageBackgroundMobile.height}
          priority
          className="max-w-[85%] w-[85%] h-auto"
        />
      </section>
    </div>
  );
}
