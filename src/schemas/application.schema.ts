import { z } from "zod";

export const applicationCreateSchema = z.object({
  roomId: z.string().min(1, "Room is required"),
  moveInDate: z.string().min(1, "Choose a move-in date"),
  isPrivateLease: z.boolean().default(false),
  agreedRentAmount: z.coerce
    .number({ required_error: "Rent must be a number" })
    .positive("Rent must be greater than 0"),
});

export type ApplicationCreateValues = z.infer<typeof applicationCreateSchema>;

export const applicationUpdateSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "CANCELLED"]),
  ownerFeedback: z
    .string()
    .max(500, "Keep it under 500 characters")
    .optional(),
});

export type ApplicationUpdateValues = z.infer<typeof applicationUpdateSchema>;

export const applicationSchema = applicationCreateSchema;
export type ApplicationFormValues = ApplicationCreateValues;

export const applicationReviewSchema = applicationUpdateSchema;
export type ApplicationReviewValues = ApplicationUpdateValues;

export const viewRequestSchema = z.object({
  roomId: z.string().min(1),
  proposedDate: z.string().min(1, "Choose a date and time"),
});
export type ViewRequestFormValues = z.infer<typeof viewRequestSchema>;

export const viewRequestCounterSchema = z.object({
  viewRequestId: z.string().min(1),
  counterDate: z.string().min(1, "Propose a new date"),
  counterNote: z.string().max(300).optional(),
});
export type ViewRequestCounterValues = z.infer<typeof viewRequestCounterSchema>;