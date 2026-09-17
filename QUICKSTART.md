# 🚀 Dental Camp - Quick Start Guide

## For Developers

### 1. Local Development (Fastest)

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev
```

Visit: http://localhost:3000

### 2. Docker Development

```bash
# Start everything with one command
make setup-local

# Or manually:
docker-compose up -d
npm run db:push
npm run dev
```

### 3. Using Makefile (Recommended)

```bash
# View all available commands
make help

# Common commands:
make install      # Install dependencies
make dev          # Start dev server
make docker-up    # Start Docker services
make db-migrate   # Run database migrations
make health       # Check application health
```

---

## For DevOps Engineers

### Local Development Environment

```bash
# Clone repository
git clone https://github.com/your-org/dental-camp.git
cd dental-camp

# Setup local environment
make setup-local
```

### Docker Deployment

```bash
# Build production image
make docker-build

# Or with docker directly:
docker build -t dental-camp:latest .
docker run -p 3000:3000 dental-camp:latest
```

### Kubernetes Deployment

```bash
# Deploy to cluster
make k8s-deploy

# Check status
make k8s-status

# View logs
make k8s-logs

# Scale deployment
make k8s-scale

# Rollback if needed
make k8s-rollback
```

### CI/CD Setup

1. **Fork/Clone repository**

2. **Setup GitHub Secrets** (Settings → Secrets → Actions):
   ```
   DATABASE_URL
   AUTH_SECRET
   VERCEL_TOKEN (optional)
   AWS_ACCESS_KEY_ID (for backups)
   AWS_SECRET_ACCESS_KEY
   ```

3. **Push to main branch** - CI/CD automatically triggers

---

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - Secret for JWT tokens
- `NEXTAUTH_URL` - Application URL

### Optional
- `AUTH_GOOGLE_ID` - Google OAuth client ID
- `AUTH_GOOGLE_SECRET` - Google OAuth secret
- `UPLOADTHING_TOKEN` - File upload service token
- `SMTP_*` - Email configuration

See `.env.example` for full list.

---

## Database Setup

### Local PostgreSQL
```bash
# Using Docker Compose (Recommended)
docker-compose up -d postgres

# Or install PostgreSQL locally
# Then run migrations:
npm run db:push
```

### Cloud Database (Neon, Supabase, etc.)
1. Create database
2. Copy connection string to `.env`
3. Run: `npm run db:push`

---

## Health Checks

```bash
# Local
curl http://localhost:3000/api/health

# Production
curl https://www.dental-camp.com/api/health

# Using make
make health
```

---

## Troubleshooting

### Port 3000 already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Database connection failed
```bash
# Check PostgreSQL is running
docker-compose ps

# Restart database
docker-compose restart postgres

# Check connection string in .env
```

### Docker build fails
```bash
# Clear Docker cache
docker system prune -a

# Rebuild
docker-compose up -d --build
```

---

## Next Steps

1. ✅ Setup local environment
2. ✅ Configure environment variables
3. ✅ Run database migrations
4. ✅ Start development server
5. 📖 Read full [DevOps Documentation](DEVOPS.md)
6. 🚀 Deploy to production

---

## Support

- 📚 [Full DevOps Docs](DEVOPS.md)
- 🐛 [Report Issues](https://github.com/your-org/dental-camp/issues)
- 💬 [Discussions](https://github.com/your-org/dental-camp/discussions)

---

**Happy Coding! 🎉**
