import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const newPassword = "Astelwane123";
    console.log(`🔒 Traitement en cours... Hachage du mot de passe "${newPassword}"`);

    // Hash the password with cost 10
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log(`🔑 Mot de passe haché généré. Mise à jour de tous les utilisateurs...`);

    // Update all users
    const result = await prisma.user.updateMany({
        data: {
            password: hashedPassword
        }
    });

    console.log(`✅ Succès ! ${result.count} utilisateurs ont maintenant le mot de passe : ${newPassword}`);
}

main()
    .catch((e) => {
        console.error("❌ Erreur lors de la mise à jour :", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
