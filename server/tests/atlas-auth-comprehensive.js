const { MongoClient } = require('mongodb');

async function testConnection(uri, description) {
  console.log(`\nTesting ${description}...`);
  console.log('URI:', uri.replace(/:([^:@]+)@/, ':****@'));
  
  try {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      directConnection: false
    });
    
    await client.connect();
    const db = client.db('admin');
    await db.command({ ping: 1 });
    console.log('✓ Connection successful');
    await client.close();
    return true;
  } catch (error) {
    console.error('✗ Connection failed');
    console.error('Error:', error.message);
    return false;
  }
}

async function runTests() {
  const baseUri = 'mongodb+srv://architsaxena349:Archit01@evolvenet.gf3ijvv.mongodb.net';
  
  const tests = [
    {
      description: 'Basic connection',
      uri: `${baseUri}/?retryWrites=true&w=majority`
    },
    {
      description: 'With authSource',
      uri: `${baseUri}/?authSource=admin&retryWrites=true&w=majority`
    },
    {
      description: 'With authMechanism',
      uri: `${baseUri}/?authMechanism=SCRAM-SHA-1&retryWrites=true&w=majority`
    },
    {
      description: 'With database and authSource',
      uri: `${baseUri}/evolvenet?authSource=admin&retryWrites=true&w=majority`
    },
    {
      description: 'With SSL required',
      uri: `${baseUri}/?ssl=true&retryWrites=true&w=majority`
    }
  ];

  console.log('Starting comprehensive MongoDB Atlas authentication tests...\n');
  
  for (const test of tests) {
    await testConnection(test.uri, test.description);
    // Add a small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\nAll tests completed');
  process.exit(0);
}

runTests().catch(console.error);