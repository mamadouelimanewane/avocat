
$env:DATABASE_URL = "mongodb+srv://mamadouelimane:Astelwane123@cluster0.orfpiew.mongodb.net/lexpremium?retryWrites=true&w=majority"

Write-Host "1. Envoi du Schéma vers le Cloud (MongoDB Atlas)..." -ForegroundColor Cyan
npx prisma db push

Write-Host "2. Remplissage des Données de Démonstration..." -ForegroundColor Cyan
node prisma/seed-crm.mjs
node prisma/seed-audiences.mjs
node prisma/seed-directory.mjs

Write-Host "✅ TERMINÉ : Base de données Cloud prête !" -ForegroundColor Green
