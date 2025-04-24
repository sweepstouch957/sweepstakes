"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

interface FormState {
  name: string;
  phone: string;
}

export default function RegisterSweepstake() {
  const searchParams = useSearchParams();
  const storeId = searchParams.get("store");

  const [form, setForm] = useState<FormState>({ name: "", phone: "" });
  const [success, setSuccess] = useState<boolean>(false);

  const validateName = (name: string) => /^[a-zA-Z\s]+$/.test(name);
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
    if (name === "name" && /[^a-zA-Z\s]/.test(value)) return;
    if (name === "phone") {
      const formatted = formatPhone(value);
      setForm((prev) => ({ ...prev, phone: formatted }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.error(storeId);

    if (!validateName(form.name)) {
      toast.error("Full Name can only contain letters and spaces");
      return;
    }

    if (!validatePhone(form.phone)) {
      toast.error("Phone number must match (123) 456-7890 format");
      return;
    }
    toast.success("🎉 Successfully registered!");
    setSuccess(true);
    setForm({ name: "", phone: "" });
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#16286a] px-4 flex flex-col items-center justify-center">
      <Toaster position="top-center" />
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6 md:p-8 space-y-6 animate-fade-in-up">
        <motion.div
          animate={{
            scale: [1, 1.05, 1], // crece un poco y vuelve
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          className="relative w-full h-56 sm:h-80 md:h-100"
        >
          <Image
            src="https://res.cloudinary.com/proyectos-personales/image/upload/v1744346908/LABOR-DAY-SWEEPSTAKE_yb7msu.webp"
            alt="Sweepstake Banner"
            fill
            className="object-contain rounded-md"
            priority
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </motion.div>

        <h1 className="text-2xl font-bold text-center">
          Enter your phone number participate & win a car
        </h1>

        <form className="flex flex-col space-y-2 gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff0080]"
          />

          <input
            type="tel"
            name="phone"
            placeholder="(123) 456-7890"
            value={form.phone}
            onChange={handleChange}
            required
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff0080]"
          />

          <button
            type="submit"
            className="bg-[#16286a] hover:bg-[#ff0080] transition text-white rounded-full px-6 py-2 font-semibold"
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
    </div>
  );
}
