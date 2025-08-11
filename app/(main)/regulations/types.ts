export interface RegulationData {
  id: string;
  number: string;
  title: string;
  description?: string | null;
  effectiveDate?: string | null;
  departmentId?: string | null;
  attachmentUrl?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
  department?: DepartmentData | null;
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
