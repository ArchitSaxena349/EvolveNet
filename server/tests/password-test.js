const { MongoClient } = require('mongodb');

async function testPasswordEncoding() {
  const baseUri = 'mongodb+srv://architsaxena349:';
  const password = 'Archit01';
  const suffix = '@evolvenet.gf3ijvv.mongodb.net/evolvenet?retryWrites=true&w=majority';
  
  // Test different password encodings
  const passwords = [
    password,                              // Raw password
    encodeURIComponent(password),          // URL encoded
    encodeURI(password),                   // URI encoded
    Buffer.from(password).toString('hex')  // Hex encoded
  ];

  for (const encodedPassword of passwords) {
    const uri = baseUri + encodedPassword + suffix;
    console.log('\nTesting with encoded password:', encodedPassword);
    
    try {
      const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
      });

      await client.connect();
      const db = client.db('admin');
      await db.command({ ping: 1 });
      
      console.log('✓ Connection successful with this encoding');
      await client.close();
      
      // Write working configuration to a file
      require('fs').writeFileSync(
        require('path').join(__dirname, 'working-config.txt'),
        `Working MongoDB URI: ${uri.replace(encodedPassword, '****')}\nPassword encoding used: ${encodedPassword === password ? 'none' : encodedPassword}`
      );
      
      process.exit(0);
    } catch (error) {
      console.error('✗ Failed with error:', error.message);
      continue;
    }
  }
  
  console.error('\nAll password encoding attempts failed');
  process.exit(1);
}

testPasswordEncoding().catch(console.error);