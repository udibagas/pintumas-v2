import { useCrudStore } from "@/store/crudStore";
import type { Apps } from "@prisma/client";

export const appsStore = useCrudStore<Apps>("/api/admin/apps");
