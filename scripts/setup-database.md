# Database Setup Guide

## Quick Setup (Recommended)

### Option 1: Using Docker (Easiest)

1. **Install Docker** if you haven't already
2. **Run PostgreSQL in Docker:**
   ```bash
   docker run --name dental-postgres -e POSTGRES_PASSWORD=password123 -e POSTGRES_DB=dental_camp -p 5432:5432 -d postgres:15
   ```

3. **Update your .env.local file:**
   ```bash
   # Uncomment and update this line in .env.local:
   DATABASE_URL="postgresql://postgres:password123@localhost:5432/dental_camp"
   ```

4. **Generate Prisma client and run migrations:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Seed the database with sample data:**
   ```bash
   npm run db:seed
   ```

### Option 2: Using Local PostgreSQL

1. **Install PostgreSQL** on your system
2. **Create a database:**
   ```sql
   CREATE DATABASE dental_camp;
   CREATE USER dental_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE dental_camp TO dental_user;
   ```

3. **Update .env.local:**
   ```bash
   DATABASE_URL="postgresql://dental_user:your_password@localhost:5432/dental_camp"
   ```

4. **Run setup commands:**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

### Option 3: Using Online Database (Supabase/Neon)

1. **Create a free account** at [Supabase](https://supabase.com) or [Neon](https://neon.tech)
2. **Create a new PostgreSQL database**
3. **Copy the connection string** and update .env.local:
   ```bash
   DATABASE_URL="your_connection_string_here"
   ```
4. **Run setup:**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

## Package.json Scripts

Add these scripts to your package.json:

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx scripts/seed-database.ts",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset"
  }
}
```

## Verification

After setup, your website will automatically:
- ✅ Load real categories from database
- ✅ Display actual products with proper data
- ✅ Show "from database" in console logs
- ✅ Use database pagination and filtering

## Sample Data Included

The seeding script creates:
- **6 Categories**: Composite, Instruments, Equipment, Sterilization, Diagnostic, Anesthesia
- **6 Products**: Including featured items with realistic pricing and descriptions
- **Proper relationships**: Products linked to categories
- **SEO data**: Meta titles and descriptions
- **Inventory tracking**: Stock quantities and SKUs

## Troubleshooting

If you see "using mock data" in the console:
1. Check DATABASE_URL is uncommented in .env.local
2. Verify database connection with: `npm run db:studio`
3. Ensure database is running and accessible
4. Check console for specific error messages

## Next Steps

Once database is connected:
1. Visit [http://localhost:3003](http://localhost:3003) to see real data
2. Use `npm run db:studio` to manage data visually
3. Add more products and categories through the admin interface
4. Customize the seeding script for your specific needs
