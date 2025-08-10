"use client";

import { usePromotorPage } from "@/hooks/usePromotorPage";
import {
  Button,
  Typography,
  Drawer,
  IconButton,
  Divider,
  Box,
} from "@mui/material";
import ImageLabrDay from "@public/LaborDay.webp";
import ImageBackgroundMobile from "@public/Carro.webp";
import Link from "next/link";
import RegisterForm from "./RegisterNew";
import LoginForm from "./LoginForm";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

const CombinedSweepstakePage = () => {
  const {
    form,
    handleChange,
    handleRegisterSubmit,
    success,
    isPromotor,
    activeShift,
    hasActiveShift,
    isLoaded,
    storeInfo,
    handleLoginSubmit,
    loading,
    sweepstake,
    user,
    handleLogout,
  } = usePromotorPage();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  const showRegisterForm =
    isPromotor && hasActiveShift && activeShift && sweepstake;

  useEffect(() => {
    if (!activeShift) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const end = new Date(activeShift.endTime).getTime();
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
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [activeShift]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative"
      style={{
        background: `linear-gradient(to bottom, #1b3fac 0%, #000029 100%)`,
      }}
    >
      {/* Botón hamburguesa */}
      {isPromotor && (
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            color: "white",
            zIndex: 50,
          }}
        >
          <MenuIcon fontSize="large" />
        </IconButton>
      )}

      <section className="w-full max-w-2xl flex flex-col items-center justify-center pt-8 space-y-4">
        {isLoaded ? (
          <>
            {showRegisterForm ? (
              <RegisterForm
                form={form}
                handleChange={handleChange}
                handleSubmit={handleRegisterSubmit}
                success={success}
                store={storeInfo}
                sweepstake={sweepstake}
                image={{
                  src: ImageLabrDay.src,
                  width: ImageLabrDay.width,
                  height: ImageLabrDay.height,
                }}
                prizeImage={{
                  src: ImageBackgroundMobile.src,
                  width: ImageBackgroundMobile.width,
                  height: ImageBackgroundMobile.height,
                }}
              />
            ) : isPromotor && !hasActiveShift ? (
              <div className="flex flex-col items-center text-center space-y-4">
                <Typography variant="h5" className="text-white" mb={2}>
                  No tenés un turno activo en este momento.
                </Typography>
                <Link 
                  href={"https://work.sweepstouch.com/"}
                  target="_blank"
                >
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#08C7F7",
                      "&:hover": { backgroundColor: "#08C7F795" },
                      borderRadius: "2rem",
                      paddingX: "2rem",
                      paddingY: "0.75rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    Buscar Turnos Disponibles
                  </Button>
                </Link>
              </div>
            ) : (
              <LoginForm
                form={form}
                handleChange={handleChange}
                handleSubmit={handleLoginSubmit}
                loading={loading}
              />
            )}
          </>
        ) : (
          <div className="flex justify-center items-center">
            <div className="w-40 h-40 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </section>

      {/* Drawer del usuario */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 300, padding: 2 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography variant="h6" fontWeight="bold">
              Mi Cuenta
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {user && (
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography fontWeight="bold">Nombre:</Typography>
              <Typography>{`${user.firstName} ${user.lastName}`}</Typography>

              <Typography fontWeight="bold" mt={2}>
                Teléfono:
              </Typography>
              <Typography>{user.phoneNumber}</Typography>

              <Typography fontWeight="bold" mt={2}>
                Email:
              </Typography>
              <Typography>{user.email}</Typography>

              {hasActiveShift && (
                <Typography fontWeight="bold" mt={2}>
                  Tiempo restante:
                </Typography>
              )}
              <Typography color="primary">{timeLeft}</Typography>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {hasActiveShift ? (
            <Button
              fullWidth
              startIcon={<BarChartIcon />}
              variant="outlined"
              sx={{ mb: 1, borderRadius: 4, textTransform: "none" }}
              href="https://work.sweepstouch.com/"
              target="_blank"
            >
              Ver estadísticas
            </Button>
          ) : (
            <Button
              fullWidth
              variant="outlined"
              sx={{ mb: 1, borderRadius: 4, textTransform: "none" }}
              href="https://work.sweepstouch.com/"
            >
              Buscar turnos disponibles
            </Button>
          )}
          <Button
            fullWidth
            startIcon={<LogoutIcon />}
            variant="contained"
            sx={{
              backgroundColor: "#ff0080",
              borderRadius: 4,
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#e60073",
              },
            }}
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </Box>
      </Drawer>
    </div>
  );
};

export default CombinedSweepstakePage;
