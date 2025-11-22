# 🚀 Deployment Guide

This guide provides step-by-step instructions to deploy both the backend and frontend of the Multi-Agent Tourism System.

## Prerequisites

- GitHub account with your code repository
- Render account (free tier available)
- Vercel account (free tier available)

## Backend Deployment (Render)

### Step 1: Prepare Repository

1. **Ensure your repository is public** on GitHub
2. **Verify your backend structure:**
   ```
   backend/
   ├── app/
   ├── requirements.txt
   ├── Dockerfile
   └── .env.example
   ```

### Step 2: Create Render Web Service

1. **Go to [Render](https://render.com)** and sign up/log in
2. **Click "New +"** → **"Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `tourism-ai-backend`
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Step 3: Configure Environment Variables (Optional)

In Render dashboard:
- **Environment Variables** → **Add Environment Variable**
- Add any custom variables from `.env.example` if needed

### Step 4: Deploy

1. **Click "Create Web Service"**
2. **Wait for deployment** (usually 3-5 minutes)
3. **Note your backend URL**: `https://tourism-ai-backend-xxx.onrender.com`
4. **Test the deployment**: Visit `https://your-url.onrender.com/health`

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. **Ensure your frontend structure:**
   ```
   frontend/
   ├── src/
   ├── package.json
   ├── vite.config.js
   └── .env.example
   ```

### Step 2: Deploy to Vercel

1. **Go to [Vercel](https://vercel.com)** and sign up/log in
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure deployment settings:**
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Configure Environment Variables

1. **In Vercel dashboard** → **Settings** → **Environment Variables**
2. **Add environment variable:**
   - **Name**: `VITE_API_URL`
   - **Value**: `https://tourism-ai-backend-xxx.onrender.com` (your Render URL)
   - **Environment**: Production

### Step 4: Deploy

1. **Click "Deploy"**
2. **Wait for deployment** (usually 1-2 minutes)
3. **Note your frontend URL**: `https://tourism-ai-xxx.vercel.app`

## Post-Deployment Configuration

### Update CORS Settings

If you encounter CORS issues, update the backend CORS configuration in `app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-url.vercel.app"],  # Update this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Test the Full Application

1. **Visit your frontend URL**
2. **Test sample queries:**
   - "What's the weather in Tokyo?"
   - "I'm going to Paris, show me tourist attractions"
   - "I want to visit London, what's the temperature and what places can I see?"

### Monitor Performance

- **Backend logs**: Available in Render dashboard
- **Frontend analytics**: Available in Vercel dashboard
- **API health**: Monitor `/health` endpoint

## Alternative Deployment Options

### Railway (Alternative to Render)

```yaml
# railway.yml
version: 2
build:
  commands:
    - pip install -r requirements.txt
run:
  command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Netlify (Alternative to Vercel)

1. Connect GitHub repository
2. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
   - Base directory: `frontend`

## Troubleshooting

### Common Backend Issues

1. **Build failures**: Check `requirements.txt` format
2. **Port issues**: Ensure using `$PORT` environment variable
3. **Module import errors**: Verify file structure

### Common Frontend Issues

1. **API connection errors**: Check `VITE_API_URL` environment variable
2. **Build failures**: Ensure all dependencies in `package.json`
3. **CORS errors**: Update backend CORS settings

### Performance Optimization

1. **Backend:**
   - Enable caching (already implemented)
   - Add rate limiting if needed
   - Monitor API response times

2. **Frontend:**
   - Images are optimized
   - CSS is minified
   - JavaScript is bundled efficiently

## Security Considerations

1. **API Keys**: Never expose API keys (we use free APIs)
2. **CORS**: Restrict origins in production
3. **HTTPS**: Both platforms provide HTTPS by default
4. **Rate Limiting**: Consider implementing for production use

## Maintenance

1. **Monitor logs** regularly
2. **Update dependencies** periodically
3. **Check external API** status pages:
   - [Open-Meteo Status](https://open-meteo.com/)
   - [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)
   - [Overpass API Status](https://overpass-api.de/)

## Backup Deployment URLs

Keep a record of your deployment URLs:

- **Backend**: `https://tourism-ai-backend-xxx.onrender.com`
- **Frontend**: `https://tourism-ai-xxx.vercel.app`
- **GitHub Repo**: `https://github.com/yourusername/tourism-ai`

## Support

For deployment issues:
- **Render**: Check their [documentation](https://render.com/docs)
- **Vercel**: Check their [documentation](https://vercel.com/docs)
- **General**: Create an issue in your GitHub repository