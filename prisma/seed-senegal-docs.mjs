
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seed() {
    console.log('📄 Ajout des documents au dossier SCI Horizon Dakar...')

    // On récupère le dossier créé précédemment
    const dossier = await prisma.dossier.findFirst({
        where: { reference: '2026/TF/MBAO-042' }
    })

    if (!dossier) {
        console.error('❌ Dossier introuvable. Veuillez lancer le premier script de seed.')
        return
    }

    // 1. Assignation en Référé
    await prisma.document.create({
        data: {
            name: 'Assignation en Référé d\'Heure à Heure',
            status: 'SIGNED',
            folder: '/Conclusions',
            dossierId: dossier.id,
            versions: {
                create: {
                    version: 1,
                    path: '/demo_ged/SCI_Horizon_Dakar_2026/Conclusions/Assignation_V1.pdf',
                    size: 1024 * 450, // 450 KB
                    comment: 'Version signée par Maître'
                }
            }
        }
    })

    // 2. Titre Foncier
    await prisma.document.create({
        data: {
            name: 'Copie Titre Foncier n°14.782/R (Original)',
            status: 'ARCHIVED',
            folder: '/Pieces_Justificatives',
            dossierId: dossier.id,
            versions: {
                create: {
                    version: 1,
                    path: '/demo_ged/SCI_Horizon_Dakar_2026/Pieces_Justificatives/TF_Original.pdf',
                    size: 1024 * 1200, // 1.2 MB
                    comment: 'Numérisation haute définition'
                }
            }
        }
    })

    // 3. PV Huissier
    await prisma.document.create({
        data: {
            name: 'PV de Constat de Sommations interpellatives',
            status: 'REVIEW',
            folder: '/Actes_Huissier',
            dossierId: dossier.id,
            versions: {
                create: {
                    version: 1,
                    path: '/demo_ged/SCI_Horizon_Dakar_2026/Actes_Huissier/PV_Constat_Mbao.pdf',
                    size: 1024 * 850,
                    comment: 'En attente de validation par l\'associé'
                }
            }
        }
    })

    console.log('✅ Documents de démonstration créés avec succès !')
}

seed()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
