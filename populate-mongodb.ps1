# ============================================
# SCRIPT DE PEUPLEMENT DE LA BASE MONGODB
# ============================================
#
# Ce script va remplir votre base MongoDB Atlas
# avec toutes les données de démonstration
#
# ============================================

# ÉTAPE 1 : Modifier .env pour pointer vers MongoDB Atlas
# --------------------------------------------
# Ouvrez le fichier .env et remplacez la ligne DATABASE_URL par :
# DATABASE_URL="mongodb+srv://mamadouelimane:VOTRE_MOT_DE_PASSE@cluster0.orfpiew.mongodb.net/lexpremium?retryWrites=true&w=majority"

# ÉTAPE 2 : Synchroniser le schéma Prisma avec MongoDB
Write-Host "📊 Synchronisation du schéma avec MongoDB Atlas..." -ForegroundColor Cyan
npx prisma db push

# ÉTAPE 3 : Peupler avec les données de base
Write-Host "`n🌱 Peuplement avec les données de base..." -ForegroundColor Cyan
node prisma/seed.mjs

# ÉTAPE 4 : Peupler le module CRM
Write-Host "`n💼 Ajout des prospects et données CRM..." -ForegroundColor Cyan
node prisma/seed-crm.mjs

# ÉTAPE 5 : Peupler l'annuaire professionnel
Write-Host "`n📔 Ajout de l'annuaire (Huissiers, Greffes...)..." -ForegroundColor Cyan
node prisma/seed-directory.mjs

# ÉTAPE 6 : Peupler les audiences
Write-Host "`n⚖️ Ajout des audiences planifiées..." -ForegroundColor Cyan
node prisma/seed-audiences.mjs

Write-Host "`n✅ TERMINÉ ! Votre base MongoDB Atlas est prête.`n" -ForegroundColor Green
Write-Host "🌐 Vous pouvez maintenant accéder à votre application sur Vercel !`n" -ForegroundColor Green
