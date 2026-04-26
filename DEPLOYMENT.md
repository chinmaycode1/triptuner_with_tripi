# 🚀 Deployment Guide

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/chinmaycode1/triptuner_with_tripi)

## 📋 Pre-Deployment Checklist

### 1. Supabase Setup ✅
- [ ] Create Supabase project
- [ ] Run database setup SQL
- [ ] Create `trip-pdfs` storage bucket
- [ ] Set bucket to public
- [ ] Configure storage policies

### 2. API Keys ✅
- [ ] Get Supabase URL and keys
- [ ] Get Google Gemini API key
- [ ] Note down all credentials

### 3. Backend Deployment ✅
- [ ] Deploy backend to Railway/Render
- [ ] Set environment variables
- [ ] Test API endpoints

## 🎯 Step-by-Step Deployment

### Step 1: Deploy Backend

**Option A: Railway (Recommended)**
1. Go to [Railway](https://railway.app)
2. Connect GitHub repository
3. Select `backend` folder
4. Set environment variables:
   ```
   SUPABASE_URL=your_url
   SUPABASE_SERVICE_KEY=your_key
   GEMINI_API_KEY=your_key
   PORT=3001
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
5. Deploy and note the URL

**Option B: Render**
1. Go to [Render](https://render.com)
2. Create new Web Service
3. Connect repository
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && npm start`
6. Add environment variables
7. Deploy

### Step 2: Deploy Frontend to Vercel

**Method 1: One-Click Deploy**
1. Click the deploy button above
2. Connect your GitHub account
3. Fork the repository
4. Set environment variables in Vercel:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_API_URL=https://your-backend-url.railway.app
   ```
5. Deploy

**Method 2: Manual Deploy**
1. Fork this repository
2. Go to [Vercel](https://vercel.com)
3. Import your forked repository
4. Set build settings:
   - Framework: Vite
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `cd frontend && npm install`
5. Add environment variables
6. Deploy

### Step 3: Configure Environment Variables

**Vercel Environment Variables:**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=https://your-backend.railway.app
```

**Backend Environment Variables:**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
GEMINI_API_KEY=your_gemini_key
PORT=3001
FRONTEND_URL=https://your-app.vercel.app
```

## 🔧 Post-Deployment Setup

### 1. Test the Application
- [ ] Visit your Vercel URL
- [ ] Test user registration/login
- [ ] Generate an itinerary
- [ ] Save a trip (test PDF storage)
- [ ] Check saved trips page

### 2. Configure CORS
Update backend CORS settings to include your Vercel domain:
```javascript
app.use(cors({
  origin: [
    'https://your-app.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));
```

### 3. Update Supabase Settings
- Add your Vercel domain to Supabase Auth settings
- Update redirect URLs if needed

## 🐛 Common Deployment Issues

### Frontend Issues

**Build Fails**
```bash
# Check build locally first
cd frontend
npm run build
```

**Environment Variables Not Working**
- Ensure variables start with `VITE_`
- Redeploy after adding variables
- Check Vercel dashboard settings

### Backend Issues

**API Not Responding**
- Check backend logs in Railway/Render
- Verify environment variables
- Test endpoints directly

**CORS Errors**
- Add Vercel domain to CORS origins
- Check frontend API URL is correct

### Database Issues

**Connection Failed**
- Verify Supabase URL and keys
- Check RLS policies are enabled
- Ensure storage bucket exists

## 📊 Performance Optimization

### Frontend
- Images are optimized via Unsplash CDN
- Code splitting with React Router
- Lazy loading for components

### Backend
- Efficient database queries
- PDF generation optimization
- Proper error handling

### Database
- Indexed columns for fast queries
- RLS for security
- Storage CDN for PDFs

## 🔒 Security Checklist

- [ ] Environment variables secured
- [ ] RLS policies enabled
- [ ] Storage policies configured
- [ ] API keys not exposed in frontend
- [ ] HTTPS enabled (automatic with Vercel)

## 📈 Monitoring

### Vercel Analytics
- Enable Vercel Analytics for usage insights
- Monitor Core Web Vitals
- Track deployment success

### Backend Monitoring
- Use Railway/Render built-in monitoring
- Set up error alerts
- Monitor API response times

## 🚀 Production Tips

1. **Use Production API Keys**
   - Separate dev/prod Supabase projects
   - Different Gemini API quotas

2. **Enable Caching**
   - Vercel Edge caching
   - Browser caching for static assets

3. **Monitor Usage**
   - Gemini API usage
   - Supabase storage limits
   - Vercel bandwidth

4. **Backup Strategy**
   - Regular database backups
   - Export user data periodically

## 🎉 Success!

Your TripTuner app is now live! 🎊

**Next Steps:**
- Share your app with users
- Monitor performance and usage
- Collect feedback for improvements
- Scale as needed

---

**Need help?** Open an issue on GitHub or check the troubleshooting section above.