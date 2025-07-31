/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Fab, Box, IconButton } from "@mui/material";
import { Analytics, Logout } from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/lib/context/auth";
import { getActiveShift, ShiftResponse } from "@/lib/services/shift.service";
import { RegisterSweepstake } from "./RefferalForm";
import { NoActiveShiftModal } from "./NoActiveShiftModal";
import { ShiftDrawer } from "./ShiftDrawer";

export const PromoterDashboard = () => {
  const { user, logout } = useAuth();
  const [shiftData, setShiftData] = useState<ShiftResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNoShiftModal, setShowNoShiftModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchShiftData = useCallback(async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      const data = await getActiveShift(user._id);
      setShiftData(data);
      
      if (!data.shift) {
        setShowNoShiftModal(true);
      } else {
        // Solo mostrar toast la primera vez que se carga con turno activo
        if (!shiftData?.shift) {
          toast.success(`¡Turno activo encontrado! Tienda: ${data.shift.storeInfo?.name || 'N/A'}`);
        }
      }
    } catch (error: any) {
      toast.error("Error al obtener información del turno");
      console.error("Error fetching shift:", error);
    } finally {
      setLoading(false);
    }
  }, [user?._id, shiftData?.shift]);

  useEffect(() => {
    fetchShiftData();
  }, [fetchShiftData]);

  // Refrescar datos cada 30 segundos
  useEffect(() => {
    if (!shiftData?.shift) return;

    const interval = setInterval(() => {
      fetchShiftData();
    }, 30000);

    return () => clearInterval(interval);
  }, [shiftData?.shift, fetchShiftData]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom, #1b3fac 0%, #000029 100%)",
        }}
      >
        <div className="text-white text-xl">Cargando...</div>
      </Box>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      
      {/* Modal para cuando no hay turno activo */}
      <NoActiveShiftModal
        open={showNoShiftModal}
        onClose={() => setShowNoShiftModal(false)}
      />

      {/* Drawer de métricas */}
      <ShiftDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        shiftData={shiftData}
      />

      {/* Si hay turno activo, mostrar el formulario de registro */}
      {shiftData?.shift && (
        <>
          <RegisterSweepstake shiftData={shiftData} />
          
          {/* Botón flotante para abrir el drawer de métricas */}
          <Fab
            color="primary"
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
              background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)",
              },
            }}
            onClick={() => setDrawerOpen(true)}
          >
            <Analytics />
          </Fab>

          {/* Botón de logout */}
          <IconButton
            onClick={logout}
            sx={{
              position: "fixed",
              top: 16,
              right: 16,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              color: "#d32f2f",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
              },
              zIndex: 1000,
            }}
          >
            <Logout />
          </IconButton>
        </>
      )}

      {/* Si no hay turno activo, mostrar mensaje en lugar del formulario */}
      {!shiftData?.shift && !showNoShiftModal && (
        <>
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(to bottom, #1b3fac 0%, #000029 100%)",
              px: 4,
              textAlign: "center",
            }}
          >
            <div className="text-white text-2xl mb-4">
              No tienes un turno activo en este momento
            </div>
            <button
              onClick={() => setShowNoShiftModal(true)}
              className="bg-[#08C7F7] hover:bg-[#08C7F795] text-white rounded-full px-6 py-3 font-bold text-xl"
            >
              Ver detalles
            </button>
          </Box>

          {/* Botón de logout cuando no hay turno */}
          <IconButton
            onClick={logout}
            sx={{
              position: "fixed",
              top: 16,
              right: 16,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              color: "#d32f2f",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
              },
              zIndex: 1000,
            }}
          >
            <Logout />
          </IconButton>
        </>
      )}
    </>
  );
};