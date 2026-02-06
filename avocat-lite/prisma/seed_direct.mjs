import { MongoClient, ObjectId } from 'mongodb'

const uri = "mongodb+srv://mamadouelimane:Astelwane123@cluster0.orfpiew.mongodb.net/avocat-lite?appName=Cluster0"
const client = new MongoClient(uri)

async function run() {
    try {
        await client.connect()
        const db = client.db('avocat-lite')

        console.log("Connected to MongoDB")

        // Clear existing test data
        await db.collection('Client').deleteMany({ email: 'mamadouelimane@gmail.com' })
        // Also cleanup dossiers for this client if any (manual cleanup for simplicity)

        const clientId = new ObjectId()
        const dossierId = new ObjectId()

        const clientDoc = {
            _id: clientId,
            name: 'M. Mamadou Elimane Wane',
            email: 'mamadouelimane@gmail.com',
            phone: '+221 77 123 45 67',
            address: 'Mermoz, Dakar',
            accessCode: '777000',
            createdAt: new Date(),
            updatedAt: new Date()
        }

        await db.collection('Client').insertOne(clientDoc)
        console.log("Client inserted")

        // Find a user or create one
        let userId
        const user = await db.collection('User').findOne({})
        if (user) {
            userId = user._id
        } else {
            userId = new ObjectId()
            await db.collection('User').insertOne({
                _id: userId,
                email: 'admin@lex.sn',
                password: 'hash',
                role: 'AVOCAT',
                createdAt: new Date(),
                updatedAt: new Date()
            })
        }

        const dossierDoc = {
            _id: dossierId,
            title: 'Divorce Contentieux Fall c. Diop',
            reference: 'DOS-2024-015',
            status: 'EN_COURS',
            description: 'Divorce contentieux',
            clientId: clientId,
            userId: userId,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        await db.collection('Dossier').insertOne(dossierDoc)
        console.log("Dossier inserted")

        // Create Document
        await db.collection('Document').insertOne({
            name: 'Livret de Famille.pdf',
            type: 'PIECE',
            status: 'DRAFT',
            path: '/uploads/livret.pdf',
            dossierId: dossierId,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        // Create Facture
        await db.collection('Facture').insertOne({
            number: 'PROV-2024-089',
            amount: 295000,
            status: 'ENVOYE',
            clientId: clientId,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        // Create Event
        await db.collection('Event').insertOne({
            title: 'Préparation Plaidoirie',
            date: new Date(),
            type: 'AUDIENCE',
            dossierId: dossierId,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        console.log("Seeding complete via direct Mongo")
    } catch (e) {
        console.error(e)
    } finally {
        await client.close()
    }
}
run()
