import { z } from "zod";

export const applicationSchema = z.object({
  roomId: z.string().min(1),
  moveInDate: z.string().min(1, "Choose a move-in date"),
  message: z.string().max(500, "Keep it under 500 characters").optional(),
});
export type ApplicationFormValues = z.infer<typeof applicationSchema>;

export const applicationReviewSchema = z.object({
  applicationId: z.string().min(1),
  decision: z.enum(["accepted", "rejected"]),
  reviewNote: z.string().max(500).optional(),
});
export type ApplicationReviewValues = z.infer<typeof applicationReviewSchema>;

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
