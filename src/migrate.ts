import { execSync } from 'child_process';

console.log('🔄 Aplicando migrations do banco de dados...');

try {
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: process.env
  });
  console.log('✅ Migrations aplicadas com sucesso!');
} catch (error) {
  console.error('❌ Erro ao aplicar migrations:', error);
  process.exit(1);
}


