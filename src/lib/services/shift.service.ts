import apiClient from "../http/config";

export interface ShiftStats {
  totalParticipants: number;
  todayParticipants: number;
  avgPerHour: number;
}

export interface ShiftResponse {
  shift: {
    _id: string;
    promoterId: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    };
    storeId: string;
    startTime: string;
    endTime: string;
    status: string;
    storeInfo?: {
      name: string;
      address: string;
    };
  } | null;
  stats: ShiftStats;
}

export const getActiveShift = async (promoterId: string): Promise<ShiftResponse> => {
  try {
    const res = await apiClient.get(`/shifts/active/${promoterId}`);
    return res.data;
  } catch (error: unknown) {
    // Si no hay turno activo, el backend retorna 200 con shift: null
    const axiosError = error as { response?: { status?: number; data?: { shift?: null } } };
    if (axiosError.response?.status === 404 || axiosError.response?.data?.shift === null) {
      return {
        shift: null,
        stats: {
          totalParticipants: 0,
          todayParticipants: 0,
          avgPerHour: 0,
        },
      };
    }
    throw error;
  }
};