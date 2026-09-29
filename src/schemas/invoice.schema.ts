import { z } from "zod";

export const invoiceLineItemSchema = z.object({
  label: z.string().min(1, "Line item needs a label"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  kind: z.enum(["rent", "utility", "maintenance", "other"]),
});

export const invoiceSchema = z.object({
  roomId: z.string().min(1, "Select a room"),
  period: z.string().min(1, "Select the billing month"),
  dueDate: z.string().min(1, "Set a due date"),
  lineItems: z.array(invoiceLineItemSchema).min(1, "Add at least one line item"),
});
export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
