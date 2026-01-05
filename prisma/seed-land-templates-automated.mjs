
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('📝 GÉNÉRATION DE MODÈLES D\'ACTES FONCIERS AVANCÉS...')

    const landTemplates = [
        {
            name: "Réquisition d'Immatriculation Foncière",
            category: "FONCIER",
            variables: JSON.stringify(["NOM_REQUERANT", "ADRESSE_TERRAIN", "SURFACE", "VALEUR_ESTIMEE"]),
            content: `
                <div style="font-family: serif; padding: 40px; line-height: 1.6;">
                    <h2 style="text-align: center; text-decoration: underline;">RÉQUISITION D'IMMATRICULATION</h2>
                    <p style="text-align: right;">A Monsieur le Conservateur de la Propriété Foncière</p>
                    <p>Je soussigné(e) <b>{{NOM_REQUERANT}}</b>, agissant pour mon propre compte, sollicite par la présente l'immatriculation au Livre Foncier du Sénégal de l'immeuble dont la désignation suit :</p>
                    
                    <ul style="list-style: none;">
                        <li><b>Désignation :</b> {{ADRESSE_TERRAIN}}</li>
                        <li><b>Contenance :</b> {{SURFACE}} m² environ</li>
                        <li><b>Limites :</b> Selon plan de bornage ci-joint</li>
                        <li><b>Valeur estimée :</b> {{VALEUR_ESTIMEE}} FCFA</li>
                    </ul>

                    <p>J'affirme avoir une possession paisible, publique et non équivoque de cet immeuble conformément à la Loi 64-46 sur le Domaine National et au Décret de 1932.</p>
                    
                    <p style="margin-top: 50px;">Fait à Dakar, le .........................</p>
                    <p style="margin-top: 20px;">Signature du Requérant</p>
                </div>
            `
        },
        {
            name: "Assignation en Expulsion (Occupant sans droit ni titre)",
            category: "FONCIER",
            variables: JSON.stringify(["PROPRIETAIRE", "OCCUPANT", "ADRESSE_IMMEUBLE", "TRIBUNAL"]),
            content: `
                <div style="font-family: serif; padding: 40px;">
                    <h2 style="text-align: center;">ASSIGNATION EN EXPULSION</h2>
                    <p><b>À LA REQUÊTE DE :</b> {{PROPRIETAIRE}}, ayant pour conseil Maître [NOM_AVOCAT], avocat à la Cour.</p>
                    <p><b>CONTRE :</b> {{OCCUPANT}}, occupant sans droit ni titre le local sis à {{ADRESSE_IMMEUBLE}}.</p>
                    
                    <hr/>
                    <h3>PLAISE AU TRIBUNAL ({{TRIBUNAL}})</h3>
                    <p>Le requérant est propriétaire légitime de l'immeuble objet du Titre Foncier n° [NUM_TF].</p>
                    <p>Il est constaté que le défendeur occupe les lieux sans aucun contrat de bail ni autorisation expresse de mon client.</p>
                    
                    <p>Conformément au Code des Obligations Civiles et Commerciales (COCC), le propriétaire a le droit de revendiquer son bien contre tout détenteur illégitime.</p>
                    
                    <h4>PAR CES MOTIFS</h4>
                    <ul>
                        <li>Constater l'occupation illégale de {{OCCUPANT}}.</li>
                        <li>Ordonner son expulsion immédiate, ainsi que celle de tout occupant de son chef.</li>
                        <li>Assortir cette mesure d'une astreinte de 100.000 FCFA par jour de retard.</li>
                    </ul>
                </div>
            `
        },
        {
            name: "Demande de Transformation de Titre Précaire en Titre Foncier",
            category: "FONCIER",
            variables: JSON.stringify(["BENEFICIAIRE", "NUMERO_PERMIS", "ZONE_PLU"]),
            content: `
                <div style="font-family: sans-serif; padding: 40px; border: 1px solid #ddd;">
                    <h2 style="text-align: center; color: #1e40af;">DEMANDE DE MUTATION EN TITRE FONCIER</h2>
                    <p><b>Objet :</b> Application de la Loi n° 2011-06</p>
                    <p>Monsieur le Directeur des Domaines,</p>
                    <p>Titulaire du Permis d'Habiter/Bail n° <b>{{NUMERO_PERMIS}}</b> portant sur la parcelle située dans la zone de {{ZONE_PLU}}, je sollicite la transformation de ce titre précaire en Titre Foncier définitif.</p>
                    <p>Je m'engage à m'acquitter de la valeur des impenses et des frais de bornage réglementaires.</p>
                    <p>Veuillez agréer, Monsieur le Directeur, l'expression de mes salutations distinguées.</p>
                </div>
            `
        },
        {
            name: "Mise en Demeure de Payer (Bail Habitation - Décret 2023)",
            category: "FONCIER",
            variables: JSON.stringify(["BAILLEUR", "LOCATAIRE", "MONTANT_ARRIERE", "MOIS_IMPAYES"]),
            content: `
                <div style="font-family: Arial, sans-serif; padding: 40px; background: #f9fafb;">
                    <h2 style="color: #991b1b;">MISE EN DEMEURE - DERNIER AVIS</h2>
                    <p><b>Bailleur :</b> {{BAILLEUR}}</p>
                    <p><b>Locataire :</b> {{LOCATAIRE}}</p>
                    
                    <p>Sauf erreur de notre part, votre compte locataire présente un solde débiteur de <b>{{MONTANT_ARRIERE}} FCFA</b> correspondant aux mois de : {{MOIS_IMPAYES}}.</p>
                    
                    <p>Nous vous rappelons que conformément au Décret 2023-382 et au COCC, le loyer est exigible à terme échu.</p>
                    <p>À défaut de règlement sous 48 heures, nous saisirons la Commission de Régulation du Loyer et le Tribunal pour expulsion immédiate.</p>
                </div>
            `
        }
    ];

    for (const template of landTemplates) {
        const existing = await prisma.template.findFirst({
            where: { name: template.name }
        });

        if (existing) {
            await prisma.template.update({
                where: { id: existing.id },
                data: template
            });
            console.log(`🔄 Modèle mis à jour : ${template.name}`);
        } else {
            await prisma.template.create({
                data: template
            });
            console.log(`✅ Modèle créé : ${template.name}`);
        }
    }

    console.log('🚀 GÉNÉRATION DES MODÈLES FONCIERS TERMINÉE.');
}

main()
    .catch(e => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())
