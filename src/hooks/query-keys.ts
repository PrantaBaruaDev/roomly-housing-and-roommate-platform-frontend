/** One factory per resource keeps invalidations consistent everywhere they're used. */
export const queryKeys = {
  properties: {
    all: ["properties"] as const,
    list: (params?: object) => ["properties", "list", params] as const,
    detail: (id: string) => ["properties", "detail", id] as const,
  },
  flats: {
    list: (propertyId: string) => ["flats", propertyId] as const,
  },
  rooms: {
    all: ["rooms"] as const,
    list: (params?: object) => ["rooms", "list", params] as const,
    detail: (id: string) => ["rooms", "detail", id] as const,
  },
  applications: {
    all: ["applications"] as const,
    list: (params?: object) => ["applications", "list", params] as const,
    detail: (id: string) => ["applications", "detail", id] as const,
  },
  payments: {
    all: ["payments"] as const,
    list: (params?: object) => ["payments", "list", params] as const,
  },
  invoices: {
    all: ["invoices"] as const,
    list: (params?: object) => ["invoices", "list", params] as const,
    detail: (id: string) => ["invoices", "detail", id] as const,
  },
  roomOccupants: {
    byRoom: (roomId: string) => ["room-occupants", roomId] as const,
    mine: ["room-occupants", "me"] as const,
    roommates: (roomId: string) => ["room-occupants", "roommates", roomId] as const,
  },
  viewRequests: {
    all: ["view-requests"] as const,
    list: (params?: object) => ["view-requests", "list", params] as const,
  },
};
