# OUR MEMORIES — Digital Graduation Yearbook 🎓

> A beautiful digital yearbook for Class 12A19 (2023-2026)

## ✨ Features

- 🖼️ Photo gallery powered by Google Drive
- 💬 Memory wall for sharing memories
- ✍️ Digital signature wall
- 📊 Live statistics
- 🌙 Dark/Light mode
- 🎵 Background music player
- 📱 Fully responsive design
- ⚡ Built with Next.js 15 App Router

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Database**: Supabase
- **Images**: Google Drive API
- **Deployment**: Vercel

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repository-url>
cd our-memories
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Drive
GOOGLE_DRIVE_API_KEY=your_google_drive_api_key
GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Database Setup

Run the SQL schema in your Supabase SQL editor:

```bash
# File location: src/lib/supabase/schema.sql
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/new)
3. Import your repository
4. Add environment variables in Vercel project settings
5. Deploy!

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

### Environment Variables for Vercel

Add these in your Vercel project settings (Settings → Environment Variables):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_DRIVE_API_KEY`
- `GOOGLE_DRIVE_FOLDER_ID`
- `NEXT_PUBLIC_SITE_URL` (your production URL)

## 🔧 Configuration

### Google Drive Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable Google Drive API

2. **Get API Key**
   - Go to Credentials → Create Credentials → API Key
   - Copy the API key

3. **Share Your Drive Folder**
   - Open your Google Drive folder
   - Click "Share" → Change to "Anyone with the link"
   - Set role to "Viewer"
   - Copy the folder ID from URL

### Supabase Setup

1. Create a new project at [Supabase](https://supabase.com)
2. Go to Project Settings → API
3. Copy your URL and keys
4. Run the schema from `src/lib/supabase/schema.sql`

## 📁 Project Structure

```
our-memories/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── api/         # API routes
│   │   └── page.tsx     # Main page
│   ├── components/      # React components
│   │   ├── sections/   # Page sections
│   │   ├── ui/         # UI components
│   │   └── providers/  # Context providers
│   ├── lib/            # Utilities
│   │   └── supabase/   # Supabase client
│   └── types/          # TypeScript types
├── public/             # Static assets
└── ...config files
```

## 🎨 Customization

### Theme Colors

Edit `src/app/globals.css` to customize the color scheme.

### Content

- Modify sections in `src/components/sections/`
- Update text and images as needed
- Add your class information

## 📝 Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🐛 Troubleshooting

### Images not loading from Google Drive

Make sure your Google Drive folder is shared publicly:
1. Open folder in Google Drive
2. Click "Share" → "Anyone with the link"
3. Set role to "Viewer"

### Supabase connection issues

Check your environment variables and ensure:
- URLs don't have trailing slashes
- Keys are correct
- Database schema is properly set up

## 📄 License

This project is created for Class 12A19 graduation yearbook.

## 👨‍💻 Author

**Nguyễn Tài Phát**  
Class 12A19 (2023-2026)
