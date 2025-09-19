/* eslint-disable @typescript-eslint/no-explicit-any */
import { updateProfile, uploadPhoto } from "@/lib/services/auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUploadPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadPhoto(file),
    onSuccess: () => {
      // Invalidar datos del usuario para refrescar la foto
      queryClient.invalidateQueries({
        queryKey: ["auth", "user"],
      });
    },
  });
};

export const useUpdateProfile = () =>   {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: any }) =>
      updateProfile(userId, updates),
    onSuccess: (data) => {
      // Actualizar el usuario en cache
      queryClient.setQueryData(["auth", "user"], data);
    },
  });
};