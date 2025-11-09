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
  const baseUri = process.env.MONGODB_URI;

  if (!baseUri) {
    console.error('No MONGODB_URI set in environment. Skipping tests.');
    process.exit(0);
  }

  const tests = [
    { description: 'Basic connection', uri: `${baseUri}` },
    { description: 'With database appended', uri: `${baseUri}/evolvenet` }
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