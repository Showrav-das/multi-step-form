"use client"
import type { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { FormData } from "@/lib/validateSchemas"

interface JobDetailsStepProps {
    form: UseFormReturn<FormData>
}

const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "Design"]

const managersByDepartment: Record<string, string[]> = {
    Engineering: ["Sarah Chen", "Mike Johnson", "Alex Rodriguez"],
    Marketing: ["Emma Wilson", "David Park", "Lisa Thompson"],
    Sales: ["John Smith", "Maria Garcia", "Tom Brown"],
    HR: ["Jennifer Lee", "Robert Davis"],
    Finance: ["Amanda White", "Kevin Miller"],
    Operations: ["Rachel Green", "Steve Wilson"],
    Design: ["Maya Patel", "Chris Taylor"],
}

export function JobDetailsStep({ form }: JobDetailsStepProps) {
    const [filteredManagers, setFilteredManagers] = useState<string[]>([])

    const department = form.watch("department")
    const jobType = form.watch("jobType")

    useEffect(() => {
        if (department) {
            const managers = managersByDepartment[department] || []
            setFilteredManagers(managers)
        }
    }, [department])

    const getSalaryLabel = () => {
        switch (jobType) {
            case "full-time":
                return "Annual Salary ($30,000 - $200,000) *"
            case "contract":
                return "Hourly Rate ($50 - $150) *"
            default:
                return "Salary *"
        }
    }

    const getSalaryPlaceholder = () => {
        switch (jobType) {
            case "full-time":
                return "75000"
            case "contract":
                return "85"
            default:
                return "Enter amount"
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Department *</FormLabel>
                            <Select
                                onValueChange={(value) => {
                                    field.onChange(value)
                                    form.setValue("manager", "")
                                }}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept} value={dept}>
                                            {dept}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Position *</FormLabel>
                            <FormControl>
                                <Input placeholder="Software Engineer" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Start Date *</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="jobType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Type *</FormLabel>
                            <Select
                                onValueChange={(value) => {
                                    field.onChange(value)
                                    form.setValue("salary", "")
                                }}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="full-time">Full-time</SelectItem>
                                    <SelectItem value="part-time">Part-time</SelectItem>
                                    <SelectItem value="contract">Contract</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{getSalaryLabel()}</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder={getSalaryPlaceholder()} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="manager"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Manager *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={!department}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={department ? "Select manager" : "Select department first"} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {filteredManagers.map((manager) => (
                                        <SelectItem key={manager} value={manager}>
                                            {manager}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            {!department && <p className="text-sm text-muted-foreground">Please select a department first</p>}
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}
