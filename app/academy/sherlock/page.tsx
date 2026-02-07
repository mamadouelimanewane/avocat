"use client"

import { useState } from "react"
import {
    Search,
    FileText,
    Mail,
    Smartphone,
    MapPin,
    Siren,
    Eye,
    CheckCircle2,
    AlertTriangle,
    TriangleAlert,
    Fingerprint,
    Unlock,
    ScanLine,
    Database,
    Briefcase
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// --- TYPES ---
type EvidenceItem = {
    id: string
    type: 'bank' | 'email' | 'whatsapp' | 'legal' | 'photo'
    title: string
    content: string
    clue: boolean // Is this actually part of the solution? (Internal use)
    description: string
}

type Scenario = {
    id: string
    title: string
    ref: string
    description: string
    goal: string
    correctEvidenceIds: string[]
    conclusion: string
    hint: string
    evidence: EvidenceItem[]
}

// --- DATA: SCENARIOS ---
const SCENARIO_DB: Scenario[] = [
    {
        id: 'abs_teranga',
        title: 'Dossier "Teranga" - Abus de Biens Sociaux',
        ref: 'SH-2026-092B',
        description: "Enquête sur l'achat suspect d'un véhicule de luxe par la société Teranga Immo.",
        goal: "Identifiez les preuves constitutives de l'Abus de Biens Sociaux (ABS).",
        correctEvidenceIds: ["doc_2", "doc_4"],
        conclusion: "Corrélation Détectée : L'Email prouve l'intention personnelle et le PV d'AG prouve le dépassement de l'objet social. Conclusion : ABS (Art. 891 AUSCGIE).",
        hint: "Cherchez l'élément intentionnel et la violation de l'intérêt social.",
        evidence: [
            {
                id: "doc_1",
                type: "bank",
                title: "Relevé CBAO - Janvier 2026",
                content: "DÉBIT: 15.000.000 FCFA | LIBELLÉ: 'Achat Véhicule Service' | BÉNÉFICIAIRE: 'Sénégal Auto Luxury'",
                clue: false,
                description: "Opération d'apparence normale."
            },
            {
                id: "doc_2",
                type: "email",
                title: "Email Intercepté - 12 Jan",
                content: "De: DG <dg@teranga-immo.sn> | A: Concessionnaire. 'Mettez la carte grise à mon nom personnel (Amadou Fall)... C'est pour ma femme.'",
                clue: true,
                description: "Preuve directe de l'intention frauduleuse."
            },
            {
                id: "doc_3",
                type: "whatsapp",
                title: "Note Vocale Transcrite",
                content: "Audio 'Audi_Q8_Commande.mp3' (0:45) - Discussion sur la couleur du véhicule.",
                clue: false,
                description: "Élément contextuel."
            },
            {
                id: "doc_4",
                type: "legal",
                title: "PV Assemblée Générale 2025",
                content: "Résolution 4: 'L'AG autorise l'achat d'un véhicule utilitaire pour les chantiers, budget max 8M FCFA.'",
                clue: true,
                description: "Dépassement de mandat (15M vs 8M) + Détournement usage."
            }
        ]
    },
    {
        id: 'blanchiment_saly',
        title: 'Opération "Saly Sunset" - Blanchiment',
        ref: 'SH-2026-104C',
        description: "Achat d'une résidence secondaire d'une valeur de 200M FCFA par un fonctionnaire.",
        goal: "Identifiez l'origine douteuse des fonds et le montage écran.",
        correctEvidenceIds: ["ev_2", "ev_3"],
        conclusion: "Alerte Rouge : Le reçu de dépôt espèce n'a aucune traçabilité et les statuts révèlent une coquille vide gérée par un prête-nom. Présomption de Blanchiment.",
        hint: "L'argent liquide massif et les sociétés sans activité réelle sont des marqueurs.",
        evidence: [
            {
                id: "ev_1",
                type: "legal",
                title: "Titre Foncier N° 4421/Mbour",
                content: "Mutation de propriété. Vendeur: SCI Horizon. Acquéreur: M. Diop (Fonctionnaire). Prix déclaré: 200.000.000 FCFA.",
                clue: false,
                description: "L'acte notarié semble en règle formellement."
            },
            {
                id: "ev_2",
                type: "bank",
                title: "Bordereau Devises Cash",
                content: "Dépôt Espèces: 150.000.000 FCFA en coupures de 10.000. Guichet: Agence Plateau. Motif: 'Économies personnelles'.",
                clue: true,
                description: "Volume d'espèces suspect sans justificatif d'origine."
            },
            {
                id: "ev_3",
                type: "legal",
                title: "Statuts SCI 'Ombre'",
                content: "Associé Unique: Un étudiant de 22 ans (neveu de l'acquéreur). Capital Social: 10.000 FCFA. Siège social: Boite Postale.",
                clue: true,
                description: "Société écran typique (Bénéficiaire Effectif dissimulé)."
            },
            {
                id: "ev_4",
                type: "email",
                title: "Email Notaire",
                content: "Relance pour paiement des frais d'enregistrement.",
                clue: false,
                description: "Procédure administrative standard."
            }
        ]
    },
    {
        id: 'licenciement_frauduleux',
        title: 'Affaire "Call Center" - Licenciement',
        ref: 'SH-2026-055S',
        description: "Un délégué du personnel est licencié pour 'Faute Lourde' suite à une altercation.",
        goal: "Prouvez que le licenciement était prémédité et discriminatoire.",
        correctEvidenceIds: ["soc_1", "soc_3"],
        conclusion: "Nullité Absolue : L'Email RH prouve la préméditation avant la faute alléguée. Le licenciement d'un délégué sans autorisation est nul.",
        hint: "La chronologie est cruciale. Regardez les dates des emails par rapport à l'incident.",
        evidence: [
            {
                id: "soc_1",
                type: "email",
                title: "Email DRH Interne - 02 Fév",
                content: "De: DRH | A: CEO. 'Le délégué Ndiaye devient gênant pour les Négociations Annuelles. Il faut trouver un prétexte pour le sortir avant le 15.'",
                clue: true,
                description: "Preuve accablante de la préméditation et du motif réel."
            },
            {
                id: "soc_2",
                type: "legal",
                title: "Lettre de Licenciement - 10 Fév",
                content: "Motif: Insubordination caractérisée lors de la réunion du 09 Février. Mise à pied conservatoire immédiate.",
                clue: false,
                description: "La lettre formalise la sanction, mais ne prouve pas la fraude en soi."
            },
            {
                id: "soc_3",
                type: "legal",
                title: "Mandat Délégué Personnel",
                content: "Élu le 12 Janvier 2024. Mandat en cours. Statut : Salarié Protégé.",
                clue: true,
                description: "Confirme le statut protégé => Autorisation Inspecteur Travail requise (absente ici)."
            },
            {
                id: "soc_4",
                type: "whatsapp",
                title: "Témoignage Collègue",
                content: "Audio : 'Oui, il a crié fort en réunion, c'était chaud.'",
                clue: false,
                description: "Confirme l'altercation, ce qui pourrait valider la faute lourde sans la préméditation."
            }
        ]
    },
    {
        id: 'ponzi_crypto',
        title: 'Affaire "Sénégal-Coin" - Pyramide de Ponzi',
        ref: 'FIN-2026-88A',
        description: "Une start-up promettant 20% de rendements mensuels sur les cryptos s'effondre.",
        goal: "Démontrez que les 'dividendes' étaient payés avec l'argent des nouveaux entrants (Système de Ponzi).",
        correctEvidenceIds: ["fin_2", "fin_3"],
        conclusion: "Escroquerie Caractérisée : Le fichier Excel interne montre que les entrées de capitaux financent directement les sorties 'dividendes'. Aucune activité de trading réelle n'existe.",
        hint: "Cherchez la source réelle des fonds utilisés pour payer les 'bénéfices'.",
        evidence: [
            {
                id: "fin_1",
                type: "photo",
                title: "Brochure Marketing",
                content: "Image: 'Investissez dans le futur. Rendement garanti 20%/mois grâce à notre IA de trading quantique.'",
                clue: false,
                description: "Promesse irréaliste, indicatrice d'arnaque mais pas une preuve légale du mécanisme."
            },
            {
                id: "fin_2",
                type: "bank",
                title: "Grand Livre (Fichier Excel)",
                content: "Ligne 402: Entrée Client X (+5M) -> Immédiatement viré vers Client Y (Libellé 'Dividende Janvier'). Solde Trading: 0 FCFA.",
                clue: true,
                description: "La preuve mathématique du système pyramidal (Money in = Money out)."
            },
            {
                id: "fin_3",
                type: "email",
                title: "Email Fondateur à Comptable",
                content: "De: CEO | A: CFO. 'Il nous faut 30 nouveaux clients cette semaine pour payer les sortants de Mars, sinon ça explose.'",
                clue: true,
                description: "Aveu explicite de la cavalerie financière."
            },
            {
                id: "fin_4",
                type: "whatsapp",
                title: "Plaintes Clients Telegram",
                content: "Groupe 'Investisseurs VIP': 'Je n'arrive pas à retirer mes fonds depuis 48h !'",
                clue: false,
                description: "Signe l'effondrement du système, mais ne qualifie pas l'escroquerie juridiquement."
            }
        ]
    },
    {
        id: 'fraude_tva',
        title: 'Dossier "Carrousel" - Fraude Fiscale',
        ref: 'FIS-2026-102X',
        description: "Une société de négoce demande un remboursement de crédit de TVA de 500 Millions FCFA.",
        goal: "Prouvez que les transactions sont fictives et destinées uniquement à détourner la TVA.",
        correctEvidenceIds: ["tva_1", "tva_4"],
        conclusion: "Fraude Fiscale : La société fournisseur est une coquille vide (Taxi-Phone) et la marchandise n'a jamais quitté le port (Bon de sortie manquant).",
        hint: "Vérifiez la réalité matérielle du fournisseur et de la marchandise.",
        evidence: [
            {
                id: "tva_1",
                type: "photo",
                title: "Photo Investigation Terrain",
                content: "Adresse du Fournisseur 'Global Tech Sarl' (Facture de 500M) : C'est une boutique de transfert d'argent (Wari) abandonnée.",
                clue: true,
                description: "Prouve que le fournisseur est une société fictive ('Taxi-Phone')."
            },
            {
                id: "tva_2",
                type: "legal",
                title: "Déclaration TVA",
                content: "Formulaire : Crédit TVA reportable de 450M FCFA suite à 'achat massif de matériel informatique'.",
                clue: false,
                description: "La demande administrative qui déclenche le contrôle."
            },
            {
                id: "tva_3",
                type: "bank",
                title: "Relevé Bancaire",
                content: "Virement de 500M vers le fournisseur 'Global Tech'.",
                clue: false,
                description: "Le flux financier existe, ce qui donne une apparence de légalité."
            },
            {
                id: "tva_4",
                type: "legal",
                title: "Rapport Douanier (Contre-Vérification)",
                content: "Aucune importation de matériel informatique enregistrée au nom de 'Global Tech' ou du client sur la période.",
                clue: true,
                description: "Absence de matérialité de la transaction. La TVA a été facturée sur du vent."
            }
        ]
    }
]

export default function SherlockCasePage() {
    const [activeScenario, setActiveScenario] = useState<Scenario | null>(null) // Null = Selection Screen
    const [selectedEvidence, setSelectedEvidence] = useState<string[]>([])
    const [status, setStatus] = useState<'investigating' | 'solved' | 'failed'>('investigating')

    const startScenario = (scenario: Scenario) => {
        setActiveScenario(scenario)
        setSelectedEvidence([])
        setStatus('investigating')
    }

    const toggleEvidence = (id: string) => {
        if (status !== 'investigating') return

        if (selectedEvidence.includes(id)) {
            setSelectedEvidence(prev => prev.filter(e => e !== id))
        } else {
            setSelectedEvidence(prev => [...prev, id])
        }
    }

    const submitInvestigation = () => {
        if (!activeScenario) return

        const correctIds = activeScenario.correctEvidenceIds
        const isMatch = selectedEvidence.length === correctIds.length && selectedEvidence.every(id => correctIds.includes(id))

        if (isMatch) {
            setStatus('solved')
        } else {
            setStatus('failed')
        }
    }

    // --- LOBBY SCREEN ---
    if (!activeScenario) {
        return (
            <div className="min-h-screen bg-slate-950 p-8 text-slate-100">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center space-y-6 animate-in slide-in-from-top-10 duration-700">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 font-bold uppercase tracking-widest text-sm mb-4">
                            <ScanLine className="w-4 h-4" /> Sherlock Investigation
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-4">
                            Bureau des <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">Enquêtes</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Sélectionnez un dossier classifié. Votre mission : Analyser les pièces saisies et confondre les coupables par la preuve juridique.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {SCENARIO_DB.map((scenario) => (
                            <Card
                                key={scenario.id}
                                className="bg-slate-900 border-white/5 overflow-hidden group hover:border-amber-500/50 transition-all cursor-pointer hover:-translate-y-2 duration-300"
                                onClick={() => startScenario(scenario)}
                            >
                                <div className="h-40 bg-slate-800 relative p-6 flex flex-col justify-between">
                                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                                    <div className="absolute top-0 right-0 p-4 opacity-50">
                                        <Briefcase className="w-16 h-16 text-slate-600" />
                                    </div>
                                    <Badge variant="outline" className="w-fit bg-black/50 border-white/10 text-white backdrop-blur-sm">
                                        {scenario.ref}
                                    </Badge>
                                    <h3 className="text-2xl font-black text-white leading-tight z-10">{scenario.title}</h3>
                                </div>
                                <CardContent className="p-6 space-y-4">
                                    <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                                        {scenario.description}
                                    </p>
                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-xs font-mono text-amber-500 uppercase tracking-widest flex items-center gap-2">
                                            <Database className="w-3 h-3" /> {scenario.evidence.length} Pièces
                                        </span>
                                        <Button size="sm" className="bg-white/5 hover:bg-amber-500 hover:text-slate-900 text-white transition-colors uppercase font-bold text-xs rounded-lg">
                                            Ouvrir Dossier
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // --- GAME SCREEN (Reusing existing layout with dynamic data) ---
    return (
        <div key={activeScenario.id} className="min-h-screen bg-slate-950 p-6 font-sans text-slate-100 flex flex-col animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
                <div className="space-y-2">
                    <Button
                        variant="ghost"
                        className="pl-0 text-slate-500 hover:text-white mb-2"
                        onClick={() => setActiveScenario(null)}
                    >
                        ← Retour aux Dossiers
                    </Button>
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-rose-500/50 text-rose-500 bg-rose-500/10 px-3 py-1 font-black animate-pulse">
                            <Siren className="w-3 h-3 mr-2" /> DOSSIER ACTIF
                        </Badge>
                        <span className="text-slate-500 font-mono text-xs uppercase tracking-widest">REF: {activeScenario.ref}</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        {activeScenario.title}
                    </h1>
                    <p className="text-slate-400 max-w-xl">
                        {activeScenario.goal}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">

                {/* EVIDENCE BOARD */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-black flex items-center gap-3">
                            <Search className="w-6 h-6 text-amber-500" />
                            Pièces à Conviction ({activeScenario.evidence.length})
                        </h2>

                        {/* Status Message */}
                        {status === 'solved' && (
                            <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 px-4 py-2 rounded-lg font-black text-sm animate-in zoom-in flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" /> SUCCÈS : DOCTRINE CONFIRMÉE
                            </div>
                        )}
                        {status === 'failed' && (
                            <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 px-4 py-2 rounded-lg font-black text-sm animate-in zoom-in flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" /> ÉCHEC : PREUVES INSUFFISANTES
                            </div>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {activeScenario.evidence.map((doc) => (
                            <Card
                                key={doc.id}
                                className={cn(
                                    "cursor-pointer group relative overflow-hidden transition-all duration-300 border-2",
                                    selectedEvidence.includes(doc.id)
                                        ? "bg-amber-500/10 border-amber-500/80 shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]"
                                        : "bg-slate-900/50 border-white/5 hover:border-white/20 hover:bg-slate-900"
                                )}
                                onClick={() => toggleEvidence(doc.id)}
                            >
                                {/* Selection Indicator */}
                                <div className={cn(
                                    "absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                    selectedEvidence.includes(doc.id)
                                        ? "bg-amber-500 border-amber-500 text-slate-900"
                                        : "border-slate-600 text-transparent"
                                )}>
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>

                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={cn("p-2 rounded-lg",
                                            doc.type === 'bank' ? "bg-emerald-500/20 text-emerald-500" :
                                                doc.type === 'email' ? "bg-blue-500/20 text-blue-500" :
                                                    doc.type === 'legal' ? "bg-violet-500/20 text-violet-500" :
                                                        "bg-slate-500/20 text-slate-400"
                                        )}>
                                            {doc.type === 'bank' && <Fingerprint className="w-5 h-5" />}
                                            {doc.type === 'email' && <Mail className="w-5 h-5" />}
                                            {doc.type === 'whatsapp' && <Smartphone className="w-5 h-5" />}
                                            {doc.type === 'legal' && <FileText className="w-5 h-5" />}
                                        </div>
                                        <h3 className="font-bold text-slate-200 line-clamp-1">{doc.title}</h3>
                                    </div>

                                    <p className="text-sm font-mono text-slate-400 bg-black/40 p-3 rounded-lg border-l-2 border-slate-700 min-h-[5rem]">
                                        {doc.content}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* ANALYSIS TERMINAL */}
                <div className="space-y-6 flex flex-col">
                    <h2 className="text-xl font-black flex items-center gap-3">
                        <ScanLine className="w-6 h-6 text-emerald-500" />
                        Terminal Nexus
                    </h2>

                    <div className="flex-1 bg-black rounded-3xl border border-emerald-900/40 p-6 font-mono text-sm relative overflow-hidden shadow-2xl">
                        {/* CRT Effect Overlay */}
                        <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-10 pointer-events-none z-20"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-900/10 pointer-events-none z-10"></div>

                        <div className="relative z-30 space-y-4 h-full flex flex-col">
                            <div className="text-emerald-500/80 text-xs mb-4 border-b border-emerald-900/50 pb-2 flex justify-between">
                                <span>SYSTEM READY</span>
                                <span>NEXUS-OS v2.4</span>
                            </div>

                            <div className="flex-1 space-y-4 overflow-y-auto">
                                <p className="text-slate-400">&gt; Initialisation du module d'analyse...</p>
                                <p className="text-slate-400">&gt; Chargement du dossier {activeScenario.ref}...</p>

                                {selectedEvidence.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-white">&gt; Éléments sélectionnés :</p>
                                        {selectedEvidence.map(id => (
                                            <p key={id} className="text-amber-500 ml-4 flex items-center">
                                                <span className="w-2 h-2 bg-amber-500 mr-2"></span>
                                                {id.toUpperCase()} - CHARGÉ
                                            </p>
                                        ))}
                                    </div>
                                )}

                                {status === 'solved' && (
                                    <div className="mt-8 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg animate-in fade-in slide-in-from-bottom-5">
                                        <p className="text-emerald-400 font-bold mb-2">&gt;&gt; ANALYSE JURIDIQUE COMPLÈTE &lt;&lt;</p>
                                        <p className="text-emerald-200/80 leading-relaxed">
                                            {activeScenario.conclusion}
                                        </p>
                                    </div>
                                )}

                                {status === 'failed' && (
                                    <div className="mt-8 p-4 bg-rose-900/20 border border-rose-500/30 rounded-lg animate-in fade-in">
                                        <p className="text-rose-400 font-bold">&gt;&gt; ERREUR D'ANALYSE &lt;&lt;</p>
                                        <p className="text-rose-200/80">
                                            {activeScenario.hint}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <Button
                                onClick={submitInvestigation}
                                disabled={selectedEvidence.length === 0 || status === 'solved'}
                                className={cn(
                                    "w-full h-14 font-black tracking-widest text-lg rounded-xl transition-all",
                                    status === 'solved'
                                        ? "bg-emerald-600 text-white cursor-default"
                                        : "bg-emerald-600 hover:bg-emerald-500 text-slate-950 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                                )}
                            >
                                {status === 'solved' ? "DOSSIER CLÔTURÉ" : "LANCER L'ANALYSE NEXUS"}
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
