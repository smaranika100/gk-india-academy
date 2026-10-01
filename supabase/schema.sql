-- ==============================================================================
-- GK INDIA ACADEMY - PRODUCTION DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- ==============================================================================
-- Enables full data management for GK topics, questions (MCQs), current affairs,
-- government exams, study materials repository, contact messages, and admin profiles.
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Helper Function: Auto-update updated_at timestamp
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 2. Table: admin_profiles
-- Stores administrative user profiles linked to Supabase auth.users
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL DEFAULT 'Academy Administrator',
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'editor')),
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_profiles_email ON public.admin_profiles(email);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_role ON public.admin_profiles(role);

DROP TRIGGER IF EXISTS trg_admin_profiles_updated_at ON public.admin_profiles;
CREATE TRIGGER trg_admin_profiles_updated_at
  BEFORE UPDATE ON public.admin_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 3. Table: topics
-- General Knowledge subjects and syllabus modules
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.topics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  questions_count INTEGER NOT NULL DEFAULT 0 CHECK (questions_count >= 0),
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_topics_slug ON public.topics(slug);
CREATE INDEX IF NOT EXISTS idx_topics_subject ON public.topics(subject);
CREATE INDEX IF NOT EXISTS idx_topics_status ON public.topics(status);
CREATE INDEX IF NOT EXISTS idx_topics_created_at ON public.topics(created_at DESC);

DROP TRIGGER IF EXISTS trg_topics_updated_at ON public.topics;
CREATE TRIGGER trg_topics_updated_at
  BEFORE UPDATE ON public.topics
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 4. Table: questions (MCQs)
-- Practice questions and past competitive exam MCQs
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of 4 string options: ["Option A", "Option B", ...]
  correct_index INTEGER NOT NULL CHECK (correct_index >= 0 AND correct_index <= 3),
  explanation TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_topic_id ON public.questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_subject ON public.questions(subject);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_status ON public.questions(status);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON public.questions(created_at DESC);

DROP TRIGGER IF EXISTS trg_questions_updated_at ON public.questions;
CREATE TRIGGER trg_questions_updated_at
  BEFORE UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 5. Table: current_affairs
-- Daily and monthly news digests, national & international milestones
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.current_affairs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of tag strings
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_current_affairs_date ON public.current_affairs(date DESC);
CREATE INDEX IF NOT EXISTS idx_current_affairs_category ON public.current_affairs(category);
CREATE INDEX IF NOT EXISTS idx_current_affairs_status ON public.current_affairs(status);

DROP TRIGGER IF EXISTS trg_current_affairs_updated_at ON public.current_affairs;
CREATE TRIGGER trg_current_affairs_updated_at
  BEFORE UPDATE ON public.current_affairs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 6. Table: government_exams
-- Comprehensive notifications, eligibility, dates, and syllabus outlines
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.government_exams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  agency TEXT NOT NULL,
  category TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  total_vacancies TEXT NOT NULL,
  exam_dates TEXT NOT NULL,
  stages TEXT NOT NULL,
  syllabus_summary TEXT NOT NULL,
  notification_url TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_government_exams_category ON public.government_exams(category);
CREATE INDEX IF NOT EXISTS idx_government_exams_status ON public.government_exams(status);
CREATE INDEX IF NOT EXISTS idx_government_exams_created_at ON public.government_exams(created_at DESC);

DROP TRIGGER IF EXISTS trg_government_exams_updated_at ON public.government_exams;
CREATE TRIGGER trg_government_exams_updated_at
  BEFORE UPDATE ON public.government_exams
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 7. Table: study_materials
-- High-yield revision PDF documents, formula cheat-sheets, maps, and guides
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.study_materials (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'PDF Document',
  file_size TEXT NOT NULL,
  pages TEXT NOT NULL,
  download_url TEXT NOT NULL,
  storage_path TEXT, -- Reference to Supabase Storage bucket object path
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_study_materials_subject ON public.study_materials(subject);
CREATE INDEX IF NOT EXISTS idx_study_materials_status ON public.study_materials(status);
CREATE INDEX IF NOT EXISTS idx_study_materials_created_at ON public.study_materials(created_at DESC);

DROP TRIGGER IF EXISTS trg_study_materials_updated_at ON public.study_materials;
CREATE TRIGGER trg_study_materials_updated_at
  BEFORE UPDATE ON public.study_materials
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 8. Table: contact_messages
-- Public candidate inquiries, feedback, and admin reply notes
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'replied', 'archived')),
  reply_note TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_date ON public.contact_messages(date DESC);

DROP TRIGGER IF EXISTS trg_contact_messages_updated_at ON public.contact_messages;
CREATE TRIGGER trg_contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 9. Initial Seed Data
-- ------------------------------------------------------------------------------
INSERT INTO public.topics (id, title, slug, subject, description, questions_count, status, created_at)
VALUES
  ('top-1', 'Indus Valley Civilization & Ancient Cities', 'indus-valley-civilization', 'Indian History', 'Urban planning, Harappan seals, trade routes, Great Bath, and town planning architecture for UPSC & SSC.', 45, 'published', '2026-01-12'),
  ('top-2', 'Fundamental Rights & Constitutional Remedies (Art 12-35)', 'fundamental-rights-remedies', 'Indian Polity', 'Six core freedoms, writ jurisdiction (Habeas Corpus, Mandamus, Quo-Warranto), and basic structure doctrine.', 62, 'published', '2026-01-18'),
  ('top-3', 'Indian River Systems & Himalayan Drainage', 'indian-river-systems-himalayas', 'Indian Geography', 'Indus, Ganga, and Brahmaputra drainage networks, tributaries, river projects, and major dams.', 38, 'published', '2026-01-25'),
  ('top-4', 'Reserve Bank of India: Monetary Policy & Inflation Targets', 'rbi-monetary-policy-inflation', 'Indian Economy', 'Repo rate, reverse repo, CRR, SLR, MPC framework, CPI/WPI metrics and economic indicators.', 29, 'published', '2026-02-05'),
  ('top-5', 'India Space Missions: Gaganyaan, Chandrayaan & Aditya-L1', 'isro-space-missions-milestones', 'General Science', 'ISRO achievements, cryogenic engines, LVM3 launch vehicles, space probes, and future solar astronomy.', 34, 'published', '2026-02-14'),
  ('top-6', 'Modern Indian History: 1857 Revolt to Independence 1947', 'modern-indian-freedom-struggle', 'Indian History', 'Chronology of freedom movements, Quit India, Non-Cooperation, Round Table Conferences, and Subhash Chandra Bose.', 54, 'published', '2026-02-22'),
  ('top-7', 'Biodiversity Hotspots & Biosphere Reserves of India', 'biodiversity-hotspots-biospheres', 'Environment & Ecology', 'Western Ghats, Indo-Burma, Eastern Himalayas, endemic species, Wildlife Protection Act, and Ramsar sites.', 22, 'draft', '2026-03-02'),
  ('top-8', 'UNESCO World Heritage Sites & Classical Dances of India', 'unesco-heritage-classical-dances', 'Art & Culture', '8 Sangeet Natak Akademi classical dances, temple architecture (Nagara, Dravida, Vesara), and GI tags.', 18, 'draft', '2026-03-10')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.questions (id, question, topic_id, subject, options, correct_index, explanation, difficulty, status, created_at)
VALUES
  ('q-1', 'Which Article of the Indian Constitution is described by Dr. B.R. Ambedkar as the "Heart and Soul of the Constitution"?', 'top-2', 'Indian Polity', '["Article 19", "Article 21", "Article 32", "Article 44"]'::jsonb, 2, 'Article 32 guarantees the Right to Constitutional Remedies, empowering individuals to move the Supreme Court directly via writs for the enforcement of fundamental rights.', 'Easy', 'published', '2026-01-15'),
  ('q-2', 'Which of the following Indus Valley sites is famous for an ancient dockyard connected to the Sabarmati river basin?', 'top-1', 'Indian History', '["Kalibangan", "Lothal", "Mohenjo-daro", "Banawali"]'::jsonb, 1, 'Lothal in Gujarat was a prominent port city of the Harappan civilization with a massive tidal dockyard facilitating maritime trade across the Arabian Sea.', 'Easy', 'published', '2026-01-16'),
  ('q-3', 'The Majuli Island, recognized as the world''s largest river island, is located on which river?', 'top-3', 'Indian Geography', '["Ganga", "Godavari", "Brahmaputra", "Narmada"]'::jsonb, 2, 'Majuli is a picturesque river island situated on the Brahmaputra River in Assam, known as the cultural capital of Assamese Vaishnavite heritage.', 'Medium', 'published', '2026-01-28'),
  ('q-4', 'In India, the Monetary Policy Committee (MPC) consists of how many members, and who acts as its ex-officio Chairperson?', 'top-4', 'Indian Economy', '["5 members, Union Finance Minister", "6 members, Governor of RBI", "7 members, Chief Economic Advisor", "6 members, Secretary of Department of Economic Affairs"]'::jsonb, 1, 'The Monetary Policy Committee has 6 members (3 from RBI and 3 appointed by Central Government). The Governor of the Reserve Bank of India serves as its ex-officio Chairperson.', 'Hard', 'published', '2026-02-08'),
  ('q-5', 'Which heavy-lift launch vehicle was configured by ISRO for launching the Gaganyaan crew module into low earth orbit?', 'top-5', 'General Science', '["PSLV-C56", "GSLV Mk II", "LVM3 (GSLV Mk III)", "SSLV-D2"]'::jsonb, 2, 'The Launch Vehicle Mark-3 (LVM3), human-rated as HLVM3, is selected for India’s crewed Gaganyaan missions due to its robust safety and heavy lift capacity.', 'Medium', 'published', '2026-02-18'),
  ('q-6', 'Who founded the "Forward Bloc" inside the Indian National Congress in 1939 after resigning as Congress President?', 'top-6', 'Indian History', '["Subhash Chandra Bose", "Bhagat Singh", "Jawaharlal Nehru", "C. Rajagopalachari"]'::jsonb, 0, 'Netaji Subhash Chandra Bose formed the All India Forward Bloc in 1939 to rally left-wing elements within Congress and intensify the anti-imperialist struggle.', 'Medium', 'published', '2026-02-25'),
  ('q-7', 'Which of the following is NOT one of the recognized biodiversity hotspots in India?', 'top-7', 'Environment & Ecology', '["Western Ghats", "Himalayas", "Sundaland (Nicobar Islands)", "Thar Desert Basin"]'::jsonb, 3, 'The 4 biodiversity hotspots in India are the Himalayas, Indo-Burma, Western Ghats & Sri Lanka, and Sundaland (Nicobar islands). The Thar desert is not a recognized global biodiversity hotspot.', 'Medium', 'draft', '2026-03-05'),
  ('q-8', 'Sattriya dance, an official classical dance tradition of India, originated in which Indian state?', 'top-8', 'Art & Culture', '["Manipur", "Odisha", "Assam", "Kerala"]'::jsonb, 2, 'Sattriya originated in 15th-century Assam under the Bhakti saint Mahapurusha Srimanta Sankaradeva within monastic institutions known as Satras.', 'Hard', 'draft', '2026-03-12')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.current_affairs (id, title, category, date, summary, content, tags, status, created_at)
VALUES
  ('ca-1', 'India Inaugurates Strategic 2026 Deep-Sea Port Terminal on Western Coast', 'Economy & Infrastructure', '2026-03-22', 'State-of-the-art automated terminal commissioned to boost trade corridors and cut logistics turnaround times by 35%.', 'The mega maritime hub integrates dedicated green rail freight corridors, automated container gantries, and 100% renewable shoreside electric power. It forms a key node in the India-Middle East-Europe Economic Corridor (IMEC).', '["Infrastructure", "Maritime", "Trade", "IMEC"]'::jsonb, 'published', '2026-03-22'),
  ('ca-2', 'ISRO & NASA NISAR Satellite Mission Enters Final Orbital Operations Phase', 'Science & Technology', '2026-03-18', 'Joint synthetic aperture radar satellite systematically tracks earth surface deformations, glaciers, and forest biomass.', 'Equipped with dual-frequency L-band and S-band radar systems, NISAR delivers high-resolution millimeter-level earth observation data globally every 12 days to predict natural hazards and climate variations.', '["ISRO", "NASA", "NISAR", "Earth Observation"]'::jsonb, 'published', '2026-03-18'),
  ('ca-3', 'National Green Hydrogen Mission Crosses Milestone 1.2 MMT Production Capacity', 'Environment & Energy', '2026-03-14', 'Ministry of New & Renewable Energy awards electrolyser incentive packages to establish green ammonia export hubs.', 'India accelerates toward its target of 5 Million Metric Tonnes (MMT) per annum green hydrogen by 2030, reducing carbon emissions and reliance on fossil fuel imports.', '["Renewable Energy", "Hydrogen", "Net Zero", "Economy"]'::jsonb, 'published', '2026-03-14'),
  ('ca-4', 'India Wins 12 Medals at World Shooting Championship 2026 in Munich', 'Sports & Awards', '2026-03-09', 'Indian marksmen and markswomen clinch 5 Gold, 4 Silver, and 3 Bronze medals in 10m Air Rifle and Pistol events.', 'The contingent topped the medal table in junior categories and secured additional Olympic quota slots for the upcoming quadrennial games.', '["Sports", "Shooting", "Championship", "Medals"]'::jsonb, 'published', '2026-03-09'),
  ('ca-5', 'Defence Ministry Inks Contract for 4th Generation Indigenous Fighter Jet Radars', 'Defense & Security', '2026-02-28', 'Uttam AESA Radar systems to be manufactured domestically under Make-in-India for Tejas Mk-1A and Mk-2 aircraft.', 'Developed by LRDE (DRDO), the Uttam Active Electronically Scanned Array radar delivers electronic warfare counter-measures, multi-target tracking, and superior dogfight situational awareness.', '["Defence", "DRDO", "Tejas", "AESA Radar"]'::jsonb, 'draft', '2026-02-28')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.government_exams (id, title, agency, category, eligibility, total_vacancies, exam_dates, stages, syllabus_summary, notification_url, status, created_at)
VALUES
  ('ex-1', 'UPSC Civil Services Examination (CSE) 2026', 'UPSC', 'UPSC', 'Bachelor''s Degree in any discipline from a recognized University. Age: 21-32 years (Relaxations as per rules).', '1,056+ Posts', 'Prelims: May 24, 2026 | Mains: Sept 18-27, 2026', 'Stage 1: Preliminary Exam (GS 1 + CSAT) → Stage 2: Main Written Exam (9 Papers) → Stage 3: Personality Test (Interview)', 'Comprehensive Indian Polity, Modern & Ancient History, Geography, Economy, Ecology, Ethics, Governance and Optional Subject.', 'https://upsc.gov.in', 'published', '2026-01-10'),
  ('ex-2', 'SSC Combined Graduate Level (CGL) Examination 2026', 'Staff Selection Commission (SSC)', 'SSC', 'Bachelor''s Degree from a recognized University. Age: 18-32 years depending on post code.', '14,500+ Posts', 'Tier-1: July 2026 | Tier-2: October 2026', 'Tier-1: Computer Based Test (Reasoning, GK, Math, English) → Tier-2: Paper I (Math, Reasoning, English, GS, Computer, Typing)', 'General Intelligence, Quantitative Aptitude, General Awareness (Current Affairs, Science, History), English Comprehension.', 'https://ssc.gov.in', 'published', '2026-01-20'),
  ('ex-3', 'RRB Non-Technical Popular Categories (NTPC) 2026', 'Railway Recruitment Boards (RRB)', 'Railway', '12th Pass / Graduate depending on level (Level 2 to Level 6). Age: 18-33 years.', '11,558 Posts', 'CBT-1: August-September 2026 | CBT-2: November 2026', '1st Stage CBT → 2nd Stage CBT → Typing Skill Test / CBAT (as applicable) → Document Verification & Medical', 'General Awareness (40 marks), Mathematics (30 marks), General Intelligence & Reasoning (30 marks).', 'https://indianrailways.gov.in', 'published', '2026-02-01'),
  ('ex-4', 'IBPS Probationary Officer (PO / MT) XIV 2026', 'Institute of Banking Personnel Selection', 'Banking', 'Graduation in any discipline. Age: 20-30 years.', '4,450+ Posts', 'Prelims: October 2026 | Mains: November 2026', 'Preliminary Exam (Online) → Main Exam (Online Objective + Descriptive) → Common Interview', 'Banking Awareness, Financial GK, Reasoning Ability, Quantitative Aptitude, English Language & Descriptive Essay.', 'https://ibps.in', 'published', '2026-02-15'),
  ('ex-5', 'NDA & NA Examination (I) 2026', 'UPSC / Ministry of Defence', 'Defence', '12th Class pass (Physics & Math for Air Force / Navy). Unmarried male/female candidates.', '400 Posts', 'Written Exam: April 2026 | SSB Interviews: July-Sept 2026', 'Written Examination (Math 300 marks + GAT 600 marks) → 5-Day SSB Interview & Medical Testing', 'Mathematics (Calculus, Trigonometry, Matrices) and General Ability Test (English, Physics, Chemistry, GS, Current Affairs).', 'https://upsc.gov.in', 'draft', '2026-02-20')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.study_materials (id, title, subject, file_type, file_size, pages, download_url, description, status, created_at)
VALUES
  ('sm-1', 'Indian Polity 395 Articles & Constitutional Amendments Pocket Guide', 'Indian Polity', 'PDF Document', '4.8 MB', '64 Pages', '#', 'Complete high-yield table of Fundamental Rights, Directive Principles, Parliamentary committees, and 106 Constitutional Amendments.', 'published', '2026-01-20'),
  ('sm-2', 'Indian Rivers, Tributaries & Major Multipurpose Dams Map Chart', 'Indian Geography', 'Formula / Map Sheet', '6.2 MB', '18 Pages', '#', 'Color-coded drainage basin charts, river origins, left/right bank tributaries, waterfalls, and national waterways.', 'published', '2026-02-04'),
  ('sm-3', 'Modern Indian History Timeline (1757 Battle of Plassey to 1947 Independence)', 'Indian History', 'Quick Revision Notes', '3.5 MB', '42 Pages', '#', 'Chronological summary of British Viceroy acts, Indian National Congress sessions, tribal & peasant revolts, and revolutionary movements.', 'published', '2026-02-16'),
  ('sm-4', 'Government Exam Quantitative Formulas & Mental Math Tricks Handbook', 'Exam Preparation', 'Formula / Map Sheet', '2.9 MB', '36 Pages', '#', 'Shortcut tricks for Percentage, Ratio, Speed-Time-Distance, Work-Time, Permutations, and Data Interpretation.', 'published', '2026-02-28'),
  ('sm-5', '2025-2026 Current Affairs Annual Digest: National & Global Milestones', 'Current Affairs', 'PDF Document', '8.4 MB', '110 Pages', '#', 'Curated monthly roundups covering Science, Economy, Summits, Government Schemes, Sports, and Military Exercises.', 'draft', '2026-03-10')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.contact_messages (id, name, email, subject, message, date, status, reply_note)
VALUES
  ('msg-1', 'Saurabh Pandey', 'saurabh.pandey98@gmail.com', 'Question on UPSC CSE Prelims 2026 Mock Test Schedule', 'Dear GK India Academy Team, I have been using your subject MCQs daily. Will you be organizing a full-length All-India Mock Test Series before May 2026? Also, can we download PDF answer keys with detailed explanations?', '2026-03-25T11:24:00Z', 'unread', ''),
  ('msg-2', 'Priyanka Ghosh', 'priyanka.ghosh.wb@outlook.com', 'Suggestion for West Bengal PSC & State Exam Material', 'Hello Sir/Madam, could you please add state-specific GK and previous year question papers for WBPSC WBCS exams? The current Indian Geography section is exceptionally well structured.', '2026-03-23T16:45:00Z', 'replied', 'Noted and sent to content research team; WBPSC module slated for Q2 2026.'),
  ('msg-3', 'Ankit Verma', 'ankit.verma_rrb@yahoo.com', 'Inquiry regarding RRB NTPC Study Notes Download Link', 'Hi, I tried downloading the Railway Formula Guide yesterday but faced a network timeout. Could you please verify the cloud download link? Thank you for the great free resources.', '2026-03-20T09:12:00Z', 'unread', '')
ON CONFLICT (id) DO NOTHING;
