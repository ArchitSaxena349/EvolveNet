const { MongoClient } = require('mongodb');

async function testMongoDBAtlasConnection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('No MONGODB_URI set in environment. Skipping MongoDB Atlas connection test.');
    process.exit(0);
  }

  console.log('Testing MongoDB Atlas connection using MONGODB_URI...');
  console.log('Connection string (hidden password):', uri.replace(/:([^:@]+)@/, ':****@'));
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    // Test the connection by listing databases
    const adminDb = client.db('admin');
    const result = await adminDb.command({ listDatabases: 1 });
    
    console.log('\nConnection successful!');
    console.log('Available databases:', 
      result.databases.map(db => db.name).join(', '));
    
    await client.close();
    console.log('\nConnection closed cleanly');
    process.exit(0);
  } catch (error) {
    console.error('\nConnection failed!');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.message.includes('bad auth')) {
      console.error('\nAuthentication failed. Please verify:');
      console.error('1. Username is correct (architsaxena349)');
      console.error('2. Password is correct');
      console.error('3. User has appropriate database access permissions');
    }
    
    process.exit(1);
  }
}

testMongoDBAtlasConnection();