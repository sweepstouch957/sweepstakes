import RegisterSweepstake from "@/components/Register";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Car Labor day - Participa y Gana",
  description: "Regístrate para participar en el sorteo de Carla Borda.",
};

export default function SweepstakePage() {
  return (
    <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
      <RegisterSweepstake />
    </Suspense>
  );  
}
