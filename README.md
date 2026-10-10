# Roomly — House & Roommate Rental Platform (Frontend)

A modern, role-based rental management frontend built with Next.js 16 App Router,
TypeScript, Tailwind CSS, and shadcn-style components. Sits on top of an
Express + PostgreSQL backend that handles authentication, properties, rooms,
applications, payments, invoices, and room occupancy.

**Live demo:** https://roomly-frontend-gold.vercel.app

**Backend API:** https://housing-and-roommate-platform.vercel.app/

**Backend Repo:** https://github.com/PrantaBaruaDev/housing-and-roommate-platform.git

---

## Table of Contents

- [Roomly — House \& Roommate Rental Platform (Frontend)](#roomly--house--roommate-rental-platform-frontend)
  - [Table of Contents](#table-of-contents)
  - [What is Roomly](#what-is-roomly)
  - [Tech Stack](#tech-stack)
  - [Features by Role](#features-by-role)
    - [Public (not logged in)](#public-not-logged-in)
    - [Tenant](#tenant)
    - [Owner](#owner)
    - [Admin](#admin)
  - [Design System](#design-system)
    - [Color Tokens (`src/app/globals.css`)](#color-tokens-srcappglobalscss)
    - [Typography](#typography)
    - [Layout Principles](#layout-principles)
  - [Architecture](#architecture)
    - [Server vs Client Components](#server-vs-client-components)
    - [Route Groups](#route-groups)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Install](#install)
    - [Configure](#configure)
    - [Run](#run)
    - [Build](#build)
  - [Demo Credentials](#demo-credentials)
  - [Project Structure](#project-structure)
  - [API Integration Pattern](#api-integration-pattern)
    - [Example](#example)
    - [Response envelope](#response-envelope)
  - [Authentication \& Route Guards](#authentication--route-guards)
    - [Cookie strategy](#cookie-strategy)
    - [Server-side guards](#server-side-guards)
    - [Role vocabulary](#role-vocabulary)
  - [Forms \& Validation](#forms--validation)
  - [State Management](#state-management)
    - [Server state → TanStack Query](#server-state--tanstack-query)
    - [Client state → Zustand](#client-state--zustand)
  - [Payment Flow](#payment-flow)
  - [Notable Implementation Details](#notable-implementation-details)
    - [Pagination component](#pagination-component)
    - [Copyable IDs](#copyable-ids)
    - [Error boundaries per route group](#error-boundaries-per-route-group)
    - [Loading skeletons](#loading-skeletons)
    - [Role-based navigation](#role-based-navigation)
    - [Query key factory](#query-key-factory)

---

## What is Roomly

Roomly connects three types of users on a single platform:

- **Tenants** looking for a room — browse listings, request viewings, submit applications, pay rent via bKash, manage their occupancy.
- **Owners** listing properties — manage buildings, flats, and rooms; review applications; track occupancy; issue invoices.
- **Admins** overseeing the platform — verify property listings, review every application, invoice, and payment, manage user accounts.

Every role gets its own dashboard with a distinct navigation set. All roles
share the same design language, component library, and API layer.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 3 + custom design tokens |
| Components | Hand-written shadcn-style primitives (Radix UI underneath) |
| Data fetching | TanStack Query v5 |
| HTTP client | ofetch with a typed wrapper |
| Forms | React Hook Form + Zod |
| Global state | Zustand (auth store + UI store), persisted to localStorage |
| Animation | tw-animate-css |
| Icons | lucide-react |
| Fonts | Fraunces (display), IBM Plex Sans (body), IBM Plex Mono (structural labels) |
| Runtime | Bun for install/build, Node.js 20+ for deploy |

---

## Features by Role

### Public (not logged in)

- **Homepage** with live stats, role explanations, and featured rooms
- **Browse rooms** with search, city filter, sort, and pagination
- **Room detail page** with full property info and CTAs
- **Auth-gated actions** — Apply or Request-viewing redirects to login with a return URL

### Tenant

- **Dashboard** — current rent, active applications, upcoming viewings, roommate count
- **Browse** — filter and search available rooms
- **Applications** — view status, withdraw pending applications, pay for approved ones
- **View requests** — accept or decline counter-proposals from owners
- **Payments** — full history with gateway references
- **Invoices** — view monthly bills, pay via bKash, view receipts
- **Roommates** — see who else lives in your property
- **Room occupant view** — track your own occupancy record

### Owner

- **Dashboard** — property count, pending applications, upcoming viewings, unpaid invoice total
- **Properties** — create, edit, delete, view details
- **Rooms** — per-property management of flats and rooms (add, edit, delete)
- **Applications** — review, approve, reject, or cancel
- **View requests** — confirm, reschedule (with counter-date), or decline
- **Room occupants** — track active tenants, mark move-out, undo move-out
- **Invoices** — create, view, list with filters

### Admin

- **Dashboard** — platform-wide stats and pending items
- **Properties** — verify/unverify, edit, soft-delete, hard-delete
- **Applications** — override any application status (approve, reject, cancel)
- **Invoices** — full read-only view of every invoice
- **Payments** — full read-only view of every payment with gateway details
- **Users** — user list with role and status badges
- **Rooms** — per-property inventory management

---

## Design System

The visual identity is a **"floor plan / blueprint"** aesthetic, not a
generic SaaS template. The subject matter is rooms, keys, and architectural
drawings — so the UI borrows from that language.

### Color Tokens (`src/app/globals.css`)

| Token | Value | Purpose |
|---|---|---|
| `--paper` | `#FBFAF7` | Warm paper background (not pure white) |
| `--ink` | `#1B211F` | Near-black with a slight green cast |
| `--blueprint` | `#1E3A5F` | Primary actions, active nav, auth hero |
| `--brass` | `#A8763E` | Secondary accent — keys, ownership actions |
| `--moss` | `#436B4B` | Occupied / paid / accepted states |
| `--amber` | warm amber | Pending / awaiting-review states |
| `--clay` | `#A84A3B` | Overdue / rejected / destructive |

### Typography

- **Display:** Fraunces — used for headings and hero copy
- **Body:** IBM Plex Sans — all UI text
- **Mono:** IBM Plex Mono — room numbers, invoice numbers, transaction IDs

Room identifiers like `R-204` and invoice numbers like `INV-2026-0091` are
always rendered in mono, so they read like plan annotations rather than
decorative text.

### Layout Principles

- **Hairline borders instead of card shadows.** Every card is a rectangle
  with a 1px border. No drop shadows anywhere.
- **Blueprint grid** as an optional background for hero sections and room
  placeholders.
- **Mobile-first** — every page reflows cleanly from 375px up.
- **Full dark-mode variable set** defined in `globals.css` under `.dark` (toggle not yet wired to UI).

---

## Architecture

### Server vs Client Components

Next.js App Router defaults to Server Components. The project follows a
strict split:

| Kind | Where | Why |
|---|---|---|
| **Server Components** | Route-group `layout.tsx` files, `loading.tsx`, `error.tsx` | Route guards, cookie reads, redirects before any JS loads |
| **Client Components** | Any page using hooks (`useQuery`, `useState`), dialogs, forms | Interactive state and API calls |
| **Server + Client split** | Auth layouts (server) wrap client shell (`RoleShell`) | Server verifies role, client hydrates store |

Every route group has:
- `layout.tsx` — server component that guards the whole group
- `error.tsx` — boundary that shows a friendly fallback
- `loading.tsx` — skeleton shown while the route loads

### Route Groups

```
src/app/
  (public)/    → /, /browse, /browse/[id]
  (auth)/      → /login, /register
  (owner)/     → /owner/*
  (tenant)/    → /tenant/*
  (admin)/     → /admin/*
  payment/     → /payment/success, /payment/cancel
```

URLs stay lowercase; role identifiers in code stay uppercase (`OWNER`, `TENANT`, `ADMIN`).

---

## Getting Started

### Prerequisites

- Node.js 20+
- Bun 1.0+ (or npm/pnpm)
- A running instance of the Roomly backend API

### Install

```bash
bun install
```

### Configure

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SHOW_DEMO_LOGINS=true   # optional — enables demo login buttons
```

### Run

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
bun run build
bun run start
```

The production build runs a full TypeScript typecheck — pass this locally
before pushing.

---

## Demo Credentials

Every role has a demo account. The login page includes **one-click demo
buttons** so you can log in without typing.

| Role | Email | Password |
|---|---|---|
| Admin | `testeradmin@gmail.com` | `Tester@admin12345` |
| Owner | `testerowner@gmail.com` | `Tester@owner12345` |
| Tenant | `tester.tenant@gmail.com` | `Tester@subscribercustomer12345` |

Demo buttons are enabled when `NEXT_PUBLIC_SHOW_DEMO_LOGINS=true`, or in
development automatically.

---

## Project Structure

```
src/
  app/
    globals.css                    Design tokens (CSS variables)
    layout.tsx                     Root layout, fonts, providers
    error.tsx                      Root error boundary
    (public)/
      layout.tsx                   Public topbar layout
      page.tsx                     Homepage
      browse/
        page.tsx                   Public room browsing
        [id]/page.tsx              Room detail
    (auth)/
      layout.tsx                   Split-hero layout
      login/page.tsx
      register/page.tsx
    (owner)/
      layout.tsx                   Server-side role guard
      error.tsx
      owner/
        page.tsx                   Owner dashboard
        properties/
          page.tsx
          [id]/page.tsx            Property detail + edit/delete
          [id]/rooms/page.tsx      Flat + room inventory
        applications/
          page.tsx
          [id]/page.tsx
        view-requests/
          page.tsx
          [id]/page.tsx
        room-occupants/
          page.tsx
          [id]/page.tsx
        invoices/
          page.tsx
          [id]/page.tsx
    (tenant)/
      layout.tsx
      error.tsx
      tenant/
        page.tsx                   Tenant dashboard
        browse/page.tsx
        applications/
          page.tsx
          [id]/page.tsx
          new/page.tsx
        view-requests/
          page.tsx
          [id]/page.tsx
          new/page.tsx
        payments/
          page.tsx
          [id]/page.tsx
        invoices/
          page.tsx
          [id]/page.tsx
        roommates/page.tsx
    (admin)/
      layout.tsx
      error.tsx
      admin/
        page.tsx
        properties/
          page.tsx
          [id]/page.tsx
          [id]/rooms/page.tsx
        applications/
          page.tsx
          [id]/page.tsx
        invoices/
          page.tsx
          [id]/page.tsx
        payments/
          page.tsx
          [id]/page.tsx
        users/page.tsx
    payment/
      success/page.tsx
      cancel/page.tsx

  components/
    layout/
      dashboard-shell.tsx          Fixed sidebar + topbar + content
      sidebar-nav.tsx              Shared desktop + mobile nav
      topbar.tsx                   User menu, logout, mobile trigger
      public-topbar.tsx            Public site header
      nav-config.ts                Per-role nav items — single source of truth
      role-shell.tsx               Client shell that hydrates auth store
    shared/
      page-header.tsx
      stat-card.tsx
      status-badge.tsx
      empty-state.tsx
      data-pagination.tsx
      confirm-dialog.tsx
      copyable-id.tsx
      skeletons.tsx                Skeleton shapes for loading states
      application-card.tsx
      invoice-detail.tsx
      room-occupant-card.tsx
      flat-section.tsx
      room-card.tsx
      public-room-card.tsx
      create-property-dialog.tsx
      edit-property-dialog.tsx
      create-flat-dialog.tsx
      edit-flat-dialog.tsx
      add-rooms-dialog.tsx
      edit-room-dialog.tsx
    ui/                            shadcn-style primitives
      avatar.tsx, badge.tsx, button.tsx, card.tsx, dialog.tsx,
      input.tsx, label.tsx, select.tsx, separator.tsx, sheet.tsx,
      skeleton.tsx, table.tsx, tabs.tsx

  features/                        Plain API modules (no React)
    auth/api.ts
    properties/api.ts
    rooms/api.ts
    applications/api.ts
    invoices/api.ts
    payments/api.ts
    room-occupants/api.ts
    view-requests/api.ts

  hooks/
    query-keys.ts                  Query key factory
    use-auth.ts
    use-properties.ts
    use-rooms.ts
    use-applications.ts
    use-invoices.ts
    use-payments.ts
    use-room-occupants.ts
    use-view-requests.ts
    use-require-tenant.ts          Auth gate for public page actions

  lib/
    api-client.ts                  ofetch wrapper with auth + error handling
    adapters/                      API response → view model
      property.ts
      room.ts
      application.ts
      invoice.ts
      payment.ts
      room-occupant.ts
      view-request.ts
    constants.ts                   Enums, status styles, API base URL
    server-auth.ts                 Server-side auth helper for layouts
    utils.ts                       cn(), formatCurrency(), formatDate(), initials()

  providers/
    query-provider.tsx             TanStack Query client

  schemas/                         Zod validation
    auth.schema.ts
    property.schema.ts
    application.schema.ts
    invoice.schema.ts

  store/
    auth-store.ts                  Session, token, frontend cookie mirror
    ui-store.ts                    Sidebar collapse state

  types/                           TypeScript domain types
    auth.ts, property.ts, application.ts, invoice.ts,
    payment.ts, room-occupant.ts, view-request.ts, room.ts

  utils/
    jwt-decode.ts                  Decode JWT without verifying signature
```

---

## API Integration Pattern

Every backend resource follows the same three-layer pattern:

```
types/<resource>.ts        ← exact mirror of backend shape (ApiX)
     ↓
features/<resource>/api.ts ← plain fetch functions (no React)
     ↓
hooks/use-<resource>.ts    ← TanStack Query wrappers
     ↓
lib/adapters/<resource>.ts ← maps API shape → view model (XCardVM)
     ↓
page/component             ← consumes only the VM, never the raw response
```

**Why:** the API shape and the UI shape are different concerns. Adapters
translate between them, so a backend field rename only affects one file.

### Example

```ts
// types/property.ts
export interface ApiProperty { /* raw shape */ }
export interface PropertyCardVM { /* what the UI renders */ }

// features/properties/api.ts
export const propertiesApi = {
  list: (params) => apiClient<PaginatedResponse<ApiProperty>>("/properties", { params }),
};

// hooks/use-properties.ts
export function useProperties(params) {
  return useQuery({
    queryKey: queryKeys.properties.list(params),
    queryFn: () => propertiesApi.list(params),
  });
}

// lib/adapters/property.ts
export function toPropertyCardVM(api: ApiProperty): PropertyCardVM { /* ... */ }

// page
const { data } = useProperties({ page });
const properties = (data?.data ?? []).map(toPropertyCardVM);
```

### Response envelope

Every list endpoint returns:

```json
{
  "success": true,
  "message": "...",
  "data": [...],
  "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
}
```

The `apiClient` handles 401 by clearing the session and redirecting to login.

---

## Authentication & Route Guards

### Cookie strategy

The backend sets `accessToken` and `refreshToken` as **httpOnly** cookies on
**its own domain**. That means the Next.js frontend (a different domain) can't
read them.

To make server-side route guards work, the frontend **mirrors the token into a
JS-readable cookie** on its own domain when the user logs in. This cookie:

- Is used **only for routing decisions**, not for API authentication
- Is not sent to the backend (the backend uses the httpOnly cookie)
- Is cleared on logout

Real API authentication still uses `Authorization: Bearer <token>` — the
backend verifies the JWT signature on every request.

### Server-side guards

Each role's `layout.tsx` is a **Server Component** that reads the cookie,
decodes the JWT, and redirects before the browser sees the page:

```tsx
export default async function OwnerLayout({ children }) {
  const user = await getServerUser();
  if (!user) redirect("/login?redirect=/owner");
  if (user.role !== "OWNER") redirect(ROLE_HOME[user.role]);
  return <RoleShell role="OWNER">{children}</RoleShell>;
}
```

Result: no flash of the wrong dashboard, no client-side `useEffect` redirects.

### Role vocabulary

- Backend, JWT, and frontend store all use **uppercase**: `ADMIN`, `OWNER`, `TENANT`
- URL paths stay lowercase: `/owner`, `/tenant`, `/admin`
- The `Role` type in `lib/constants.ts` enforces this at compile time

---

## Forms & Validation

Every form uses **React Hook Form + Zod**. The schema lives in `src/schemas/`
and matches the backend's validation rules.

```tsx
const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
  resolver: zodResolver(schema),
});

<Input {...register("email")} />
{errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
```

Numeric inputs use `valueAsNumber: true` so the DOM string converts to a
number before Zod sees it:

```tsx
<Input type="number" {...register("rentAmount", { valueAsNumber: true })} />
```

Dynamic rows (utilities, rooms) use `useFieldArray` from react-hook-form.

---

## State Management

### Server state → TanStack Query

All data from the API lives in React Query. Query keys are built through a
factory in `hooks/query-keys.ts`, so invalidations stay consistent.

### Client state → Zustand

| Store | Holds |
|---|---|
| `auth-store` | `user`, `accessToken`, persisted to localStorage + mirrored to a cookie |
| `ui-store` | `isMobileNavOpen`, `isSidebarCollapsed` |

Server data **never** lives in Zustand. If it comes from the API, it goes
through React Query.

---

## Payment Flow

Roomly uses **bKash** for rent and application-fee payments. The flow is:

1. User clicks **Pay via bKash** on an invoice or application
2. Confirmation dialog explains the amount and that a new tab will open
3. `POST /payments/create/bkash` with `{ invoiceId }` or `{ applicationId }`
4. Backend returns `{ paymentUrl, payment }`
5. Frontend opens `paymentUrl` in a **new tab** — user completes checkout on bKash
6. Original tab shows a "waiting for confirmation" banner
7. When the user returns to the original tab, the invoice cache is invalidated
   via the `window.focus` event — the status updates automatically

If the popup is blocked, the frontend falls back to a same-tab redirect.

Landing pages:

- `/payment/success` — shows receipt with transaction ID, amount, gateway reference
- `/payment/cancel` — explains failure, offers retry with the invoice ID

---

## Notable Implementation Details

### Pagination component

`DataPagination` renders a compact range like `1 … 4 5 6 … 20`, showing the
total count ("Showing 1–10 of 47"), and hides itself entirely when there's
only one page.

### Copyable IDs

Every UUID in the UI (occupant IDs, transaction IDs, reference IDs) uses
`<CopyableId />`, which truncates to `first8…last4`, shows the full value on
hover, and copies it to the clipboard on click with a green checkmark flash.

### Error boundaries per route group

Errors inside `/owner/*` render inside the owner layout — sidebar stays,
content area shows the fallback. Errors that escape render at the root boundary.

### Loading skeletons

Each list page has a `loading.tsx` that renders a shape-matched skeleton
(table skeleton for invoices, card grid for properties, list for applications).
The skeleton uses the same grid/tailwind classes, so the transition from
skeleton → real content is seamless.

### Role-based navigation

`nav-config.ts` is the single source of truth for what each role sees in the
sidebar. Adding a new page for a role is one line in that file.

### Query key factory

Every query uses a key from `hooks/query-keys.ts`. Mutations invalidate via
prefix matching (`["properties"]` matches `["properties", "list"]`,
`["properties", "detail", id]`, etc.) — no stale data after mutations.

