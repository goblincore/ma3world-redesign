import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:Misterbear9614!@db.lxlaqnmnegjmfgejbqkd.supabase.co:5432/postgres',
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
