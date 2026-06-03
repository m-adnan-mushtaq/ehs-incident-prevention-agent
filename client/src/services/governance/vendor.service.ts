import { apiRoutes } from "@/constants";
import { apiInstance } from "../_base";
import { IVendorSchema } from "@/lib/validation/vendor.validation";

export enum IVendorRiskLevel {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export enum IVendorClassification {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export enum IVendorComplianceStatus {
  MEET_REQUIREMENTS = "MEET_REQUIREMENTS",
  REJECTED = "REJECTED",
}

export interface IVendor {
  id: string;
  pkid: number;
  department: number;
  contact_person: number;
  name: string;
  description: string;
  risk_level: IVendorRiskLevel;
  compliance_status: IVendorComplianceStatus;
  start_date: Date;
  end_date: Date;
  access_required: boolean;
  classfication: IVendorClassification;
  created_at: Date;
  updated_at: Date;
}

export const vendorRiskLevelOptions = [
  {
    label: "High",
    value: IVendorRiskLevel.HIGH,
  },
  {
    label: "Medium",
    value: IVendorRiskLevel.MEDIUM,
  },
  {
    label: "Low",
    value: IVendorRiskLevel.LOW,
  },
];

export const vendorClassificationOptions = [
  {
    label: "Public",
    value: IVendorClassification.PUBLIC,
  },
  {
    label: "Private",
    value: IVendorClassification.PRIVATE,
  },
];

export const vendorComplianceStatusOptions = [
  {
    label: "Meet Requirements",
    value: IVendorComplianceStatus.MEET_REQUIREMENTS,
  },
  {
    label: "Rejected",
    value: IVendorComplianceStatus.REJECTED,
  },
];

export const getAllRecords = () => {
  return apiInstance.get<IVendor[]>(apiRoutes.VENDOR.getAll());
};

export const getRecordById = (id: string) => {
  return apiInstance.get<IVendor>(apiRoutes.VENDOR.getById(id));
};

export const createRecord = (payload: IVendorSchema) => {
  return apiInstance.post<IVendor>(apiRoutes.VENDOR.createNew(), payload);
};

export const updateRecordById = ({
  id,
  payload,
}: {
  id: string;
  payload: IVendorSchema;
}) => {
  return apiInstance.put<IVendor>(apiRoutes.VENDOR.updateById(id), payload);
};

export const deleteRecordById = (id: string) => {
  return apiInstance.delete(apiRoutes.VENDOR.deleteById(id));
};
