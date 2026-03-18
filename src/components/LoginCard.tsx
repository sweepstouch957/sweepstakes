"use client";

import React, { useState } from "react";
import { Typography, Box, Tabs, Tab } from "@mui/material";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

const ACCENT = "#ff0080";
const SURFACE = "#1e293b";
const SURFACE_LIGHT = "#334155";

export interface LoginCardProps {
  form: { username: string; password: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLoginSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleAccessCodeLogin?: (accessCode: string) => Promise<void>;
  loading: boolean;
}

export default function LoginCard({
  form,
  handleChange,
  handleLoginSubmit,
  handleAccessCodeLogin,
  loading,
}: Readonly<LoginCardProps>) {
  const [tab, setTab] = useState(0);
  const [accessCode, setAccessCode] = useState("");

  const handleAccessCodeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (handleAccessCodeLogin && accessCode.trim()) {
      await handleAccessCodeLogin(accessCode.trim());
    }
  };

  const inputSx = {
    width: "100%",
    height: 48,
    padding: "0 16px",
    borderRadius: 12,
    border: `1px solid ${SURFACE_LIGHT}`,
    background: SURFACE,
    color: "#f1f5f9",
    fontSize: 15,
    fontWeight: 500,
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    transition: "all 0.2s ease",
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 400,
        borderRadius: 4,
        background: "rgba(30, 41, 59, 0.85)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(148, 163, 184, 0.12)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,0,128,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          pb: 0,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${ACCENT}, #ff4da6)`,
            display: "grid",
            placeItems: "center",
            mx: "auto",
            mb: 2,
            boxShadow: `0 8px 32px rgba(255, 0, 128, 0.3)`,
          }}
        >
          <VpnKeyRoundedIcon sx={{ color: "#fff", fontSize: 28 }} />
        </Box>
        <Typography
          variant="h5"
          sx={{ color: "#f1f5f9", fontWeight: 800, mb: 0.5 }}
        >
          Iniciar sesión
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#94a3b8", mb: 2 }}
        >
          Panel de promotoras
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="fullWidth"
        sx={{
          mx: 3,
          minHeight: 40,
          borderRadius: 2,
          background: "rgba(15, 23, 42, 0.6)",
          border: "1px solid rgba(148, 163, 184, 0.08)",
          "& .MuiTabs-indicator": {
            display: "none",
          },
          "& .MuiTab-root": {
            minHeight: 40,
            textTransform: "none",
            fontWeight: 600,
            fontSize: 13,
            color: "#94a3b8",
            borderRadius: 2,
            transition: "all 0.2s",
            "&.Mui-selected": {
              color: "#fff",
              background: ACCENT,
            },
          },
        }}
      >
        <Tab icon={<PersonRoundedIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Usuario" />
        <Tab icon={<VpnKeyRoundedIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Código" />
      </Tabs>

      {/* Tab content */}
      <Box sx={{ p: 3 }}>
        {tab === 0 ? (
          <form onSubmit={handleLoginSubmit}>
            <Box sx={{ mb: 2 }}>
              <label
                style={{
                  display: "block",
                  color: "#94a3b8",
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                Usuario
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Correo o usuario"
                style={inputSx}
                onFocus={(e) => {
                  e.target.style.borderColor = ACCENT;
                  e.target.style.boxShadow = `0 0 0 3px rgba(255,0,128,0.15)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = SURFACE_LIGHT;
                  e.target.style.boxShadow = "none";
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <label
                style={{
                  display: "block",
                  color: "#94a3b8",
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={inputSx}
                onFocus={(e) => {
                  e.target.style.borderColor = ACCENT;
                  e.target.style.boxShadow = `0 0 0 3px rgba(255,0,128,0.15)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = SURFACE_LIGHT;
                  e.target.style.boxShadow = "none";
                }}
              />
            </Box>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: 48,
                borderRadius: 999,
                border: "none",
                background: `linear-gradient(135deg, ${ACCENT}, #ff4da6)`,
                color: "#fff",
                fontWeight: 800,
                fontSize: 16,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                boxShadow: `0 8px 32px rgba(255, 0, 128, 0.3)`,
                transition: "all 0.2s ease",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleAccessCodeSubmit}>
            <Box sx={{ mb: 3 }}>
              <label
                style={{
                  display: "block",
                  color: "#94a3b8",
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                Código de acceso
              </label>
              <input
                name="accessCode"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Ingresa tu código"
                style={{
                  ...inputSx,
                  textAlign: "center" as const,
                  fontSize: 18,
                  letterSpacing: 2,
                  fontWeight: 700,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = ACCENT;
                  e.target.style.boxShadow = `0 0 0 3px rgba(255,0,128,0.15)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = SURFACE_LIGHT;
                  e.target.style.boxShadow = "none";
                }}
              />
            </Box>

            <button
              type="submit"
              disabled={loading || !accessCode.trim()}
              style={{
                width: "100%",
                height: 48,
                borderRadius: 999,
                border: "none",
                background: `linear-gradient(135deg, ${ACCENT}, #ff4da6)`,
                color: "#fff",
                fontWeight: 800,
                fontSize: 16,
                cursor: loading || !accessCode.trim() ? "not-allowed" : "pointer",
                opacity: loading || !accessCode.trim() ? 0.7 : 1,
                boxShadow: `0 8px 32px rgba(255, 0, 128, 0.3)`,
                transition: "all 0.2s ease",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {loading ? "Verificando..." : "Acceder con código"}
            </button>
          </form>
        )}
      </Box>
    </Box>
  );
}
