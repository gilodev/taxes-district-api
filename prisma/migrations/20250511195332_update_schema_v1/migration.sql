/*
  Warnings:

  - Changed the type of `utilisation` on the `Vehicle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "utilisation",
ADD COLUMN     "utilisation" TEXT NOT NULL;

-- DropEnum
DROP TYPE "VehicleUsage";
