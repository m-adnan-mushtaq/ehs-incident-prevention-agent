import DetailsPreview from "@/components/shared/details-preview";
import { IVendor } from "@/services/governance/vendor.service";
import {
  VendorClassificationChip,
  VendorComplianceChip,
  VendorRiskLevelChip,
} from "./columnDef";
import { formatDate } from "@/helpers/common";

const VendorDetails = ({ vendor }: { vendor: IVendor }) => {
  return (
    <div className="w-[80vw] max-w-screen-sm">
      <DetailsPreview
        columns={[
          {
            label: "Name",
            value: vendor.name,
          },
          {
            label: "Description",
            value: vendor.description,
          },
          {
            label: "Risk Level",
            value: <VendorRiskLevelChip level={vendor.risk_level} />,
          },
          {
            label: "Compliance Status",
            value: <VendorComplianceChip status={vendor.compliance_status} />,
          },
          {
            label: "Classification",
            value: <VendorClassificationChip value={vendor.classfication} />,
          },
          {
            label: "Access Required",
            value: vendor.access_required ? "Yes" : "No",
          },
          {
            label: "Start Date",
            value: formatDate(vendor.start_date),
          },
          {
            label: "End Date",
            value: formatDate(vendor.end_date),
          },
        ]}
      />
    </div>
  );
};

export default VendorDetails;
