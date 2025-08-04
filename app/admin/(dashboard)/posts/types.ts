import {
  Post,
  User,
  Department as PrismaDepartment,
  Apps,
} from "@prisma/client";

export type { Post };

export interface PostWithRelations extends Post {
  author: {
    id: string;
    name: string;
    email: string;
  };
  department?: PrismaDepartment | null;
  app?: Apps | null;
  _count: {
    comments: number;
  };
}

export interface Department {
  id: string;
  name: string;
  slug: string;
}

export interface App {
  id: string;
  name: string;
  iconUrl?: string | null;
  link?: string | null;
  description?: string | null;
}
