
// Load environment variables FIRST
import 'dotenv/config'

import { interpretVoiceCommand as aiInterpret } from '../lib/openai'
import { PrismaClient } from '@prisma/client'

// Mock environment for OpenAI/DeepSeek if needed, but we assume .env is loaded
const prisma = new PrismaClient()

async function testVoiceIntelligence() {
    console.log("🎤 Testing Voice Command Intelligence...\n")

    const testCases = [
        "Rdv demain 15h avec Client Diop pour signature",
        "Note sur dossier Succession Faye il faut relancer l'huissier rapidement",
        "Emmène-moi vers la comptabilité",
        "Recherche des arrêts sur le licenciement abusif"
    ]

    for (const transcript of testCases) {
        console.log(`🗣️  User says: "${transcript}"`)

        // 1. Test AI Interpretation
        const start = Date.now()
        const interpretation = await aiInterpret(transcript)
        const duration = Date.now() - start

        if (interpretation) {
            console.log(`🤖 AI understood (${duration}ms):`)
            console.log(JSON.stringify(interpretation, null, 2))

            // 2. Validate Intent Structure
            if (!interpretation.intent) {
                console.error("❌ Link missing 'intent' field.")
            } else {
                console.log("✅ Intent Detected:", interpretation.intent)
            }
        } else {
            console.error("❌ AI failed to interpret.")
        }
        console.log("-".repeat(40))
    }

    // Optional: Test Database Side Effect (Integration Test)
    // Only if we had a clear 'processVoiceInput' detached from Next.js specifics.
    // For now, validating the "Brain" is sufficient proof of concept.
}

testVoiceIntelligence()
    .then(() => console.log("Done."))
    .catch(console.error)
