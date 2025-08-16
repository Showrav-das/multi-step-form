import { z } from "zod"

// Helper function to calculate age
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

// Personal Info Schema
export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .refine((name) => name.trim().split(" ").length >= 2, {
      message: "Please enter both first and last name",
    }),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().refine(
    (phone) => {
      const digits = phone.replace(/\D/g, "")
      return digits.length === 11 && digits.startsWith("1")
    },
    {
      message: "Please enter a valid US phone number",
    },
  ),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => calculateAge(date) >= 18, {
      message: "Must be at least 18 years old",
    }),
  profilePicture: z.instanceof(File).nullable().optional(),
})

// Job Details Schema
export const jobDetailsSchema = z.object({
  department: z.string().min(1, "Department is required"),
  position: z.string().min(3, "Position must be at least 3 characters"),
  startDate: z.string().min(1, "Start date is required"),
  jobType: z.enum(["full-time", "part-time", "contract"]),
  salary: z
    .string()
    .min(1, "Salary is required")
    .refine(
      (salary) => {
        const num = Number.parseFloat(salary)
        return !isNaN(num) && num > 0
      },
      {
        message: "Please enter a valid salary amount",
      },
    ),
  manager: z.string().min(1, "Manager is required"),
})

// Skills & Preferences Schema
export const skillsPreferencesSchema = z.object({
  skills: z
    .array(
      z.object({
        skill: z.string().min(1, "Skill name is required"),
        experience: z.string().min(1, "Experience level is required"),
      }),
    )
    .min(3, "At least 3 skills are required"),
  workingHours: z.object({
    start: z.string().min(1, "Start time is required"),
    end: z.string().min(1, "End time is required"),
  }),
  remotePreference: z.number().min(0).max(100),
  managerApproved: z.boolean(),
  notes: z.string().optional(),
})

// Emergency Contact Schema
export const emergencyContactSchema = z
  .object({
    emergencyContact: z.object({
      name: z.string().min(1, "Emergency contact name is required"),
      relationship: z.string().min(1, "Relationship is required"),
      phone: z.string().min(1, "Emergency contact phone is required"),
    }),
    guardianContact: z
      .object({
        name: z.string().min(1, "Guardian name is required"),
        phone: z.string().min(1, "Guardian phone is required"),
      })
      .optional(),
    dateOfBirth: z.string(), // Needed for age validation
  })
  .refine(
    (data) => {
      const age = calculateAge(data.dateOfBirth)
      return age >= 21 || (data.guardianContact?.name && data.guardianContact?.phone)
    },
    {
      message: "Guardian contact is required for employees under 21",
      path: ["guardianContact"],
    },
  )

// Review & Submit Schema
export const reviewSubmitSchema = z.object({
  confirmed: z.boolean().refine((val) => val === true, {
    message: "You must confirm the information is accurate",
  }),
})

// Complete Form Schema
export const completeFormSchema = z.object({
  ...personalInfoSchema.shape,
  ...jobDetailsSchema.shape,
  ...skillsPreferencesSchema.shape,
  ...emergencyContactSchema.shape,
  ...reviewSubmitSchema.shape,
})

export type FormData = z.infer<typeof completeFormSchema>
