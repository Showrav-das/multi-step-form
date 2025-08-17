import React from 'react'
import { Progress } from '../ui/progress'

interface Step {
    id: number
    title: string
    description: string
}

interface StepperProps {
    currentStep: number;
    steps: Step[];
    progress: number;
}

export default function Stepper({ currentStep, steps, progress }: StepperProps) {
    return (
        <>
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                        Step {currentStep} of {steps.length}
                    </span>
                    <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>
            <div className="flex justify-between">
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className={`flex flex-col items-center space-y-2 ${step.id <= currentStep ? "text-primary" : "text-muted-foreground"
                            }`}
                    >
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step.id < currentStep
                                ? "bg-primary text-primary-foreground"
                                : step.id === currentStep
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                }`}
                        >
                            {step.id < currentStep ? "✓" : step.id}
                        </div>
                        <div className="text-center">
                            <div className="text-xs font-medium">{step.title}</div>
                            <div className="text-xs hidden sm:block">{step.description}</div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
