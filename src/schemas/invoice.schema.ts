import { z } from "zod";

export const invoiceUtilitySchema = z.object({
  name: z.string().min(1, "Utility needs a name"),
  amount: z.number().nonnegative("Amount cannot be negative"),
});

export const invoiceSchema = z.object({
  roomOccupantId: z.string().min(1, "Select a room occupant"),
  billMonth: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Use YYYY-MM format"),
  type: z.enum(["COMBINED_RENT_UTILITY", "MAINTENANCE_FEE"]),
  rentAmount: z.number().nonnegative("Rent cannot be negative"),
  utilityDetails: z.array(invoiceUtilitySchema).default([]),
  dueDate: z.string().min(1, "Set a due date"),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;