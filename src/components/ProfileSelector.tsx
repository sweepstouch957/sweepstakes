/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Avatar,
  IconButton,
  Slider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useAuth } from "@/lib/context/auth";
import { useUpdateProfile, useUploadPhoto } from "@/hooks/usePromoterData";
import { getCroppedImg } from "@/lib/utils/getCropImage";

interface ProfileSelectorProps {
  open: boolean;
  onClose: () => void;
  onProfileSelected: (profileImage: string) => void;
}

export default function ProfileSelector({
  open,
  onClose,
  onProfileSelected,
}: ProfileSelectorProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);

  const uploadPhotoMutation = useUploadPhoto();
  const updateProfileMutation = useUpdateProfile();

  const isLoading =
    uploadPhotoMutation.isPending || updateProfileMutation.isPending;

  const onCropComplete = useCallback(
    (_croppedArea: any, croppedPixels: any) => {
      setCroppedAreaPixels(croppedPixels);
    },
    []
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Archivo inválido");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar los 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const cropped = await getCroppedImg(imageSrc, croppedAreaPixels);
    setCroppedImage(cropped);
    setCropModalOpen(false);
  };

  const handleConfirm = async () => {
    if (!user || !croppedImage) return;

    try {
      const blob = await fetch(croppedImage).then((res) => res.blob());
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });

      const uploadResult = await uploadPhotoMutation.mutateAsync(file);
      if (uploadResult.url) {
        await updateProfileMutation.mutateAsync({
          userId: user._id || user.id,
          updates: {
            profileImage: uploadResult.url,
            isFirstLogin: false,
          },
        });

        onProfileSelected(uploadResult.url);
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError("Error al subir la imagen");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle>Elige tu foto</DialogTitle>
        <DialogContent>
          {error && (
            <Alert
              severity="error"
              onClose={() => setError(null)}
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}

          <Stack spacing={2} alignItems="center">
            <Stack direction="column" spacing={2} width="100%">
              {/* Botón para abrir galería */}
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                component="label"
                disabled={isLoading}
              >
                Subir desde galería
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileSelect}
                />
              </Button>

              {/* Botón para abrir cámara directamente */}
              <Button
                variant="contained"
                color="secondary"
                startIcon={<PhotoCamera />}
                component="label"
                disabled={isLoading}
              >
                Tomar con cámara
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  hidden
                  onChange={handleFileSelect}
                />
              </Button>
            </Stack>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileSelect}
            />

            {croppedImage && (
              <Box position="relative">
                <Avatar
                  src={croppedImage}
                  sx={{ width: 80, height: 80, border: "3px solid #e91e63" }}
                />
                <IconButton
                  size="small"
                  onClick={() => setCroppedImage(null)}
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    bgcolor: "#fff",
                    border: "1px solid #ccc",
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={!croppedImage || isLoading}
          >
            {isLoading ? (
              <CircularProgress size={20} sx={{ color: "#fff" }} />
            ) : (
              "Confirmar"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Crop Dialog */}
      <Dialog
        open={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Recorta tu imagen</DialogTitle>
        <DialogContent>
          {imageSrc && (
            <Box position="relative" width="100%" height={300}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </Box>
          )}
          <Box mt={2} px={2}>
            <Typography gutterBottom>Zoom</Typography>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(_, value) => setZoom(value as number)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCropModalOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCropConfirm}>
            Confirmar recorte
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
