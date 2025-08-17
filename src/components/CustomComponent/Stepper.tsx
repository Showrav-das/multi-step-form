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
        <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                    Step {currentStep} of {steps.length}
                </span>
                <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
        </div>
    )
}
