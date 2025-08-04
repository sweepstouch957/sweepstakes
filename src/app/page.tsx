import RegisterSweepstake from "@/components/PromotorRegister";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impulsadora - Participa y Gana",
  description: "Regístrate para participar en el sorteo de Impulsadora.",
};

export default function Home() {
  return (
    <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
      <RegisterSweepstake />
    </Suspense>
  );  
}
