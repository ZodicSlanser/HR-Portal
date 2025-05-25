# Vercel Project Settings

This file contains the recommended Vercel project configuration for optimal deployment.

## Build Settings

**Framework Preset**: Next.js
**Build Command**: `npm run vercel-build`
**Output Directory**: `.next`
**Install Command**: `npm ci`
**Development Command**: `npm run dev`

## Environment Variables

### Production
```
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-32-char-secret
DATABASE_URL=postgresql://user:pass@host:5432/db
```

### Preview (Optional)
```
NEXTAUTH_URL=https://preview-branch.vercel.app
NEXTAUTH_SECRET=your-32-char-secret
DATABASE_URL=postgresql://user:pass@preview-host:5432/preview-db
```

## Custom Domains

1. Add your domain in Vercel dashboard
2. Update NEXTAUTH_URL to match your domain
3. Configure DNS records as instructed by Vercel

## Function Configuration

- **Timeout**: 30 seconds (configured in vercel.json)
- **Memory**: Default (1024 MB)
- **Runtime**: Node.js 20.x

## Analytics & Monitoring

- Enable Vercel Analytics for performance insights
- Consider Vercel Speed Insights for Core Web Vitals
- Set up Sentry for error tracking (optional)

## Git Integration

- **Production Branch**: main
- **Preview Branches**: All other branches
- **Automatic Deployments**: Enabled

## Security Headers

Configured in `next.config.ts`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin

## Performance Optimizations

- Image optimization enabled
- Automatic static optimization
- Edge caching for static assets
- Compression enabled
