import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: { email: true, role: true, name: true, active: true },
        orderBy: { role: 'asc' }
    });

    if (users.length === 0) {
        console.log("Aucun utilisateur trouvé.");
    } else {
        console.log("Voici les utilisateurs trouvés :");
        users.forEach(u => {
            console.log(`- Email: ${u.email} | Rôle: ${u.role} | Nom: ${u.name} | Actif: ${u.active}`);
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
