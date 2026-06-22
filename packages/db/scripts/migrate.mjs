import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, '..', 'migrations');

const databaseUrl =
  process.env.DATABASE_URL ??
  'postgresql://dimaker:dimaker@localhost:5433/dimaker';

async function main() {
  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const version = file.replace('.sql', '');
    const { rows } = await client.query(
      'SELECT 1 FROM schema_migrations WHERE version = $1',
      [version],
    );
    if (rows.length > 0) {
      console.log(`skip ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log(`apply ${file}`);
    await client.query(sql);
    await client.query(
      'INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT DO NOTHING',
      [version],
    );
  }

  await client.end();
  console.log('migrations complete');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
