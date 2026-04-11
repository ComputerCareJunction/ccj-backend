# Supabase Connection Details - Quick Start

## Getting Your Supabase Connection String

Follow these steps to retrieve your database connection string:

### Step 1: Access Supabase Dashboard
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Log in with your account
3. Click on your **CCJ-DATABASE** project

### Step 2: Navigate to Database Settings
1. In the left sidebar, click **Settings**
2. Select **Database** from the menu
3. You'll see the database connection options

### Step 3: Get Your Connection String

You have two options:

#### Option A: Direct Connection (Recommended for Development)
- Look for **Connection String** section
- Select **PostgreSQL** from the dropdown
- Copy the connection string
- **Format:**
  ```
  postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
  ```

#### Option B: Connection Pooling (Recommended for Production)
- Look for **Connection pooling** section
- Select **Session** mode
- Copy the pooling connection string
- **Format:**
  ```
  postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?sslmode=require
  ```

## Where to Find Each Part

From the Supabase dashboard:

| Part | Location | Example |
|------|----------|---------|
| **HOST** | Connection details area | `xxxxxxxxxxx.supabase.co` |
| **PASSWORD** | Shown when you first reveal the connection string | (Password set during project creation) |
| **PORT** | 5432 (direct) or 6543 (pooling) | `5432` |

## Complete Connection String Format

```
postgresql://postgres:YOUR_PASSWORD@YOUR_HOST.supabase.co:5432/postgres?sslmode=require
```

**Example (with dummy values):**
```
postgresql://postgres:abc123xyz789@xpzpqywvabcdefgh.supabase.co:5432/postgres?sslmode=require
```

## Update Your .env File

Once you have your connection string:

1. Open `.env` file in your project root
2. Update this line:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST.supabase.co:5432/postgres?sslmode=require
   ```

3. Also update these (optional but recommended):
   ```
   NODE_ENV=production
   FRONTEND_URL=https://your-domain.com
   API_URL=https://api.your-domain.com/api
   JWT_SECRET=generate-a-strong-random-key
   ```

4. Save the file

## Test Your Connection

Run the development server to test the connection:

```bash
npm run dev
```

You should see in the logs:
```
✅ Database connection established successfully
🚀 Server is running on port 3000
```

## Common Issues

### "Password authentication failed"
- Double-check your password in the connection string
- Make sure there are no extra spaces
- If you forgot the password, you can reset it in Supabase Settings

### "Connection timeout"
- Verify the HOST is correct (should be `xxxx.supabase.co`)
- Ensure your internet connection is stable
- Check that port 5432 is not blocked by your firewall

### "SSL certificate error"
- Ensure your connection string includes `?sslmode=require`
- Update the `pg` npm package to the latest version

## Next Steps

1. ✅ Get connection string (you are here)
2. ⏭️ Update `.env` file with your connection string
3. ⏭️ Run migrations: `npm run migrate:run`
4. ⏭️ Seed initial data: `npm run seed`
5. ⏭️ Start development: `npm run dev`

## Additional Resources

- [Supabase Database Documentation](https://supabase.com/docs/guides/database)
- [Connection String Format](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)
- [PostgreSQL Port Numbers](https://www.postgresql.org/docs/current/runtime-config-connection.html)

## Security Tips

⚠️ **Important:** Never commit your `.env` file with real credentials to Git!

1. Make sure `.env` is in your `.gitignore`
2. Use environment variables in CI/CD pipelines
3. Rotate your database password periodically
4. Use strong, unique JWT secrets
5. Store sensitive keys in secure vaults (e.g., GitHub Secrets, HashiCorp Vault)
