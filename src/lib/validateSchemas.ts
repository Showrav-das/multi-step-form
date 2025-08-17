import { z } from "zod"

// Helper function to calculate age from a date string (YYYY-MM-DD)
const calculateAge = (dateOfBirth: string): number => {
  if (!dateOfBirth) return 0
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  if (Number.isNaN(birthDate.getTime())) return 0
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

const isValidDateString = (v: string) => !Number.isNaN(new Date(v).getTime())

// Personal Info Schema (DOB kept as string for <input type="date">)
export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .refine((name) => name.trim().split(" ").length >= 2, {
      message: "Please enter both first and last name",
    }),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine(isValidDateString, { message: "Invalid date" })
    .refine((date) => calculateAge(date) >= 18, {
      message: "Must be at least 18 years old",
    }),
  profilePicture: z.instanceof(File).nullable().optional(),
})

// Job Details Schema (unchanged)
export const jobDetailsSchema = z.object({
  department: z.string().min(1, "Department is required"),
  position: z.string().min(3, "Position must be at least 3 characters"),
   startDate: z
    .string()
    .min(1, "Start date is required")
    .refine((dateStr) => {
      const date = new Date(dateStr)
      const today = new Date()
      today.setHours(0, 0, 0, 0) // ignore time
      const maxDate = new Date()
      maxDate.setDate(today.getDate() + 90) // 90 days from today
      return !isNaN(date.getTime()) && date >= today && date <= maxDate
    }, { 
      message: "Start date cannot be in the past and must be within 90 days from today" 
    }),
  jobType: z.enum(["full-time", "part-time", "contract"]),
  salary: z
    .string()
    .min(1, "Salary is required")
    .refine((salary) => {
      const num = Number.parseFloat(salary)
      return !Number.isNaN(num) && num > 0
    }, { message: "Please enter a valid salary amount" }),
  manager: z.string().min(1, "Manager is required"),
})

// Skills & Preferences Schema (unchanged)
export const skillsPreferencesSchema = z.object({
  skills: z.array(
    z.object({
      skill: z.string().min(1, "Skill name is required"),
      experience: z.string().min(1, "Experience level is required"),
    }),
  ).min(3, "At least 3 skills are required"),
  workingHours: z.object({
    start: z.string().min(1, "Start time is required"),
    end: z.string().min(1, "End time is required"),
  }),
  remotePreference: z.number().min(0).max(100),
  managerApproved: z.boolean(),
  notes: z.string().optional(),
})

// Emergency Contact Schema (NOTE: no dateOfBirth here)
export const emergencyContactSchema = z.object({
  emergencyContact: z.object({
    name: z.string().min(1, "Emergency contact name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    phone: z.string().min(1, "Emergency contact phone is required"),
  }),
  guardianContact: z.object({
    name: z.string().min(1, "Guardian name is required"),
    phone: z.string().min(1, "Guardian phone is required"),
  }).optional(),
})

// Review & Submit Schema (unchanged)
export const reviewSubmitSchema = z.object({
  confirmed: z.boolean().refine((val) => val === true, {
    message: "You must confirm the information is accurate",
  }),
})

// Build the full schema, then enforce guardian rule if age < 21
export const completeFormSchema = personalInfoSchema
  .merge(jobDetailsSchema)
  .merge(skillsPreferencesSchema)
  .merge(emergencyContactSchema)
  .merge(reviewSubmitSchema)
  .superRefine((data, ctx) => {
    const age = calculateAge(data.dateOfBirth)
    if (age < 21) {
      const g = data.guardianContact
      if (!g?.name || !g?.phone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["guardianContact"],
          message: "Guardian contact is required for employees under 21",
        })
      }
    }
  })

export type FormData = z.infer<typeof completeFormSchema>
