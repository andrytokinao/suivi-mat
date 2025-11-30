import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMaterials, getMaterialById, deleteMaterial, createMaterial, updateMaterial } from "./material.api";

export const useMaterials = () =>
    useQuery({
        queryKey: ["materials"],
        queryFn: getMaterials
    });

export const useMaterial = (id: number) =>
    useQuery({
        queryKey: ["materials", id],
        queryFn: () => getMaterialById(id)
    });

export const useCreateMaterial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createMaterial,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["materials"] });
        }
    });
};

export const useUpdateMaterial = (id: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => updateMaterial(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["materials"] });
            queryClient.invalidateQueries({ queryKey: ["materials", id] });
        }
    });
};

export const useDeleteMaterial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteMaterial,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materials"] })
    });
};
