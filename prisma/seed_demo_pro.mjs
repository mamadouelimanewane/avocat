
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Démarrage de l\'injection des données de démo PRO...')

    // 2. Création de Prospects (CRM)
    console.log('Creating Prospects...')
    const prospects = [
        {
            name: 'Société Générale de BTP',
            type: 'ENTREPRISE',
            email: 'contact@sgbtp.sn',
            phone: '77 654 32 10',
            status: 'NEGOTIATION',
            city: 'Dakar'
        },
        {
            name: 'Clinique des Mamelles',
            type: 'ENTREPRISE',
            email: 'direction@cliniquemamelles.com',
            phone: '33 820 00 00',
            status: 'PROSPECT',
            city: 'Dakar'
        },
        {
            name: 'M. Mamadou Elimane Wane',
            type: 'PARTICULIER',
            email: 'mamadouelimane@gmail.com',
            phone: '+221777529288',
            status: 'TO_CONVERT', // A Convertir
            city: 'Dakar'
        },
        {
            name: 'TechSolutions Senegal SA',
            type: 'ENTREPRISE',
            email: 'ceo@techsolutions.sn',
            phone: '78 987 65 43',
            status: 'NEGOTIATION',
            city: 'Diamniadio'
        },
        {
            name: 'Groupement des Maraîchers de Mboro',
            type: 'ORGANISATION',
            email: 'gmm@asso.sn',
            phone: '76 555 44 33',
            status: 'PROSPECT',
            city: 'Mboro'
        }
    ]

    for (const p of prospects) {
        // Check existence manually
        const existing = await prisma.client.findFirst({
            where: { email: p.email }
        })

        if (!existing) {
            await prisma.client.create({
                data: {
                    name: p.name,
                    type: p.type,
                    email: p.email,
                    phone: p.phone,
                    status: p.status,
                    address: `${p.city}, Sénégal`,
                    city: p.city,
                    country: 'Sénégal',
                    accessCode: Math.floor(100000 + Math.random() * 900000).toString()
                }
            })
        }
    }

    // 3. Création de Clients Actifs & Dossiers
    console.log('Creating Active Clients & Dossiers...')

    // Client 1 : Banque
    let bankClient = await prisma.client.findFirst({ where: { email: 'juridique@banque-atlantique.sn' } })
    if (!bankClient) {
        bankClient = await prisma.client.create({
            data: {
                name: 'Banque Atlantique Sénégal',
                type: 'ENTREPRISE',
                email: 'juridique@banque-atlantique.sn',
                phone: '33 849 10 00',
                status: 'CLIENT',
                address: 'Plateau, Dakar',
                city: 'Dakar',
                country: 'Sénégal',
                accessCode: '882910'
            }
        })
    }

    // Check if dossier exists to avoid duplicates
    const existingDossier1 = await prisma.dossier.findFirst({ where: { reference: 'DOS-2024-042' } })
    if (!existingDossier1 && bankClient) {
        await prisma.dossier.create({
            data: {
                title: 'Recouvrement Créance - SOCIM SA',
                reference: 'DOS-2024-042',
                clientId: bankClient.id,
                status: 'CONTENTIEUX',
                opposingParty: 'SOCIM SA',
                opposingCounsel: 'Me Ndiaye'
            }
        })
    }

    // Client 2 : Particulier (VOUS - Pour Test Réel)
    let divorceClient = await prisma.client.findFirst({ where: { email: 'mamadouelimane@gmail.com' } })
    if (!divorceClient) {
        divorceClient = await prisma.client.create({
            data: {
                name: 'M. Mamadou Elimane Wane',
                type: 'PARTICULIER',
                email: 'mamadouelimane@gmail.com',
                phone: '+221777529288',
                status: 'CLIENT',
                address: 'Cité Keur Gorgui, Dakar',
                city: 'Dakar',
                accessCode: '777000'
            }
        })
    } else {
        // Update existing prospect to CLIENT with correct access code
        divorceClient = await prisma.client.update({
            where: { id: divorceClient.id },
            data: {
                status: 'CLIENT',
                accessCode: '777000',
                address: 'Cité Keur Gorgui, Dakar'
            }
        })
    }

    const existingDossier2 = await prisma.dossier.findFirst({ where: { reference: 'DOS-2024-015' } })
    if (!existingDossier2 && divorceClient) {
        await prisma.dossier.create({
            data: {
                title: 'Divorce Contentieux Fall c. Diop',
                reference: 'DOS-2024-015',
                clientId: divorceClient.id,
                status: 'INSTRUCTION',
                opposingParty: 'M. Oumar Diop',
                opposingCounsel: 'Me Sall'
            }
        })
    }

    // 4. Peuplement de l'Agenda (Audiences & RDV)
    console.log('📅 Creating Agenda Events...')

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    // Audience de Renvoi (Dossier Banque)
    const dossierBanque = await prisma.dossier.findFirst({ where: { reference: 'DOS-2024-042' } })
    if (dossierBanque) {
        await prisma.event.create({
            data: {
                title: 'Audience de Renvoi - Affaire SOCIM',
                description: 'Audience de mise en état. Vérifier le dépôt des conclusions adverses.',
                startDate: new Date(tomorrow.setHours(9, 0, 0, 0)),
                endDate: new Date(tomorrow.setHours(10, 30, 0, 0)),
                type: 'AUDIENCE',
                location: 'Tribunal de Commerce, Salle 2',
                dossierId: dossierBanque.id
            }
        })
    }

    // RDV Client (Dossier Divorce)
    const dossierDivorce = await prisma.dossier.findFirst({ where: { reference: 'DOS-2024-015' } })
    if (dossierDivorce) {
        await prisma.event.create({
            data: {
                title: 'Préparation Plaidoirie - Mme Fall',
                description: 'Revue des pièces finales avant l\'audience de conciliation.',
                startDate: new Date(today.setHours(14, 0, 0, 0)),
                endDate: new Date(today.setHours(15, 30, 0, 0)),
                type: 'RENDEZ_VOUS',
                location: 'Cabinet - Salle de réunion 1',
                dossierId: dossierDivorce.id
            }
        })
    }

    // Échéance Légale
    await prisma.event.create({
        data: {
            title: 'Dépôt Mémoire en Défense (Dossier BTP)',
            description: 'Date limite impérative.',
            startDate: new Date(nextWeek.setHours(17, 0, 0, 0)),
            endDate: new Date(nextWeek.setHours(18, 0, 0, 0)),
            type: 'ECHEANCE',
            location: 'Greffe TGI'
        }
    })

    // 5. Peuplement de l'Annuaire Pro
    console.log('📖 Creating Directory Contacts...')

    const contacts = [
        {
            name: 'Maître Alioune Sylla',
            category: 'HUISSIER',
            speciality: 'Recouvrement Rapide',
            phone: '77 500 11 22',
            city: 'Dakar',
            email: 'etude.sylla@huissiers.sn'
        },
        {
            name: 'Office Notarial du Plateau',
            category: 'NOTAIRE',
            speciality: 'Immobilier & Successions',
            phone: '33 821 33 44',
            city: 'Dakar',
            address: '5, Avenue Roume'
        },
        {
            name: 'Dr. Marie Diouf',
            category: 'EXPERT',
            speciality: 'Médecine Légale',
            phone: '70 200 30 40',
            city: 'Dakar',
            notes: 'Expert agréée auprès des tribunaux.'
        },
        {
            name: 'Cabinet Confrère Sow & Associés',
            category: 'CONFRERE',
            phone: '33 845 67 89',
            city: 'Saint-Louis',
            notes: 'Correspondant local habituel.'
        }
    ]

    for (const c of contacts) {
        // Simple create, assume repeatable for demo or cleanup DB before
        const existing = await prisma.directoryContact.findFirst({ where: { name: c.name } })
        if (!existing) {
            await prisma.directoryContact.create({
                data: c
            })
        }
    }

    // 6. Peuplement Palais & Audiences (Historique)
    console.log('⚖️ Creating Audience History...')

    const lastMonth = new Date(today)
    lastMonth.setDate(lastMonth.getDate() - 30)

    if (dossierBanque) {
        await prisma.event.create({
            data: {
                title: 'Audience de Mise en État - Affaire SOCIM',
                description: 'Renvoi sollicité par la partie adverse.',
                startDate: new Date(lastMonth.setHours(9, 0, 0, 0)),
                endDate: new Date(lastMonth.setHours(9, 15, 0, 0)),
                type: 'AUDIENCE',
                result: 'RENVOYE',
                location: 'Tribunal de Commerce',
                dossierId: dossierBanque.id
            }
        })
    }

    // 7. Finance & Facturation
    console.log('💰 Creating Financial Data...')

    // Facture Payée (Recouvrement Réussi)
    if (dossierBanque && bankClient) {
        const existingFac1 = await prisma.facture.findUnique({ where: { number: 'FAC-2024-001' } })

        let fac1 = existingFac1
        if (!existingFac1) {
            fac1 = await prisma.facture.create({
                data: {
                    number: 'FAC-2024-001',
                    type: 'FACTURE',
                    status: 'PAYEE',
                    issueDate: lastMonth,
                    dueDate: today,
                    amountHT: 500000,
                    amountTVA: 90000,
                    amountTTC: 590000,
                    clientId: bankClient.id,
                    dossierId: dossierBanque.id,
                    items: {
                        create: [
                            { description: 'Ouverture Dossier & Assignation', quantity: 1, unitPrice: 500000, totalPrice: 500000 }
                        ]
                    }
                }
            })

            // Paiement associé (Create only if invoice was just created or strictly separate check)
            await prisma.payment.create({
                data: {
                    amount: 590000,
                    date: today,
                    method: 'VIREMENT',
                    reference: 'VIR-SO-GEN-002',
                    factureId: fac1.id
                }
            })
        }
    }

    // Facture en Retard (Provision Divorce)
    if (dossierDivorce && divorceClient) {
        const existingProv = await prisma.facture.findUnique({ where: { number: 'PROV-2024-089' } })
        if (!existingProv) {
            await prisma.facture.create({
                data: {
                    number: 'PROV-2024-089',
                    type: 'PROVISION',
                    status: 'EMISE', // Non payée
                    issueDate: lastMonth, // En retard
                    dueDate: lastMonth,
                    amountHT: 250000,
                    amountTVA: 45000,
                    amountTTC: 295000,
                    clientId: divorceClient.id,
                    dossierId: dossierDivorce.id,
                    items: {
                        create: [
                            { description: 'Provision sur Honoraires - Diligences Divorce', quantity: 1, unitPrice: 250000, totalPrice: 250000 }
                        ]
                    }
                }
            })
        }
    }

    // 8. GED & Documents Virtuels
    console.log('📂 Creating Virtual Documents...')

    if (dossierBanque) {
        await prisma.document.create({
            data: {
                name: 'Assignation en Paiement.pdf',
                type: 'application/pdf',
                category: 'ACTE',
                status: 'SIGNED',
                folder: '/Procédures',
                dossierId: dossierBanque.id,
                createdAt: lastMonth
            }
        })

        await prisma.document.create({
            data: {
                name: 'Reconnaissance de Dette - SOCIM.pdf',
                type: 'application/pdf',
                category: 'PREUVE',
                status: 'ARCHIVED',
                folder: '/Pièces/Adverse',
                dossierId: dossierBanque.id
            }
        })
    }

    if (dossierDivorce) {
        await prisma.document.create({
            data: {
                name: 'Livret de Famille.pdf',
                type: 'application/pdf',
                category: 'PIECE_CLIENT',
                status: 'REVIEW',
                folder: '/Etat Civil',
                dossierId: dossierDivorce.id
            }
        })
    }

    // 9. Comptabilité Complète (SYSCOHADA)
    console.log('📈 Creating SYSCOHADA Accounting Data...')

    // A. Exercice Comptable
    let fiscalYear = await prisma.fiscalYear.findUnique({ where: { name: 'Exercice 2024' } })
    if (!fiscalYear) {
        fiscalYear = await prisma.fiscalYear.create({
            data: {
                name: 'Exercice 2024',
                startDate: new Date(today.getFullYear(), 0, 1),
                endDate: new Date(today.getFullYear(), 11, 31),
                status: 'OPEN',
                isCurrent: true
            }
        })
    }

    // B. Journaux Comptables
    const journals = {}
    const journalCodes = [
        { code: 'VT', name: 'Journal des Ventes', type: 'VENTE' },
        { code: 'BQ', name: 'Journal de Banque', type: 'TRESORERIE' },
        { code: 'HA', name: 'Journal des Achats', type: 'ACHAT' }
    ]

    for (const j of journalCodes) {
        const existing = await prisma.journal.findUnique({ where: { code: j.code } })
        if (existing) {
            journals[j.code] = existing
        } else {
            journals[j.code] = await prisma.journal.create({ data: j })
        }
    }

    // C. Plan Comptable (Comptes Clés SYSCOHADA)
    const accountsData = [
        { code: '1011', name: 'Capital Social', type: 'PASSIF' },
        { code: '4111', name: 'Clients - Ventes de services', type: 'ACTIF' },
        { code: '4011', name: 'Fournisseurs', type: 'PASSIF' },
        { code: '4433', name: 'TVA Facturée', type: 'PASSIF' },
        { code: '4452', name: 'TVA Récupérable', type: 'ACTIF' },
        { code: '5211', name: 'Banque SGBS', type: 'ACTIF' },
        { code: '7061', name: 'Honoraires', type: 'PRODUIT' },
        { code: '6221', name: 'Locations Générales', type: 'CHARGE' }
    ]

    const accounts = {}
    for (const acc of accountsData) {
        const existing = await prisma.account.findUnique({ where: { code: acc.code } })
        if (existing) {
            accounts[acc.code] = existing
        } else {
            accounts[acc.code] = await prisma.account.create({
                data: { code: acc.code, name: acc.name, type: acc.type }
            })
        }
    }

    // D. Simulation Écritures (Partie Double) - Check if they exist first via findFirst by reference

    // D1. Écriture de Vente
    const tx1 = await prisma.transaction.findFirst({ where: { reference: 'FAC-2024-001' } }) // Assuming ref match invoice
    if (!tx1) {
        await prisma.transaction.create({
            data: {
                date: lastMonth,
                description: 'Facture N° FAC-2024-001 - SOCIM',
                reference: 'FAC-2024-001',
                status: 'VALIDATED',
                journalId: journals['VT'].id,
                fiscalYearId: fiscalYear.id,
                lines: {
                    create: [
                        { accountId: accounts['4111'].id, debit: 590000, credit: 0 }, // Client
                        { accountId: accounts['7061'].id, debit: 0, credit: 500000 }, // Produit
                        { accountId: accounts['4433'].id, debit: 0, credit: 90000 }  // TVA
                    ]
                }
            }
        })
    }

    // D2. Écriture d'Encaissement
    const tx2 = await prisma.transaction.findFirst({ where: { reference: 'VIR-SO-GEN-002' } })
    if (!tx2) {
        await prisma.transaction.create({
            data: {
                date: today,
                description: 'Virement Recouvrement SOCIM',
                reference: 'VIR-SO-GEN-002',
                status: 'VALIDATED',
                journalId: journals['BQ'].id,
                fiscalYearId: fiscalYear.id,
                lines: {
                    create: [
                        { accountId: accounts['5211'].id, debit: 590000, credit: 0 },
                        { accountId: accounts['4111'].id, debit: 0, credit: 590000 }
                    ]
                }
            }
        })
    }

    // D3. Écriture d'Achat (Loyer)
    const tx3 = await prisma.transaction.findFirst({ where: { reference: 'VIR-LOYER-MAI' } })
    if (!tx3) {
        await prisma.transaction.create({
            data: {
                date: new Date(today.getFullYear(), today.getMonth(), 5),
                description: 'Paiement Loyer Bureau Plateau',
                reference: 'VIR-LOYER-MAI',
                status: 'VALIDATED',
                journalId: journals['BQ'].id,
                fiscalYearId: fiscalYear.id,
                lines: {
                    create: [
                        { accountId: accounts['6221'].id, debit: 300000, credit: 0 },
                        { accountId: accounts['5211'].id, debit: 0, credit: 300000 }
                    ]
                }
            }
        })
    }

    // 10. Workflows & Tâches (Simulation Flux)
    console.log('🔄 Creating Workflow Tasks...')

    if (dossierBanque) {
        // Workflow contentieux
        await prisma.task.create({
            data: {
                title: 'Rédiger Conclusions en Réplique',
                description: 'Suite aux conclusions adverses reçues le 12/05.',
                dossierId: dossierBanque.id,
                priority: 'HAUTE',
                dueDate: nextWeek,
                completed: false
            }
        })
        await prisma.task.create({
            data: {
                title: 'Valider Note d\'Honoraires Complémentaire',
                description: 'A faire valider par l\'associé avant envoi.',
                dossierId: dossierBanque.id,
                priority: 'NORMAL',
                dueDate: tomorrow,
                completed: false
            }
        })
    }

    if (dossierDivorce) {
        // Workflow procédure
        await prisma.task.create({
            data: {
                title: 'Réunion Client - Préparation Audience',
                description: 'Préparer Mme Fall pour son audition.',
                dossierId: dossierDivorce.id,
                priority: 'URGENT',
                dueDate: today,
                completed: false
            }
        })
        // Tâche passée completed
        await prisma.task.create({
            data: {
                title: 'Collecte Pièces État Civil',
                description: 'Récupérer livret de famille et actes de naissance.',
                dossierId: dossierDivorce.id,
                priority: 'NORMAL',
                completed: true
            }
        })
    }

    // 11. Documents Supplémentaires pour la GED
    console.log('📂 Filling GED with more documents...')

    if (dossierBanque) {
        const docs = [
            { name: 'Conclusions_Demandeur_20240401.pdf', type: 'application/pdf', category: 'ACTE', folder: '/Procédures/Conclusions' },
            { name: 'Bordereau_Pieces_001.pdf', type: 'application/pdf', category: 'ACTE', folder: '/Procédures' },
            { name: 'Email_Confrere_Ndiaye_Renvoi.eml', type: 'message/rfc822', category: 'CORRESPONDANCE', folder: '/Correspondances/Adversaire' },
            { name: 'Kbis_Societe_SOCIM.pdf', type: 'application/pdf', category: 'PREUVE', folder: '/Pièces/Adverse' }
        ]

        for (const d of docs) {
            await prisma.document.create({
                data: {
                    name: d.name, type: d.type, category: d.category, folder: d.folder, status: 'SIGNED', dossierId: dossierBanque.id
                }
            })
        }
    }

    // 12. Bibliothèque Juridique (Jurisprudence OHADA)
    console.log('📚 Creating Jurisprudence Database...')
    const jurisprudence = [
        {
            title: 'Arrêt n° 023/2019 : Validité de la clause compromissoire',
            court: 'CCJA',
            date: new Date('2019-02-28'),
            summary: 'La CCJA réaffirme l\'autonomie de la clause compromissoire par rapport au contrat principal.',
            category: 'COMMERCIAL',
            region: 'OHADA',
            content: 'Attendu que...'
        },
        {
            title: 'Arrêt Chambre Sociale : Licenciement motif économique',
            court: 'COUR_SUPREME_SENEGAL',
            date: new Date('2022-11-15'),
            summary: 'Précisions sur l\'ordre des licenciements et l\'obligation de reclassement.',
            category: 'SOCIAL',
            region: 'SENEGAL',
            content: 'La cour...'
        }
    ]

    for (const j of jurisprudence) {
        const existing = await prisma.jurisprudence.findFirst({ where: { title: j.title } })
        if (!existing) {
            await prisma.jurisprudence.create({ data: j })
        }
    }

    // 13. RH & Équipe (Simulation Cabinet)
    console.log('👥 Creating Team & RH Data...')

    // Collaborateur
    const collabUser = await prisma.user.findUnique({ where: { email: 'collab@avocat-pro.sn' } })
    let collabId = collabUser?.id

    if (!collabUser) {
        const newCollab = await prisma.user.create({
            data: {
                name: 'Me Jean Diouf',
                email: 'collab@avocat-pro.sn',
                role: 'COLLABORATEUR',
                hourlyRate: 75000,
                active: true
            }
        })
        collabId = newCollab.id

        // Demande de congé
        await prisma.leaveRequest.create({
            data: {
                userId: newCollab.id,
                startDate: nextWeek,
                endDate: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate() + 5),
                type: 'CONGE_PAYE',
                status: 'PENDING',
                reason: 'Congés annuels'
            }
        })
    }

    // 14. Performance : Temps & Frais (Rentabilité)
    console.log('⏱️ Injecting Time Entries & Expenses...')

    if (dossierBanque) {
        // Temps passé (Facturable)
        await prisma.timeEntry.create({
            data: {
                dossierId: dossierBanque.id,
                description: 'Rédaction Assignation',
                duration: 180, // 3h
                rate: 150000,
                date: lastMonth,
                billable: true
            }
        })

        // Frais (Débours)
        await prisma.expense.create({
            data: {
                dossierId: dossierBanque.id,
                description: 'Frais d\'Huissier - Assignation',
                amount: 50000,
                category: 'HUISSIER',
                type: 'DEBOURS',
                status: 'BILLED', // Refacturé
                date: lastMonth
            }
        })
    }

    console.log('✅ Injection terminée avec succès !')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
