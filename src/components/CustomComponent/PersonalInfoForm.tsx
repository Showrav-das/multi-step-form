"use client"

import type React from "react"
import type { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { useRef } from "react"
import { FormData } from "@/lib/validateSchemas"
import { Input } from "../ui/input"


interface PersonalInfoStepProps {
    form: UseFormReturn<FormData>
}

export function PersonalInfoStep({ form }: PersonalInfoStepProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file type and size
            if (!["image/jpeg", "image/png"].includes(file.type)) {
                alert("Please select a JPG or PNG file")
                return
            }
            if (file.size > 2 * 1024 * 1024) {
                // 2MB
                alert("File size must be less than 2MB")
                return
            }
            form.setValue("profilePicture", file)
        }
    }

    const formatPhoneNumber = (value: string) => {
        const numbers = value.replace(/\D/g, "")
        if (numbers.length === 0) return ""
        if (numbers.length === 1) return numbers.startsWith("1") ? "+1-" : `+1-${numbers}`
        if (numbers.length <= 4) return `+1-${numbers.slice(1)}`
        if (numbers.length <= 7) return `+1-${numbers.slice(1, 4)}-${numbers.slice(4)}`
        return `+1-${numbers.slice(1, 4)}-${numbers.slice(4, 7)}-${numbers.slice(7, 11)}`
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

    const dateOfBirth = form.watch("dateOfBirth")
    const profilePicture = form.watch("profilePicture")
    const age = calculateAge(dateOfBirth)

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                                <Input placeholder="First Last" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone *</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="+1-123-456-7890"
                                    {...field}
                                    onChange={(e) => {
                                        const formatted = formatPhoneNumber(e.target.value)
                                        field.onChange(formatted)
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date of Birth *</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                            {age > 0 && age >= 18 && <p className="text-sm text-muted-foreground">Age: {age} years</p>}
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={form.control}
                name="profilePicture"
                render={() => (
                    <FormItem>
                        <FormLabel>Profile Picture (JPG/PNG, max 2MB)</FormLabel>
                        <div className="flex items-center gap-4">
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                Choose File
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                {profilePicture ? profilePicture.name : "No file selected"}
                            </span>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
