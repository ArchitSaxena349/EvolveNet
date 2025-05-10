require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

async function testMinimalConnection() {
  try {
    console.log('Testing connection with minimal configuration...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });

    console.log(`Connected to MongoDB at ${conn.connection.host}`);
    await mongoose.disconnect();
    console.log('Test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Connection failed with error:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    process.exit(1);
  }
}

testMinimalConnection();