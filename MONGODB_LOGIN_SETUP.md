# MongoDB Login Setup Guide

This guide explains how to set up the admin login functionality to work with MongoDB.

## Files Created/Modified

1. **`app/api/admin/login/route.ts.fixed`** - Updated admin login API that works with MongoDB
2. **`scripts/setup-admin-mongodb.js`** - Script to create the initial admin user in MongoDB

## Setup Steps

### 1. Replace the Login API

Replace the content of `app/api/admin/login/route.ts` with the content from `app/api/admin/login/route.ts.fixed`:

```bash
# On Windows
copy /Y "app\api\admin\login\route.ts.fixed" "app\api\admin\login\route.ts"

# On Linux/Mac
cp app/api/admin/login/route.ts.fixed app/api/admin/login/route.ts
```

### 2. Create Admin User in MongoDB

Run the setup script to create the initial admin user:

```bash
node scripts/setup-admin-mongodb.js
```

This will create an admin user with:
- Username: `admin`
- Password: `admin123`

### 3. Test the Login

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the admin login page:
   ```
   http://localhost:3000/admin/login
   ```

3. Use the credentials:
   - Username: `admin`
   - Password: `admin123`

## Troubleshooting

If you encounter connection issues:

1. Verify your MongoDB connection string in `.env`
2. Ensure MongoDB is accessible and your credentials are correct
3. Check that the database name in the connection string matches what's used in the code (`webook`)
