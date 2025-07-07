import axios from "axios";
import { create } from "zustand";

interface CrudStore<T> {
  items: T[];
  loading: boolean;
  item?: T;
  isFormOpen: boolean;
  isDeleteConfirmOpen: boolean;
  setItems: (items: T[]) => void;
  setLoading: (loading: boolean) => void;
  setItem: (item?: T) => void;
  setIsFormOpen: (isFormOpen: boolean) => void;
  setIsDeleteConfirmOpen: (isOpen: boolean) => void;
  fetchItems: () => Promise<void>;
  createItem: (itemData: Record<string, any>) => Promise<void>;
  updateItem: (id: string | number, itemData: Record<string, any>) => Promise<void>;
  deleteItem: (id: string | number) => Promise<void>;
}

export const useCrudStore = <T extends { id?: number | string }>(
  url: string
) => {
  return create<CrudStore<T>>((set, get) => ({
    items: [],
    loading: true,
    item: undefined,
    isFormOpen: false,
    isDeleteConfirmOpen: false,

    setItems: (items: T[]) => set({ items }),
    setLoading: (loading: boolean) => set({ loading }),
    setItem: (item?: T) => set({ item }),
    setIsFormOpen: (isFormOpen: boolean) => set({ isFormOpen }),
    setIsDeleteConfirmOpen: (isOpen: boolean) => set({ isDeleteConfirmOpen: isOpen }),

    fetchItems: async () => {
      try {
        set({ loading: true });
        const { data } = await axios.get(url);
        set({ items: data.data });
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        set({ loading: false });
      }
    },

    createItem: async (itemData) => {
      try {
        await axios.post(url, itemData);
        set({ isFormOpen: false, item: undefined });
        await get().fetchItems();
      } catch (error) {
        console.error("Error creating item:", error);
        throw error;
      }
    },

    updateItem: async (id: string | number, itemData) => {
      try {
        await axios.put(`${url}/${id}`, itemData);
        set({ isFormOpen: false, item: undefined });
        await get().fetchItems();
      } catch (error) {
        console.error("Error updating item:", error);
        throw error;
      }
    },

    deleteItem: async (id: string | number) => {
      console.log("Deleting item with ID:", id);
      try {
        await axios.delete(`${url}/${id}`);
        set({ isDeleteConfirmOpen: false });
        await get().fetchItems();
      } catch (error) {
        console.error("Error deleting item:", error);
        throw error;
      }
    },
  }));
};
