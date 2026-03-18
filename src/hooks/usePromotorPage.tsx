/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { formatPhone, validatePhone } from "@/lib/utils/formatPhone";
import { createSweepstake, getSweeptakeById } from "@/lib/services/sweeptakes";
import { useAuth } from "@/lib/context/auth";
import { shiftService } from "@/lib/services/shift.service";

const qk = {
  activeShift: (userId?: string | null) =>
    ["promoter", "activeShift", userId ?? "anon"] as const,
  sweepstake: (sweepstakeId?: string | null) =>
    ["sweepstake", sweepstakeId ?? "none"] as const,
};

type MinimalShift = {
  _id: string;
  status: "active" | "completed" | "cancelled";
  storeId?: string;
  storeInfo?: any;
  sweepstakeId?: string;
  endTime?: string | Date;
  totalParticipations?: number;
  newParticipations?: number;
  existingParticipations?: number;
  totalEarnings?: number;
};

const getErrorMessage = (
  err: unknown,
  fallback = "Ocurrió un error. Intenta otra vez."
) => {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const anyErr = err as any;
    if (anyErr?.response?.data?.message)
      return String(anyErr.response.data.message);
    if (anyErr?.response?.data?.error)
      return String(anyErr.response.data.error);
    if (anyErr?.message) return String(anyErr.message);
  }
  return fallback;
};

const formatE164FromUS = (rawPhone: string) => {
  const digits = (rawPhone || "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("1") ? `+${digits}` : `+1${digits}`;
};

export const usePromotorPage = () => {
  const qc = useQueryClient();
  const {
    user,
    login,
    loginWithAccessCode,
    loading: authLoading,
    isLoaded,
    logout,
  } = useAuth();

  // ---- Form auth/registro
  const [form, setForm] = useState({ phone: "", username: "", password: "" });
  const [success, setSuccess] = useState(false);

  // ---- UX / info lateral
  const [recentPhones, setRecentPhones] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>("");

  const isPromotor = user?.role === "promotor";
  const userId = user?._id ?? null;
  const phoneE164 = useMemo(() => formatE164FromUS(form.phone), [form.phone]);

  // ---- Queries: turno activo + sweepstake
  const {
    data: activeShift,
    isLoading: isLoadingActiveShift,
    isFetching: isFetchingActiveShift,
  } = useQuery({
    queryKey: qk.activeShift(userId),
    enabled: Boolean(isPromotor && userId),
    queryFn: async (): Promise<MinimalShift | null> => {
      const { shift } = await shiftService.getActiveShiftByPromoter(userId!);
      if (!shift || shift.status !== "active") return null;
      return shift as MinimalShift;
    },
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
    staleTime: 10_000,
    gcTime: 5 * 60_000,
  });

  const hasActiveShift = activeShift != null;

  const sweepstakeId = activeShift?.sweepstakeId ?? null;
  const {
    data: sweepstake,
    isLoading: isLoadingSweepstake,
    isFetching: isFetchingSweepstake,
  } = useQuery({
    queryKey: qk.sweepstake(sweepstakeId),
    enabled: Boolean(sweepstakeId && hasActiveShift),
    queryFn: async () => await getSweeptakeById(sweepstakeId!),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

  // ---- Auth
  const loginMutation = useMutation({
    mutationFn: async () => {
      if (!form.username || !form.password) {
        throw new Error("Por favor completa usuario y contraseña.");
      }
      await login(form.username, form.password);
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        "Error al iniciar sesión";
      toast.error(msg);
    },
  });

  // ---- AccessCode login
  const handleAccessCodeLogin = async (accessCode: string) => {
    await loginWithAccessCode(accessCode);
  };

  // ---- Registro de participación (DIRECTO, sin OTP)
  const [registerError, setRegisterError] = useState<string | null>(null);

  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!validatePhone(form.phone)) {
        throw new Error("Phone number must match (123) 456-7890 format");
      }
      if (!phoneE164) {
        throw new Error("Número de teléfono inválido.");
      }
      if (
        !hasActiveShift ||
        !activeShift?.sweepstakeId ||
        !activeShift?.storeId
      ) {
        throw new Error("No hay turno activo válido.");
      }
      return await createSweepstake({
        sweepstakeId: activeShift.sweepstakeId,
        customerPhone: form.phone.replace(/[^0-9]/g, ""),
        customerName: "",
        storeId: activeShift.storeId,
        method: "promotor",
        createdBy: user?._id || "",
      });
    },
    onSuccess: () => {
      setRegisterError(null);
      toast.success("🎉 Participación registrada con éxito!");
      if (form.phone) {
        const masked = `(***) ***-${String(form.phone)
          .replace(/\D/g, "")
          .slice(-4)}`;
        setRecentPhones((prev) => [masked, ...prev].slice(0, 12));
      }
      setForm((prev) => ({ ...prev, phone: "" }));
      setSuccess(true);
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Error al registrar participación.";
      setRegisterError(msg);
      toast.error(msg);
    },
  });

  // ---- Handlers expuestos para UI
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedValue = name === "phone" ? formatPhone(value) : value;
    setForm((prev) => ({ ...prev, [name]: updatedValue }));
  };

  const onPhoneSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterError(null);
    await registerMutation.mutateAsync();
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterError(null);
    await registerMutation.mutateAsync();
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await loginMutation.mutateAsync();
  };

  // ---- Countdown de turno
  useEffect(() => {
    if (!activeShift?.endTime) return;

    const updateCountdown = () => {
      const now = Date.now();
      const end = new Date(activeShift.endTime as string).getTime();
      const diff = end - now;
      if (diff <= 0) {
        setTimeLeft("Turno finalizado");
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}min restantes`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60_000);
    return () => clearInterval(interval);
  }, [activeShift?.endTime]);

  // ---- Flags de carga y fetch
  const loading =
    authLoading ||
    loginMutation.isPending ||
    isLoadingActiveShift ||
    isLoadingSweepstake;

  const fetchingBackground = isFetchingActiveShift || isFetchingSweepstake;

  const resolvingShift =
    isPromotor && (isLoadingActiveShift || activeShift === undefined);

  const registerPending = registerMutation.isPending;

  return {
    // form
    form,
    setForm,
    handleChange,

    // login
    handleLoginSubmit,
    handleAccessCodeLogin,
    loading,
    isLoaded,

    // auth / user
    isPromotor,
    user,
    handleLogout: logout,

    // datos
    activeShift,
    hasActiveShift,
    sweepstake,
    storeInfo: activeShift?.storeInfo ?? null,

    // flags de fetch
    fetchingBackground,
    resolvingShift,

    // registro directo
    registerNow: async () => registerMutation.mutateAsync(),
    registerPending,
    success,
    setSuccess,
    registerError,

    // UI extra
    timeLeft,
    recentPhones,
  };
};
