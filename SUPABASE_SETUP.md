# Supabase Setup Guide for Katitirok 2026

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or email
4. Create a new organization (or use default)
5. Create a new project:
   - **Name**: `katitirok-farm`
   - **Password**: Create a strong password
   - **Region**: Choose closest to you
   - Click "Create new project"

(Wait 2-3 minutes for project to initialize)

---

## Step 2: Create Database Table

In Supabase dashboard, go to **SQL Editor** and run this query:

```sql
CREATE TABLE IF NOT EXISTS farmers (
  id TEXT PRIMARY KEY,
  imgUrl TEXT NOT NULL,
  x FLOAT NOT NULL,
  y FLOAT NOT NULL,
  tx FLOAT NOT NULL,
  ty FLOAT NOT NULL,
  speed FLOAT NOT NULL,
  animationTime FLOAT NOT NULL,
  state TEXT NOT NULL,
  idleTimeLeft FLOAT NOT NULL,
  costume JSONB NOT NULL,
  hatTilt FLOAT NOT NULL,
  updatedAt BIGINT NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  UNIQUE(id)
);

CREATE INDEX idx_farmers_updated_at ON farmers(updatedAt DESC);
```

---

## Step 3: Set Environment Variables

1. In your project root, create a `.env.local` file
2. Copy from `.env.example`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Get your credentials from Supabase:
   - Dashboard → Settings → API
   - Copy "Project URL" (paste into `VITE_SUPABASE_URL`)
   - Copy "anon" public key (paste into `VITE_SUPABASE_ANON_KEY`)

---

## Step 4: Enable Row-Level Security (Optional but Recommended)

In Supabase SQL Editor:

```sql
-- Enable RLS on farmers table
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read farmers (public farm)
CREATE POLICY "Allow public read" ON farmers
  FOR SELECT
  USING (true);

-- Allow anyone to insert farmers
CREATE POLICY "Allow public insert" ON farmers
  FOR INSERT
  WITH CHECK (true);

-- Allow update if same farmer id (prevent overwriting others)
CREATE POLICY "Allow update own farmers" ON farmers
  FOR UPDATE
  USING (true);

-- Allow anyone to delete
CREATE POLICY "Allow public delete" ON farmers
  FOR DELETE
  USING (true);
```

---

## Step 5: Test Locally

```bash
npm run dev
```

Then:
1. Open http://localhost:3000
2. Add a farmer (take a photo)
3. Open in an **incognito/private** browser tab
4. You should see the same farmer on both tabs! 🎮

---

## Step 6: Deploy to Vercel

1. In your Vercel project settings, go to **Environment Variables**
2. Add both variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Redeploy - cross-device sync is now live!

---

## Troubleshooting

**"Cannot read property 'from' of undefined"**
- Your env variables aren't loaded
- Check `.env.local` exists and has correct format
- Restart dev server: `npm run dev`

**Farmers sync but then disappear**
- Check RLS policies are created
- Go to Supabase SQL Editor, verify farmers table has data

**Want to reset everything?**
```sql
TRUNCATE TABLE farmers;
```

---

✅ Done! Your farmers now sync across all devices and browsers!
