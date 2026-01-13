# Blog Application

A modern blog web application built with React 19, TypeScript, Redux, and Supabase.

## Features

- ✅ User Authentication (Register, Login, Logout)
- ✅ Create, Read, Update, Delete (CRUD) blog operations
- ✅ Image upload for blog posts
- ✅ Pagination for blog listing
- ✅ Responsive design with Tailwind CSS
- ✅ Protected routes
- ✅ Type-safe with TypeScript

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Supabase** - Backend (Auth + Database + Storage)
- **Tailwind CSS** - Styling
- **React Hook Form + Zod** - Form validation
- **React Hot Toast** - Notifications

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

## Setup Instructions

### 1. Clone and Install

```bash
cd blog-app
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Authentication → Settings** and **disable email confirmation**
3. Go to **SQL Editor** and run the following SQL:

```sql
-- Create blogs table
CREATE TABLE blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to read blogs
CREATE POLICY "Anyone can view blogs"
  ON blogs FOR SELECT
  USING (true);

-- Allow authenticated users to create blogs
CREATE POLICY "Users can create blogs"
  ON blogs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own blogs
CREATE POLICY "Users can update own blogs"
  ON blogs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own blogs
CREATE POLICY "Users can delete own blogs"
  ON blogs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

4. Go to **Storage** and create a new bucket:
   - Name: `blog-images`
   - Public: Yes
   - Allowed MIME types: `image/jpeg, image/jpg, image/png, image/webp`

5. Create a storage policy:
```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

-- Allow anyone to view images
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in your Supabase project settings under **API**.

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/
│   ├── store.ts          # Redux store
│   └── hooks.ts          # Typed Redux hooks
├── features/
│   ├── auth/             # Authentication slice
│   └── blogs/            # Blog CRUD slice
├── pages/                # Route pages
├── components/           # Reusable components
├── services/             # Supabase client
├── routes/               # Route definitions
├── types/                # TypeScript types
└── utils/                # Helper functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

## License

MIT
