# Deployment Guide

## Quick Deploy Options

### 1. Replit Deployment (Recommended)
Your project is already configured for Replit deployment:

1. **Connect to GitHub**: 
   - Push your code to GitHub repository
   - Import the repository into Replit

2. **Configure Environment**:
   - Add `DATABASE_URL` to Replit Secrets
   - Use direct connection URL from Supabase (not pooler)

3. **Deploy**:
   - Run `npm install`
   - Run `npm run db:push` to set up database
   - Click "Deploy" in Replit interface

### 2. Vercel Deployment

1. **Connect Repository**:
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Environment Variables**:
   - Add `DATABASE_URL` in Vercel dashboard
   - Set `NODE_ENV=production`

3. **Build Configuration**:
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 3. Railway Deployment

1. **Connect GitHub**: Link your repository to Railway

2. **Environment Variables**:
   ```
   DATABASE_URL=your-postgresql-url
   NODE_ENV=production
   ```

3. **Deploy**: Railway auto-deploys from your main branch

## Database Setup

### Supabase Configuration

1. **Create Project**: Visit [supabase.com](https://supabase.com/dashboard)
2. **Get Connection String**: 
   - Settings → Database
   - Use "Direct connection" URL
   - Format: `postgresql://postgres:password@db.project.supabase.co:5432/postgres`
3. **Run Migrations**: `npm run db:push`

### Environment Variables

Required for all deployments:
```env
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
```

## Production Considerations

### Security
- [ ] Enable HTTPS
- [ ] Set up proper session management
- [ ] Hash user passwords
- [ ] Add rate limiting
- [ ] Implement CORS properly

### Performance
- [ ] Enable database connection pooling
- [ ] Add Redis for session storage
- [ ] Implement API caching
- [ ] Optimize database queries
- [ ] Add monitoring and logging

### Backup Strategy
- [ ] Set up automated database backups
- [ ] Document recovery procedures
- [ ] Test backup restoration

## Monitoring

### Health Checks
- Database connectivity
- API response times
- Error rates
- User authentication

### Logging
- Application errors
- User activities
- Inventory movements
- System performance

## Scaling Considerations

### Database
- Connection pooling
- Read replicas for reporting
- Database indexing optimization

### Application
- Horizontal scaling
- Load balancing
- CDN for static assets

### Monitoring
- Application performance monitoring
- Database performance monitoring
- User analytics
- Business metrics tracking