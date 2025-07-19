import { Category } from "@prisma/client";

export interface CategoryWithPostCount extends Category {
  _count: {
    posts: number;
  };
}
