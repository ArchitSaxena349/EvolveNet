const { MongoClient } = require('mongodb');

const envUri = process.env.MONGODB_URI;
if (!envUri) {
  console.error('No MONGODB_URI set in environment. Skipping test.');
  process.exit(0);
}

const uri = envUri;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testConnection() {
  let client;
  
  try {
    console.log('Starting MongoDB connection test...\n');
    await delay(1000);

    // Step 1: Validate URI format
    console.log('Step 1: Validating connection string format...');
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    console.log('✓ Connection string format is valid\n');
    await delay(1000);

    // Step 2: Test actual connection
    console.log('Step 2: Attempting to connect...');
    await client.connect();
    console.log('✓ Successfully connected to MongoDB\n');
    await delay(1000);

    // Step 3: Verify database access
    console.log('Step 3: Verifying database access...');
    const db = client.db('evolvenet');
    const collections = await db.listCollections().toArray();
    console.log('✓ Database access verified');
    console.log('Available collections:', collections.map(c => c.name).join(', ') || 'none');
    
  } catch (error) {
    console.error('\n❌ Connection test failed!');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    
    if (error.name === 'MongoParseError') {
      console.error('\nThis appears to be a connection string format error.');
      console.error('Please verify the connection string format is correct.');
    } else if (error.name === 'MongoTimeoutError') {
      console.error('\nConnection timed out.');
      console.error('Please check:');
      console.error('1. Your network connection');
      console.error('2. MongoDB Atlas whitelist settings');
      console.error('3. Database server status');
    }
    
    process.exit(1);
  } finally {
    if (client) {
      console.log('\nClosing connection...');
      await client.close();
      console.log('Connection closed');
    }
    process.exit(0);
  }
}

// Handle any uncaught errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
  process.exit(1);
});

testConnection();