/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  Alert,
  LinearProgress,
  Skeleton,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";

import LoginCard from "./LoginCard";
import PromoterDrawer from "./Drawer";

import { usePromotorPage } from "@/hooks/usePromotorPage";
import ProfileSelector from "./ProfileSelector";
import Link from "next/link";

const ACCENT = "#ff0080";
const BG_DARK = "#0f172a";
const BG_SURFACE = "#1e293b";
const BG_SURFACE_LIGHT = "#334155";

/* ---------- UI helpers ---------- */

const BeautifulSpinner = () => (
  <Box sx={{ display: "grid", placeItems: "center", width: "100%", py: 4 }}>
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        border: "3px solid rgba(255,0,128,0.15)",
        borderTopColor: ACCENT,
        animation: "spin 0.8s linear infinite",
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
      height={200}
      sx={{ borderRadius: 4, bgcolor: "rgba(148,163,184,0.08)" }}
    />
    <Skeleton variant="text" width="80%" sx={{ fontSize: "2rem", bgcolor: "rgba(148,163,184,0.08)" }} />
    <Skeleton variant="text" width="60%" sx={{ fontSize: "1rem", bgcolor: "rgba(148,163,184,0.08)" }} />
    <Skeleton
      variant="rectangular"
      width="100%"
      height={80}
      sx={{ borderRadius: 3, bgcolor: "rgba(148,163,184,0.08)" }}
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
      p: 4,
      background: "rgba(30, 41, 59, 0.7)",
      border: "1px solid rgba(148, 163, 184, 0.12)",
      backdropFilter: "blur(16px)",
      borderRadius: 4,
      color: "#f1f5f9",
    }}
  >
    <Box
      sx={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "rgba(255,0,128, 0.1)",
        display: "grid",
        placeItems: "center",
        mx: "auto",
        mb: 2,
      }}
    >
      <CampaignRoundedIcon sx={{ color: ACCENT, fontSize: 32 }} />
    </Box>
    <Typography variant="h5" fontWeight={800} sx={{ mb: 1, color: "#f1f5f9" }}>
      No tenés un turno activo
    </Typography>
    <Typography variant="body2" sx={{ color: "#94a3b8", mb: 3 }}>
      Podés revisar los turnos disponibles y aplicar en segundos.
    </Typography>
    <Button
      component={Link}
      href="https://work.sweepstouch.com/"
      target="_blank"
      rel="noopener noreferrer"
      variant="contained"
      sx={{
        background: `linear-gradient(135deg, ${ACCENT}, #ff4da6)`,
        color: "#fff",
        "&:hover": { opacity: 0.9 },
        borderRadius: "2rem",
        px: "2rem",
        py: "0.75rem",
        fontSize: "1rem",
        fontWeight: 800,
        textTransform: "none",
        boxShadow: `0 8px 32px rgba(255,0,128, 0.25)`,
      }}
    >
      Buscar turnos disponibles
    </Button>
  </Paper>
);

/* ---------- Main Component ---------- */

export default function RegisterForm() {
  const {
    form,
    handleChange,
    handleLoginSubmit,
    handleAccessCodeLogin,
    loading,
    isLoaded,
    isPromotor,
    user,
    handleLogout,
    activeShift,
    hasActiveShift,
    sweepstake,
    storeInfo: store,
    fetchingBackground,
    resolvingShift,
    registerPending,
    registerError,
    registerNow,
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

  // Use sweepstake image from API, fallback to placeholder
  const sweepstakeImage = sweepstake?.image || null;
  const sweepstakeName = sweepstake?.name || "Sorteo activo";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: { xs: 2, md: 4 },
        background: `linear-gradient(180deg, ${BG_DARK} 0%, #0c1222 50%, ${BG_DARK} 100%)`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-50%",
          right: "-30%",
          width: "80%",
          height: "100%",
          background: `radial-gradient(ellipse, rgba(255,0,128,0.06) 0%, transparent 70%)`,
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "-30%",
          left: "-20%",
          width: "60%",
          height: "80%",
          background: `radial-gradient(ellipse, rgba(255,0,128,0.04) 0%, transparent 70%)`,
          pointerEvents: "none",
        },
      }}
    >
      {/* Progress bar */}
      {fetchingBackground && (
        <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 80 }}>
          <LinearProgress
            sx={{
              "& .MuiLinearProgress-bar": {
                background: `linear-gradient(90deg, ${ACCENT}, #ff4da6)`,
              },
              bgcolor: "rgba(255,0,128,0.1)",
            }}
          />
        </Box>
      )}

      {/* Drawer button */}
      {user && (
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: "fixed",
            top: 12,
            right: 12,
            zIndex: 90,
            bgcolor: BG_SURFACE,
            color: ACCENT,
            border: "1px solid rgba(255,0,128,0.2)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            "&:hover": { bgcolor: BG_SURFACE_LIGHT },
          }}
          aria-label="Abrir panel"
        >
          <MenuIcon />
        </IconButton>
      )}

      {user && (
        <PromoterDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          user={user}
          activeShift={activeShift}
          hasActiveShift={!!hasActiveShift}
          timeLeft={undefined as any}
          handleLogout={handleLogout}
          recentPhones={[]}
        />
      )}

      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* LOADING */}
        {showLoadingBlock && !showLogin && (
          <>
            <CentralSkeleton />
            <BeautifulSpinner />
          </>
        )}

        {/* LOGIN */}
        {showLogin && (
          <LoginCard
            form={{
              username: (form as any).username,
              password: (form as any).password,
            }}
            handleChange={handleChange}
            handleLoginSubmit={handleLoginSubmit}
            handleAccessCodeLogin={handleAccessCodeLogin}
            loading={loading}
          />
        )}

        {/* NOT A PROMOTOR */}
        {!showLoadingBlock && user && !isPromotor && (
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 720,
              textAlign: "center",
              p: 4,
              background: "rgba(30, 41, 59, 0.7)",
              border: "1px solid rgba(148, 163, 184, 0.12)",
              color: "#f1f5f9",
              backdropFilter: "blur(16px)",
              borderRadius: 4,
            }}
          >
            <Typography variant="h6" fontWeight={800}>
              Necesitás permisos de promotor para continuar.
            </Typography>
          </Paper>
        )}

        {/* NO ACTIVE SHIFT */}
        {!showLoadingBlock &&
          user &&
          isPromotor &&
          (!hasActiveShift || !activeShift) && <NoActiveShiftCard />}

        {/* FORM: WITH ACTIVE SHIFT */}
        {!showLoadingBlock &&
          user &&
          isPromotor &&
          hasActiveShift &&
          activeShift && (
            <Paper
              component="form"
              onSubmit={async (e) => {
                e.preventDefault();
                await registerNow();
              }}
              elevation={0}
              sx={{
                width: "100%",
                maxWidth: 520,
                px: { xs: 2.5, sm: 3.5 },
                py: { xs: 3, sm: 4 },
                borderRadius: 4,
                background: "rgba(30, 41, 59, 0.75)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(148, 163, 184, 0.1)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
              }}
            >
              {/* Sweepstake Image */}
              {sweepstakeImage ? (
                <Box
                  sx={{
                    width: "100%",
                    borderRadius: 3,
                    overflow: "hidden",
                    position: "relative",
                    aspectRatio: "16/9",
                    mb: 2.5,
                    border: "1px solid rgba(148,163,184,0.08)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sweepstakeImage}
                    alt={sweepstakeName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    borderRadius: 3,
                    aspectRatio: "16/9",
                    mb: 2.5,
                    background: `linear-gradient(135deg, rgba(255,0,128,0.1), rgba(255,0,128,0.05))`,
                    border: "1px solid rgba(255,0,128,0.15)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <CampaignRoundedIcon sx={{ fontSize: 48, color: "rgba(255,0,128,0.3)" }} />
                </Box>
              )}

              {/* Title */}
              <Stack alignItems="center" sx={{ mb: 3 }}>
                <Typography
                  variant="h5"
                  sx={{
                    textAlign: "center",
                    color: "#f1f5f9",
                    fontWeight: 800,
                    lineHeight: 1.2,
                    mb: 0.5,
                  }}
                >
                  {sweepstakeName}
                </Typography>
                {store?.name && (
                  <Typography
                    variant="body2"
                    sx={{ color: "#94a3b8", textAlign: "center" }}
                  >
                    {store.name}
                  </Typography>
                )}
              </Stack>

              {/* Phone input */}
              <Stack spacing={2} alignItems="center">
                <Box sx={{ width: "100%" }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "#94a3b8",
                      mb: 0.75,
                      fontWeight: 600,
                      fontSize: 13,
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
                          <Typography sx={{ color: ACCENT, fontWeight: 800, fontSize: 15 }}>
                            +1
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: BG_SURFACE,
                        color: "#f1f5f9",
                        fontWeight: 600,
                        borderRadius: 3,
                        fontSize: 16,
                        "& fieldset": {
                          borderColor: BG_SURFACE_LIGHT,
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(255,0,128,0.4)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: ACCENT,
                          boxShadow: `0 0 0 3px rgba(255,0,128,0.15)`,
                        },
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: "#64748b",
                        opacity: 1,
                      },
                      caretColor: ACCENT,
                    }}
                  />
                </Box>

                <Button
                  type="submit"
                  disabled={registerPending}
                  variant="contained"
                  sx={{
                    width: "100%",
                    height: 52,
                    borderRadius: 999,
                    fontWeight: 800,
                    fontSize: 16,
                    textTransform: "none",
                    background: `linear-gradient(135deg, ${ACCENT}, #ff4da6)`,
                    color: "#fff",
                    boxShadow: `0 8px 32px rgba(255,0,128, 0.25)`,
                    "&:hover": {
                      opacity: 0.92,
                      boxShadow: `0 12px 40px rgba(255,0,128, 0.35)`,
                    },
                    "&.Mui-disabled": {
                      background: BG_SURFACE_LIGHT,
                      color: "#64748b",
                    },
                  }}
                >
                  {registerPending ? "Registrando…" : "Registrar participación"}
                </Button>

                {!!registerError && (
                  <Alert
                    severity="error"
                    variant="filled"
                    sx={{
                      bgcolor: "rgba(239, 68, 68, 0.15)",
                      color: "#fca5a5",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      width: "100%",
                      borderRadius: 2,
                      "& .MuiAlert-icon": { color: "#ef4444" },
                    }}
                  >
                    {registerError}
                  </Alert>
                )}
              </Stack>
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
