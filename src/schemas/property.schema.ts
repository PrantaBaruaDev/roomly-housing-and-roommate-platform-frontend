import { z } from "zod";

/* ────────────────────────────────────────────────────────────────
   Property
   ──────────────────────────────────────────────────────────────── */

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

/* ────────────────────────────────────────────────────────────────
   Room — shared input shape for flat creation and room additions
   ──────────────────────────────────────────────────────────────── */

const roomInputSchema = z.object({
  roomNumber: z
    .string()
    .min(1, "Room number is required"),
  rentAmount: z.coerce
    .number({ error: "Rent must be a number" })
    .positive("Rent must be greater than 0"),
  bookingMode: z
    .enum(["BOOK_BY_ROOM", "BOOK_BY_SEAT"])
    .default("BOOK_BY_ROOM"),
  maxCapacity: z.coerce
    .number({ error: "Capacity must be a number" })
    .int("Capacity must be a whole number")
    .positive("Capacity must be at least 1")
    .default(1),
});

/* ────────────────────────────────────────────────────────────────
   Create flat + its initial rooms (POST /properties/flat)
   ──────────────────────────────────────────────────────────────── */

export const flatWithRoomsSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
  flatName: z.string().min(1, "Give the flat a name"),
  floorNumber: z.coerce
    .number({ error: "Floor must be a number" })
    .int("Floor must be a whole number")
    .min(0, "Floor can't be negative"),
  rooms: z
    .array(roomInputSchema)
    .min(1, "Add at least one room"),
});

export type FlatWithRoomsValues = z.infer<typeof flatWithRoomsSchema>;

/* ────────────────────────────────────────────────────────────────
   Add rooms to an existing flat
   (POST /properties/flat/add-rooms)
   ──────────────────────────────────────────────────────────────── */

export const addRoomsSchema = z.object({
  flatId: z.string().min(1, "Flat ID is required"),
  rooms: z
    .array(roomInputSchema)
    .min(1, "Add at least one room"),
});

export type AddRoomsValues = z.infer<typeof addRoomsSchema>;

/* ────────────────────────────────────────────────────────────────
   Edit an existing room
   (PATCH /properties/flat/room/edit/:roomId)
   ──────────────────────────────────────────────────────────────── */

export const editRoomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required").optional(),
  rentAmount: z.coerce
    .number({ error: "Rent must be a number" })
    .positive("Rent must be greater than 0")
    .optional(),
  bookingMode: z.enum(["BOOK_BY_ROOM", "BOOK_BY_SEAT"]).optional(),
  maxCapacity: z.coerce
    .number({ error: "Capacity must be a number" })
    .int("Capacity must be a whole number")
    .positive("Capacity must be at least 1")
    .optional(),
  isAvailable: z.boolean().optional(),
});

export type EditRoomValues = z.infer<typeof editRoomSchema>;

/* ────────────────────────────────────────────────────────────────
   Edit an existing flat's metadata
   (PATCH /properties/flat/edit/:flatId)
   ──────────────────────────────────────────────────────────────── */

export const editFlatSchema = z.object({
  flatName: z.string().min(1, "Give the flat a name").optional(),
  floorNumber: z.coerce
    .number({ error: "Floor must be a number" })
    .int("Floor must be a whole number")
    .min(0, "Floor can't be negative")
    .optional(),
});

export type EditFlatValues = z.infer<typeof editFlatSchema>;

/* ────────────────────────────────────────────────────────────────
   Legacy export kept for files still importing `roomSchema`
   ──────────────────────────────────────────────────────────────── */

export const roomSchema = z.object({
  flatId: z.string().min(1, "Select a flat"),
  roomNumber: z.string().min(1, "Room number is required"),
  monthlyRent: z.coerce.number().positive("Enter a rent amount greater than 0"),
  sizeSqft: z.coerce.number().positive().optional(),
  description: z.string().optional(),
});

export type RoomFormValues = z.infer<typeof roomSchema>;