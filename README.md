# 🦷 Dental Camp - E-commerce Platform

A modern, full-stack e-commerce platform for dental equipment and supplies built with Next.js 15, TypeScript, and Prisma.

## ✨ Features

### 🔐 Authentication System
- **Google OAuth** integration
- **Credentials-based** authentication
- **Role-based access control** (Admin/User)
- **Automatic role-based routing**:
  - Admins → `/dashboard`
  - Users → `/user/dashboard`
- **Protected routes** with middleware
- **Session management** with NextAuth.js v5

### 👥 User Management
- **Admin Dashboard**: Complete management interface
- **User Dashboard**: Customer portal with order tracking
- **Profile management**
- **Email verification**

### 🛍️ E-commerce Features
- **Product catalog** with categories
- **Search and filtering**
- **Shopping cart** functionality
- **Order management**
- **Inventory tracking**

### 🎨 Modern UI/UX
- **Responsive design** with Tailwind CSS
- **Component library** with Radix UI
- **Smooth animations** with Framer Motion
- **Professional dashboard** layouts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google OAuth credentials (optional)

### 1. Clone and Install
```bash
git clone <repository-url>
cd dental-camp
npm install
```

### 2. Environment Setup
Create `.env.local` file:
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/dental_camp"

# Authentication
AUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Email (optional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="your-email@gmail.com"
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Create your first admin user manually or through Prisma Studio
npm run db:studio
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
dental-camp/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Admin dashboard
│   ├── user/              # User dashboard
│   ├── catalog/           # Product catalog
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── auth/              # Auth components
│   ├── ui/                # UI components
│   ├── user/              # User-specific components
│   └── landing/           # Landing page components
├── lib/                   # Utility functions
├── prisma/                # Database schema & migrations
├── public/                # Static assets
└── types/                 # TypeScript definitions
```

## 🔑 Authentication Flow

### User Registration & Login
1. **Sign Up**: Users can register with email/password or Google OAuth
2. **Email Verification**: Optional email verification system
3. **Role Assignment**: Users are assigned USER role by default
4. **Admin Access**: Admins can be created through database seeding

### Role-Based Routing
- **Authenticated users** trying to access auth pages are redirected to their dashboard
- **Unauthenticated users** accessing protected routes are redirected to sign-in
- **Non-admin users** accessing admin routes are redirected to user dashboard

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run build:production # Build with database push
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Create migration files

npm run db:studio        # Open Prisma Studio
npm run db:reset         # Reset database (careful!)

# Utilities
npm run clean            # Clean build files
```

## 🗄️ Database Schema

### Core Models
- **User**: Authentication and profile data
- **Account**: OAuth account linking
- **Session**: User sessions
- **Product**: Product catalog
- **Category**: Product categories
- **Order**: Customer orders
- **VerificationCode**: Email verification

### User Roles
- **USER**: Regular customers with access to user dashboard
- **ADMIN**: Administrators with full system access

## 🚀 Deployment

### Production Build
```bash
npm run build:production
npm start
```

### Environment Variables for Production
```bash
# Required
DATABASE_URL="your-production-database-url"
AUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://yourdomain.com"

# Optional
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

### Vercel Deployment
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🧪 Testing

### Creating Test Accounts
Create test accounts manually through:
1. **Sign up page**: `/auth/signup`
2. **Prisma Studio**: `npm run db:studio`
3. **Direct database**: Update user role to 'ADMIN' for admin access

## 🔧 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository.
