
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Real Legal Texts...')

    const realData = [
        {
            reference: "AUDCG-2010",
            content: `ACTE UNIFORME PORTANT SUR LE DROIT COMMERCIAL GÉNÉRAL (AUDCG)
Adoption : 15/12/2010 | Entrée en vigueur : 15/05/2011

LIVRE I : STATUT DU COMMERÇANT ET DE L'ENTREPRENANT

TITRE I : STATUT DU COMMERÇANT
CHAPITRE I : DÉFINITION DU COMMERÇANT ET DES ACTES DE COMMERCE

Article 2
Est commerçant celui qui fait de l'accomplissement d'actes de commerce par nature sa profession.

Article 3
L'acte de commerce par nature est celui par lequel une personne s'entremet dans la circulation des biens qu'elle produit ou achète ou par lequel elle fournit des prestations de service avec l'intention d'en tirer un profit pécuniaire.
Ont, notamment, le caractère d'actes de commerce par nature :
- l'achat de biens, meubles ou immeubles, en vue de leur revente ;
- les opérations de banque, de bourse, de change, de courtage, d'assurance, et de transit ;
- les contrats entre commerçants pour les besoins de leur commerce ;
- l'exploitation industrielle des mines, carrières et de tout gisement de ressources naturelles.

Article 4
Ont également le caractère d'actes de commerce, et ce, par leur forme la lettre de change et le billet à ordre, et le warrant.

Article 5
Les actes de commerce peuvent se prouver par tous moyens à l'égard des commerçants.

CHAPITRE II : CAPACITÉ D'EXERCER LE COMMERCE

Article 6
Nul ne peut accomplir des actes de commerce à titre de profession, s'il n'est juridiquement capable d'exercer le commerce.

Article 7
Le mineur, sauf s'il est émancipé, ne peut avoir la qualité de commerçant ni effectuer des actes de commerce.`
        },
        {
            reference: "LOI-63-62",
            content: `CODE DES OBLIGATIONS CIVILES ET COMMERCIALES DU SENEGAL (COCC)
Partie Générale - Loi n° 63-62 du 10 juillet 1963

DISPOSITIONS PRÉLIMINAIRES

Article 1 : Définition de l'obligation.
L'obligation lie un débiteur à son créancier en donnant à celui-ci le droit d'exiger une prestation ou une abstention.

Article 2 : Domaine d'application du présent code.
Sauf disposition contraire, la partie générale du présent Code s'applique sans distinction aux obligations civiles et commerciales. Les diverses catégories de contrats sont soumises de plus aux règles particulières du titre consacré aux contrats spéciaux.
Les obligations civiles qui naissent des infractions pénales sont en outre régies par les dispositions du droit pénal.

TITRE PRÉLIMINAIRE

CHAPITRE 1 : LES DIVERSES SORTES D'OBLIGATIONS.

Article 3 : Classification.
L'obligation a pour objet de donner, de faire ou de ne pas faire quelque chose.

Article 4 : Objet de l'obligation de donner.
Celui qui est obligé à donner une chose doit en transférer la propriété ou les droits qu'il a sur la chose principale et ses accessoires. Il est tenu d'assurer la délivrance selon les règles d'exécution des obligations.

Article 5 : Exécution de l'obligation de donner, transfert de la propriété.
Le créancier acquiert le droit sur la chose au moment de la délivrance, sauf volonté contraire des parties et sous réserve des dispositions particulières à la propriété foncière.`
        }
    ]

    for (const item of realData) {
        const doc = await prisma.jurisprudence.findFirst({ where: { reference: item.reference } })
        if (doc) {
            await prisma.jurisprudence.update({
                where: { id: doc.id },
                data: { content: item.content }
            })
            console.log(`Updated content for ${item.reference}`)
        } else {
            console.log(`Reference ${item.reference} not found, skipping update.`)
        }
    }

    console.log('Real text injection completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
