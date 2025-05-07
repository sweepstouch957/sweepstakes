/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { formatPhone, validatePhone } from "@/lib/utils/formatPhone";
import { createSweepstake } from "@/lib/services/sweeptakes";
import { useAuth } from "@/lib/context/auth";
import { useStore } from "@/lib/context/store";
import { getStore } from "@/lib/services/store.service";

export const useSweepstakeForm = () => {
  const searchParams = useSearchParams();
  const param = searchParams.get("store");

  // ✅ Si es BRAVO viejo, lo redirigimos al nuevo
  const storeIdFromUrl =
    param === process.env.NEXT_PUBLIC_BRAVO_OLD_ID
      ? `${process.env.NEXT_PUBLIC_BRAVO_NEW_ID}`
      : param;

  const {
    user,
    login,
    loading,
    isLoaded,
    store,
    logout,
    changeStore,
    handleSetStore,
  } = useAuth();

  const { stores, loading: loadingStores } = useStore();

 useEffect(() => {
  if (storeIdFromUrl) {
    const getStoreById = async () => {
      try {
        const store = await getStore(storeIdFromUrl);
        if (store) {
          setSelectedStore(store._id);
          handleSetStore(store);
        } else {
          toast.error("Tienda no encontrada");
        }
      } catch (error:any) {
        toast.error("Error al cargar la tienda");
      }
    }
    getStoreById();
  }
}, [storeIdFromUrl, handleSetStore]);


  const [form, setForm] = useState({ phone: "", username: "", password: "" });
  const [success, setSuccess] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const isPromotor = user?.role === "promotor";

  // 🔁 Si cambia la store seleccionada (manual/promotor), cargarla al contexto
  useEffect(() => {
    if (selectedStore && stores.length > 0) {
      const found = stores.find((s) => s._id === selectedStore);
      if (found) {
        handleSetStore(found);
      }
      localStorage.setItem("storeId", selectedStore);
    }
  }, [selectedStore, stores, handleSetStore]);

  // ✅ Mostrar el formulario solo si hay storeId en la URL o login
  const showRegisterForm = Boolean(storeIdFromUrl || user || store || selectedStore);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedValue = name === "phone" ? formatPhone(value) : value;
    setForm((prev) => ({ ...prev, [name]: updatedValue }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePhone(form.phone)) {
      toast.error("Phone number must match (123) 456-7890 format");
      return;
    }

    const resolvedStoreId =
      storeIdFromUrl ||
      selectedStore ||
      store?._id ||
      localStorage.getItem("storeId") ||
      "";

    if (!resolvedStoreId) {
      toast.error("Selecciona una tienda antes de registrar");
      return;
    }

    try {
      await createSweepstake({
        sweepstakeId: process.env.NEXT_PUBLIC_SWEEPSTAKE_ID!,
        customerPhone: form.phone.replace(/[^0-9]/g, ""),
        customerName: "",
        storeId: resolvedStoreId,
        method: storeIdFromUrl ? "qr" : "web",
        createdBy: user?._id || store?.ownerId || "",
      });

      toast.success("🎉 Successfully registered!");
      setSuccess(true);
      setForm((prev) => ({ ...prev, phone: "" }));
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      toast.error(
        `${error}` || "Error al registrar participación"
      );
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (storeIdFromUrl) return; // 🚫 No hacer login si la tienda viene en la URL

    if (!form.username || !form.password) {
      toast.error("Por favor completa usuario y contraseña.");
      return;
    }

    try {
      await login(form.username, form.password);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Error al iniciar sesión";
      toast.error(errorMessage);
    }
  };

  return {
    form,
    setForm,
    success,
    setSuccess,
    handleChange,
    handleRegisterSubmit,
    handleLoginSubmit,
    showRegisterForm,
    loading,
    isLoaded,
    isPromotor,
    stores,
    selectedStore,
    setSelectedStore,
    loadingStores,
    logout,
    store,
    changeStore,
  };
};
