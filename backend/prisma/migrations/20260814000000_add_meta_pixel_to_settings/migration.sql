-- AlterTable: Ajout du champ metaPixelId global dans SystemSettings
-- A executer dans le SQL Editor de Supabase ou via Prisma migrate deploy sur Render
ALTER TABLE "SystemSettings" ADD COLUMN IF NOT EXISTS "metaPixelId" TEXT NOT NULL DEFAULT '';
