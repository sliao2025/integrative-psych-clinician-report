/**
 * Prisma Client Export
 *
 * This file re-exports the prisma client from db-router.ts
 * to enable dual-write and failover capabilities while
 * maintaining backward compatibility with existing imports.
 *
 * For new code, prefer importing directly from @/lib/db-router:
 *   import { prisma, dualWrite, db } from "@/lib/db-router";
 */

export {
  prisma,
  db,
  dualWrite,
  getDatabaseHealthStatus,
} from "@/lib/db-router";
