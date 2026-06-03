import { z } from "zod";
import { numberSchema, stringSchema } from "./_base";
import {
  IVendorClassification,
  IVendorComplianceStatus,
  IVendorRiskLevel,
} from "@/services/governance/vendor.service";

export const vendorSchema = z
  .object({
    name: stringSchema("Vendor name", 3, 50),
    description: stringSchema("Vendor description", 3, 1000),
    department: numberSchema("Vendor department", 1),
    contact_person: numberSchema("Vendor contact person", 1),
    risk_level: z.nativeEnum(IVendorRiskLevel),
    compliance_status: z.nativeEnum(IVendorComplianceStatus),
    start_date: z.date(),
    end_date: z.date(),
    access_required: z.boolean(),
    classfication: z.nativeEnum(IVendorClassification),
  })
  .superRefine((data, ctx) => {
    if (data.end_date <= data.start_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["contract_end_date"],
        message: "Contract end date must be greater than the start date.",
      });
    }
  });

export type IVendorSchema = z.infer<typeof vendorSchema>;
