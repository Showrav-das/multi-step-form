"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PersonalInfoStep } from "./onboarding-steps/personal-info-step"
import { JobDetailsStep } from "./onboarding-steps/job-details-step"
import { SkillsPreferencesStep } from "./onboarding-steps/skills-preferences-step"
import { EmergencyContactStep } from "./onboarding-steps/emergency-contact-step"
import { ReviewSubmitStep } from "./onboarding-steps/review-submit-step"
import { useToast } from "@/hooks/use-toast"

export interface FormData {
    // Personal Info
    fullName: string
    email: string
    phone: string
    dateOfBirth: string
    profilePicture: File | null

    // Job Details
    department: string
    position: string
    startDate: string
    jobType: "full-time" | "part-time" | "contract"
    salary: string
    manager: string

    // Skills & Preferences
    skills: Array<{ skill: string; experience: string }>
    workingHours: { start: string; end: string }
    remotePreference: number
    managerApproved: boolean
    notes: string

    // Emergency Contact
    emergencyContact: {
        name: string
        relationship: string
        phone: string
    }
    guardianContact?: {
        name: string
        phone: string
    }

    confirmed?: boolean
}

const initialFormData: FormData = {
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    profilePicture: null,
    department: "",
    position: "",
    startDate: "",
    jobType: "full-time",
    salary: "",
    manager: "",
    skills: [],
    workingHours: { start: "09:00", end: "17:00" },
    remotePreference: 0,
    managerApproved: false,
    notes: "",
    emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
    },
    confirmed: false,
}

const steps = [
    { id: 1, title: "Personal Info", description: "Basic personal information" },
    { id: 2, title: "Job Details", description: "Position and department details" },
    { id: 3, title: "Skills & Preferences", description: "Skills and work preferences" },
    { id: 4, title: "Emergency Contact", description: "Emergency contact information" },
    { id: 5, title: "Review & Submit", description: "Review and confirm details" },
]

export function EmployeeOnboardingForm() {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<FormData>(initialFormData)
    const [stepValidation, setStepValidation] = useState<Record<number, boolean>>({})
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const { toast } = useToast()

    // Auto-save to localStorage
    useEffect(() => {
        const savedData = localStorage.getItem("employee-onboarding-form")
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData)
                setFormData(parsed)
            } catch (error) {
                console.error("Failed to parse saved form data:", error)
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("employee-onboarding-form", JSON.stringify(formData))
        setHasUnsavedChanges(true)
    }, [formData])

    // Warn before leaving with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault()
                e.returnValue = ""
            }
        }

        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => window.removeEventListener("beforeunload", handleBeforeUnload)
    }, [hasUnsavedChanges])

    const updateFormData = (updates: Partial<FormData>) => {
        setFormData((prev) => ({ ...prev, ...updates }))
    }

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                const phoneDigits = formData.phone.replace(/\D/g, "")
                const isPhoneValid = phoneDigits.length === 11 && phoneDigits.startsWith("1")

                return !!(
                    formData.fullName.trim().split(" ").length >= 2 &&
                    formData.email.includes("@") &&
                    isPhoneValid &&
                    formData.dateOfBirth &&
                    calculateAge(formData.dateOfBirth) >= 18
                )
            case 2:
                return !!(
                    formData.department &&
                    formData.position.length >= 3 &&
                    formData.startDate &&
                    formData.manager &&
                    formData.salary
                )
            case 3:
                return formData.skills.length >= 3
            case 4:
                const emergencyValid = !!(
                    formData.emergencyContact.name &&
                    formData.emergencyContact.relationship &&
                    formData.emergencyContact.phone
                )
                const guardianValid =
                    calculateAge(formData.dateOfBirth) >= 21 ||
                    (formData.guardianContact?.name && formData.guardianContact?.phone)
                return emergencyValid && guardianValid
            case 5:
                return formData.confirmed || false
            default:
                return false
        }
    }

    const calculateAge = (dateOfBirth: string): number => {
        if (!dateOfBirth) return 0
        const today = new Date()
        const birthDate = new Date(dateOfBirth)
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age
    }

    const handleNext = () => {
        const isValid = validateStep(currentStep)
        setStepValidation((prev) => ({ ...prev, [currentStep]: isValid }))

        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, 5))
        } else {
            toast({
                title: "Validation Error",
                description: "Please complete all required fields correctly before proceeding.",
                variant: "destructive",
            })
        }
    }

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1))
    }

    const handleSubmit = () => {
        // Transform data before submission
        const transformedData = {
            ...formData,
            phone: formData.phone.replace(/\D/g, ""), // Remove formatting
            salary: Number.parseFloat(formData.salary),
            age: calculateAge(formData.dateOfBirth),
            isMinor: calculateAge(formData.dateOfBirth) < 21,
        }

        console.log("Submitting transformed data:", transformedData)
        localStorage.removeItem("employee-onboarding-form")
        setHasUnsavedChanges(false)

        toast({
            title: "Success!",
            description: "Your onboarding form has been submitted successfully.",
        })
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <PersonalInfoStep formData={formData} updateFormData={updateFormData} />
            case 2:
                return <JobDetailsStep formData={formData} updateFormData={updateFormData} />
            case 3:
                return <SkillsPreferencesStep formData={formData} updateFormData={updateFormData} />
            case 4:
                return <EmergencyContactStep formData={formData} updateFormData={updateFormData} />
            case 5:
                return <ReviewSubmitStep formData={formData} updateFormData={updateFormData} />
            default:
                return null
        }
    }

    const progress = (currentStep / steps.length) * 100

    return (
        <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                        Step {currentStep} of {steps.length}
                    </span>
                    <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            {/* Step Indicators */}
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

            {/* Form Content */}
            <Card>
                <CardHeader>
                    <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                </CardHeader>
                <CardContent>{renderStep()}</CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                    Previous
                </Button>

                {currentStep < 5 ? (
                    <Button onClick={handleNext}>Next</Button>
                ) : (
                    <Button onClick={handleSubmit}>Submit Application</Button>
                )}
            </div>
        </div>
    )
}
