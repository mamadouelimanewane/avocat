import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function diagnoseUser() {
    const email = "Diamimi@gmail.com";
    const expectedPassword = "12345678";

    console.log('🔍 DIAGNOSTIC UTILISATEUR PRODUCTION\n');
    console.log(`Email: ${email}`);
    console.log(`Base: ${process.env.DATABASE_URL?.includes('lexpremium') ? 'lexpremium (PROD)' : 'avocat (LOCAL)'}\n`);

    // Rechercher l'utilisateur
    const user = await prisma.user.findFirst({
        where: {
            email: {
                equals: email,
                mode: 'insensitive'
            }
        }
    });

    if (!user) {
        console.log('❌ UTILISATEUR NON TROUVÉ dans cette base !');
        console.log('\n📋 Utilisateurs présents:');
        const all = await prisma.user.findMany({ select: { email: true, name: true } });
        all.forEach(u => console.log(`   • ${u.email} (${u.name})`));
        return;
    }

    console.log('✅ Utilisateur trouvé:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Nom: ${user.name}`);
    console.log(`   Rôle: ${user.role}`);
    console.log(`   Hash présent: ${user.password ? 'OUI' : 'NON'}`);
    console.log(`   Hash (15 premiers): ${user.password?.substring(0, 15)}...`);

    // Test de vérification du mot de passe
    if (user.password) {
        console.log('\n🔐 Test de vérification du mot de passe...');
        const isValid = await bcrypt.compare(expectedPassword, user.password);

        if (isValid) {
            console.log(`✅ Le mot de passe "${expectedPassword}" est CORRECT`);
        } else {
            console.log(`❌ Le mot de passe "${expectedPassword}" est INCORRECT`);
            console.log('\n⚠️  PROBLÈME DÉTECTÉ : Le hash ne correspond pas !');
            console.log('   Recréation du mot de passe nécessaire...');

            // Recréer le hash
            const newHash = await bcrypt.hash(expectedPassword, 10);
            await prisma.user.update({
                where: { id: user.id },
                data: { password: newHash }
            });

            console.log('✅ Mot de passe mis à jour !');
            console.log('   Veuillez réessayer la connexion.');
        }
    } else {
        console.log('\n❌ AUCUN MOT DE PASSE défini pour cet utilisateur !');
        console.log('   Création du mot de passe...');

        const newHash = await bcrypt.hash(expectedPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: newHash }
        });

        console.log('✅ Mot de passe créé !');
    }
}

diagnoseUser()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
