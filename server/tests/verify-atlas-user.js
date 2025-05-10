const { MongoClient } = require('mongodb');

async function verifyAtlasUser() {
  // Use admin database for authentication
  const uri = 'mongodb+srv://architsaxena349:Archit01@evolvenet.gf3ijvv.mongodb.net/admin';
  
  console.log('Verifying MongoDB Atlas user...');
  console.log('URI (with hidden password):', uri.replace(/:([^:@]+)@/, ':****@'));
  
  try {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      authSource: 'admin'
    });

    console.log('\nAttempting connection...');
    await client.connect();
    
    // Try to list users to verify permissions
    const adminDb = client.db('admin');
    console.log('\nChecking user information...');
    
    try {
      const usersInfo = await adminDb.command({ usersInfo: 1 });
      console.log('✓ Successfully retrieved user information');
      console.log('Users found:', usersInfo.users.length);
      console.log('Current user roles:', usersInfo.users.map(u => u.roles).flat());
    } catch (userError) {
      console.log('✗ Could not retrieve user information - insufficient permissions');
    }

    await client.close();
    console.log('\nConnection test completed');
  } catch (error) {
    console.error('\nConnection failed!');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.message.includes('bad auth')) {
      console.error('\nTroubleshooting suggestions:');
      console.error('1. Verify the username exactly matches: architsaxena349');
      console.error('2. Check if the password contains any special characters that need escaping');
      console.error('3. Ensure the user has appropriate roles (readWrite at minimum)');
      console.error('4. Try creating a new database user in MongoDB Atlas');
    }
  }
  
  process.exit(0);
}

verifyAtlasUser();