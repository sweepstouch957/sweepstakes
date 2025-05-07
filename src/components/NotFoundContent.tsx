"use client";

import { useSearchParams } from "next/navigation";

export default function NotFoundContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("code");

  return (
    <div className="text-center p-8 text-white">
      <h1 className="text-3xl font-bold">Página no encontrada</h1>
      {errorCode && <p className="mt-4">Código de error: {errorCode}</p>}
    </div>
  );
}
