-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Facture" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'FACTURE',
    "status" TEXT NOT NULL DEFAULT 'BROUILLON',
    "issueDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATETIME,
    "amountHT" REAL NOT NULL,
    "amountTVA" REAL NOT NULL,
    "amountTTC" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'XOF',
    "clientId" TEXT NOT NULL,
    "dossierId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Facture_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Facture_dossierId_fkey" FOREIGN KEY ("dossierId") REFERENCES "Dossier" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Facture" ("amountHT", "amountTTC", "amountTVA", "clientId", "createdAt", "currency", "dossierId", "dueDate", "id", "issueDate", "number", "status", "updatedAt") SELECT "amountHT", "amountTTC", "amountTVA", "clientId", "createdAt", "currency", "dossierId", "dueDate", "id", "issueDate", "number", "status", "updatedAt" FROM "Facture";
DROP TABLE "Facture";
ALTER TABLE "new_Facture" RENAME TO "Facture";
CREATE UNIQUE INDEX "Facture_number_key" ON "Facture"("number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
