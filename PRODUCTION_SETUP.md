# Production Setup Guide for Dental Camp

## Required Environment Variables for Vercel

Make sure to set these environment variables in your Vercel dashboard:

### 1. Authentication
```
AUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://www.dental-camp.com
```

### 2. Database
```
DATABASE_URL=your-postgresql-connection-string
```

### 3. Google OAuth (if using)
```
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
```

### 4. Email Service (if using)
```
RESEND_API_KEY=your-resend-api-key
```

### 5. File Upload (if using)
```
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id
```

## Important Notes

### AUTH_SECRET
- Generate a secure random string (32+ characters)
- You can use: `openssl rand -base64 32`
- This must be the same across all deployments

### NEXTAUTH_URL
- Must match your production domain exactly
- Include the protocol (https://)
- No trailing slash

### Google OAuth Setup
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://www.dental-camp.com/api/auth/callback/google`

## Vercel Deployment Steps

1. Connect your GitHub repository to Vercel
2. Set all environment variables in Vercel dashboard
3. Deploy

## Troubleshooting Redirect Issues

If you're getting redirect errors:

1. Check that NEXTAUTH_URL matches your domain exactly
2. Verify Google OAuth redirect URIs are correct
3. Check Vercel function logs for detailed error messages
4. Ensure all required environment variables are set

## Database Setup

Make sure your PostgreSQL database is accessible from Vercel:
1. Use a cloud database (Supabase, PlanetScale, etc.)
2. Ensure connection string includes SSL parameters if required
3. Run `npx prisma db push` to sync schema
