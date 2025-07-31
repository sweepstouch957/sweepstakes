"use client";

import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import { Close, AccessTime, Person, TrendingUp, Store } from "@mui/icons-material";
import { FC, useEffect, useState } from "react";
import { ShiftResponse } from "@/lib/services/shift.service";

interface ShiftDrawerProps {
  open: boolean;
  onClose: () => void;
  shiftData: ShiftResponse | null;
}

export const ShiftDrawer: FC<ShiftDrawerProps> = ({ open, onClose, shiftData }) => {
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (!shiftData?.shift) return;

    const updateTimer = () => {
      const now = new Date();
      const endTime = new Date(shiftData.shift!.endTime);
      const startTime = new Date(shiftData.shift!.startTime);
      
      const totalDuration = endTime.getTime() - startTime.getTime();
      const elapsed = now.getTime() - startTime.getTime();
      const remaining = endTime.getTime() - now.getTime();

      if (remaining <= 0) {
        setTimeRemaining("Turno finalizado");
        setProgress(100);
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      setProgress((elapsed / totalDuration) * 100);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [shiftData]);

  if (!shiftData?.shift) return null;

  const { shift, stats } = shiftData;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 400 },
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
      }}
    >
      <Box sx={{ p: 2, color: "white" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Mi Turno
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </Box>

        <Divider sx={{ bgcolor: "white", opacity: 0.3, mb: 3 }} />

        {/* Información del Promotor */}
        <Card sx={{ mb: 2, bgcolor: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Person sx={{ mr: 1, color: "white" }} />
              <Typography variant="subtitle1" sx={{ color: "white", fontWeight: "bold" }}>
                {shift.promoterId.firstName} {shift.promoterId.lastName}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
              {shift.promoterId.email}
            </Typography>
          </CardContent>
        </Card>

        {/* Información de la Tienda */}
        {shift.storeInfo && (
          <Card sx={{ mb: 2, bgcolor: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Store sx={{ mr: 1, color: "white" }} />
                <Typography variant="subtitle1" sx={{ color: "white", fontWeight: "bold" }}>
                  {shift.storeInfo.name}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                {shift.storeInfo.address}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Tiempo Restante */}
        <Card sx={{ mb: 2, bgcolor: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <AccessTime sx={{ mr: 1, color: "white" }} />
              <Typography variant="subtitle1" sx={{ color: "white", fontWeight: "bold" }}>
                Tiempo Restante
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ color: "white", textAlign: "center", mb: 2 }}>
              {timeRemaining}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "rgba(255,255,255,0.3)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  bgcolor: "#4caf50",
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Métricas */}
        <Card sx={{ mb: 2, bgcolor: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <TrendingUp sx={{ mr: 1, color: "white" }} />
              <Typography variant="subtitle1" sx={{ color: "white", fontWeight: "bold" }}>
                Métricas del Turno
              </Typography>
            </Box>
            
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
                  {stats.totalParticipants}
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
                  Total Participantes
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
                  {stats.todayParticipants}
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
                  Hoy
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
                  {stats.avgPerHour.toFixed(1)}
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
                  Promedio/Hora
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Horario del Turno */}
        <Card sx={{ bgcolor: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ color: "white", fontWeight: "bold", mb: 1 }}>
              Horario del Turno
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
              Inicio: {new Date(shift.startTime).toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
              Fin: {new Date(shift.endTime).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Drawer>
  );
};