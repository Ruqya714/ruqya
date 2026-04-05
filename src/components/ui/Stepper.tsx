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
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className={`flex items-center ${!isLast ? "flex-1" : ""}`}>
              {/* Step circle */}
              <div className="flex flex-col items-center flex-shrink-0 w-10 relative">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold relative z-10
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
                
                {/* Text underneath circle */}
                <span
                  className={`
                    absolute top-full mt-2 text-[11px] sm:text-xs font-medium whitespace-nowrap
                    ${index === 0 ? "right-0 sm:-mr-4 sm:right-1/2 sm:translate-x-1/2" : index === steps.length - 1 ? "left-0 sm:-ml-4 sm:left-1/2 sm:-translate-x-1/2" : "left-1/2 -translate-x-1/2"}
                    ${isCurrent ? "text-primary" : isCompleted ? "text-text-primary" : "text-text-secondary"}
                  `}
                >
                  {step}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 mx-2 sm:mx-3 h-[2px] relative z-0">
                  <div
                    className={`
                      w-full h-full rounded-full transition-all duration-500
                      ${isCompleted ? "bg-primary" : "bg-border"}
                    `}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Spacer to prevent absolute text from overlapping content below */ }
      <div className="h-6 mt-1" />
    </div>
  );
}
