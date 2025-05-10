require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function testDBConnection() {
  let client;
  try {
    console.log('\nStep 1: Testing MongoDB Connection...');
    const uri = process.env.MONGODB_URI;
    client = new MongoClient(uri);
    await client.connect();
    
    // Test database operations
    const db = client.db('evolvenet');
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10)
    };
    
    console.log('\nStep 2: Testing Database Operations...');
    const users = db.collection('users');
    
    // Clean up any existing test user
    await users.deleteOne({ email: testUser.email });
    
    // Insert test user
    const result = await users.insertOne(testUser);
    console.log('✓ Test user created:', result.insertedId);
    
    // Verify we can find the user
    const foundUser = await users.findOne({ email: testUser.email });
    console.log('✓ Test user retrieved successfully');
    
    // Clean up
    await users.deleteOne({ email: testUser.email });
    console.log('✓ Test user cleaned up');
    
    console.log('\nAll database operations completed successfully!');
  } catch (error) {
    console.error('\nTest failed:', error.message);
    if (error.name === 'MongoServerError' && error.code === 18) {
      console.error('\nAuthentication failed - Please verify:');
      console.error('1. Username in connection string');
      console.error('2. Password in connection string');
      console.error('3. Database user permissions');
    }
  } finally {
    if (client) {
      await client.close();
      console.log('\nConnection closed');
    }
    process.exit(0);
  }
}

testDBConnection();