# KK Mern — Turborepo

A full-stack monorepo for managing device inventory and sales.

## Stack

- **Frontend** — React + Vite + shadcn/ui + TanStack Table + TanStack Query + nuqs
- **API** — Express + Mongoose + Zod
- **Shared** — `@repo/types` — Zod schemas and TypeScript types shared across apps
- **Tooling** — TypeScript, ESLint, Prettier, pnpm workspaces, Turborepo

## Structure

```
apps/
  frontend/     React + Vite client
  api/          Express REST API
packages/
  types/        Shared Zod schemas and TypeScript types
  eslint-config/
  typescript-config/
```

## Getting Started

Install dependencies from the root:

```sh
pnpm install
```

Build shared packages first:

```sh
pnpm --filter types build
```

## Development

Run all apps in parallel:

```sh
turbo dev
```

Or run individually:

```sh
turbo dev --filter=frontend
turbo dev --filter=api
```

## Environment Variables

Create the following env files — these are gitignored and must be created manually:

**`apps/api/.env.dev`**

```env
PORT=5000
MONGO_URI=your_mongo_uri
```

**`apps/api/.env.prod`**

```env
PORT=5000
MONGO_URI=your_mongo_uri
```

## Build

Build all apps and packages:

```sh
turbo build
```

Build a specific app:

```sh
turbo build --filter=frontend
turbo build --filter=api
```

## API

Base URL: `http://localhost:5000`

| Method | Endpoint           | Description     |
| ------ | ------------------ | --------------- |
| GET    | `/api/devices`     | Get all devices |
| POST   | `/api/devices`     | Add a device    |
| PUT    | `/api/devices/:id` | Update a device |
| DELETE | `/api/devices/:id` | Delete a device |

### Query Params — `GET /api/devices`

| Param          | Type                                                       | Description                  |
| -------------- | ---------------------------------------------------------- | ---------------------------- |
| `sortBy`       | `cost_price \| name \| createdAt \| quantity`              | Field to sort by             |
| `sort`         | `asc \| desc`                                              | Sort direction               |
| `manufacturer` | `string`                                                   | Filter by manufacturer       |
| `type`         | `mobile \| gadget \| audio \| other`                       | Filter by type               |
| `condition`    | `new \| used \| refurbished`                               | Filter by condition          |
| `status`       | `available \| sold \| damaged \| out_of_stock \| returned` | Filter by status             |
| `page`         | `number`                                                   | Page number (default: 1)     |
| `limit`        | `number`                                                   | Items per page (default: 10) |

Example:

```
GET /api/devices?manufacturer=Apple&condition=new&sortBy=cost_price&sort=desc
```

## Pages

| Route      | Page                                              |
| ---------- | ------------------------------------------------- |
| `/`        | Dashboard                                         |
| `/devices` | Device inventory table with filtering and sorting |
| `/sales`   | Sales                                             |

## Shared Types

Types and Zod schemas are defined once in `packages/types` and imported in both frontend and API:

```ts
import {
  deviceSchema,
  type Device,
  types,
  conditions,
  statuses,
} from "@repo/types";
```

After modifying `packages/types`, rebuild it:

```sh
pnpm --filter types build
```
