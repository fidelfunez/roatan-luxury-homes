# Supabase Setup Guide for Caribbean Lux Realty

## 🚀 Step-by-Step Setup

### Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Click "Start your project"**
3. **Sign up with GitHub** (recommended)
4. **Create new project:**
   - **Name**: `caribbean-lux-realty`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users (US East recommended)
5. **Click "Create new project"**
6. **Wait for setup to complete** (2-3 minutes)

### Step 2: Get Your Project Credentials

1. **Go to Settings → API** in your Supabase dashboard
2. **Copy these values:**
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep secret!)

### Step 3: Set Up Database Schema

1. **Go to SQL Editor** in your Supabase dashboard
2. **Click "New query"**
3. **Copy and paste** the entire contents of `database-schema.sql`
4. **Click "Run"** to create all tables and policies

### Step 4: Create Admin User

1. **Go to Authentication → Users** in Supabase dashboard
2. **Click "Add user"**
3. **Enter admin credentials:**
   - **Email**: `admin@caribbeanlux.com`
   - **Password**: Create a strong password
4. **Click "Create user"**

### Step 5: Configure Environment Variables

**In your Netlify dashboard:**

1. **Go to Site settings → Environment variables**
2. **Add these variables:**

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Replace with your actual values from Step 2.**

### Step 6: Test the Setup

1. **Deploy your updated code** (already done!)
2. **Test admin login** at `/admin/login`
3. **Test adding a property** at `/admin/properties/add`
4. **Check that data persists** (no more localStorage!)

## 🎯 What You Get

### ✅ Professional Database
- **PostgreSQL** (industry standard)
- **Real-time updates** (properties update instantly)
- **Secure authentication** (admin login)
- **File storage** (property images)

### ✅ Better Performance
- **Faster loading** (no localStorage limits)
- **Real-time sync** (changes appear instantly)
- **Better SEO** (server-side data)

### ✅ Scalability
- **500MB free storage** (plenty for real estate)
- **50,000 API calls/month** (more than enough)
- **Easy to upgrade** when needed

## 🔧 Troubleshooting

### If admin login doesn't work:
1. Check environment variables in Netlify
2. Verify user exists in Supabase Auth
3. Check browser console for errors

### If properties don't save:
1. Check RLS policies in Supabase
2. Verify user is authenticated
3. Check database permissions

### If images don't upload:
1. Check Supabase Storage bucket
2. Verify storage policies
3. Check file size limits

## 📊 Monitoring

**In Supabase Dashboard:**
- **Database**: Monitor table sizes and performance
- **Auth**: Track user logins
- **Storage**: Monitor file uploads
- **Logs**: Check for errors

## 🚀 Next Steps

After setup is complete:
1. **Migrate existing data** from localStorage
2. **Add image upload** to Supabase Storage
3. **Implement real-time features**
4. **Add analytics tracking**

---

**Your Caribbean Lux Realty website will now have a professional, scalable database!** 🏠✨ 