import NotFoundContent from "@/components/NotFoundContent";
import { Suspense } from "react";

export default function NotFoundPage() {
  return (
    <Suspense fallback={<div className="text-white p-6 text-center">Cargando...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}
