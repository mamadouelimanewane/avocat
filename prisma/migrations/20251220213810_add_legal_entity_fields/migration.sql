-- AlterTable
ALTER TABLE "CabinetSettings" ADD COLUMN "capital" TEXT;
ALTER TABLE "CabinetSettings" ADD COLUMN "legalForm" TEXT DEFAULT 'INDIVIDUEL';
ALTER TABLE "CabinetSettings" ADD COLUMN "ninea" TEXT;
ALTER TABLE "CabinetSettings" ADD COLUMN "tradeRegister" TEXT;
