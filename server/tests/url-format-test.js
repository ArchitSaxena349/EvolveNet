function validateMongoDBUrl(url) {
  const mongoUrlRegex = /^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)(\?.*)?$/;
  const match = url.match(mongoUrlRegex);
  
  if (!match) {
    console.error('Invalid MongoDB URL format');
    return false;
  }
  
  const [_, username, password, host, database, queryString] = match;
  
  console.log('MongoDB URL Analysis:');
  console.log('-------------------');
  console.log('Format:', '✓ Valid mongodb+srv:// URL');
  console.log('Username:', username);
  console.log('Password:', '*'.repeat(password.length));
  console.log('Host:', host);
  console.log('Database:', database);
  console.log('Query Parameters:', queryString ? queryString.slice(1).split('&').join(', ') : 'none');
  
  // Additional validations
  const issues = [];
  
  if (username.includes('@')) {
    issues.push('Username contains @ character');
  }
  
  if (password.includes('@')) {
    issues.push('Password contains @ character');
  }
  
  if (!host.includes('.mongodb.net')) {
    issues.push('Host does not end with .mongodb.net');
  }
  
  if (queryString && !queryString.includes('retryWrites=true')) {
    issues.push('Missing retryWrites=true parameter');
  }
  
  if (issues.length > 0) {
    console.error('\nPotential Issues Found:');
    issues.forEach(issue => console.error('- ' + issue));
    return false;
  }
  
  console.log('\nAll validation checks passed ✓');
  return true;
}

// Test the current connection string from environment
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('No MONGODB_URI provided in environment. Skipping URL format test.');
  process.exit(0);
}

console.log('Analyzing MongoDB Atlas connection string from MONGODB_URI...\n');
validateMongoDBUrl(uri);