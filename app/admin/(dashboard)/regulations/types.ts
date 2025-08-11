export interface RegulationData {
  id: string;
  number: string;
  title: string;
  description?: string | null;
  effectiveDate?: Date | null;
  departmentId?: string | null;
  attachmentUrl?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: Date;
  updatedAt: Date;
  department?: DepartmentData | null;
}

export interface DepartmentData {
  id: string;
  name: string;
  slug: string;
}
