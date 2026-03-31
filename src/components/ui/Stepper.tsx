import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export default function Stepper({
  steps,
  currentStep,
  className = "",
}: StepperProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={index} className="flex-1 flex items-center">
              {/* Step circle */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                    transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-primary text-white shadow-md"
                        : isCurrent
                          ? "bg-primary text-white shadow-lg ring-4 ring-primary/20"
                          : "bg-gray-100 text-text-secondary border-2 border-border"
                    }
                  `}
                >
                  {isCompleted ? <Check size={18} /> : index + 1}
                </div>
                <span
                  className={`
                    mt-2 text-xs font-medium text-center max-w-[80px]
                    ${isCurrent ? "text-primary" : isCompleted ? "text-text-primary" : "text-text-secondary"}
                  `}
                >
                  {step}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 mt-[-20px]">
                  <div
                    className={`
                      h-0.5 rounded-full transition-all duration-500
                      ${isCompleted ? "bg-primary" : "bg-border"}
                    `}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
