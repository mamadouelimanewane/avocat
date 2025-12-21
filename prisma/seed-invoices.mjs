
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Invoices...');

    const client = await prisma.client.findFirst();
    if (!client) {
        console.log('No client found. Skipping invoice seed.');
        return;
    }

    const dossier = await prisma.dossier.findFirst({ where: { clientId: client.id } });

    // Invoice 1: Paid
    await prisma.facture.create({
        data: {
            number: 'FAC-2025-001',
            status: 'PAYEE',
            issueDate: new Date('2025-11-01'),
            amountHT: 500000,
            amountTVA: 90000,
            amountTTC: 590000,
            clientId: client.id,
            dossierId: dossier ? dossier.id : undefined,
            items: {
                create: [
                    { description: 'Honoraires forfaitaires - Ouverture dossier', quantity: 1, unitPrice: 500000, totalPrice: 500000 }
                ]
            }
        }
    });

    // Invoice 2: Sent (Emise)
    await prisma.facture.create({
        data: {
            number: 'FAC-2025-002',
            status: 'EMISE',
            issueDate: new Date('2025-12-05'),
            amountHT: 150000,
            amountTVA: 27000,
            amountTTC: 177000,
            clientId: client.id,
            dossierId: dossier ? dossier.id : undefined,
            items: {
                create: [
                    { description: 'Rédaction Assignation', quantity: 3, unitPrice: 50000, totalPrice: 150000 }
                ]
            }
        }
    });

    console.log('Invoices seeded!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
