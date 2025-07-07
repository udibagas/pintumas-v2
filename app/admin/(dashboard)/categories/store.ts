import { useCrudStore } from "@/store/crudStore";
import { Category } from "@prisma/client";

export interface CategoryWithPostCount extends Category {
  _count: {
    posts: number;
  };
}

export const useStore = useCrudStore<CategoryWithPostCount>(
  "/api/admin/categories"
);

export type CategoryStore = typeof useStore;
