# UploadThing Setup Guide

## Overview
This project uses UploadThing for file uploads. To enable image uploads in the product management system, you need to configure UploadThing with your API credentials.

## Quick Setup

### 1. Create UploadThing Account
1. Visit [uploadthing.com](https://uploadthing.com)
2. Sign up for a free account
3. Create a new app for your project

### 2. Get Your API Credentials
1. Go to your [UploadThing Dashboard](https://uploadthing.com/dashboard)
2. Select your app
3. Copy your **API Token** and **App ID**

### 3. Configure Environment Variables
Add the following to your `.env` file:

```env
# UploadThing Configuration
UPLOADTHING_TOKEN="your_actual_token_here"
UPLOADTHING_APP_ID="your_actual_app_id_here"
```

### 4. Restart Development Server
```bash
npm run dev
```

## Current Status

### ✅ What's Working
- **Fallback Mode**: Image upload works in demo mode with local previews
- **UI Components**: Full drag-and-drop interface with image management
- **Error Handling**: Graceful fallback when UploadThing is not configured
- **Image Management**: Reorder, set main image, remove images

### ⚠️ What Needs UploadThing
- **Real File Uploads**: Actual file storage and CDN delivery
- **Persistent Images**: Images that survive page refreshes
- **Production Ready**: Scalable image hosting

## Features Available in Demo Mode

Even without UploadThing configured, you can:
- ✅ Upload and preview images locally
- ✅ Reorder images and set main image
- ✅ Test the complete UI/UX flow
- ✅ Create products with image placeholders
- ✅ See how the system will work when fully configured

## UploadThing Benefits

When properly configured, UploadThing provides:
- 🚀 **Fast CDN Delivery**: Global content delivery network
- 🔒 **Secure Uploads**: Built-in security and validation
- 📱 **Automatic Optimization**: Image resizing and format optimization
- 💾 **Reliable Storage**: Persistent file storage
- 📊 **Usage Analytics**: Upload statistics and monitoring

## Troubleshooting

### Common Issues

1. **"Missing token" Error**
   - Ensure `UPLOADTHING_TOKEN` is set in `.env`
   - Restart the development server
   - Check that the token is valid

2. **Images Not Uploading**
   - Verify your UploadThing app is active
   - Check file size limits (current: 4MB max)
   - Ensure file types are supported (JPG, PNG, WEBP)

3. **Demo Mode Stuck**
   - Clear browser cache
   - Restart development server
   - Verify environment variables are loaded

### Getting Help

- [UploadThing Documentation](https://docs.uploadthing.com)
- [UploadThing Discord](https://discord.gg/uploadthing)
- [GitHub Issues](https://github.com/pingdotgg/uploadthing/issues)

## Alternative Solutions

If you prefer not to use UploadThing, you can:
1. Use AWS S3 with custom upload logic
2. Implement Cloudinary integration
3. Use Vercel Blob storage
4. Set up your own file server

The current fallback system makes it easy to swap out the upload provider while keeping the same UI/UX.
