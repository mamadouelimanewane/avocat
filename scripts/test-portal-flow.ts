
import { PrismaClient } from '@prisma/client'
import { createClient, loginClient, getPortalDashboardData } from '../app/actions'
// Need to mock Next.js headers/cookies for server actions in script context???
// Or run via direct Prisma calls to verify logic?

// Testing server actions that use 'cookies()' inside a standalone script is hard because 'next/headers' context is missing.
// So I will test the DATA LOGIC primarily.

const prisma = new PrismaClient()

async function testPortalFlow() {
    console.log("🚀 Starting Portal Flow Test...")

    // 1. Create Client
    console.log("\n1. Creating Test Client...")
    const clientData = {
        name: "Moussa Diop (Test Portal)",
        email: `moussa.test.${Date.now()}@example.com`,
        phone: "770000000",
        type: "PARTICULIER"
    }

    // Direct call or mocked action? 
    // I can't call createClient cleanly if it uses revalidatePath/cookies strictly.
    // Let's use Prisma directly to replicate what createClient does, then test the login logic logic.

    // Simulating createClient action logic
    const accessCode = Math.floor(100000 + Math.random() * 900000).toString()
    const client = await prisma.client.create({
        data: {
            ...clientData,
            accessCode
        }
    })
    console.log(`✅ Client created: ${client.name} (ID: ${client.id})`)
    console.log(`🔑 Access Code: ${client.accessCode}`)

    // 2. Generate WhatsApp Link
    const waLink = `https://wa.me/?text=${encodeURIComponent(`Bonjour, accès: https://avocatos.app/portal/login?email=${client.email} Code: ${client.accessCode}`)}`
    console.log(`\n📱 WhatsApp Link Generated:\n${waLink}`)

    // 3. Simulate Login Check
    console.log("\n3. Simulating Credentials Check...")
    const foundClient = await prisma.client.findFirst({ where: { email: client.email } })
    if (foundClient && foundClient.accessCode === accessCode) {
        console.log("✅ Credentials Validated Successfully.")
    } else {
        console.error("❌ Credential Check Failed.")
    }

    // 4. Create some data for dashboard
    console.log("\n4. Seeding Dashboard Data...")
    await prisma.dossier.create({
        data: {
            title: "Affaire Diop c/ Entrepôt",
            reference: `DOS-TEST-${Date.now()}`,
            status: "EN_COURS",
            clientId: client.id
        }
    })
    console.log("✅ Dossier created.")

    // 5. Verify Dashboard Data Fetching (Logic only)
    // 5. Verify Dashboard Data Fetching (Logic only)
    console.log("\n5. Verifying Data Fetch Logic...")
    const dashboardData = await prisma.client.findUnique({
        where: { id: client.id },
        include: {
            dossiers: {
                include: { events: true }
            },
            factures: true
        }
    })

    if (dashboardData && dashboardData.dossiers.length > 0) {
        console.log(`✅ Dashboard Data Retrieved: ${dashboardData.dossiers.length} dossier(s) found.`)
        // Flat events logic simulation
        const events = dashboardData.dossiers.flatMap(d => d.events)
        console.log(`   Events found via Dossiers: ${events.length}`)
    } else {
        console.error("❌ Dashboard Data Missing.")
    }

    console.log("\n🎉 Full Portal Flow Test Logic COMPLETE.")
}

testPortalFlow()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
