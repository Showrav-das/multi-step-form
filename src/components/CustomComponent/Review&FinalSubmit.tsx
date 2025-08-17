"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormControl } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FormData } from "@/lib/validateSchemas"

interface ReviewSubmitStepProps {
    form: UseFormReturn<FormData>
}

export function ReviewSubmitStep({ form }: ReviewSubmitStepProps) {
    const formData = form.watch()

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

    const formatSalary = (salary: string, jobType: string) => {
        const amount = Number.parseFloat(salary)
        if (jobType === "full-time") {
            return `$${amount.toLocaleString()} annually`
        } else if (jobType === "contract") {
            return `$${amount}/hour`
        }
        return `$${amount}`
    }

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Review Your Information</h2>
                <p className="text-muted-foreground">Please review all details before submitting</p>
            </div>

            {/* Personal Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <strong>Full Name:</strong> {formData.fullName}
                        </div>
                        <div>
                            <strong>Email:</strong> {formData.email}
                        </div>
                        <div>
                            <strong>Phone:</strong> {formData.phone}
                        </div>
                        <div>
                            <strong>Date of Birth:</strong> {formData.dateOfBirth} (Age: {calculateAge(formData.dateOfBirth)})
                        </div>
                        <div>
                            <strong>Profile Picture:</strong>{" "}
                            {formData.profilePicture ? formData.profilePicture.name : "Not uploaded"}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Job Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <strong>Department:</strong> {formData.department}
                        </div>
                        <div>
                            <strong>Position:</strong> {formData.position}
                        </div>
                        <div>
                            <strong>Start Date:</strong> {formData.startDate}
                        </div>
                        <div>
                            <strong>Job Type:</strong> {formData.jobType.charAt(0).toUpperCase() + formData.jobType.slice(1)}
                        </div>
                        <div>
                            <strong>Salary:</strong> {formatSalary(formData.salary, formData.jobType)}
                        </div>
                        <div>
                            <strong>Manager:</strong> {formData.manager}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Skills & Preferences */}
            <Card>
                <CardHeader>
                    <CardTitle>Skills & Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <strong>Skills:</strong>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.skills.map((skillItem) => (
                                <Badge key={skillItem.skill} variant="secondary">
                                    {skillItem.skill} ({skillItem.experience} years)
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <strong>Working Hours:</strong> {formData.workingHours.start} - {formData.workingHours.end}
                        </div>
                        <div>
                            <strong>Remote Preference:</strong> {formData.remotePreference}%
                            {formData.remotePreference > 50 && formData.managerApproved && (
                                <Badge variant="outline" className="ml-2">
                                    Manager Approved
                                </Badge>
                            )}
                        </div>
                    </div>
                    {formData.notes && (
                        <div>
                            <strong>Additional Notes:</strong>
                            <p className="mt-1 text-muted-foreground">{formData.notes}</p>
                        </div>
                    )}
                </CardContent>
            </Card>


            <Card>

                <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <strong>Name:</strong> {formData.emergencyContact.name}
                        </div>
                        <div>
                            <strong>Relationship:</strong> {formData.emergencyContact.relationship}
                        </div>
                        <div>
                            <strong>Phone:</strong> {formData.emergencyContact.phone}
                        </div>
                    </div>

                    {formData.guardianContact && (
                        <div className="mt-4 pt-4 border-t">
                            <h4 className="font-semibold mb-2">Guardian Contact</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <strong>Name:</strong> {formData.guardianContact.name}
                                </div>
                                <div>
                                    <strong>Phone:</strong> {formData.guardianContact.phone}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Confirmation */}
            <Card>
                <CardContent className="pt-6">
                    <FormField
                        control={form.control}
                        name="confirmed"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <Label className="text-sm">
                                        I confirm that all the information provided above is accurate and complete. I understand that any
                                        false information may result in the termination of my employment.
                                    </Label>
                                </div>
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            {!formData.confirmed && (
                <p className="text-sm text-destructive text-center">
                    Please confirm the accuracy of your information before submitting
                </p>
            )}
        </div>
    )
}
