import { useCrudStore } from "@/store/crudStore";

export interface Department {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  link?: string;
  createdAt: string;
  updatedAt: string;
}

export const departmentStore = useCrudStore<Department>(
  "/api/admin/departments"
);
