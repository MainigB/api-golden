# Script para fazer push para GitHub
# Execute este script após criar o repositório no GitHub

Write-Host "🚀 Preparando para deploy no Railway..." -ForegroundColor Green
Write-Host ""

# Verificar se já existe remote
$remote = git remote get-url origin 2>$null

if ($remote) {
    Write-Host "✅ Remote já configurado: $remote" -ForegroundColor Green
    Write-Host ""
    Write-Host "Fazendo push para GitHub..." -ForegroundColor Yellow
    git push -u origin master
} else {
    Write-Host "⚠️  Você precisa criar o repositório no GitHub primeiro!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Passos:" -ForegroundColor Cyan
    Write-Host "1. Acesse: https://github.com/new" -ForegroundColor White
    Write-Host "2. Crie um novo repositório (ex: api-golden)" -ForegroundColor White
    Write-Host "3. NÃO inicialize com README" -ForegroundColor White
    Write-Host "4. Copie a URL do repositório" -ForegroundColor White
    Write-Host "5. Execute o comando abaixo substituindo SEU-USUARIO:" -ForegroundColor White
    Write-Host ""
    Write-Host "   git remote add origin https://github.com/SEU-USUARIO/api-golden.git" -ForegroundColor Green
    Write-Host "   git branch -M main" -ForegroundColor Green
    Write-Host "   git push -u origin main" -ForegroundColor Green
    Write-Host ""
}

