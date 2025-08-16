"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { X } from "lucide-react"
import { FormData } from "@/lib/validateSchemas"


interface SkillsPreferencesStepProps {
    form: UseFormReturn<FormData>
}

const skillsByDepartment: Record<string, string[]> = {
    Engineering: ["JavaScript", "Python", "React", "Node.js", "SQL", "AWS", "Docker", "Git"],
    Marketing: ["SEO", "Content Marketing", "Social Media", "Analytics", "Email Marketing", "PPC"],
    Sales: ["CRM", "Lead Generation", "Negotiation", "Customer Relations", "Sales Analytics"],
    HR: ["Recruitment", "Employee Relations", "Performance Management", "Training", "Compliance"],
    Finance: ["Financial Analysis", "Budgeting", "Excel", "QuickBooks", "Tax Preparation", "Auditing"],
    Operations: ["Project Management", "Process Improvement", "Supply Chain", "Quality Control"],
    Design: ["Figma", "Photoshop", "UI/UX Design", "Prototyping", "Brand Design", "Illustration"],
}

export function SkillsPreferencesStep({ form }: SkillsPreferencesStepProps) {
    const [newSkill, setNewSkill] = useState("")
    const [newExperience, setNewExperience] = useState("")

    const department = form.watch("department")
    const skills = form.watch("skills")
    const workingHours = form.watch("workingHours")
    const remotePreference = form.watch("remotePreference")
    const managerApproved = form.watch("managerApproved")
    const notes = form.watch("notes")

    const availableSkills = department ? skillsByDepartment[department] || [] : []

    const addSkill = (skillName: string) => {
        if (skillName && !skills.some((s) => s.skill === skillName)) {
            const updatedSkills = [...skills, { skill: skillName, experience: "" }]
            form.setValue("skills", updatedSkills)
        }
    }

    const addCustomSkill = () => {
        if (newSkill.trim() && newExperience.trim()) {
            addSkill(newSkill.trim())
            const updatedSkills = skills.map((s) =>
                s.skill === newSkill.trim() ? { ...s, experience: newExperience.trim() } : s,
            )
            form.setValue("skills", updatedSkills)
            setNewSkill("")
            setNewExperience("")
        }
    }

    const removeSkill = (skillToRemove: string) => {
        const updatedSkills = skills.filter((s) => s.skill !== skillToRemove)
        form.setValue("skills", updatedSkills)
    }

    const updateSkillExperience = (skillName: string, experience: string) => {
        const updatedSkills = skills.map((s) => (s.skill === skillName ? { ...s, experience } : s))
        form.setValue("skills", updatedSkills)
    }

    const handleRemotePreferenceChange = (value: number[]) => {
        const preference = value[0]
        form.setValue("remotePreference", preference)
        if (preference <= 50) {
            form.setValue("managerApproved", false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Skills Selection */}
            <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Skills * (Select at least 3)</FormLabel>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                {department ? `Skills for ${department}:` : "Please select a department first"}
                            </p>

                            {department && (
                                <div className="flex flex-wrap gap-2">
                                    {availableSkills.map((skill) => (
                                        <Button
                                            key={skill}
                                            variant={skills.some((s) => s.skill === skill) ? "default" : "outline"}
                                            size="sm"
                                            type="button"
                                            onClick={() => addSkill(skill)}
                                            disabled={skills.some((s) => s.skill === skill)}
                                        >
                                            {skill}
                                        </Button>
                                    ))}
                                </div>
                            )}

                            {/* Custom Skill Input */}
                            <div className="flex gap-2">
                                <Input placeholder="Add custom skill" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
                                <Input
                                    placeholder="Years of experience"
                                    value={newExperience}
                                    onChange={(e) => setNewExperience(e.target.value)}
                                />
                                <Button type="button" onClick={addCustomSkill} disabled={!newSkill.trim() || !newExperience.trim()}>
                                    Add
                                </Button>
                            </div>

                            {/* Selected Skills */}
                            <div className="space-y-3">
                                {skills.map((skillItem) => (
                                    <div key={skillItem.skill} className="flex items-center gap-3 p-3 border rounded-lg">
                                        <Badge variant="secondary">{skillItem.skill}</Badge>
                                        <Input
                                            placeholder="Years of experience"
                                            value={skillItem.experience}
                                            onChange={(e) => updateSkillExperience(skillItem.skill, e.target.value)}
                                            className="flex-1"
                                        />
                                        <Button variant="ghost" size="sm" type="button" onClick={() => removeSkill(skillItem.skill)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Working Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="workingHours.start"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Working Hours - Start Time</FormLabel>
                            <FormControl>
                                <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="workingHours.end"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Working Hours - End Time</FormLabel>
                            <FormControl>
                                <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Remote Preference */}
            <FormField
                control={form.control}
                name="remotePreference"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Remote Work Preference: {remotePreference}%</FormLabel>
                        <FormControl>
                            <Slider
                                value={[field.value]}
                                onValueChange={handleRemotePreferenceChange}
                                max={100}
                                step={10}
                                className="w-full"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {remotePreference > 50 && (
                <FormField
                    control={form.control}
                    name="managerApproved"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Manager Approved</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
            )}

            {/* Notes */}
            <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Additional Notes (max 500 characters)</FormLabel>
                        <FormControl>
                            <Textarea
                                {...field}
                                onChange={(e) => {
                                    if (e.target.value.length <= 500) {
                                        field.onChange(e.target.value)
                                    }
                                }}
                                placeholder="Any additional information you'd like to share..."
                                className="min-h-[100px]"
                            />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">{notes.length}/500 characters</p>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
