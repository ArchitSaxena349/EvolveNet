const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

async function testAtlasAuth() {
  // Test different authentication scenarios
  const baseUri = 'mongodb+srv://architsaxena349:Archit01@evolvenet.gf3ijvv.mongodb.net';
  const testCases = [
    {
      name: 'Default connection',
      uri: `${baseUri}/?retryWrites=true&w=majority`
    },
    {
      name: 'With database name',
      uri: `${baseUri}/evolvenet?retryWrites=true&w=majority`
    },
    {
      name: 'With authSource',
      uri: `${baseUri}/evolvenet?retryWrites=true&w=majority&authSource=admin`
    }
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