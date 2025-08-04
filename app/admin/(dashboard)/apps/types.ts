import { Apps, Department, DepartmentApps } from "@prisma/client";

export interface AppsData extends Apps {
  DepartmentApps?: (DepartmentApps & {
    department: Department;
  })[];
}

// For compatibility, alias to departments
export interface AppsDataWithDepartments
  extends Omit<AppsData, "DepartmentApps"> {
  departments?: (DepartmentApps & {
    department: Department;
  })[];
}

export interface DepartmentData {
  id: string;
  name: string;
  slug: string;
}
