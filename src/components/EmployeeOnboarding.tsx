"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import {
    emergencyContactSchema,
    jobDetailsSchema,
    personalInfoSchema,
    reviewSubmitSchema,
    skillsPreferencesSchema,
    type FormData,
} from "@/lib/validateSchemas"
import { toast } from "sonner"
import { EmergencyContactStep } from "./CustomComponent/ContactInformation"
import { JobDetailsStep } from "./CustomComponent/JobDetailsForm"
import { PersonalInfoStep } from "./CustomComponent/PersonalInfoForm"
import { ReviewSubmitStep } from "./CustomComponent/Review&FinalSubmit"
import { SkillsPreferencesStep } from "./CustomComponent/SkillPeference"
import Stepper from "./CustomComponent/Stepper"




const completeFormSchema = personalInfoSchema
    .merge(jobDetailsSchema)
    .merge(skillsPreferencesSchema)
    .merge(emergencyContactSchema)
    .merge(reviewSubmitSchema)

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
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [formData, setFormData] = useState<FormData>(initialFormData)

    const form = useForm<FormData>({
        resolver: zodResolver(completeFormSchema),
        defaultValues: formData,
        // mode: "onChange",
    })

    const { watch, trigger } = form

    const formValues = watch()



    useEffect(() => {
        setFormData((prev) => {
            // shallow compare to avoid unnecessary updates
            if (JSON.stringify(prev) !== JSON.stringify(formValues)) {
                return formValues
            }
            return prev
        })
    }, [formValues])
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

    const validateStep = async (step: number): Promise<boolean> => {
        const fieldsToValidate = getFieldsForStep(step)
        const isValid = await trigger(fieldsToValidate)

        if (!isValid) {
            const errors = form.formState.errors
            const firstError = Object.values(errors)[0]
            if (firstError?.message) {
                toast('validation error')
            }
        }

        return isValid
    }

    const getFieldsForStep = (step: number): (keyof FormData)[] => {
        switch (step) {
            case 1:
                return ["fullName", "email", "phone", "dateOfBirth"]
            case 2:
                return ["department", "position", "startDate", "jobType", "salary", "manager"]
            case 3:
                return ["skills", "workingHours", "remotePreference"]
            case 4:
                return ["emergencyContact"]
            case 5:
                return ["confirmed"]
            default:
                return []
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

    const handleNext = async () => {
        const isValid = await validateStep(currentStep)
        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, 5))
        }
    }

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1))
    }

    const onSubmit = (data: FormData) => {
        const transformedData = {
            ...data,
            phone: (data.phone ?? "").replace(/\D/g, ""),
            salary: Number.parseFloat(data.salary),
            age: calculateAge(data.dateOfBirth),
            isMinor: calculateAge(data.dateOfBirth) < 21,
        }

        console.log("Submitting transformed data:", transformedData)
        localStorage.removeItem("employee-onboarding-form")
        setHasUnsavedChanges(false)

        toast("Your onboarding form has been submitted successfully.")
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <PersonalInfoStep form={form} />
            case 2:
                return <JobDetailsStep form={form} />
            case 3:
                return <SkillsPreferencesStep form={form} />
            case 4:
                return <EmergencyContactStep form={form} />
            case 5:
                return <ReviewSubmitStep form={form} />
            default:
                return null
        }
    }

    const progress = (currentStep / steps.length) * 100

    return (
        <div className="space-y-3 max-w-6xl mx-auto my-12">
            {/* /stepper */}
            <Stepper currentStep={currentStep} progress={progress} steps={steps} />
            {/* form render */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                        </CardHeader>
                        <CardContent>{renderStep()}</CardContent>
                    </Card>

                    <div className="flex justify-between mt-6">
                        <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                            Previous
                        </Button>

                        {currentStep < 5 ? (
                            <Button type="button" onClick={handleNext}>
                                Next
                            </Button>
                        ) : (
                            <Button type="submit">Submit Application</Button>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    )
}
