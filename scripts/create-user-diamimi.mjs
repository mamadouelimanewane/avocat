import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createUser() {
    const email = "Diamimi@gmail.com";
    const password = "12345678";
    const name = "Utilisateur Diamimi";

    console.log(`🔐 Création de l'utilisateur: ${email}\n`);

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                name: name,
                role: 'AVOCAT' // Rôle par défaut
            }
        });

        console.log('✅ Utilisateur créé avec succès !');
        console.log(`   ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Nom: ${user.name}`);
        console.log(`   Rôle: ${user.role}`);
        console.log(`   Mot de passe: ${password} (crypté en base)`);

    } catch (error) {
        if (error.code === 'P2002') {
            console.log('⚠️  Cet utilisateur existe déjà');
        } else {
            console.error('❌ Erreur:', error);
        }
    }
}

createUser()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
