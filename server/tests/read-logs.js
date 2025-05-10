const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '..', 'logs', 'mongo-connection.log');

try {
  if (fs.existsSync(logPath)) {
    const logs = fs.readFileSync(logPath, 'utf8');
    console.log('MongoDB Connection Logs:');
    console.log('------------------------');
    console.log(logs);
  } else {
    console.log('No MongoDB connection logs found.');
    console.log('Expected log file at:', logPath);
  }
} catch (error) {
  console.error('Error reading logs:', error);
}