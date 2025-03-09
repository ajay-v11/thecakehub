/*
  Warnings:

  - Added the required column `hasCustomImage` to the `CustomOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CustomOrder" ADD COLUMN     "customImage" BYTEA,
ADD COLUMN     "hasCustomImage" BOOLEAN NOT NULL,
ADD COLUMN     "selectedTemplate" TEXT;
