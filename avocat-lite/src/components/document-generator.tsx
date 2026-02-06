"use client"

import { FileText, Download, Copy, Check, X } from "lucide-react"
import { useState } from "react"

interface DocumentGeneratorProps {
    dossier: any;
    onClose: () => void;
}

export const DocumentGenerator = ({ dossier, onClose }: DocumentGeneratorProps) => {
    const [copied, setCopied] = useState(false)

    // Modèles pré-remplis Massifs
    const templates = [
        // Procédure Civile & Commerciale
        { id: 'assignation_paiement', category: 'Procédure', name: 'Assignation en Paiement' },
        { id: 'assignation_expulsion', category: 'Procédure', name: 'Assignation en Expulsion' },
        { id: 'requete_injonction', category: 'Procédure', name: "Requête en Injonction de Payer" },
        { id: 'conclusions_defense', category: 'Procédure', name: 'Conclusions en Défense' },
        { id: 'acte_appel', category: 'Procédure', name: "Acte d'Appel" },

        // Droit des Sociétés (OHADA)
        { id: 'statuts_sarl', category: 'Sociétés', name: 'Statuts SARL (Modèle OHADA)' },
        { id: 'statuts_sas', category: 'Sociétés', name: 'Statuts SAS' },
        { id: 'pv_ag_constitutive', category: 'Sociétés', name: 'PV AG Constitutive' },
        { id: 'cession_parts', category: 'Sociétés', name: 'Cession de Parts Sociales' },

        // Contrats & Travail
        { id: 'contrat_travail_cdi', category: 'Contrats', name: 'Contrat de Travail (CDI)' },
        { id: 'contrat_travail_cdd', category: 'Contrats', name: 'Contrat de Travail (CDD)' },
        { id: 'licenciement_faute', category: 'Contrats', name: 'Lettre de Licenciement' },
        { id: 'bail_commercial', category: 'Contrats', name: 'Bail Commercial OHADA' },
        { id: 'bail_habitation', category: 'Contrats', name: 'Bail Habitation (Sénégal)' },
        { id: 'nda', category: 'Contrats', name: 'Accord de Confidentialité (NDA)' },

        // Facturation
        { id: 'honoraires', category: 'Facturation', name: "Note d'Honoraires" },
    ]

    const [selectedTemplate, setSelectedTemplate] = useState('assignation_paiement')

    const generateContent = () => {
        const date = new Date().toLocaleDateString('fr-FR')
        const ref = dossier.reference || 'REF-2026-X'
        const client = dossier.client || '[NOM_DU_CLIENT]'
        const cabinet = "Maître [NOM_AVOCAT], Avocat à la Cour"

        switch (selectedTemplate) {
            case 'assignation_paiement':
                return `ASSIGNATION EN PAIEMENT (TRIBUNAL DE COMMERCE)
-----------------------------------------------------------
Réf : ${ref} | Date : ${date}

À LA REQUÊTE DE :
${client}, élisant domicile au Cabinet de son conseil soussigné.

CONTRE :
[NOM_ADVERSAIRE], demeurant à [ADRESSE_ADVERSAIRE].

OBJET DE LA DEMANDE :
Le requérant est créancier de la somme de [MONTANT] FCFA au titre de [CAUSE].
Malgré plusieurs mises en demeure restées infructueuses, le requis refuse de s'exécuter.

PAR CES MOTIFS :
- Déclarer l'action recevable.
- Condamner le requis au paiement de la somme principale susmentionnée.
- Le condamner à payer 1.000.000 FCFA à titre de dommages et intérêts pour résistance abusive.

SOUS TOUTES RÉSERVES.`

            case 'statuts_sarl':
                return `STATUTS DE LA SOCIÉTÉ À RESPONSABILITÉ LIMITÉE (SARL)
-----------------------------------------------------------
DENOMINATION : [NOM_SOCIETE]
CAPITAL : [MONTANT] FCFA

ARTICLE 1 : FORME
Il est formé entre ${client} et les éventuels autres associés, une SARL régie par l'Acte Uniforme OHADA.

ARTICLE 2 : OBJET
La société a pour objet : [OBJET_SOCIAL].

ARTICLE 3 : SIÈGE SOCIAL
Le siège social est fixé à Dakar, [ADRESSE].

ARTICLE 4 : DURÉE
La durée est de 99 ans.

ARTICLE 5 : APPORTS
${client} apporte la somme de [MONTANT] FCFA.`

            case 'contrat_travail_cdi':
                return `CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE (CDI)
-----------------------------------------------------------
ENTRE : ${client} (L'Employeur)
ET : [NOM_SALARIE] (Le Salarié)

ARTICLE 1 : ENGAGEMENT
Le salarié est engagé en qualité de [POSTE] à compter du ${date}.

ARTICLE 2 : RÉMUNÉRATION
Salaire mensuel : [MONTANT] FCFA brut.

ARTICLE 3 : LIEU DE TRAVAIL
Le lieu de travail est fixé à [LIEU].

Fait à Dakar, le ${date}.`

            case 'bail_commercial':
                return `CONTRAT DE BAIL À USAGE PROFESSIONNEL (OHADA)
-----------------------------------------------------------
BAILLEUR : [NOM_PROPRIETAIRE]
PRENEUR : ${client}

OBJET : Local situé à [ADRESSE], d'une superficie de [X] m2.

DURÉE : Le présent bail est conclu pour une durée de [X] années.

LOYER : Fixé à la somme de [MONTANT] FCFA payable mensuellement.

DÉPÔT DE GARANTIE : Correspondant à [X] mois de loyer.`

            case 'honoraires':
                return `NOTE D'HONORAIRES N° ${ref}
-----------------------------------------------------------
Date : ${date} | Client : ${client}

OBJET : Prestations juridiques - Dossier ${dossier.title}

DÉTAIL :
1. Consultations et étude de pièces : [MONTANT] FCFA
2. Rédaction d'actes (Assignation/Statuts/Contrats) : [MONTANT] FCFA
3. Déplacements et frais de greffe : [MONTANT] FCFA

TOTAL HT : [MONTANT] FCFA
TVA (18%) : [MONTANT] FCFA
TOTAL TTC : [MONTANT_TOTAL] FCFA`

            case 'requete_injonction':
                return `REQUÊTE AUX FINS D'INJONCTION DE PAYER (ACTE UNIFORME OHADA)
-----------------------------------------------------------
À Monsieur le Président du Tribunal de Commerce de Dakar

POUR : ${client}, agissant par Maître [NOM_AVOCAT].

CONTRE : [NOM_DEBITEUR]

EXPOSÉ :
Le requérant détient une créance certaine, liquide et exigible de [MONTANT] FCFA résultant de [CONTRAT/FACTURE].

PAR CES MOTIFS :
Plaira à Monsieur le Président rendre une Ordonnance portant Injonction de Payer contre le débiteur.`

            default:
                return "Modèle en cours d'indexation par la Sentinelle LexPremium..."
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(generateContent())
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([generateContent()], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${selectedTemplate}_${dossier.reference}.doc`;
        document.body.appendChild(element);
        element.click();
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-background border border-border w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
                {/* Header */}
                <div className="p-8 border-b border-border flex justify-between items-center bg-muted/40">
                    <div>
                        <div className="flex items-center gap-x-2 mb-1">
                            <span className="px-2 py-0.5 bg-secondary/20 text-secondary text-[10px] font-black rounded-full uppercase tracking-widest">IA Engine v3.0</span>
                            <h3 className="text-2xl font-black tracking-tight">Générateur LexPremium</h3>
                        </div>
                        <p className="text-xs text-muted-foreground font-light">Dossier : <span className="font-bold text-foreground">{dossier.title}</span></p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-muted rounded-2xl transition-all active:scale-95 border border-transparent hover:border-border">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                    {/* Sidebar modèles */}
                    <div className="w-full lg:w-80 border-r border-border p-6 bg-muted/20 overflow-y-auto">
                        <div className="space-y-8">
                            {['Procédure', 'Sociétés', 'Contrats', 'Facturation'].map(cat => (
                                <div key={cat}>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 pl-2 opacity-50">{cat}</p>
                                    <div className="space-y-1">
                                        {templates.filter(t => t.category === cat).map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => setSelectedTemplate(t.id)}
                                                className={`w-full text-left p-3.5 rounded-2xl text-[11px] font-bold transition-all border ${selectedTemplate === t.id
                                                        ? 'bg-primary text-primary-foreground shadow-xl border-primary'
                                                        : 'hover:bg-muted border-transparent hover:border-border text-muted-foreground hover:text-foreground'
                                                    }`}
                                            >
                                                {t.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Preview area */}
                    <div className="flex-1 p-8 bg-muted/5 overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <div className="flex items-center gap-x-2">
                                <FileText className="h-4 w-4 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-wider opacity-60">Prévisualisation Dynamique</span>
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground">UTF-8 / Rich Text Draft</span>
                        </div>
                        <div className="flex-1 bg-background border border-border p-10 rounded-[2rem] shadow-2xl overflow-y-auto whitespace-pre-wrap leading-relaxed font-serif text-sm md:text-md selection:bg-primary/20">
                            {generateContent()}
                        </div>
                    </div>
                </div>

                {/* Footer and Actions */}
                <div className="p-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6 bg-muted/40">
                    <div className="flex items-center gap-x-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">JD</div>)}
                        </div>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest hidden md:block">
                            Généré pour <span className="text-foreground font-bold">{dossier.client}</span>
                        </p>
                    </div>
                    <div className="flex gap-4 w-full sm:w-auto">
                        <button
                            onClick={handleCopy}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-x-2 px-8 py-4 border border-border bg-background rounded-2xl font-black text-xs hover:bg-muted transition-all active:scale-95"
                        >
                            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                            {copied ? "TEXTE COPIÉ" : "COPIER LE TEXTE"}
                        </button>
                        <button
                            onClick={handleDownload}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-x-3 px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs hover:opacity-90 hover:scale-105 transition-all shadow-xl shadow-primary/30 active:scale-95"
                        >
                            <Download className="h-4 w-4" />
                            EXPORTER EN .DOC
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
