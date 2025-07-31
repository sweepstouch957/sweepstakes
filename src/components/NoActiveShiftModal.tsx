"use client";

import { Modal, Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface NoActiveShiftModalProps {
  open: boolean;
  onClose: () => void;
}

export const NoActiveShiftModal: FC<NoActiveShiftModalProps> = ({ open, onClose }) => {
  const router = useRouter();

  const handleApplyClick = () => {
    router.push("/apply"); // Ajusta la ruta según tu aplicación
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="no-shift-modal-title"
      aria-describedby="no-shift-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 400 },
          bgcolor: "background.paper",
          border: "2px solid #1976d2",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography
          id="no-shift-modal-title"
          variant="h6"
          component="h2"
          sx={{ mb: 2, color: "#d32f2f" }}
        >
          Sin Turno Activo
        </Typography>
        
        <Typography
          id="no-shift-modal-description"
          sx={{ mb: 3, color: "text.secondary" }}
        >
          No tienes un turno activo en este momento. Para poder registrar participaciones, necesitas tener un turno asignado.
        </Typography>
        
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApplyClick}
            sx={{
              borderRadius: "20px",
              px: 3,
            }}
          >
            Aplicar para Turno
          </Button>
          
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderRadius: "20px",
              px: 3,
            }}
          >
            Cerrar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};