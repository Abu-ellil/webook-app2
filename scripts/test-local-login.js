const https = require('https');
const http = require('http');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testLocalLogin() {
  console.log('Testing local admin login...');
  
  // Use localhost for local testing
  const baseUrl = 'http://localhost:3000';
  const loginEndpoint = `${baseUrl}/api/admin/login`;
  
  console.log('Login endpoint:', loginEndpoint);
  
 // Default credentials
  const credentials = {
    username: 'admin',
    password: 'admin123'
  };
  
  console.log('Using credentials:', credentials);
  
  // Prepare the request data
  const postData = JSON.stringify(credentials);
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  // Make the request
  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`Status Code: ${res.statusCode}`);
      console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
      
      try {
        const response = JSON.parse(data);
        console.log('Response:', JSON.stringify(response, null, 2));
        
        if (response.token) {
          console.log('✅ Local login successful! JWT token received.');
        } else if (response.error) {
          console.log('❌ Local login failed:', response.error);
        }
      } catch (error) {
        console.log('Response (raw):', data);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('❌ Request error:', error);
  });
  
  // Write the request data
  req.write(postData);
  req.end();
}

testLocalLogin();