require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

async function testMongoDBConnection() {
  console.log('Starting MongoDB connection test...');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('MongoDB URI:', process.env.MONGODB_URI?.replace(/:([^:@]+)@/, ':****@'));

  try {
    // Step 1: Test connection string format
    console.log('\nStep 1: Testing connection string format...');
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('✓ Connection string format is valid');
    await client.close();

    // Step 2: Test mongoose connection
    console.log('\nStep 2: Testing mongoose connection...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });

    console.log('✓ Successfully connected to MongoDB');
    console.log('Connection details:');
    console.log('- Host:', conn.connection.host);
    console.log('- Database:', conn.connection.name);
    console.log('- Port:', conn.connection.port);

    await mongoose.disconnect();
    console.log('\nTest completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('\nConnection test failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

testMongoDBConnection();