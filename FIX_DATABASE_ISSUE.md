# Database Fix Instructions

## Problem

You're encountering an error when trying to fetch events:

```
{
  "error": "Failed to fetch events",
  "details": "Invalid `prisma.event.findMany()` invocation: Inconsistent column data: Could not convert value [] of the field `date` to type `DateTime`.",
  "code": "P2023"
}
```

This error occurs because some events in your database have an empty array `[]` in the `date` field instead of a proper DateTime value.

## Solution

Follow these steps to fix the database issue:

### Step 1: Update Prisma Schema to Use SQLite

Your project is configured to use SQLite (as indicated in DATABASE_SETUP.md), but the Prisma schema is still set to use PostgreSQL. Run this script to fix it:

```bash
node scripts/update-schema.js
```

This will update your Prisma schema to use SQLite instead of PostgreSQL.

### Step 2: Fix Invalid Date Values

Run the script to fix events with invalid date values:

```bash
node scripts/fix-dates.js
```

This script will:
1. Find all events with NULL or empty date values
2. Update them with a default date (30 days from now)
3. Specifically handle events with empty array `[]` values in the date field

### Step 3: Reset Your Database (Optional)

If the above steps don't work, you may need to completely reset your database:

1. Delete the database file:
   ```bash
   rm prisma/dev.db
   ```

2. Reinitialize the database:
   ```bash
   npm run setup
   ```

### Step 4: Verify the Fix

After running the scripts, try fetching events again to verify the issue is resolved.

## Additional Notes

- The error occurs because your app is trying to use a PostgreSQL schema with an SQLite database, and there's data corruption in the date field.
- The scripts provided will help you fix both the schema mismatch and the data corruption.
- If you continue to experience issues, check your environment variables to ensure DATABASE_URL is correctly set to point to your SQLite database file.
