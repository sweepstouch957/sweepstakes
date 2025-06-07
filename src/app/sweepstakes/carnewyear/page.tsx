import RegisterSweepstake from "@/components/Register";
import { Suspense } from "react";
import type { Metadata } from "next";
import ImageNewYear from "@public/CarForNewyear.webp";


export const metadata: Metadata = {
  title: "Car New Year - Participa y Gana",
  description: "Regístrate para participar en el sorteo de Car New Year.",
};

export default function SweepstakePage() {
  return (
    <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
      <RegisterSweepstake
        sweepstakeId={`${process.env.NEXT_PUBLIC_SWEEPSTAKE_NEW_YEAR}`}
        image={ImageNewYear}
        bgColor="#900000"
      />
    </Suspense>
  );
}
