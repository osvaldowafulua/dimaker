import pg from 'pg';

const databaseUrl =
  process.env.DATABASE_URL ??
  'postgresql://dimaker:dimaker@localhost:5433/dimaker';

async function main() {
  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();

  await client.query(`
    INSERT INTO subscription_plans (code, name, stripe_price_id, monthly_download_quota, price_cents)
    VALUES
      ('elements_monthly', 'Dimaker Elements Monthly', 'price_replace_me', 50, 1999),
      ('elements_annual', 'Dimaker Elements Annual', 'price_replace_me_annual', 50, 19900)
    ON CONFLICT (code) DO NOTHING;
  `);

  await client.end();
  console.log('seed complete');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
