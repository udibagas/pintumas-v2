export interface RegulationData {
  id: string;
  title: string;
  content: string;
  departmentId?: string | null;
  attachmentUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  department?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface DepartmentData {
  id: string;
  name: string;
  slug: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface RegulationsResponse {
  success: boolean;
  data: RegulationData[];
  pagination: PaginationData;
}
