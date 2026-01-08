import { PrismaClient } from '@prisma/client';
import { discoverLinks, processUrl } from './crawler';

const prisma = new PrismaClient();

// Configuration de la veille
const SEED_URLS = [
    { url: "https://www.sec.gouv.sn/lois-et-reglements", region: "SENEGAL", type: "LOIS" },
    { url: "https://www.ohada.com/actes-uniformes/", region: "OHADA", type: "ACTES" },
    { url: "https://www.droit-afrique.com/codes/senegal", region: "SENEGAL", type: "CODES" },
    { url: "https://www.coursupreme.gouv.sn/arrets/", region: "SENEGAL", type: "JURISPRUDENCE" },
    { url: "https://www.ccja.org/jurisprudence/", region: "OHADA", type: "JURISPRUDENCE" },
];

interface VeilleConfig {
    enabled: boolean;
    interval: number; // en heures
    maxPerSource: number;
    lastRun?: Date;
}

let veilleInterval: NodeJS.Timeout | null = null;
let isRunning = false;

/**
 * Démarre la veille juridique automatique
 */
export async function startVeille(config: VeilleConfig = { enabled: true, interval: 24, maxPerSource: 5 }) {
    if (isRunning) {
        console.log('⚠️  Veille déjà en cours...');
        return { success: false, message: 'Veille déjà active' };
    }

    console.log('🚀 Démarrage de la veille juridique automatique...');
    isRunning = true;

    // Exécution immédiate
    await runVeilleCycle(config.maxPerSource);

    // Planification des exécutions suivantes
    veilleInterval = setInterval(() => {
        runVeilleCycle(config.maxPerSource);
    }, config.interval * 60 * 60 * 1000); // Conversion heures -> millisecondes

    return { success: true, message: `Veille démarrée (intervalle: ${config.interval}h)` };
}

/**
 * Arrête la veille juridique
 */
export function stopVeille() {
    if (veilleInterval) {
        clearInterval(veilleInterval);
        veilleInterval = null;
        isRunning = false;
        console.log('⏸️  Veille juridique arrêtée');
        return { success: true, message: 'Veille arrêtée' };
    }
    return { success: false, message: 'Aucune veille active' };
}

/**
 * Statut de la veille
 */
export function getVeilleStatus() {
    return {
        isRunning,
        sources: SEED_URLS.length,
        lastRun: null // À implémenter avec Prisma pour persister
    };
}

/**
 * Cycle complet de veille (scan de toutes les sources)
 */
async function runVeilleCycle(maxPerSource: number) {
    console.log('\n🔍 === CYCLE DE VEILLE JURIDIQUE ===');
    console.log(`⏰ ${new Date().toLocaleString('fr-FR')}\n`);

    let totalFound = 0;
    let totalImported = 0;

    for (const seed of SEED_URLS) {
        console.log(`\n📡 Scan: ${seed.url} (${seed.region})...`);

        try {
            const scanResult = await discoverLinks(seed.url);

            if (!scanResult.success || !scanResult.links) {
                console.log(`   ❌ Échec du scan`);
                continue;
            }

            const candidates = scanResult.links.slice(0, maxPerSource);
            console.log(`   👉 ${candidates.length} liens candidats trouvés`);

            for (const candidate of candidates) {
                // Vérifier si déjà en base
                const exists = await prisma.jurisprudence.findFirst({
                    where: { sourceUrl: candidate.href }
                });

                if (exists) {
                    console.log(`      ⏭️  Déjà connu: ${candidate.text.substring(0, 40)}...`);
                    continue;
                }

                console.log(`      📥 NOUVEAU: ${candidate.text.substring(0, 40)}...`);

                const crawlResult = await processUrl(candidate.href, seed.region);

                if (crawlResult.success) {
                    console.log(`         ✅ Importé avec succès`);
                    totalImported++;
                } else {
                    console.log(`         ⚠️  Échec crawl`);
                }

                // Pause entre requêtes (politesse)
                await sleep(2000);
            }

            totalFound += candidates.length;
        } catch (error) {
            console.error(`   ❌ Erreur sur ${seed.url}:`, error);
        }

        // Pause entre sources
        await sleep(3000);
    }

    console.log('\n========================================');
    console.log(`🏁 FIN DU CYCLE`);
    console.log(`   Sites scannés: ${SEED_URLS.length}`);
    console.log(`   Candidats examinés: ${totalFound}`);
    console.log(`   Nouveaux documents: ${totalImported}`);
    console.log('========================================\n');

    return { totalFound, totalImported };
}

/**
 * Exécution manuelle d'un cycle unique (contrôle admin)
 */
export async function runManualCycle(maxPerSource: number = 5) {
    console.log('🎯 Lancement manuel d\'un cycle de veille...');
    return await runVeilleCycle(maxPerSource);
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Export pour usage en ligne de commande
if (require.main === module) {
    startVeille({ enabled: true, interval: 24, maxPerSource: 3 })
        .then(() => {
            console.log('✅ Veille initialisée. Appuyez sur Ctrl+C pour arrêter.');
        })
        .catch(console.error);
}
