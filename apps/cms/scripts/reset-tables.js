import pg from 'pg';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from apps/cms/.env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { Client } = pg;

if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL is not set in environment variables.');
  process.exit(1);
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function reset() {
  console.log('Connecting to database...');
  await client.connect();
  
  console.log('Dropping schema public...');
  // Drop entire public schema to ensure everything is gone
  await client.query('DROP SCHEMA public CASCADE');
  await client.query('CREATE SCHEMA public');
  await client.query('GRANT ALL ON SCHEMA public TO postgres');
  await client.query('GRANT ALL ON SCHEMA public TO public');
  
  console.log('Schema recreated successfully.');
  await client.end();
}

reset().catch(err => {
  console.error('Reset failed:', err);
  process.exit(1);
});
