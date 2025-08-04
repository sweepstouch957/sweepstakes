/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { formatPhone, validatePhone } from "@/lib/utils/formatPhone";
import { createSweepstake, getSweeptakeById } from "@/lib/services/sweeptakes";
import { useAuth } from "@/lib/context/auth";
import { shiftService } from "@/lib/services/shift.service";

export const usePromotorPage = () => {
  const { user, login, loading, isLoaded, logout } = useAuth();
  const [form, setForm] = useState({ phone: "", username: "", password: "" });
  const [success, setSuccess] = useState(false);
  const [activeShift, setActiveShift] = useState<any | null>(null);
  const [hasActiveShift, setHasActiveShift] = useState(false);
  const [storeInfo, setStoreInfo] = useState<any | null>(null);
  const [sweepstake, setSweepstake] = useState<any | null>(null);

  const isPromotor = user?.role === "promotor";

  useEffect(() => {
    const fetchActiveShiftData = async () => {
      if (isPromotor && user?._id) {
        try {
          const { shift } = await shiftService.getActiveShiftByPromoter(
            user._id
          );

          if (shift && shift.status === "active") {
            setActiveShift(shift);
            setHasActiveShift(true);

            // ✅ Ya viene desde backend el store completo
            if (shift.storeInfo) {
              setStoreInfo(shift.storeInfo);
            } else {
              toast.error("Turno activo no tiene información de tienda.");
            }

            if (shift.sweepstakeId) {
              const sweep = await getSweeptakeById(shift.sweepstakeId);
              setSweepstake(sweep);
            } else {
              toast.error("El turno no tiene un sorteo asociado.");
            }
          } else {
            toast.error(
              "❌ Tu turno ya finalizó o fue cancelado. Por favor, inicia un nuevo turno."
            );  
            setHasActiveShift(false);
            setActiveShift(null);
            setStoreInfo(null);
            setSweepstake(null);
          }
        } catch (error: any) {
          toast.error("Error al obtener turno activo.");
          setHasActiveShift(false);
          setActiveShift(null);
          setStoreInfo(null);
          setSweepstake(null);
        }
      }
    };

    fetchActiveShiftData();
  }, [user, isPromotor, logout]);

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

    if (
      !hasActiveShift ||
      !activeShift?.sweepstakeId ||
      !activeShift?.storeId
    ) {
      toast.error("No hay turno activo válido.");
      return;
    }

    try {
      await createSweepstake({
        sweepstakeId: activeShift.sweepstakeId,
        customerPhone: form.phone.replace(/[^0-9]/g, ""),
        customerName: "",
        storeId: activeShift.storeId,
        method: "promotor",
        createdBy: user?._id || "",
      });

      toast.success("🎉 Participación registrada con éxito!");
      setSuccess(true);
      setForm((prev) => ({ ...prev, phone: "" }));
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      toast.error(error || "Error al registrar participación.");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      toast.error("Por favor completa usuario y contraseña.");
      return;
    }

    try {
      await login(form.username, form.password);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error || "Error al iniciar sesión";
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
    loading,
    isLoaded,
    isPromotor,
    activeShift,
    hasActiveShift,
    storeInfo,
    sweepstake,
    user,
    handleLogout: logout,
  };
};
