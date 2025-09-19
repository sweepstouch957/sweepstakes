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
import {
  OtpService,
  SendOtpDto,
  VerifyOtpDto,
} from "@/lib/services/otp.service";

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
  // métricas opcionales (si vienen del backend)
  totalParticipations?: number;
  newParticipations?: number;
  existingParticipations?: number;
  totalEarnings?: number;
};

type Step = "phone" | "otp";

const PINK = "#ff0080";

/** Helpers locales **/
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
  const { user, login, loading: authLoading, isLoaded, logout } = useAuth();

  // ---- Form auth/registro
  const [form, setForm] = useState({ phone: "", username: "", password: "" });
  const [success, setSuccess] = useState(false);

  // ---- OTP / flujo
  const [step, setStep] = useState<Step>("phone");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [resendLeft, setResendLeft] = useState<number | undefined>(undefined);
  const [attemptsLeft, setAttemptsLeft] = useState<number | undefined>(
    undefined
  );
  const [errorSend, setErrorSend] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [locked, setLocked] = useState(false);

  // ---- UX / info lateral
  const [recentPhones, setRecentPhones] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>("");

  const otpService = new OtpService();
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

  // ---- Registro de participación (se llama post-OTP verificado)
  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!validatePhone(form.phone)) {
        throw new Error("Phone number must match (123) 456-7890 format");
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
      toast.success("🎉 Participación registrada con éxito!");
      if (form.phone) {
        const masked = `(***) ***-${String(form.phone)
          .replace(/\D/g, "")
          .slice(-4)}`;
        setRecentPhones((prev) => [masked, ...prev].slice(0, 12));
      }
      setForm((prev) => ({ ...prev, phone: "" }));
      setStep("phone");
      setOtp("");
      setVerified(false);
      setErrorSend(null);
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Error al registrar participación.";
      toast.error(msg);
    },
  });

  // Públicamente, por si quieres llamar manualmente
  const registerNow = async () => {
    await registerMutation.mutateAsync();
  };

  // ---- OTP Mutations (usando OtpService como pediste)
  const sendOtpMutation = useMutation({
    mutationFn: async (dto: SendOtpDto) => otpService.sendOtp(dto),
    onSuccess: (res: any) => {
      if (res?.success) {
        setErrorSend(null);
        setLocked(Boolean(res.locked));
        setResendTimer(Math.max(res.secondsLeft ?? 60, 0));
        setAttemptsLeft(res.attemptsLeft);
        setResendLeft(res.resendLeft);
      } else {
        setErrorSend(res?.message || "No se pudo enviar el código.");
      }
    },
    onError: (err) => {
      setErrorSend(
        getErrorMessage(err, "No se pudo enviar el código. Intenta de nuevo.")
      );
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: async (dto: SendOtpDto) => otpService.sendOtp(dto),
    onSuccess: (res: any) => {
      if (res?.success) {
        setErrorSend(null);
        setLocked(Boolean(res.locked));
        setResendTimer(Math.max(res.secondsLeft ?? 60, 0));
        if (typeof res.resendLeft === "number") setResendLeft(res.resendLeft);
        if (typeof res.attemptsLeft === "number")
          setAttemptsLeft(res.attemptsLeft);
      } else {
        setErrorSend(res?.message || "No se pudo reenviar el código.");
      }
    },
    onError: (err) =>
      setErrorSend(getErrorMessage(err, "No se pudo reenviar el código.")),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (dto: VerifyOtpDto) => otpService.verifyOtp(dto),
    onSuccess: async (res: any) => {
      if (res?.success) {
        setVerified(true);
        setErrorSend(null);
        // registra la participación automáticamente después del OTP OK
        try {
          await registerNow();
          // OJO: NO cambiamos el step aquí; dejamos que el componente/OTP haga
          // la UX de "volver al teléfono" (toast + autoReturn via OtpStep)
        } catch (e) {
          setVerified(false);
          setErrorSend(getErrorMessage(e, "No se pudo completar el registro."));
        }
      } else {
        setVerified(false);
        setErrorSend(res?.message || "Código inválido.");
        setAttemptsLeft((n) =>
          typeof n === "number" ? Math.max(n - 1, 0) : n
        );
      }
    },
    onError: (err) => {
      setVerified(false);
      setErrorSend(getErrorMessage(err, "Código inválido."));
      setAttemptsLeft((n) => (typeof n === "number" ? Math.max(n - 1, 0) : n));
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
    if (!phoneE164 || locked) return;
    setStep("otp");
    setOtp("");
    setErrorSend(null);
    setVerified(false);
    await sendOtpMutation.mutateAsync({ phone: phoneE164, channel: "sms" });
  };

  const onResend = async () => {
    if (locked) return;
    if (typeof resendLeft === "number" && resendLeft <= 0) return;
    setErrorSend(null);
    await resendOtpMutation.mutateAsync({ phone: phoneE164, channel: "sms" });
  };

  const onVerify = async (val: string) => {
    if (locked) return;
    if (verifyOtpMutation.isPending || val.length !== 6) return;
    if (typeof attemptsLeft === "number" && attemptsLeft <= 0) return;
    setErrorSend(null);
    await verifyOtpMutation.mutateAsync({ phone: phoneE164, code: val });
  };

  const goToPhone = () => {
    setStep("phone");
    setErrorSend(null);
    setVerified(false);
    setOtp("");
  };

  const goToOtp = () => {
    if (!phoneE164) return;
    setStep("otp");
    setErrorSend(null);
  };

  // ---- Effects: timers y countdown
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (step !== "otp") return;
    if (resendTimer <= 0) return;
    timerRef.current = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [step, resendTimer]);

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

  // ---- Otros handlers públicos
  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await registerMutation.mutateAsync();
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await loginMutation.mutateAsync();
  };

  // ---- Flags de carga y fetch
  const loading =
    authLoading ||
    loginMutation.isPending ||
    isLoadingActiveShift ||
    isLoadingSweepstake;

  const fetchingBackground = isFetchingActiveShift || isFetchingSweepstake;

  const resolvingShift =
    isPromotor && (isLoadingActiveShift || activeShift === undefined);

  const isResending = resendOtpMutation.isPending || sendOtpMutation.isPending;
  const registerPending = registerMutation.isPending;
  const isVerifying = verifyOtpMutation.isPending || registerPending;

  // ---- Return: TODO listo para UI
  return {
    // form
    form,
    setForm,
    handleChange,

    // login
    handleLoginSubmit,
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

    // registro (post-OTP)
    registerNow,
    registerPending,
    success,
    setSuccess,
    step,
    setStep, // por si lo necesitas directo
    goToPhone,
    goToOtp,
    otp,
    setOtp,
    resendTimer,
    resendLeft,
    attemptsLeft,
    errorSend,
    verified,
    locked,

    onPhoneSubmit,
    onResend,
    onVerify,

    isResending,
    isVerifying,
    timeLeft,
    recentPhones,
  };
};
