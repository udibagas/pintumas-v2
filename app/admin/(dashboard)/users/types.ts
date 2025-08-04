import { User, Department } from "@prisma/client";

export type { User };

export interface UserWithCounts extends User {
  _count: {
    posts: number;
    comments: number;
  };
  department?: Department | null;
}
