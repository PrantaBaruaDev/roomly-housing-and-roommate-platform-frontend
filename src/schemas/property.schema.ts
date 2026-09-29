import { z } from "zod";

export const propertySchema = z.object({
  title: z.string().min(3, "Give the property a name"),
  description: z.string().min(10, "Add a short description"),
  addressLine1: z.string().min(3, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  amenities: z.array(z.string()).default([]),
});
export type PropertyFormValues = z.infer<typeof propertySchema>;

export const roomSchema = z.object({
  flatId: z.string().min(1, "Select a flat"),
  roomNumber: z.string().min(1, "Room number is required"),
  monthlyRent: z.coerce.number().positive("Enter a rent amount greater than 0"),
  sizeSqft: z.coerce.number().positive().optional(),
  description: z.string().optional(),
});
export type RoomFormValues = z.infer<typeof roomSchema>;
