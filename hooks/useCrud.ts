import { create, deleteById, getAll, updateById } from "../lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export const useCrud = <T extends { id?: number | string }>(
  endpoint: string
) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [editingData, setEditingData] = useState<
    Record<string, any> | undefined
  >(undefined);

  function useFetch<D = T[]>(params: Record<string, any> = {}) {
    return useQuery({
      queryKey: [endpoint, params],
      queryFn: () => getAll<D>(endpoint, params),
      staleTime: 60 * 1000 * 10, // 10 minutes
    });
  }

  function refreshData() {
    queryClient.invalidateQueries({ queryKey: [endpoint] });
  }

  const createMutation = useMutation({
    mutationFn: (data: Record<string, any>) => create(endpoint, data),
    onSuccess: () => {
      toast.success("Data created successfully");
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      setModalOpen(false);
      setEditingData(undefined);
    },
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create data");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: Record<string, any>;
    }) => updateById(endpoint, id, data),
    onSuccess: () => {
      toast.success("Data updated successfully");
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      setModalOpen(false);
      setEditingData(undefined);
    },
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update user");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => deleteById(endpoint, id),
    onSuccess: () => {
      toast.success("Data deleted successfully");
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete data");
    },
  });

  const handleSubmit = async (values: Record<string, any>) => {
    if (editingData) {
      updateMutation.mutate({ id: editingData.id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleAdd = () => {
    setEditingData(undefined);
    setModalOpen(true);
  };

  const handleEdit = (data: Record<string, any>) => {
    setEditingData(data);
    setModalOpen(true);
  };

  const handleDelete = (id: string | number) => {
    deleteMutation.mutate(id);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingData(undefined);
  };

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    modalOpen,
    editingData,
    queryClient,
    isDeleteConfirmOpen,
    isSubmitting,
    useFetch,
    setModalOpen,
    setEditingData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleModalClose,
    refreshData,
    setDeleteConfirmOpen,
    setIsSubmitting,
  };
};

export type UseCrudType = ReturnType<typeof useCrud>;
