/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  CircularProgress,
  Alert,
  LinearProgress,
  Skeleton,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import Link from "next/link";

import ImageBackgroundMobile from "@public/Carro.webp";
import LaborDay from "@public/LaborDay.webp";

import OtpStep from "./Otp";
import LoginCard from "./LoginCard";
import PromoterDrawer from "./Drawer";

import { usePromotorPage } from "@/hooks/usePromotorPage";
import ProfileSelector from "./ProfileSelector";

const PINK = "#ff0080";
const PINK_LIGHT = "#ff66b3";

interface MediaProps {
  src: string;
  width: number;
  height: number;
}
interface Props {
  image?: MediaProps;
  prizeImage?: MediaProps;
}

/* ---------- UI helpers (MUI puro) ---------- */

const BeautifulSpinner = () => (
  <Box sx={{ display: "grid", placeItems: "center", width: "100%", py: 4 }}>
    <Box
      sx={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        border: "4px solid rgba(255,255,255,0.35)",
        borderTopColor: "#fff",
        animation: "spin 1s linear infinite",
        "@keyframes spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      }}
    />
  </Box>
);

const CentralSkeleton = () => (
  <Stack
    spacing={2}
    sx={{ width: "100%", maxWidth: 960, alignItems: "center", pt: 6 }}
  >
    <Skeleton
      variant="rectangular"
      width="100%"
      height={220}
      sx={{ borderRadius: 4, opacity: 0.85 }}
    />
    <Skeleton variant="text" width="80%" sx={{ fontSize: "2.2rem", mt: 1 }} />
    <Skeleton variant="text" width="60%" sx={{ fontSize: "1.2rem" }} />
    <Skeleton
      variant="rectangular"
      width="100%"
      height={88}
      sx={{ borderRadius: 10, mt: 1 }}
    />
    <Skeleton
      variant="rectangular"
      width="100%"
      height={180}
      sx={{ borderRadius: 4, mt: 2, opacity: 0.85 }}
    />
  </Stack>
);

const NoActiveShiftCard = () => (
  <Paper
    elevation={0}
    sx={{
      width: "100%",
      maxWidth: 720,
      textAlign: "center",
      p: 3,
      background: "rgba(255,255,255,0.12)",
      border: "1px solid rgba(255,255,255,0.25)",
      backdropFilter: "blur(8px)",
      color: "#fff",
    }}
  >
    <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
      No tenés un turno activo en este momento.
    </Typography>
    <Typography variant="body2" sx={{ color: "rgba(255,255,255,.9)", mb: 2 }}>
      Podés revisar los turnos disponibles y aplicar en segundos.
    </Typography>
    <Button
      component={Link}
      href="https://work.sweepstouch.com/"
      target="_blank"
      rel="noopener noreferrer"
      variant="contained"
      sx={{
        backgroundColor: "#fff",
        color: PINK,
        "&:hover": { backgroundColor: "#fff", opacity: 0.95 },
        borderRadius: "2rem",
        px: "2rem",
        py: "0.75rem",
        fontSize: "1.05rem",
        fontWeight: 800,
        textTransform: "none",
        boxShadow: "0 10px 28px rgba(255,255,255,0.25)",
      }}
    >
      Buscar turnos disponibles
    </Button>
  </Paper>  
);

/* ---------- Componente principal ---------- */

export default function RegisterForm({ image = LaborDay, prizeImage }: Props) {
  const {
    // form & handlers
    form,
    handleChange,
    handleLoginSubmit,

    // auth/UI
    loading,
    isLoaded,
    isPromotor,
    user,
    handleLogout,

    // datos
    activeShift,
    hasActiveShift,
    sweepstake,
    storeInfo: store,

    // flags
    fetchingBackground,
    resolvingShift,

    // ---- OTP flow expuesto por el hook
    step,
    setStep,
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
  } = usePromotorPage();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const handleProfileSelected = () => setShowProfileSelector(false);

  useEffect(() => {
    if (
      user &&
      (!user.profileImage || user.profileImage === "default-profile.png")
    ) {
      setShowProfileSelector(true);
    }
  }, [user]);

  const showLoadingBlock = !isLoaded || resolvingShift || loading;
  const showLogin = isLoaded && !user;

  const heroRatio =
    image?.width && image?.height ? image.width / image.height : 1.7;
  const prizeSrc = prizeImage?.src || ImageBackgroundMobile.src;
  const prizeW = prizeImage?.width || ImageBackgroundMobile.width;
  const prizeH = prizeImage?.height || ImageBackgroundMobile.height;
  const prizeRatio = prizeW / prizeH;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: { xs: 2, md: 4 },
        backgroundImage: `linear-gradient(180deg, ${PINK} 0%, ${PINK_LIGHT} 100%)`,
      }}
    >
      {/* Barra superior de progreso silencioso */}
      {fetchingBackground && (
        <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 80 }}>
          <LinearProgress
            sx={{ "& .MuiLinearProgress-bar": { backgroundColor: PINK_LIGHT } }}
          />
        </Box>
      )}

      {/* Botón para abrir Drawer */}
      {user && (
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: "fixed",
            top: 12,
            right: 12,
            zIndex: 90,
            bgcolor: "#ffffff",
            color: PINK,
            boxShadow: "0 10px 24px rgba(255,255,255,.25)",
            "&:hover": { bgcolor: "#fff" },
          }}
          aria-label="Abrir panel"
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Drawer con info de promotora */}
      {user && (
        <PromoterDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          user={user}
          activeShift={activeShift}
          hasActiveShift={!!hasActiveShift}
          timeLeft={timeLeft}
          handleLogout={handleLogout}
          recentPhones={recentPhones}
        />
      )}

      <Container
        maxWidth="md"
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {/* BLOQUE DE CARGA */}
        {showLoadingBlock && !showLogin && (
          <>
            <CentralSkeleton />
            <BeautifulSpinner />
          </>
        )}

        {/* LOGIN (card rosada) */}
        {showLogin && (
          <LoginCard
            form={{
              username: (form as any).username,
              password: (form as any).password,
            }}
            handleChange={handleChange}
            handleLoginSubmit={handleLoginSubmit}
            loading={loading}
          />
        )}

        {/* NO ES PROMOTOR */}
        {!showLoadingBlock && user && !isPromotor && (
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 720,
              textAlign: "center",
              p: 3,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#fff",
              backdropFilter: "blur(8px)",
            }}
          >
            <Typography variant="h6" fontWeight={800}>
              Necesitás permisos de promotor para continuar.
            </Typography>
          </Paper>
        )}

        {/* SIN TURNO ACTIVO */}
        {!showLoadingBlock &&
          user &&
          isPromotor &&
          (!hasActiveShift || !activeShift) && <NoActiveShiftCard />}

        {/* FORMULARIO: SOLO CON TURNO ACTIVO */}
        {!showLoadingBlock &&
          user &&
          isPromotor &&
          hasActiveShift &&
          activeShift && (
            <Paper
              component="form"
              onSubmit={onPhoneSubmit}
              elevation={0}
              sx={{
                width: "100%",
                maxWidth: 860,
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 2, sm: 3 },
                borderRadius: 3,
                backgroundImage: `linear-gradient(180deg, ${PINK} 0%, ${PINK_LIGHT} 100%)`,
                boxShadow: "0 18px 42px rgba(255,0,128,0.22)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              {/* Imagen superior con espacio reservado (sin CLS) */}
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 520,
                  mx: "auto",
                  borderRadius: 2,
                  overflow: "hidden",
                  position: "relative",
                  aspectRatio: heroRatio,
                  boxShadow: "0 10px 28px rgba(0,0,0,.15)",
                }}
              >
                <Image
                  src={image.src}
                  alt={sweepstake?.name || "Sweepstake"}
                  fill
                  priority
                  sizes="(max-width: 640px) 90vw, 500px"
                  style={{ objectFit: "cover" }}
                />
              </Box>

              {/* Título */}
              <Stack alignItems="center" sx={{ mt: 2, mb: 1 }}>
                <Typography
                  variant="h3"
                  sx={{
                    textAlign: "center",
                    color: "#fff",
                    fontWeight: 300,
                    lineHeight: 1.1,
                  }}
                >
                  <Box
                    component="span"
                    sx={{ fontWeight: 900, fontSize: { xs: 34, md: 44 } }}
                  >
                    {sweepstake?.name || "Sweepstake Name"}
                  </Box>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255,255,255,.9)",
                    textAlign: "center",
                    mt: 1,
                  }}
                >
                  {store?.name}
                </Typography>
              </Stack>

              {/* Paso 1: Teléfono */}
              {step === "phone" && (
                <Stack spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
                  <Box sx={{ width: "100%", maxWidth: 520 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "rgba(255,255,255,.9)",
                        mb: 0.5,
                        fontWeight: 600,
                      }}
                    >
                      Número de teléfono
                    </Typography>

                    <TextField
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="(555) 123-4567"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography sx={{ color: PINK, fontWeight: 800 }}>
                              +1
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#fff",
                          color: PINK,
                          fontWeight: 600,
                          borderRadius: 3,
                          boxShadow: "0 8px 20px rgba(255,0,128,0.18)",
                          "& fieldset": {
                            borderColor: "rgba(255,255,255,0.85)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255,255,255,0.95)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: PINK,
                            boxShadow: "0 0 0 4px rgba(255,0,128,0.18)",
                          },
                        },
                        "& .MuiInputBase-input::placeholder": {
                          color: "rgba(255,0,128,0.55)",
                          opacity: 1,
                        },
                        caretColor: PINK,
                      }}
                    />
                  </Box>

                  <Button
                    type="submit"
                    disabled={isResending}
                    variant="contained"
                    sx={{
                      width: "100%",
                      maxWidth: 520,
                      height: 56,
                      borderRadius: 999,
                      fontWeight: 900,
                      fontSize: 18,
                      textTransform: "none",
                      backgroundColor: "#fff",
                      color: PINK,
                      boxShadow: "0 14px 34px rgba(255,255,255,0.35)",
                      "&:hover": {
                        backgroundColor: "#fff",
                        opacity: 0.96,
                        boxShadow: "0 18px 40px rgba(255,255,255,0.42)",
                      },
                    }}
                  >
                    {isResending ? "Enviando..." : "Continuar"}
                  </Button>

                  {!!errorSend && (
                    <Alert
                      severity="error"
                      variant="filled"
                      sx={{
                        bgcolor: "#ff1744",
                        color: "white",
                        width: "100%",
                        maxWidth: 520,
                      }}
                    >
                      {errorSend}
                    </Alert>
                  )}
                </Stack>
              )}

              {/* Paso 2: OTP */}
              {step === "otp" && (
                <Paper
                  elevation={0}
                  sx={{
                    width: "100%",
                    maxWidth: 580,
                    mx: "auto",
                    mt: 2,
                    border: "1px solid rgba(255,255,255,0.18)",
                    bgcolor: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(8px)",
                    p: 2,
                  }}
                >
                  <Stack spacing={2.25} alignItems="center">
                    {/* Caso especial: backend dice "No se pudo enviar el OTP" */}
                    {errorSend === "No se pudo enviar el OTP" ? (
                      <Stack alignItems="center" spacing={1.2}>
                        <Typography
                          variant="h6"
                          sx={{ color: "#fff", fontWeight: 900 }}
                        >
                          No pudimos enviar el código
                        </Typography>
                        <Typography sx={{ color: "rgba(255,255,255,.95)" }}>
                          Verifica que el número exista o corrígelo.
                        </Typography>

                        <Button
                          onClick={() => setStep("phone")}
                          variant="contained"
                          sx={{
                            mt: 0.5,
                            borderRadius: 999,
                            fontWeight: 900,
                            px: 2.6,
                            py: 0.9,
                            textTransform: "none",
                            backgroundColor: "#ffffff",
                            color: PINK,
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
                      </Stack>
                    ) : (
                      <>
                        <OtpStep
                          otp={otp}
                          setOtp={setOtp}
                          onEditPhone={() => setStep("phone")}
                          resendTimer={resendTimer}
                          onResend={onResend}
                          phone={form.phone}
                          isResending={isResending}
                          isVerifying={isVerifying}
                          verified={verified}
                          attemptsLeft={attemptsLeft}
                          locked={
                            locked ||
                            (typeof attemptsLeft === "number" &&
                              attemptsLeft <= 0) ||
                            false
                          }
                          errorSend={errorSend}
                          resendLeft={resendLeft}
                          onSubmit={onVerify}
                          brandColor={PINK}
                        />

                        {isVerifying && (
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <CircularProgress
                              size={18}
                              sx={{ color: "#fff" }}
                            />
                            <Typography variant="body2" color="white">
                              Verificando / Registrando…
                            </Typography>
                          </Stack>
                        )}
                      </>
                    )}
                  </Stack>
                </Paper>
              )}

              {/* Imagen inferior (premio) con espacio reservado */}
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 520,
                  mx: "auto",
                  mt: 3,
                  borderRadius: 2,
                  overflow: "hidden",
                  position: "relative",
                  aspectRatio: prizeRatio,
                  boxShadow: "0 10px 28px rgba(0,0,0,.15)",
                }}
              >
                <Image
                  src={prizeSrc}
                  alt="Premio"
                  fill
                  priority
                  sizes="(max-width: 640px) 90vw, 520px"
                  style={{ objectFit: "cover" }}
                />
              </Box>
            </Paper>
          )}
      </Container>
      <ProfileSelector
        open={showProfileSelector}
        onClose={() => setShowProfileSelector(false)}
        onProfileSelected={handleProfileSelected}
      />
    </Box>
  );
}
