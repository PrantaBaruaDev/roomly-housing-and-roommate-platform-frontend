import { z } from "zod";

export const propertySchema = z.object({
  title: z
    .string()
    .min(3, "Give the property a name (at least 3 characters)"),
  description: z
    .string()
    .min(10, "Add a short description (at least 10 characters)"),
  address: z.string().min(3, "Street address is required"),
  city: z.string().min(1, "City is required"),
  propertyType: z
    .enum(["RESIDENTIAL", "COMMERCIAL", "MIXED"])
    .default("RESIDENTIAL"),
  amenities: z.array(z.string()).default([]),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

const roomInputSchema = z.object({
  roomNumber: z
    .string()
    .min(1, "Room number is required"),
  rentAmount: z.coerce
    .number({ required_error: "Rent must be a number"})
    .positive("Rent must be greater than 0"),
  bookingMode: z
    .enum(["BOOK_BY_ROOM", "BOOK_BY_SEAT"])
    .default("BOOK_BY_ROOM"),
  maxCapacity: z.coerce
    .number({ required_error: "Capacity must be a number"})
    .int("Capacity must be a whole number")
    .positive("Capacity must be at least 1")
    .default(1),
});

export const flatWithRoomsSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
  flatName: z.string().min(1, "Give the flat a name"),
  floorNumber: z.coerce
    .number({ required_error: "Floor must be a number"})
    .int("Floor must be a whole number")
    .min(0, "Floor can't be negative"),
  rooms: z
    .array(roomInputSchema)
    .min(1, "Add at least one room"),
});

export type FlatWithRoomsValues = z.infer<typeof flatWithRoomsSchema>;

export const addRoomsSchema = z.object({
  flatId: z.string().min(1, "Flat ID is required"),
  rooms: z
    .array(roomInputSchema)
    .min(1, "Add at least one room"),
});

export type AddRoomsValues = z.infer<typeof addRoomsSchema>;

export const editRoomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required").optional(),
  rentAmount: z.coerce
    .number({ required_error: "Rent must be a number" })
    .positive("Rent must be greater than 0")
    .optional(),
  bookingMode: z.enum(["BOOK_BY_ROOM", "BOOK_BY_SEAT"]).optional(),
  maxCapacity: z.coerce
    .number({ required_error: "Capacity must be a number" })
    .int("Capacity must be a whole number")
    .positive("Capacity must be at least 1")
    .optional(),
  isAvailable: z.boolean().optional(),
});

export type EditRoomValues = z.infer<typeof editRoomSchema>;

export const editFlatSchema = z.object({
  flatName: z.string().min(1, "Give the flat a name").optional(),
  floorNumber: z.coerce
    .number({ required_error: "Floor must be a number" })
    .int("Floor must be a whole number")
    .min(0, "Floor can't be negative")
    .optional(),
});

export type EditFlatValues = z.infer<typeof editFlatSchema>;

export const roomSchema = z.object({
  flatId: z.string().min(1, "Select a flat"),
  roomNumber: z.string().min(1, "Room number is required"),
  monthlyRent: z.coerce.number().positive("Enter a rent amount greater than 0"),
  sizeSqft: z.coerce.number().positive().optional(),
  description: z.string().optional(),
});

export type RoomFormValues = z.infer<typeof roomSchema>;