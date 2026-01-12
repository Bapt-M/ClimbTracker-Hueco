const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'climbtracker',
  password: 'climbtrack123',
  database: 'climbtracker',
});

console.log('Attempting to connect with:');
console.log('- host: localhost');
console.log('- port: 5432');
console.log('- user: climbtracker');
console.log('- database: climbtracker');
console.log('');

client.connect()
  .then(() => {
    console.log('✅ Connected successfully!');
    return client.query('SELECT version()');
  })
  .then((result) => {
    console.log('PostgreSQL version:', result.rows[0].version);
    return client.end();
  })
  .then(() => {
    console.log('✅ Connection closed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Connection failed:');
    console.error(err.message);
    console.error('');
    console.error('Full error:');
    console.error(err);
    process.exit(1);
  });
