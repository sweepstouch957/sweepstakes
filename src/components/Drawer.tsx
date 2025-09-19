/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Drawer,
  Box,
  Typography,
  Chip,
  IconButton,
  Divider,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import StoreMallDirectoryRoundedIcon from "@mui/icons-material/StoreMallDirectoryRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import Link from "next/link";

const PINK = "#ff0080";

export interface PromoterDrawerProps {
  open: boolean;
  onClose: () => void;
  user: any;
  activeShift: any;
  hasActiveShift: boolean;
  timeLeft: string;
  handleLogout: () => void;
  recentPhones: string[];
}

export default function PromoterDrawer({
  open,
  onClose,
  user,
  activeShift,
  hasActiveShift,
  timeLeft,
  handleLogout,
  recentPhones,
}: Readonly<PromoterDrawerProps>) {
  const stats = {
    total:
      activeShift?.totalParticipations ??
      activeShift?.storeInfo?.totalParticipations ??
      0,
    nuevos: activeShift?.newParticipations ?? 0,
    existentes: activeShift?.existingParticipations ?? 0,
    earnings: activeShift?.totalEarnings ?? 0,
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: { xs: 320, sm: 380 },
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(180deg, #ff0080 0%, #ff4da6 100%)",
          color: "#fff",
        }}
      >
        <Box
          sx={{
            p: 2.5,
            pb: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#fff",
              color: PINK,
              display: "grid",
              placeItems: "center",
              boxShadow: "0 8px 20px rgba(255,255,255,.25)",
              fontWeight: 900,
              overflow: "hidden", // importante para el recorte del img
            }}
          >
            {user?.profileImage ? (
              <Box
                component="img"
                src={user.profileImage}
                alt={user?.firstName || "User"}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                  display: "block",
                }}
              />
            ) : user?.firstName ? (
              user.firstName.charAt(0).toUpperCase()
            ) : (
              <PersonRoundedIcon />
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 900, lineHeight: 1.2 }}>
              {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
                "Promotor"}
            </Typography>
            <Chip
              size="small"
              label={user?.role || "promotor"}
              sx={{
                mt: 0.5,
                bgcolor: "rgba(255,255,255,.15)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,.35)",
              }}
            />
          </Box>
          <IconButton
            onClick={handleLogout}
            sx={{ color: "#fff" }}
            aria-label="Cerrar sesión"
          >
            <LogoutIcon />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,.25)" }} />

        {/* Info contacto */}
        <Box sx={{ p: 2.5, pt: 2 }}>
          <Stack spacing={1.2}>
            <Stack direction="row" alignItems="center" spacing={1.2}>
              <EmailRoundedIcon fontSize="small" />
              <Typography sx={{ fontSize: 14, wordBreak: "break-all" }}>
                {user?.email ?? "—"}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1.2}>
              <LocalPhoneRoundedIcon fontSize="small" />
              <Typography sx={{ fontSize: 14 }}>
                {user?.phoneNumber ?? "—"}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {/* Turno */}
        <Box sx={{ px: 2.5, pb: 1 }}>
          {hasActiveShift ? (
            <Stack spacing={1.2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <StoreMallDirectoryRoundedIcon fontSize="small" />
                <Typography sx={{ fontSize: 14 }}>
                  {activeShift?.storeInfo?.name ?? "Tienda sin nombre"}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AccessTimeFilledRoundedIcon fontSize="small" />
                <Typography sx={{ fontSize: 14 }}>
                  {timeLeft || "Turno activo"}
                </Typography>
              </Stack>
            </Stack>
          ) : (
            <Stack spacing={1.2}>
              <Typography sx={{ fontWeight: 800 }}>Sin turno activo</Typography>
              <Link href="https://work.sweepstouch.com/" target="_blank">
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#fff",
                    color: PINK,
                    "&:hover": { backgroundColor: "#fff", opacity: 0.95 },
                    borderRadius: 999,
                    fontWeight: 900,
                  }}
                >
                  Buscar turnos disponibles
                </Button>
              </Link>
            </Stack>
          )}
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,.25)" }} />

        {/* Stats */}
        <Box sx={{ p: 2.5 }}>
          <Typography sx={{ fontWeight: 900, mb: 1 }}>
            Estadísticas del turno
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <StatCard label="Total" value={stats.total} />
            <StatCard label="Nuevos" value={stats.nuevos} />
            <StatCard label="Existentes" value={stats.existentes} />
          </Stack>
          <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
            <PaidRoundedIcon fontSize="small" />
            <Typography sx={{ fontSize: 14 }}>
              Ganancias: <b>${Number(stats.earnings || 0).toFixed(2)}</b>
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,.25)" }} />

        {/* Últimos números (local) */}
        <Box sx={{ p: 2.5, pt: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <TimelineRoundedIcon fontSize="small" />
            <Typography sx={{ fontWeight: 900 }}>Últimos números</Typography>
          </Stack>
          {recentPhones.length === 0 ? (
            <Typography sx={{ mt: 1, opacity: 0.9 }}>
              Sin registros recientes.
            </Typography>
          ) : (
            <List dense sx={{ mt: 0.5 }}>
              {recentPhones.slice(0, 10).map((p, i) => (
                <ListItem key={`${p}-${i}`} sx={{ py: 0.2 }}>
                  <ListItemText
                    primaryTypographyProps={{
                      sx: { color: "#fff", fontWeight: 700 },
                    }}
                    primary={p}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Footer */}
        <Box sx={{ p: 2.5, pt: 0.5, opacity: 0.9 }}>
          <Typography variant="caption">
            Sweepstouch • Panel del promotor
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Box
      sx={{
        flex: 1,
        p: 1.25,
        borderRadius: 2,
        bgcolor: "rgba(255,255,255,.14)",
        border: "1px solid rgba(255,255,255,.35)",
        textAlign: "center",
      }}
    >
      <Typography sx={{ fontSize: 12.5, opacity: 0.9 }}>{label}</Typography>
      <Typography sx={{ fontSize: 20, fontWeight: 900 }}>
        {value ?? 0}
      </Typography>
    </Box>
  );
}
