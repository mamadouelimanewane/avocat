
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Tentative de connexion à MongoDB Atlas...")
    try {
        await prisma.$connect()
        console.log("✅ SUCCÈS : Connexion établie !")
        const count = await prisma.user.count()
        console.log(`Base de données accessible. Nombre d'utilisateurs actuels : ${count}`)
    } catch (e) {
        console.error("❌ ÉCHEC : Impossible de se connecter.")
        console.error("Raison probable : Votre IP n'est pas autorisée (Network Access) ou mot de passe incorrect.")
        console.error("Erreur brute :", e.message)
    } finally {
        await prisma.$disconnect()
    }
}

main()
