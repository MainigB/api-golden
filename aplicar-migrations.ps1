# Script para aplicar migrations no Railway
# Execute este script após fazer login no Railway

Write-Host "🚀 Aplicando migrations no Railway..." -ForegroundColor Green
Write-Host ""

# Verificar se está logado
Write-Host "Verificando login no Railway..." -ForegroundColor Yellow
$loginCheck = npx @railway/cli whoami 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Você precisa fazer login primeiro!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Execute no terminal:" -ForegroundColor Cyan
    Write-Host "  npx @railway/cli login" -ForegroundColor White
    Write-Host ""
    Write-Host "Isso abrirá o navegador para autenticação." -ForegroundColor White
    Write-Host ""
    Write-Host "Após fazer login, execute novamente este script." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Logado no Railway!" -ForegroundColor Green
Write-Host ""

# Conectar ao projeto
Write-Host "Conectando ao projeto..." -ForegroundColor Yellow
npx @railway/cli link

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Erro ao conectar ao projeto." -ForegroundColor Red
    Write-Host "Certifique-se de estar na pasta do projeto." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Projeto conectado!" -ForegroundColor Green
Write-Host ""

# Aplicar migrations
Write-Host "Aplicando migrations do banco de dados..." -ForegroundColor Yellow
npx @railway/cli run npx prisma migrate deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Migrations aplicadas com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Sua API está pronta para uso!" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Erro ao aplicar migrations." -ForegroundColor Red
    Write-Host "Verifique se o banco PostgreSQL foi criado no Railway." -ForegroundColor Yellow
}




