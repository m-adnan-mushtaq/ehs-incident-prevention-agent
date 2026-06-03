import { type LucideIcon } from "lucide-react";

type Props = {
  step: number;
  totalSteps: number;
  steps: {
    label: string;
    Icon: LucideIcon;
  }[];
};

const StepsWizard = ({ step, totalSteps, steps }: Props) => {
  return (
    <div className="relative">
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
        <div
          style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
        ></div>
      </div>
      <div className="flex text-xs justify-between">
        {steps.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col items-center ${
              step === index ? "text-primary " : "text-gray-400"
            }`}
          >
            <div
              className={`rounded-full h-8 w-8 flex items-center justify-center mb-1 ${
                step >= index
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              <item.Icon size={16} />
            </div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepsWizard;
