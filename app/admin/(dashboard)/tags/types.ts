import { Tag } from "@prisma/client";

export interface TagWithPostCount extends Tag {
  _count: {
    posts: number;
  };
}
