# 🚢 Deployment Guide - Render.com

## Prerequisites
- GitHub account with your code pushed
- Render account (free tier)

## Step 1: Push Code to GitHub

```bash
cd d:\attendance-app
git init
git add .
git commit -m "Initial commit - SmartAttd Backend"
git branch -M main
git remote add origin https://github.com/Anudeep-Bheemani/attendance-management-system.git
git push -u origin main
```

## Step 2: Create PostgreSQL Database on Render

1. Go to https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. Fill in:
   - Name: `smartattd-db`
   - Database: `smartattd`
   - User: `smartattd_user`
   - Region: Choose closest to you
   - Plan: **Free**
4. Click "Create Database"
5. **COPY the Internal Database URL** (starts with `postgresql://`)

## Step 3: Create Web Service on Render

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Fill in:
   - Name: `smartattd-backend`
   - Region: Same as database
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: **Free**

## Step 4: Add Environment Variables

In the "Environment" section, add:

```
NODE_ENV=production
PORT=5000
DATABASE_URL=<paste_your_render_postgres_url>
JWT_SECRET=smartattd-jwt-secret-production-2024
JWT_EXPIRE=7d
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=your-email@gmail.com
SENDGRID_FROM_NAME=SmartAttd System
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=https://your-frontend-url.vercel.app
ADMIN_EMAIL=admin@college.edu
ADMIN_PASSWORD=admin123
```

## Step 5: Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. You'll get a URL like: `https://smartattd-backend.onrender.com`

## Step 6: Seed Production Database

After deployment, go to "Shell" tab in Render dashboard:

```bash
node src/config/seed.js
```

## Step 7: Test Your API

Visit:
```
https://smartattd-backend.onrender.com/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "SmartAttd API is running"
}
```

## Step 8: Update Frontend

In your React app, update API URL:

```javascript
// src/config.js
export const API_URL = 'https://smartattd-backend.onrender.com/api';
```

## 🎉 Done!

Your backend is now live on Render!

## Important Notes:

### Free Tier Limitations:
- Database: 1GB storage
- Web Service: Spins down after 15 mins of inactivity
- First request after spin-down takes ~30 seconds

### Keep Service Active:
Use a service like UptimeRobot to ping your API every 10 minutes:
```
https://smartattd-backend.onrender.com/api/health
```

### Monitoring:
- Check logs in Render dashboard
- Monitor email delivery in SendGrid dashboard
- Track API usage

### Scaling:
When you need more:
- Upgrade to paid plan ($7/month)
- Get dedicated resources
- No spin-down
- More storage

## Troubleshooting:

### Build Failed
- Check `package.json` is correct
- Verify Node version compatibility
- Check build logs

### Database Connection Error
- Verify DATABASE_URL is correct
- Check database is running
- Review connection logs

### 502 Bad Gateway
- Service is spinning up (wait 30 seconds)
- Check if service crashed (view logs)

## Next: Deploy Frontend to Vercel

See VERCEL_DEPLOYMENT.md for frontend deployment!
