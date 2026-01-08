import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createProductionUser() {
    const email = "Diamimi@gmail.com";
    const password = "12345678";
    const name = "Utilisateur Diamimi";

    console.log(`🌐 CRÉATION UTILISATEUR EN PRODUCTION`);
    console.log(`   Email: ${email}`);
    console.log(`   Base: ${process.env.DATABASE_URL?.includes('lexpremium') ? 'lexpremium (PROD)' : 'avocat (LOCAL)'}\n`);

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                name: name,
                role: 'AVOCAT'
            }
        });

        console.log('✅ Utilisateur créé avec succès en PRODUCTION !');
        console.log(`   ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Nom: ${user.name}`);
        console.log(`   Rôle: ${user.role}`);
        console.log(`\n🔑 Identifiants de connexion:`);
        console.log(`   Email: ${email}`);
        console.log(`   Mot de passe: ${password}`);
        console.log(`\n🌍 URL de connexion:`);
        console.log(`   https://avocat-tito-mamadou-dias-projects-979b1f4f.vercel.app/login`);

    } catch (error) {
        if (error.code === 'P2002') {
            console.log('✅ Utilisateur existe déjà en production');

            // Récupérer l'utilisateur existant
            const existing = await prisma.user.findUnique({ where: { email } });
            console.log(`   ID: ${existing?.id}`);
            console.log(`   Nom: ${existing?.name}`);
        } else {
            console.error('❌ Erreur:', error);
        }
    }
}

createProductionUser()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
