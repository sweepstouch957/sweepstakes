"use client";

import { useState } from "react";
import Image from "next/image";
import { Toaster } from "react-hot-toast";

import { IconButton, Menu, MenuItem, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/MenuRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import StorefrontIcon from "@mui/icons-material/Storefront";

import ImageBackgroundMobile from "@public/Carro.webp";
import ImageLabrDay from "@public/LaborDay.webp";

import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import { useSweepstakeForm } from "@/hooks/useSweepstakesPage";
import Cookies from "js-cookie"
export default function CombinedSweepstakePage() {
  const {
    form,
    handleChange,
    handleRegisterSubmit,
    success,
    isPromotor,
    stores,
    selectedStore,
    setSelectedStore,
    loadingStores,
    isLoaded,
    showRegisterForm,
    handleLoginSubmit,
    loading,
    store,
    logout,
    changeStore
  } = useSweepstakeForm();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClearStore = () => {
    Cookies.remove("storeId");
    setSelectedStore(null);
    handleMenuClose();
    changeStore();
  };

  const handleLogout = () => {
    setSelectedStore(null);
    handleMenuClose();
    logout();
    changeStore();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: "linear-gradient(to bottom, #1b3fac 0%, #000029 100%)",
      }}
    >
      <Toaster position="top-center" />

      {/* Botón hamburguesa */}
      {isPromotor && (
        <Box
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 50,
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={handleMenuOpen}
            size="large"
            sx={{ backgroundColor: "#ffffff22", color: "white" }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 220,
                backgroundColor: "#1b3fac",
                color: "white",
                borderRadius: 2,
              },
            }}
          >
            <MenuItem
              onClick={handleClearStore}
              sx={{ fontSize: "1.1rem", gap: 1 }}
            >
              <StorefrontIcon /> Cambiar tienda
            </MenuItem>

              <MenuItem
                onClick={handleLogout}
                sx={{ fontSize: "1.1rem", gap: 1 }}
              >
                <LogoutIcon /> Cerrar sesión
              </MenuItem>
          </Menu>
        </Box>
      )}

      <section className="w-full max-w-2xl flex flex-col items-center justify-center pt-8 space-y-4">
        <Image
          src={ImageLabrDay.src}
          alt="Labor Day"
          width={ImageLabrDay.width}
          height={ImageLabrDay.height}
          priority
          className="w-full max-w-[500px] h-auto"
        />

        {isLoaded ? (
          showRegisterForm ? (
            <RegisterForm
              form={form}
              handleChange={handleChange}
              handleSubmit={handleRegisterSubmit}
              success={success}
              isPromotor={isPromotor && !Cookies.get("storeId")}
              stores={stores}
              selectedStore={selectedStore}
              setSelectedStore={setSelectedStore}
              loadingStores={loadingStores}
              store={store}
            />
          ) : (
            <LoginForm
              form={form}
              handleChange={handleChange}
              handleSubmit={handleLoginSubmit}
              loading={loading}
            />
          )
        ) : (
          <div className="flex justify-center items-center">
            <div className="w-40 h-40 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <Image
          src={ImageBackgroundMobile.src}
          alt="Nissan Versa"
          width={ImageBackgroundMobile.width}
          height={ImageBackgroundMobile.height}
          priority
          className="w-full max-w-[520px] h-auto"
        />
      </section>
    </div>
  );
}
