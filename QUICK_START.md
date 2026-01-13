# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Supabase

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully provisioned

### Step 2: Disable Email Confirmation
1. Go to **Authentication** → **Settings**
2. Find **"Enable email confirmations"** and **disable it**
3. Save changes

### Step 3: Create Database Table
1. Go to **SQL Editor**
2. Copy and paste the contents of `supabase-setup.sql`
3. Click **Run**

### Step 4: Set Up Storage
1. Go to **Storage**
2. Click **New bucket**
3. Name: `blog-images`
4. Make it **Public**
5. Click **Create bucket**
6. Go to **Policies** tab
7. Run the storage policies from `supabase-setup.sql`

### Step 5: Get API Keys
1. Go to **Settings** → **API**
2. Copy your:
   - **Project URL** (VITE_SUPABASE_URL)
   - **anon public** key (VITE_SUPABASE_ANON_KEY)

## 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 5. Test the Application

1. **Register** a new account
2. **Login** with your credentials
3. **Create** a blog post with an image
4. **View** your blog in the list
5. **Edit** your blog
6. **Delete** your blog

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env.local` exists and has the correct values
- Restart the dev server after creating `.env.local`

### "Failed to fetch blogs"
- Check your Supabase project is active
- Verify the `blogs` table was created
- Check RLS policies are set correctly

### "Failed to upload image"
- Verify the `blog-images` bucket exists and is public
- Check storage policies are set
- Ensure image file size is under 5MB

### Images not displaying
- Check the bucket is set to **Public**
- Verify storage policies allow public read access

