import pg from 'pg';

export const pool = new pg.Pool({
  connectionString:
    process.env.DATABASE_URL ??
    'postgresql://dimaker:dimaker@localhost:5433/dimaker',
});
