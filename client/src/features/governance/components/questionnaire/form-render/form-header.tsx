"use client";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface AdaptiveFormHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  steps?: string[];
  showStepIndicators?: boolean;
}

export default function AdaptiveFormHeader({
  currentStep = 1,
  totalSteps = 1,
  title = "Form Title",
  steps = [],
  showStepIndicators = true,
}: AdaptiveFormHeaderProps) {
  // If steps aren't provided but totalSteps is, generate generic step names
  const stepLabels =
    steps.length > 0
      ? steps
      : Array.from({ length: totalSteps }, (_, i) => `Step ${i + 1}`);

  // Determine if we should show the step indicators based on prop and number of steps
  const shouldShowStepIndicators = showStepIndicators && totalSteps > 1;

  return (
    <div className="w-full bg-white border-b p-5">
      <div className="flex flex-col space-y-4">
        {/* Title and page indicator */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          {totalSteps > 1 && (
            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
              {currentStep} of {totalSteps}
            </span>
          )}
        </div>

        {/* Progress bar - only show for multi-step forms */}
        {totalSteps > 1 && (
          <div className="relative">
            <div className="overflow-hidden h-1.5 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-300"
              ></div>
            </div>
          </div>
        )}

        {/* Step indicators - only show if explicitly enabled and there are multiple steps */}
        {shouldShowStepIndicators && (
          <div className="flex mt-2 overflow-x-auto p-2 hide-scrollbar">
            {stepLabels
              .slice(0, Math.min(stepLabels.length, 7))
              .map((step, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center mr-4 last:mr-0",
                    index + 1 > 7 && "hidden md:flex"
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 flex items-center justify-center rounded-full mr-2 text-xs transition-all",
                      index + 1 < currentStep
                        ? "bg-primary text-white"
                        : index + 1 === currentStep
                        ? "bg-primary text-white ring-2 ring-primary/50"
                        : "bg-gray-200 text-gray-600"
                    )}
                  >
                    {index + 1 < currentStep ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs whitespace-nowrap",
                      index + 1 === currentStep
                        ? "text-gray-800 font-medium"
                        : "text-gray-500"
                    )}
                  >
                    {step}
                  </span>
                </div>
              ))}

            {/* If there are more than 7 steps, show a count of remaining steps */}
            {stepLabels.length > 7 && (
              <div className="flex items-center text-xs text-gray-500">
                <span className="bg-gray-200 text-gray-600 w-6 h-6 rounded-full flex items-center justify-center mr-2">
                  +{stepLabels.length - 7}
                </span>
                <span className="hidden md:inline">more steps</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
