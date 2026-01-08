import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkUser() {
    const email = "Diamimi@gmail.com";

    console.log(`🔍 Recherche de l'utilisateur: ${email}\n`);

    // Recherche insensible à la casse
    const user = await prisma.user.findFirst({
        where: {
            email: {
                equals: email,
                mode: 'insensitive'
            }
        }
    });

    if (user) {
        console.log('✅ Utilisateur trouvé:');
        console.log(`   ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Nom: ${user.name}`);
        console.log(`   Rôle: ${user.role}`);
        console.log(`   Mot de passe hashé: ${user.password?.substring(0, 20)}...`);
        console.log(`   Créé le: ${user.createdAt}`);
    } else {
        console.log('❌ Utilisateur NON trouvé dans la base de données');
        console.log('\n📋 Utilisateurs existants:');

        const allUsers = await prisma.user.findMany({
            select: { email: true, name: true, role: true }
        });

        allUsers.forEach((u, i) => {
            console.log(`   ${i + 1}. ${u.email} (${u.name}) - ${u.role}`);
        });
    }
}

checkUser()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
