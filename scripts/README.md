# Test Scripts

This directory contains scripts for testing various functionalities of the application.

## Admin Setup Script

The `test-admin-setup.js` script tests the admin setup functionality by sending a POST request to the admin setup API endpoint. This endpoint creates an admin user in the MongoDB database if one doesn't already exist.

### Usage

```bash
node scripts/test-admin-setup.js
```

### Configuration

The script uses environment variables from the `.env` file:

- `NEXT_PUBLIC_BASE_URL`: The base URL of the application (defaults to http://localhost:3000 if not set)

### Output

The script will display:
1. The setup endpoint being used
2. The HTTP status code
3. The response headers
4. The response body (indicating if admin was created or already exists)

### Example Output

```
Testing admin setup...
Setup endpoint: http://localhost:3000/api/admin/setup
Status Code: 200
Response: {
  "message": "Admin user created successfully",
  "username": "admin",
  "note": "Default password is: admin123"
}
✅ Admin setup successful!
```

If the admin already exists:
```
Testing admin setup...
Setup endpoint: http://localhost:3000/api/admin/setup
Status Code: 200
Response: {
  "message": "Admin user already exists",
  "username": "admin"
}
ℹ️ Admin already exists
```

## Login Test Script

The `test-login.js` script tests the admin login functionality by sending a POST request to the login API endpoint.

### Usage

```bash
node scripts/test-login.js
```

### Configuration

The script uses environment variables from the `.env` file:

- `NEXT_PUBLIC_BASE_URL`: The base URL of the application (defaults to http://localhost:3000 if not set)
- `JWT_SECRET`: The secret used for JWT token generation

### Default Credentials

The script uses the default admin credentials:
- Username: `admin`
- Password: `admin123`

### Output

The script will display:
1. The login endpoint being used
2. The HTTP status code
3. The response headers
4. The response body (including JWT token if login is successful)

### Example Output

```
Testing admin login...
Using credentials: { username: 'admin', password: 'admin123' }
Login endpoint: http://localhost:3000/api/admin/login
Status Code: 200
Response: {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "cmd6g0uhy01cd2mv670ix8g4k",
    "username": "admin"
  }
}
✅ Login successful! JWT token received.
```

If the login fails, the script will display the error message from the API.