const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

async function testAtlasAuth() {
  const baseUri = process.env.MONGODB_URI;
  if (!baseUri) {
    console.error('No MONGODB_URI provided in environment. Skipping Atlas auth tests.');
    process.exit(0);
  }

  const testCases = [
    { name: 'Default connection', uri: `${baseUri}` },
    { name: 'With database name', uri: `${baseUri}/evolvenet` }
  ];

  for (const test of testCases) {
    console.log(`\nTesting ${test.name}...`);
    console.log('URI:', test.uri.replace(/:([^:@]+)@/, ':****@'));

    try {
      // Try with MongoClient
      const client = new MongoClient(test.uri, {
        serverSelectionTimeoutMS: 5000
      });
      await client.connect();
      console.log('✓ MongoClient connection successful');
      await client.close();

      // Try with Mongoose
      const conn = await mongoose.createConnection(test.uri, {
        serverSelectionTimeoutMS: 5000
      }).asPromise();
      console.log('✓ Mongoose connection successful');
      await conn.close();

    } catch (error) {
      console.error('✗ Connection failed');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      if (error.codeName) {
        console.error('Error code:', error.codeName);
      }
    }
  }

  process.exit(0);
}

testAtlasAuth();