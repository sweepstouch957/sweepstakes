"use client";

import Image from "next/image";
import { Toaster } from "react-hot-toast";
import ImageBackgroundMobile from "@public/Carro.webp";
import ImageLabrDay from "@public/LaborDay.webp";

export default function CombinedSweepstakePage() {
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
        In Progress

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
