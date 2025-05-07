"use client";

import React from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";

interface Props {
  form: { phone: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  success: boolean;
  isPromotor: boolean;
  stores: { _id: string; name: string }[];
  selectedStore: string | null;
  setSelectedStore: (storeId: string) => void;
  loadingStores: boolean;
}

export default function RegisterForm({
  form,
  handleChange,
  handleSubmit,
  success,
  isPromotor,
  stores,
  selectedStore,
  setSelectedStore,
  loadingStores,
}: Props) {
  const showStoreSelect = isPromotor && !selectedStore;

  if (showStoreSelect) {
    return (
      <div className="w-full flex flex-col items-center gap-4 px-4 md:px-12 mt-10">
        {loadingStores ? (
          <CircularProgress color="info" />
        ) : (
          <Box className="w-full max-w-lg mt-4">
            <Autocomplete
              options={stores}
              getOptionLabel={(option) => option.name}
              onChange={(_, value) => setSelectedStore(value?._id || "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Selecciona una tienda"
                  variant="outlined"
                  fullWidth
                  sx={{
                    maxWidth: "32rem",
                    backgroundColor: "white",
                    borderRadius: 2,
                    fontSize: "1.5rem",
                  }}
                />
              )}
            />
          </Box>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col items-center gap-4 px-2 md:px-12"
    >
      <h1 className="text-white text-center leading-tight text-5xl md:text-6xl font-light">
        Participate &<br />
        <span className="text-[#08C7F7] font-bold text-5xl md:text-6xl">
          Win a Car!
        </span>
      </h1>

      <input
        type="tel"
        name="phone"
        placeholder="(555) 123-4567"
        value={form.phone}
        onChange={handleChange}
        required
        className="rounded-[40px] border text-xl md:text-2xl bg-white px-6 py-3 w-full max-w-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#08C7F7] focus:border-transparent"
      />

      <button
        type="submit"
        className="bg-[#08C7F7] hover:bg-[#08C7F795] text-white rounded-full px-6 py-3 font-bold text-xl md:text-2xl w-full max-w-lg"
      >
        Submit
      </button>

      {success && (
        <Typography className="text-center text-green-400 font-medium animate-bounce">
          🎉 You are successfully registered!
        </Typography>
      )}
    </form>
  );
}
