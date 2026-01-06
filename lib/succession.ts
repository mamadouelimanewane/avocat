/**
 * MÉTHODES DE CALCUL DE SUCCESSION
 * Conformes au Code de la Famille sénégalais (Loi 72-61) et règles OHADA
 */

export interface Heritier {
    id: string
    nom: string
    lien: 'CONJOINT' | 'ENFANT' | 'PERE' | 'MERE' | 'FRERE' | 'SOEUR' | 'GRAND_PARENT' | 'NEVEU' | 'AUTRE'
    age?: number
    sexe?: 'M' | 'F'
    predecedeDefunt?: boolean // Pour la représentation
}

export interface Donation {
    id: string
    beneficiaire: string
    montant: number
    date: Date
    type: 'DON_MANUEL' | 'DONATION_NOTARIEE' | 'PRESENTE_USAGE'
}

export interface Legs {
    id: string
    beneficiaire: string
    montant?: number
    description?: string
    type: 'UNIVERSEL' | 'TITRE_UNIVERSEL' | 'PARTICULIER'
}

export interface Patrimoine {
    actifs: number
    dettes: number
    biensPropres?: number // Biens propres du défunt en régime communauté
    biensCommuns?: number // Biens communs (à diviser par 2)
}

// ============ 1. LIQUIDATION DU RÉGIME MATRIMONIAL ============

export function calculerMasseLiquidation(
    patrimoine: Patrimoine,
    regimeMatrimonial: 'SEPARATION' | 'COMMUNAUTE' | 'PARTICIPATION'
): number {
    const { actifs, dettes, biensPropres = 0, biensCommuns = 0 } = patrimoine

    switch (regimeMatrimonial) {
        case 'SEPARATION':
            // Chaque époux garde ses biens propres
            return actifs - dettes

        case 'COMMUNAUTE':
            // 1. Actif net total
            const actifNetTotal = actifs - dettes

            // 2. Part du conjoint survivant (1/2 des biens communs)
            const partConjointCommun = biensCommuns / 2

            // 3. Masse successorale = Biens propres défunt + 1/2 biens communs
            return biensPropres + partConjointCommun

        case 'PARTICIPATION':
            // Calcul complexe des acquêts - simplifié ici
            const acquets = actifs - biensPropres - dettes
            const partAcquets = acquets / 2
            return biensPropres + partAcquets

        default:
            return actifs - dettes
    }
}

// ============ 2. MASSE DE CALCUL (Rapport des donations) ============

export function calculerMasseDeCalcul(
    actifNetSuccessoral: number,
    donations: Donation[]
): number {
    // Art. 700 Code Famille : Les donations doivent être rapportées fictivement
    const totalDonations = donations.reduce((sum, d) => {
        // On exclut les présents d'usage (< 5% du patrimoine)
        if (d.type === 'PRESENTE_USAGE') return sum
        return sum + d.montant
    }, 0)

    return actifNetSuccessoral + totalDonations
}

// ============ 3. RÉSERVE HÉRÉDITAIRE ============

export function calculerReserveHereditaire(
    masseDeCalcul: number,
    nombreEnfants: number,
    presenceParents: boolean
): { reserve: number, quotiteDisponible: number } {
    // Art. 697 Code Famille

    if (nombreEnfants > 0) {
        // Avec descendants
        if (nombreEnfants === 1) {
            return {
                reserve: masseDeCalcul * 0.5,        // 1/2
                quotiteDisponible: masseDeCalcul * 0.5
            }
        } else if (nombreEnfants === 2) {
            return {
                reserve: masseDeCalcul * (2 / 3),      // 2/3
                quotiteDisponible: masseDeCalcul * (1 / 3)
            }
        } else {
            return {
                reserve: masseDeCalcul * 0.75,       // 3/4
                quotiteDisponible: masseDeCalcul * 0.25
            }
        }
    } else if (presenceParents) {
        // Sans descendants mais avec ascendants
        return {
            reserve: masseDeCalcul * (1 / 3),          // 1/3
            quotiteDisponible: masseDeCalcul * (2 / 3)
        }
    } else {
        // Aucun réservataire
        return {
            reserve: 0,
            quotiteDisponible: masseDeCalcul
        }
    }
}

// ============ 4. ORDRE DES HÉRITIERS (Dévolution légale) ============

export function classerHeritiersParOrdre(heritiers: Heritier[]): {
    ordre1: Heritier[] // Descendants
    ordre2: Heritier[] // Ascendants + Collatéraux privilégiés
    ordre3: Heritier[] // Autres collatéraux
    conjoint: Heritier | null
} {
    const conjoint = heritiers.find(h => h.lien === 'CONJOINT') || null
    const descendants = heritiers.filter(h => h.lien === 'ENFANT')
    const parents = heritiers.filter(h => h.lien === 'PERE' || h.lien === 'MERE')
    const freresSoeurs = heritiers.filter(h => h.lien === 'FRERE' || h.lien === 'SOEUR')
    const autres = heritiers.filter(h =>
        !['CONJOINT', 'ENFANT', 'PERE', 'MERE', 'FRERE', 'SOEUR'].includes(h.lien)
    )

    return {
        ordre1: descendants,
        ordre2: [...parents, ...freresSoeurs],
        ordre3: autres,
        conjoint
    }
}

// ============ 5. CALCUL DES PARTS (Dévolution légale) ============

export interface PartHeritier {
    heritier: Heritier
    partEnPleineProprieteAbsolue: number
    partEnUsufruit: number
    partEnNuePropriete: number
    pourcentage: number
}

export function calculerParts(
    heritiers: Heritier[],
    actifNetSuccessoral: number,
    optionConjoint: 'USUFRUIT' | 'PLEINE_PROPRIETE' = 'USUFRUIT'
): PartHeritier[] {
    const classes = classerHeritiersParOrdre(heritiers)
    const parts: PartHeritier[] = []

    // ===== CAS 1 : Descendants + Conjoint =====
    if (classes.ordre1.length > 0 && classes.conjoint) {
        if (optionConjoint === 'USUFRUIT') {
            // Conjoint : Usufruit de la totalité (Art. 567)
            parts.push({
                heritier: classes.conjoint,
                partEnPleineProprieteAbsolue: 0,
                partEnUsufruit: actifNetSuccessoral,
                partEnNuePropriete: 0,
                pourcentage: 100 // Usufruit
            })

            // Enfants : Nue-propriété en parts égales
            const nueProprieteParEnfant = actifNetSuccessoral / classes.ordre1.length
            classes.ordre1.forEach(enfant => {
                parts.push({
                    heritier: enfant,
                    partEnPleineProprieteAbsolue: 0,
                    partEnUsufruit: 0,
                    partEnNuePropriete: nueProprieteParEnfant,
                    pourcentage: 100 / classes.ordre1.length
                })
            })
        } else {
            // Option : Pleine propriété 1/4
            const partConjoint = actifNetSuccessoral * 0.25
            parts.push({
                heritier: classes.conjoint,
                partEnPleineProprieteAbsolue: partConjoint,
                partEnUsufruit: 0,
                partEnNuePropriete: 0,
                pourcentage: 25
            })

            const resteEnfants = actifNetSuccessoral * 0.75
            const partParEnfant = resteEnfants / classes.ordre1.length
            classes.ordre1.forEach(enfant => {
                parts.push({
                    heritier: enfant,
                    partEnPleineProprieteAbsolue: partParEnfant,
                    partEnUsufruit: 0,
                    partEnNuePropriete: 0,
                    pourcentage: 75 / classes.ordre1.length
                })
            })
        }
    }
    // ===== CAS 2 : Conjoint seul (pas de descendants) =====
    else if (classes.ordre1.length === 0 && classes.conjoint) {
        if (classes.ordre2.length > 0) {
            // Avec ascendants/frères-sœurs : 1/2 chacun
            parts.push({
                heritier: classes.conjoint,
                partEnPleineProprieteAbsolue: actifNetSuccessoral * 0.5,
                partEnUsufruit: 0,
                partEnNuePropriete: 0,
                pourcentage: 50
            })

            const partAutres = actifNetSuccessoral * 0.5
            const nbAutres = classes.ordre2.length
            classes.ordre2.forEach(h => {
                parts.push({
                    heritier: h,
                    partEnPleineProprieteAbsolue: partAutres / nbAutres,
                    partEnUsufruit: 0,
                    partEnNuePropriete: 0,
                    pourcentage: 50 / nbAutres
                })
            })
        } else {
            // Conjoint seul : 100%
            parts.push({
                heritier: classes.conjoint,
                partEnPleineProprieteAbsolue: actifNetSuccessoral,
                partEnUsufruit: 0,
                partEnNuePropriete: 0,
                pourcentage: 100
            })
        }
    }
    // ===== CAS 3 : Descendants seuls (pas de conjoint) =====
    else if (classes.ordre1.length > 0 && !classes.conjoint) {
        const partParEnfant = actifNetSuccessoral / classes.ordre1.length
        classes.ordre1.forEach(enfant => {
            parts.push({
                heritier: enfant,
                partEnPleineProprieteAbsolue: partParEnfant,
                partEnUsufruit: 0,
                partEnNuePropriete: 0,
                pourcentage: 100 / classes.ordre1.length
            })
        })
    }
    // ===== CAS 4 : Ordre subsidiaire =====
    else {
        const tousHeritiers = [...classes.ordre2, ...classes.ordre3]
        if (tousHeritiers.length > 0) {
            const partPar = actifNetSuccessoral / tousHeritiers.length
            tousHeritiers.forEach(h => {
                parts.push({
                    heritier: h,
                    partEnPleineProprieteAbsolue: partPar,
                    partEnUsufruit: 0,
                    partEnNuePropriete: 0,
                    pourcentage: 100 / tousHeritiers.length
                })
            })
        }
    }

    return parts
}

// ============ 6. RÉDUCTION DES LIBÉRALITÉS EXCESSIVES ============

export function verifierEtReduireLiberalites(
    legs: Legs[],
    donations: Donation[],
    quotiteDisponible: number
): {
    legsReduits: { legs: Legs, montantReduit: number }[]
    donationsAReduire: { donation: Donation, montantAReduire: number }[]
    totalExces: number
} {
    // Total des libéralités
    const totalLegs = legs.reduce((sum, l) => sum + (l.montant || 0), 0)
    const totalDonations = donations.reduce((sum, d) => sum + d.montant, 0)
    const totalLiberalites = totalLegs + totalDonations

    const exces = Math.max(0, totalLiberalites - quotiteDisponible)

    if (exces === 0) {
        return { legsReduits: [], donationsAReduire: [], totalExces: 0 }
    }

    // Réduction proportionnelle (les legs sont réduits en premier)
    const legsReduits = legs.map(legs => {
        const proportion = (legs.montant || 0) / totalLegs
        const reduction = exces * proportion
        return {
            legs,
            montantReduit: Math.max(0, (legs.montant || 0) - reduction)
        }
    })

    // Si les legs ne suffisent pas, on réduit les donations (ordre chronologique inverse : de la plus récente à la plus ancienne)
    let soldeExces = exces - totalLegs
    const donationsAReduire: { donation: Donation, montantAReduire: number }[] = []

    if (soldeExces > 0) {
        // Trier les donations par date décroissante (plus récente en premier)
        const sortedDonations = [...donations].sort((a, b) => b.date.getTime() - a.date.getTime())

        for (const donation of sortedDonations) {
            if (soldeExces <= 0) break

            const reductionPossbile = Math.min(soldeExces, donation.montant)
            donationsAReduire.push({
                donation,
                montantAReduire: reductionPossbile
            })
            soldeExces -= reductionPossbile
        }
    }

    return { legsReduits, donationsAReduire, totalExces: exces }
}

// ============ 7. DROITS DE SUCCESSION (Fiscalité) ============

export function calculerDroitsSuccession(
    partHeritier: number,
    lienParente: string
): { droits: number, taux: number, abattement: number } {
    // Barème Sénégal (simplifié - vérifier Code Général des Impôts)

    let abattement = 0
    let taux = 0

    switch (lienParente) {
        case 'CONJOINT':
        case 'ENFANT':
            abattement = 50000000 // 50M FCFA (exemple)
            taux = 0.05 // 5% en ligne directe
            break
        case 'FRERE':
        case 'SOEUR':
            abattement = 10000000
            taux = 0.10 // 10%
            break
        case 'PERE':
        case 'MERE':
            abattement = 30000000
            taux = 0.05
            break
        default:
            abattement = 0
            taux = 0.20 // 20% autres
    }

    const base = Math.max(0, partHeritier - abattement)
    const droits = base * taux

    return { droits, taux, abattement }
}

// ============ 8. VALORISATION USUFRUIT/NUE-PROPRIÉTÉ ============

export function valoriserDemembrement(
    valeurPleinePropriete: number,
    ageUsufruitier: number
): { valeurUsufruit: number, valeurNuePropriete: number } {
    // Barème fiscal usufruit (Code Général des Impôts)
    let tauxUsufruit = 0

    if (ageUsufruitier < 20) tauxUsufruit = 0.90
    else if (ageUsufruitier < 30) tauxUsufruit = 0.80
    else if (ageUsufruitier < 40) tauxUsufruit = 0.70
    else if (ageUsufruitier < 50) tauxUsufruit = 0.60
    else if (ageUsufruitier < 60) tauxUsufruit = 0.50
    else if (ageUsufruitier < 70) tauxUsufruit = 0.40
    else if (ageUsufruitier < 80) tauxUsufruit = 0.30
    else tauxUsufruit = 0.20

    const valeurUsufruit = valeurPleinePropriete * tauxUsufruit
    const valeurNuePropriete = valeurPleinePropriete * (1 - tauxUsufruit)

    return { valeurUsufruit, valeurNuePropriete }
}

// ============ 9. MASSE À PARTAGER (après imputation donations) ============

export function calculerMasseAPartager(
    actifNetSuccessoral: number,
    donations: Donation[],
    parts: PartHeritier[]
): { masseAPartager: number, imputations: { heritier: string, montantImpute: number }[] } {
    // Les donations déjà reçues s'imputent sur la part de l'héritier
    const imputations: { heritier: string, montantImpute: number }[] = []

    let masseRestante = actifNetSuccessoral

    parts.forEach(part => {
        const donationsRecues = donations.filter(d => d.beneficiaire === part.heritier.nom)
        const totalDonations = donationsRecues.reduce((sum, d) => sum + d.montant, 0)

        if (totalDonations > 0) {
            imputations.push({
                heritier: part.heritier.nom,
                montantImpute: Math.min(totalDonations, part.partEnPleineProprieteAbsolue)
            })
        }
    })

    return { masseAPartager: masseRestante, imputations }
}

// ============ 10. SOULTE ENTRE COHÉRITIERS ============

export function calculerSoulte(
    valeurBienAttribue: number,
    partTheorique: number
): number {
    // Si un héritier reçoit un bien d'une valeur supérieure à sa part,
    // il doit une soulte aux autres
    return Math.max(0, valeurBienAttribue - partTheorique)
}
