

import type { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FormData } from "@/lib/validateSchemas"

interface EmergencyContactStepProps {
    form: UseFormReturn<FormData>
}

export function EmergencyContactStep({ form }: EmergencyContactStepProps) {
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


    const age = calculateAge(dateOfBirth)
    const isMinor = age < 21

    return (
        <div className="space-y-6">
            {/* Emergency Contact */}
            <div>
                {/* <h3 className="text-lg font-semibold mb-4">Emergency Contact *</h3> */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="emergencyContact.name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Emergency contact name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="emergencyContact.relationship"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Relationship *</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Spouse, Parent, Sibling" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="md:col-span-2">
                        <FormField
                            control={form.control}
                            name="emergencyContact.phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Emergency contact phone" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* Guardian Contact (if under 21) */}
            {isMinor && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Guardian Contact *</h3>
                    <p className="text-sm text-muted-foreground mb-4">Required for employees under 21 years of age</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="guardianContact.name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Guardian Name *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Guardian name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="guardianContact.phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Guardian Phone *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Guardian phone number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            )}

            {age > 0 && (
                <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                        <strong>Age:</strong> {age} years
                        {isMinor && (
                            <span className="text-muted-foreground ml-2">(Guardian contact required for employees under 21)</span>
                        )}
                    </p>
                </div>
            )}
        </div>
    )
}
