
Write-Host ">>> Lancement du Déploiement Automatique LexPremium <<<" -ForegroundColor Cyan

# 1. Configuration GitHub
Write-Host "1. Configuration de GitHub..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/mamadouelimanewane/lexpremium.git
Write-Host "Remote configuré : https://github.com/mamadouelimanewane/lexpremium.git" -ForegroundColor Green

Write-Host "Tentative de PUSH vers GitHub (Une fenêtre d'authentification peut s'ouvrir)..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR : Le push a échoué. Assurez-vous d'avoir créé le dépôt vide 'lexpremium' sur GitHub." -ForegroundColor Red
    Write-Host "Lien de création : https://github.com/new?name=lexpremium" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée une fois le dépôt créé..."
    git push -u origin main
}

# 2. Déploiement Vercel
Write-Host "`n2. Déploiement vers Vercel..." -ForegroundColor Yellow
Write-Host "Installation de Vercel CLI..."
npm install -g vercel

Write-Host "Lancement du déploiement (Suivez les instructions de connexion dans le navigateur)..." -ForegroundColor Yellow
vercel --prod

Write-Host "`n>>> TERMINÉ ! <<<" -ForegroundColor Cyan
