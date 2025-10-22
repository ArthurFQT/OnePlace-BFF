const { execSync } = require('child_process');

const name = process.argv[2];

if (!name) {
  console.error('❌ Você precisa passar o nome da migration.');
  process.exit(1);
}

const command = `ts-node --require tsconfig-paths/register ./node_modules/typeorm/cli.js \
  migration:create src/shared/providers/typeorm/migrations/${name}`;

execSync(command, { stdio: 'inherit' });
