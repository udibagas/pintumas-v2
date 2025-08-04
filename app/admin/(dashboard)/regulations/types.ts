export interface RegulationData {
  id: string;
  title: string;
  content: string;
  departmentId?: string | null;
  attachmentUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  department?: DepartmentData | null;
}

export interface DepartmentData {
  id: string;
  name: string;
  slug: string;
}
