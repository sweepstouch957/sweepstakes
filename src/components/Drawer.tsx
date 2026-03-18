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

const ACCENT = "#ff0080";

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
          background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
          color: "#f1f5f9",
        }}
      >
        {/* Header */}
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
              background: `linear-gradient(135deg, ${ACCENT}, #ff4da6)`,
              color: "#fff",
              display: "grid",
              placeItems: "center",
              boxShadow: `0 8px 24px rgba(255, 0, 128, 0.3)`,
              fontWeight: 900,
              overflow: "hidden",
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
            <Typography sx={{ fontWeight: 800, lineHeight: 1.2, color: "#f1f5f9" }}>
              {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
                "Promotor"}
            </Typography>
            <Chip
              size="small"
              label={user?.role || "promotor"}
              sx={{
                mt: 0.5,
                bgcolor: "rgba(255, 0, 128, 0.15)",
                color: ACCENT,
                border: `1px solid rgba(255, 0, 128, 0.3)`,
                fontWeight: 700,
                fontSize: 11,
              }}
            />
          </Box>
          <IconButton
            onClick={handleLogout}
            sx={{
              color: "#94a3b8",
              "&:hover": { color: "#ef4444", bgcolor: "rgba(239,68,68,0.1)" },
            }}
            aria-label="Cerrar sesión"
          >
            <LogoutIcon />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.1)" }} />

        {/* Info contacto */}
        <Box sx={{ p: 2.5, pt: 2 }}>
          <Stack spacing={1.2}>
            <Stack direction="row" alignItems="center" spacing={1.2}>
              <EmailRoundedIcon fontSize="small" sx={{ color: "#94a3b8" }} />
              <Typography sx={{ fontSize: 14, color: "#94a3b8", wordBreak: "break-all" }}>
                {user?.email ?? "—"}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1.2}>
              <LocalPhoneRoundedIcon fontSize="small" sx={{ color: "#94a3b8" }} />
              <Typography sx={{ fontSize: 14, color: "#94a3b8" }}>
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
                <StoreMallDirectoryRoundedIcon fontSize="small" sx={{ color: ACCENT }} />
                <Typography sx={{ fontSize: 14, color: "#e2e8f0" }}>
                  {activeShift?.storeInfo?.name ?? "Tienda sin nombre"}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AccessTimeFilledRoundedIcon fontSize="small" sx={{ color: ACCENT }} />
                <Typography sx={{ fontSize: 14, color: "#e2e8f0" }}>
                  {timeLeft || "Turno activo"}
                </Typography>
              </Stack>
            </Stack>
          ) : (
            <Stack spacing={1.2}>
              <Typography sx={{ fontWeight: 800, color: "#94a3b8" }}>Sin turno activo</Typography>
              <Link href="https://work.sweepstouch.com/" target="_blank">
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    background: `linear-gradient(135deg, ${ACCENT}, #ff4da6)`,
                    color: "#fff",
                    "&:hover": { opacity: 0.9 },
                    borderRadius: 999,
                    fontWeight: 800,
                    textTransform: "none",
                  }}
                >
                  Buscar turnos disponibles
                </Button>
              </Link>
            </Stack>
          )}
        </Box>

        <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.1)" }} />

        {/* Stats */}
        <Box sx={{ p: 2.5 }}>
          <Typography sx={{ fontWeight: 800, mb: 1.5, color: "#f1f5f9" }}>
            Estadísticas del turno
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <StatCard label="Total" value={stats.total} />
            <StatCard label="Nuevos" value={stats.nuevos} />
            <StatCard label="Existentes" value={stats.existentes} />
          </Stack>
          <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
            <PaidRoundedIcon fontSize="small" sx={{ color: "#10b981" }} />
            <Typography sx={{ fontSize: 14, color: "#e2e8f0" }}>
              Ganancias: <b style={{ color: "#10b981" }}>${Number(stats.earnings || 0).toFixed(2)}</b>
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.1)" }} />

        {/* Últimos números (local) */}
        <Box sx={{ p: 2.5, pt: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <TimelineRoundedIcon fontSize="small" sx={{ color: ACCENT }} />
            <Typography sx={{ fontWeight: 800, color: "#f1f5f9" }}>Últimos números</Typography>
          </Stack>
          {recentPhones.length === 0 ? (
            <Typography sx={{ mt: 1, color: "#64748b" }}>
              Sin registros recientes.
            </Typography>
          ) : (
            <List dense sx={{ mt: 0.5 }}>
              {recentPhones.slice(0, 10).map((p, i) => (
                <ListItem key={`${p}-${i}`} sx={{ py: 0.2 }}>
                  <ListItemText
                    primaryTypographyProps={{
                      sx: { color: "#e2e8f0", fontWeight: 600, fontSize: 13 },
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
        <Box sx={{ p: 2.5, pt: 0.5 }}>
          <Typography variant="caption" sx={{ color: "#475569" }}>
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
        bgcolor: "rgba(255, 0, 128, 0.08)",
        border: "1px solid rgba(255, 0, 128, 0.15)",
        textAlign: "center",
      }}
    >
      <Typography sx={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{label}</Typography>
      <Typography sx={{ fontSize: 22, fontWeight: 900, color: "#f1f5f9" }}>
        {value ?? 0}
      </Typography>
    </Box>
  );
}
