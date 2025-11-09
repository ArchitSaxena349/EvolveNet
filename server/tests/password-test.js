const { MongoClient } = require('mongodb');

async function testPasswordEncoding() {
  const envUri = process.env.MONGODB_URI;
  if (!envUri) {
    console.error('No MONGODB_URI set in environment. Skipping password-encoding test.');
    process.exit(0);
  }

  try {
    const client = new MongoClient(envUri, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    const db = client.db();
    await db.command({ ping: 1 });
    console.log('✓ Connection successful using MONGODB_URI');
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ Connection failed with error:', error.message);
    process.exit(1);
  }
}

testPasswordEncoding().catch(console.error);