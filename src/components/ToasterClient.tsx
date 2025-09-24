/* app/ToasterClient.tsx */
"use client";

import { Toaster } from "react-hot-toast";
import { useMemo } from "react";

export default function ToasterClient() {
  // zIndex alto para ganarle a Drawer/Modal/MUI tooltips/snackbars
  const opts = useMemo(
    () => ({
      position: "top-center" as const,
      toastOptions: {
        duration: 3000,
        style: {
          zIndex: 999999, // > theme.zIndex.modal
          borderRadius: "12px",
          fontWeight: 700,
        },
        success: {
          style: { background: "#ffffff", color: "#111" },
        },
        error: {
          style: { background: "#ff1744", color: "#fff" },
        },
      },
      containerStyle: { zIndex: 999999, pointerEvents: "auto" as const },
    }),
    []
  );

  return <Toaster {...opts} />;
}
