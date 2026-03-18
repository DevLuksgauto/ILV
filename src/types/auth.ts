import { z } from "zod"

export type LoginOperationMode = "online" | "offline"

export type SavedProfileType = "iga" | "general"

export type SavedProfile = {
  type: SavedProfileType
  hostname?: string
  username?: string
  password?: string
  port?: number
  path?: string
  localLogPath?: string
  operationMode?: LoginOperationMode
}

export type SavedProfilesMap = Record<string, SavedProfile>

export type FlashStatus = "success" | "error" | "warning" | "info"

export type SubmitFeedback = {
  status: FlashStatus
  message: string
}

export const igaLoginSchema = z
  .object({
    operationMode: z.enum(["online", "offline"]),
    hostname: z.string().optional(),
    username: z.string().optional(),
    port: z.coerce.number().int().min(1).max(65535).default(22),
    password: z.string().optional(),
    path: z.string().optional(),
    localLogPath: z.string().optional(),
    saveProfile: z.boolean().default(true),
    saveAsDefault: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.operationMode === "online") {
      if (!data.hostname?.trim()) {
        ctx.addIssue({
          path: ["hostname"],
          code: z.ZodIssueCode.custom,
          message: "Host / IP is required in online mode",
        })
      }
      if (!data.username?.trim()) {
        ctx.addIssue({
          path: ["username"],
          code: z.ZodIssueCode.custom,
          message: "SSH user is required in online mode",
        })
      }
      if (!data.password?.trim()) {
        ctx.addIssue({
          path: ["password"],
          code: z.ZodIssueCode.custom,
          message: "Password is required in online mode",
        })
      }
      if (!data.path?.trim()) {
        ctx.addIssue({
          path: ["path"],
          code: z.ZodIssueCode.custom,
          message: "Base directory is required in online mode",
        })
      }
    }

    if (data.operationMode === "offline" && !data.localLogPath?.trim()) {
      ctx.addIssue({
        path: ["localLogPath"],
        code: z.ZodIssueCode.custom,
        message: "Local logs directory is required in offline mode",
      })
    }
  })

export type IgaLoginFormValues = z.infer<typeof igaLoginSchema>

export const generalLoginSchema = z.object({
  hostname: z.string().trim().min(1, "Host / IP is required"),
  port: z.coerce.number().int().min(1).max(65535),
  username: z.string().trim().min(1, "SSH user is required"),
  password: z.string().trim().min(1, "Password is required"),
  path: z.string().trim().min(1, "File path is required"),
  saveProfile: z.boolean().default(false),
  profileName: z.string().trim().optional(),
})

export type GeneralLoginFormValues = z.infer<typeof generalLoginSchema>


