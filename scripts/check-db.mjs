import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    const jurisprudenceCount = await prisma.jurisprudence.count();
    const templateCount = await prisma.template.count();
    const userCount = await prisma.user.count();

    console.log(`Jurisprudence: ${jurisprudenceCount}`);
    console.log(`Templates: ${templateCount}`);
    console.log(`Users: ${userCount}`);
}

check()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
