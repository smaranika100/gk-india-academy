# GK India Academy — Supabase Backend & Database Architecture

This directory contains the production-grade PostgreSQL / Supabase backend architecture, Row Level Security (RLS) policies, storage bucket configurations, and automated backup/recovery tooling for **GK India Academy**.

---

## Backend Feature Matrix

| Feature | Status | Specification & Implementation |
| :--- | :---: | :--- |
| **Database** | 🟢 **Ready** | Relational PostgreSQL schema for Topics, MCQs, Current Affairs, Exams, Materials, Messages, and Admin Profiles (`supabase/schema.sql`). |
| **Admin Authentication** | 🟢 **Ready** | Secure Supabase Auth with JWT claims, role-based access control (RBAC), cloak protection, and timeout guards (`admin/auth.js`). |
| **Secure Database Rules (RLS)** | 🟢 **Ready** | Granular Row Level Security policies ensuring public read for published content and admin-only write permissions (`supabase/rls-policies.sql`). |
| **File / Image Storage** | 🟢 **Ready** | Public buckets for `study-materials` (PDFs up to 50MB) and `media-uploads` (Images up to 10MB) with strict write rules (`supabase/storage-setup.sql`). |
| **Backup / Recovery** | 🟢 **Ready** | Automated PowerShell scripts for timestamped JSON & SQL dumps and 1-click restore (`supabase/backup.ps1`, `supabase/restore.ps1`). |
| **Environment Variables & Secrets** | 🟢 **Ready** | Standardized configuration template in `.env.example` with protected client/backend separation. |

---

## 1. Quick Setup Guide (Supabase Cloud)

### Step 1: Create Supabase Project
1. Log in to [Supabase](https://supabase.com).
2. Create a new project (e.g., `gk-india-academy`).
3. Note your **Project URL** and **API Keys** (`anon` public key and `service_role` secret).

### Step 2: Run Database Schema
1. In your Supabase Dashboard, navigate to the **SQL Editor** tab.
2. Open [supabase/schema.sql](file:///c:/Users/urmil/OneDrive/Desktop/MyApps/gk-india-academy/supabase/schema.sql), copy all contents, and click **Run**.
3. This creates all 7 tables, indexes, updated_at triggers, and initial seed data.

### Step 3: Apply Row Level Security (RLS) Policies
1. In the **SQL Editor**, open [supabase/rls-policies.sql](file:///c:/Users/urmil/OneDrive/Desktop/MyApps/gk-india-academy/supabase/rls-policies.sql), copy all contents, and click **Run**.
2. This defines `public.is_admin()` and applies strict access rules across all tables.

### Step 4: Configure Storage Buckets
1. In the **SQL Editor**, open [supabase/storage-setup.sql](file:///c:/Users/urmil/OneDrive/Desktop/MyApps/gk-india-academy/supabase/storage-setup.sql), copy all contents, and click **Run**.
2. This creates:
   - `study-materials`: For candidate revision guides, formula sheets, maps, and PDFs.
   - `media-uploads`: For question diagrams, current affairs photos, and logos.

### Step 5: Configure Environment Variables
1. Copy [.env.example](file:///c:/Users/urmil/OneDrive/Desktop/MyApps/gk-india-academy/.env.example) to `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```
2. Populate your credentials:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-public-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
   ```

### Step 6: Create Your Administrator Account
1. In Supabase Dashboard -> **Authentication** -> **Users**, click **Add user** -> **Create user**.
2. Enter your admin email and password.
3. Open the **SQL Editor** and grant the `admin` role:
   ```sql
   -- Option A: Add to admin_profiles table
   INSERT INTO public.admin_profiles (id, email, full_name, role)
   SELECT id, email, 'Academy Administrator', 'admin'
   FROM auth.users
   WHERE email = 'your-admin-email@example.com';

   -- Option B: Set app_metadata claim
   UPDATE auth.users
   SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
   WHERE email = 'your-admin-email@example.com';
   ```

---

## 2. Row Level Security (RLS) Overview

The database implements zero-trust security:

```
[ Public Visitor ]
       │
       ├──► SELECT * FROM topics WHERE status = 'published' (Allowed)
       ├──► SELECT * FROM questions WHERE status = 'published' (Allowed)
       ├──► SELECT * FROM study_materials WHERE status = 'published' (Allowed)
       ├──► INSERT INTO contact_messages (Allowed for inquiries)
       └──► UPDATE / DELETE / DRAFT access (Blocked by RLS)

[ Verified Administrator (public.is_admin() = true) ]
       │
       ├──► Full CRUD on all topics, questions, exams, affairs, study materials
       ├──► Full SELECT and status management on contact messages
       └──► Storage bucket uploads, updates, and removals
```

---

## 3. Automated Backup & Disaster Recovery

### Creating a Database Backup
Run the backup script from PowerShell:
```powershell
.\supabase\backup.ps1
```
- Backups are stored in `backups/backup-YYYY-MM-DD_HH-mm-ss/`.
- Produces:
  - `metadata.json`: Timestamp, source, and record counts.
  - JSON snapshots for each collection.
  - `restore-dump.sql`: Complete PostgreSQL transaction script.

### Restoring from Backup
To restore the latest backup snapshot:
```powershell
.\supabase\restore.ps1
```
Or specify a specific backup directory:
```powershell
.\supabase\restore.ps1 -BackupDir "backups\backup-2026-09-29_23-39-33"
```
