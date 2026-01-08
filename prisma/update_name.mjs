import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
    try {
        const user = await prisma.user.update({
            where: { email: 'diamimi@gmail.com' },
            data: { name: 'Diamimi' }
        });
        console.log('SUCCESS: Updated user ' + user.email + ' with name: ' + user.name);
    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

run();
