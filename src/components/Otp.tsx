"use client";

import React, { useEffect, useMemo, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Alert,
  LinearProgress,
  Chip,
  Fade,
} from "@mui/material";
import OTPInput from "react-otp-input";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import toast from "react-hot-toast";

const BRAND = "#ff0080";

export interface OtpStepProps {
  otp: string;
  setOtp: (val: string) => void;

  resendTimer: number;
  onResend: () => void;

  phone?: string;
  isResending?: boolean;
  isVerifying?: boolean;
  attemptsLeft?: number;
  errorSend: string | null;
  locked?: boolean;
  resendLeft?: number;

  verified?: boolean;
  onSubmit?: (val: string) => void;

  onEditPhone?: () => void;

  resendInitial?: number;
  brandColor?: string;
  autoReturnMs?: number;
}

const formatTimer = (sec: number): string => {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const maskPhone = (raw?: string): string => {
  if (!raw) return "tu número";
  const d = String(raw).replace(/\D/g, "");
  if (d.length >= 10) return `(***) ***-${d.slice(-4)}`;
  return raw;
};

export default function OtpStep({
  otp,
  setOtp,
  resendTimer,
  onResend,
  phone,
  isResending = false,
  isVerifying = false,
  attemptsLeft,
  errorSend,
  locked = false,
  resendLeft,
  verified = false,
  onSubmit,
  onEditPhone,
  resendInitial = 60,
  brandColor = BRAND,
  autoReturnMs = 1200,
}: Readonly<OtpStepProps>) {
  const maskedPhone = useMemo(() => maskPhone(phone), [phone]);
  const inputsDisabled = isVerifying || locked || verified;

  const percent =
    resendTimer > 0 && resendInitial > 0
      ? Math.max(
          0,
          Math.min(100, Math.round((resendTimer / resendInitial) * 100))
        )
      : 0;

  const handleChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 6);
    setOtp(digits);
    if (digits.length === 6) onSubmit?.(digits);
  };

  // Detecta error "fatal" de envío (tel inexistente / fallo 500)
  const fatalSendError = useMemo(() => {
    const msg = (errorSend || "").toLowerCase();
    return (
      msg.includes("no se pudo enviar el otp") ||
      msg.includes("status code 500") ||
      msg.includes("internal server error")
    );
  }, [errorSend]);

  // Toast + regreso automático al teléfono cuando verified=true
  const successShown = useRef(false);
  useEffect(() => {
    if (verified && !successShown.current) {
      successShown.current = true;
      toast.success("¡Código verificado con éxito!", {
        style: {
          background: "#ffffff",
          color: brandColor,
          fontWeight: 800,
          borderRadius: "14px",
          boxShadow: "0 14px 34px rgba(255,0,128,0.22)",
        },
        iconTheme: { primary: brandColor, secondary: "#fff" },
      });
      if (onEditPhone && autoReturnMs > 0) {
        const t = setTimeout(() => onEditPhone(), autoReturnMs);
        return () => clearTimeout(t);
      }
    }
  }, [verified, onEditPhone, autoReturnMs, brandColor]);

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 18,
        p: { xs: 2.5, sm: 3 },
        background:
          "linear-gradient(180deg, rgba(255,0,128,1) 0%, rgba(240,0,120,1) 100%)",
        border: "2px solid rgba(255,255,255,0.95)",
        boxShadow: "0 18px 40px rgba(255,0,128,0.30)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow decorativo */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(1200px 300px at 50% -100px, rgba(255,255,255,0.25), transparent), radial-gradient(800px 200px at 80% 120%, rgba(255,255,255,0.15), transparent)",
          opacity: 0.9,
        }}
      />

      <Stack spacing={1.5} alignItems="center" sx={{ position: "relative" }}>
        {/* Header: teléfono + cambiar */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.2}
          alignItems="center"
          justifyContent="center"
          sx={{ mb: 0.5 }}
        >
          <Chip
            icon={<LocalPhoneIcon sx={{ color: "#fff !important" }} />}
            label={
              <Typography sx={{ fontWeight: 800, color: "#fff" }}>
                {maskedPhone}
              </Typography>
            }
            sx={{
              bgcolor: "rgba(255,255,255,0.18)",
              color: "#fff",
              border: "1.5px dashed rgba(255,255,255,0.8)",
              "& .MuiChip-icon": { color: "#fff" },
              px: 1.2,
              py: 1,
              height: 36,
              borderRadius: 999,
              backdropFilter: "blur(2px)",
            }}
          />

          {onEditPhone && (
            <Button
              size="small"
              onClick={onEditPhone}
              startIcon={<EditOutlinedIcon />}
              sx={{
                color: brandColor,
                bgcolor: "#fff",
                borderRadius: 999,
                px: 1.6,
                py: 0.7,
                textTransform: "none",
                fontWeight: 900,
                boxShadow: "0 10px 22px rgba(255,255,255,0.25)",
                "&:hover": { bgcolor: "#fff", opacity: 0.95 },
              }}
            >
              Cambiar número
            </Button>
          )}
        </Stack>

        {/* Título */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 900,
            color: "#fff",
            textAlign: "center",
            letterSpacing: -0.4,
          }}
        >
          Verifica tu identidad
        </Typography>

        {/* --- VISTA DE ERROR FATAL (teléfono inexistente / 500) --- */}
        {fatalSendError && !verified ? (
          <Stack
            spacing={1.5}
            alignItems="center"
            sx={{
              mt: 1,
              width: "100%",
              borderRadius: 14,
              px: 2,
              py: 2,
              bgcolor: "rgba(255,255,255,0.08)",
              border: "1.5px solid rgba(255,255,255,0.9)",
              backdropFilter: "blur(2px)",
            }}
          >
            <ErrorOutlineIcon sx={{ color: "#fff", fontSize: 42 }} />
            <Typography
              sx={{ color: "#fff", fontWeight: 800, textAlign: "center" }}
            >
              No pudimos enviar el código a este teléfono
            </Typography>
            <Typography
              sx={{ color: "rgba(255,255,255,.95)", textAlign: "center" }}
            >
              Verifica que el número exista y pueda recibir SMS/WhatsApp.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.2}
              mt={0.5}
            >
              {onEditPhone && (
                <Button
                  onClick={onEditPhone}
                  sx={{
                    borderRadius: 999,
                    fontWeight: 900,
                    px: 2.4,
                    py: 0.9,
                    textTransform: "none",
                    backgroundColor: "#ffffff",
                    color: brandColor,
                    boxShadow: "0 14px 34px rgba(255,255,255,0.35)",
                    "&:hover": {
                      backgroundColor: "#ffffff",
                      opacity: 0.96,
                      boxShadow: "0 18px 40px rgba(255,255,255,0.42)",
                    },
                  }}
                >
                  Cambiar número
                </Button>
              )}

              <Button
                onClick={onResend}
                variant="outlined"
                startIcon={<AutorenewIcon />}
                sx={{
                  borderRadius: 999,
                  fontWeight: 900,
                  px: 2.2,
                  py: 0.9,
                  textTransform: "none",
                  color: "#fff",
                  borderColor: "#fff",
                  "&:hover": {
                    borderColor: "#fff",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Intentar de nuevo
              </Button>
            </Stack>
          </Stack>
        ) : (
          <>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,.95)",
                textAlign: "center",
                mt: -0.25,
              }}
            >
              Ingresa el código de 6 dígitos enviado a tu teléfono.
            </Typography>

            {/* Contenido: OTP o Éxito */}
            <Fade in={!verified} mountOnEnter unmountOnExit>
              <Stack alignItems="center" sx={{ width: "100%" }}>
                <OTPInput
                  value={otp}
                  onChange={handleChange}
                  numInputs={6}
                  inputType="tel"
                  shouldAutoFocus
                  inputStyle={{
                    width: "3rem",
                    height: "3.6rem",
                    fontSize: "1.35rem",
                    borderRadius: 14,
                    border: `2px solid ${
                      errorSend
                        ? "rgba(255,255,255,1)"
                        : "rgba(255,255,255,0.9)"
                    }`,
                    background: "rgba(255,255,255,0.16)",
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: 900,
                    outline: "none",
                    marginRight: 12,
                    boxShadow:
                      "0 10px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,.35)",
                    transition:
                      "border-color .14s, box-shadow .14s, transform .07s",
                  }}
                  containerStyle={{
                    justifyContent: "center",
                    gap: 8,
                    marginTop: 10,
                    marginBottom: 8,
                    width: "100%",
                    display: "flex",
                    flexWrap: "wrap",
                  }}
                  renderInput={(
                    props: React.InputHTMLAttributes<HTMLInputElement>
                  ) => (
                    <input
                      {...props}
                      disabled={inputsDisabled}
                      aria-disabled={inputsDisabled}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      onPaste={(e) => {
                        const pasted = e.clipboardData
                          .getData("Text")
                          .replace(/\D/g, "");
                        handleChange(pasted);
                        e.preventDefault();
                      }}
                    />
                  )}
                />

                {!!errorSend && !fatalSendError && (
                  <Alert
                    severity="error"
                    icon={<ErrorOutlineIcon sx={{ color: "#fff" }} />}
                    variant="outlined"
                    sx={{
                      borderColor: "rgba(255,255,255,0.9)",
                      color: "#fff",
                      bgcolor: "rgba(255,255,255,0.08)",
                      py: 0.7,
                      px: 1.25,
                      fontSize: 13,
                      mb: 0.5,
                    }}
                  >
                    {errorSend}
                    {typeof attemptsLeft === "number" && attemptsLeft > 0
                      ? ` · ${attemptsLeft} intento(s) restante(s)`
                      : ""}
                  </Alert>
                )}

                {/* Cooldown / Reenviar */}
                <Stack alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                  {resendTimer > 0 ? (
                    <>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ color: "#fff", fontWeight: 800 }}
                      >
                        <Typography fontSize={14}>
                          Puedes reenviar en
                        </Typography>
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            bgcolor: "#fff",
                            color: brandColor,
                            fontWeight: 900,
                            fontSize: 16,
                            px: 1.3,
                            borderRadius: 2,
                            minWidth: 54,
                            justifyContent: "center",
                            letterSpacing: 1,
                          }}
                        >
                          {formatTimer(resendTimer)}
                        </Box>
                        {typeof resendLeft === "number" && (
                          <Typography
                            fontSize={12.5}
                            sx={{ color: "rgba(255,255,255,.9)" }}
                          >
                            ({resendLeft} intento(s) restantes)
                          </Typography>
                        )}
                      </Stack>

                      <Box sx={{ width: 280 }}>
                        <LinearProgress
                          variant="determinate"
                          value={percent}
                          sx={{
                            height: 8,
                            borderRadius: 999,
                            bgcolor: "rgba(255,255,255,.25)",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 999,
                              background: "#fff",
                            },
                          }}
                        />
                      </Box>
                    </>
                  ) : (
                    <Button
                      onClick={onResend}
                      variant="contained"
                      startIcon={
                        isResending ? (
                          <CircularProgress size={16} />
                        ) : (
                          <AutorenewIcon />
                        )
                      }
                      disabled={
                        isResending || resendLeft === 0 || isVerifying || locked
                      }
                      sx={{
                        borderRadius: 999,
                        fontWeight: 900,
                        px: 3,
                        py: 1,
                        textTransform: "none",
                        backgroundColor: "#ffffff",
                        color: brandColor,
                        boxShadow: "0 14px 34px rgba(255,255,255,0.35)",
                        "&:hover": {
                          backgroundColor: "#ffffff",
                          opacity: 0.96,
                          boxShadow: "0 18px 40px rgba(255,255,255,0.42)",
                        },
                        opacity:
                          isResending ||
                          resendLeft === 0 ||
                          isVerifying ||
                          locked
                            ? 0.65
                            : 1,
                      }}
                    >
                      {isResending ? "Enviando..." : "Reenviar código"}
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Fade>

            {/* UI de Éxito */}
            <Fade in={verified} mountOnEnter unmountOnExit>
              <Stack alignItems="center" spacing={1.2} sx={{ py: 1 }}>
                <CheckCircleRoundedIcon sx={{ color: "#fff", fontSize: 56 }} />
                <Typography
                  sx={{ color: "#fff", fontWeight: 900, fontSize: 20 }}
                >
                  ¡Código verificado con éxito!
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,.95)" }}>
                  {maskedPhone}
                </Typography>

                {onEditPhone && (
                  <Button
                    onClick={onEditPhone}
                    sx={{
                      mt: 0.5,
                      borderRadius: 999,
                      fontWeight: 900,
                      px: 2.6,
                      py: 0.9,
                      textTransform: "none",
                      backgroundColor: "#ffffff",
                      color: brandColor,
                      boxShadow: "0 14px 34px rgba(255,255,255,0.35)",
                      "&:hover": {
                        backgroundColor: "#ffffff",
                        opacity: 0.96,
                        boxShadow: "0 18px 40px rgba(255,255,255,0.42)",
                      },
                    }}
                  >
                    Registrar otro número
                  </Button>
                )}
              </Stack>
            </Fade>
          </>
        )}

        {/* Nota inferior */}
        <Typography
          variant="caption"
          sx={{
            mt: 1.5,
            textAlign: "center",
            color: "rgba(255,255,255,.9)",
            display: "block",
          }}
        >
          ¿No recibiste el código? Revisa tu número y la carpeta de spam.
        </Typography>
      </Stack>
    </Box>
  );
}
