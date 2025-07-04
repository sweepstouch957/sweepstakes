/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "../http/config";

export interface CreateParticipantPayload {
  sweepstakeId: string;
  customerPhone: string;
  customerName: string;
  storeId: string;
  method: string;
  createdBy: string;
}

export const createSweepstake = async (data: CreateParticipantPayload) => {
  try {
    const res = await apiClient.post(
      "/sweepstakes/participants/register",
      data
    );
    return res.data;
  } catch (error: any) {
    // Puedes personalizar este mensaje o lanzar uno genérico
    const message =
      error?.response?.data?.error || "Error al registrar participante";
    console.error("❌ createSweepstake error:", message);

    return Promise.reject(message);
  }
};

interface CreateDefaultParticipantPayload extends CreateParticipantPayload {
  zipCode: string;
}

export const createSweepstakeDefault = async (
  data: CreateDefaultParticipantPayload
) => {
  try {
    const res = await apiClient.post(
      "/sweepstakes/participants/register",
      data
    );
    return res.data;
  } catch (error: any) {
    // Puedes personalizar este mensaje o lanzar uno genérico
    const message =
      error?.response?.data?.error || "Error al registrar participante";
    console.error("❌ createSweepstake error:", message);

    return Promise.reject(message);
  }
};
