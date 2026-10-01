/**
 * GK INDIA ACADEMY — Centralized Government Exams Data Store
 * Modular, extensible and future-database ready (REST / Firebase / Supabase / SQL)
 */

const examStatsData = {
  questions: '1000+',
  questionsLabel: 'Practice Questions',
  exams: '50+',
  examsLabel: 'Government Exams',
  categories: '10+',
  categoriesLabel: 'Exam Categories',
  daily: 'Daily',
  dailyLabel: 'New Questions'
};

const examCategoriesData = [
  {
    id: 'upsc',
    name: 'UPSC Exams',
    filterKey: 'UPSC',
    icon: 'fa-landmark',
    colorTheme: 'upsc',
    shortDesc: 'Civil Services and other Union Public Service Commission examinations.'
  },
  {
    id: 'ssc',
    name: 'SSC Exams',
    filterKey: 'SSC',
    icon: 'fa-briefcase',
    colorTheme: 'ssc',
    shortDesc: 'Staff Selection Commission examinations including CGL, CHSL, CPO, MTS & GD.'
  },
  {
    id: 'railway',
    name: 'Railway Exams',
    filterKey: 'Railway',
    icon: 'fa-train',
    colorTheme: 'railway',
    shortDesc: 'RRB examinations including NTPC, Group D, JE and other railway recruitment exams.'
  },
  {
    id: 'banking',
    name: 'Banking Exams',
    filterKey: 'Banking',
    icon: 'fa-university',
    colorTheme: 'banking',
    shortDesc: 'SBI, IBPS, RBI and other national banking sector examinations.'
  },
  {
    id: 'defence',
    name: 'Defence Exams',
    filterKey: 'Defence',
    icon: 'fa-shield-halved',
    colorTheme: 'defence',
    shortDesc: 'NDA, CDS, AFCAT and other Indian Armed Forces examinations.'
  },
  {
    id: 'teaching',
    name: 'Teaching Exams',
    filterKey: 'Teaching',
    icon: 'fa-chalkboard-user',
    colorTheme: 'teaching',
    shortDesc: 'CTET, State TET, UGC NET and other teaching recruitment examinations.'
  },
  {
    id: 'state-government',
    name: 'State Government Exams',
    filterKey: 'State Government',
    icon: 'fa-map-location-dot',
    colorTheme: 'state',
    shortDesc: 'OPSC, OSSC, OSSSC, BPSC, UPPSC, WBPSC and other state-level examinations.'
  },
  {
    id: 'police',
    name: 'Police Exams',
    filterKey: 'Police',
    icon: 'fa-person-military-pointing',
    colorTheme: 'police',
    shortDesc: 'State Police, SSC GD, Sub-Inspector and other police recruitment examinations.'
  }
];

const quickLinksData = [
  { label: 'UPSC', category: 'UPSC' },
  { label: 'SSC', category: 'SSC' },
  { label: 'Railway', category: 'Railway' },
  { label: 'Banking', category: 'Banking' },
  { label: 'Defence', category: 'Defence' },
  { label: 'Teaching', category: 'Teaching' },
  { label: 'State Government', category: 'State Government' },
  { label: 'Police', category: 'Police' }
];

const examUpdatesData = [
  {
    id: 'upd-1',
    examName: 'UPSC Civil Services 2026',
    organization: 'Union Public Service Commission',
    updateType: 'New Recruitment',
    date: 'Sep 24, 2026',
    description: 'Annual notification calendar for Civil Services (Prelims) released. Applications open as per scheduled notification cycle.',
    examSlug: 'upsc-civil-services'
  },
  {
    id: 'upd-2',
    examName: 'SSC CGL Tier 1',
    organization: 'Staff Selection Commission',
    updateType: 'Admit Card',
    date: 'Sep 22, 2026',
    description: 'City intimation slips and regional admit cards published for Combined Graduate Level examination.',
    examSlug: 'ssc-cgl'
  },
  {
    id: 'upd-3',
    examName: 'RRB NTPC Centralized Notice',
    organization: 'Railway Recruitment Boards',
    updateType: 'Application Started',
    date: 'Sep 20, 2026',
    description: 'Online application window activated for Graduate and Undergraduate Non-Technical Popular Categories.',
    examSlug: 'rrb-ntpc'
  },
  {
    id: 'upd-4',
    examName: 'IBPS PO Probationary Officers',
    organization: 'Institute of Banking Personnel Selection',
    updateType: 'Exam Date',
    date: 'Sep 18, 2026',
    description: 'Official schedule for IBPS PO Preliminary computer-based test announced along with shift guidelines.',
    examSlug: 'ibps-po'
  },
  {
    id: 'upd-5',
    examName: 'OSSC Combined Graduate Recruitment',
    organization: 'Odisha Staff Selection Commission',
    updateType: 'Answer Key',
    date: 'Sep 15, 2026',
    description: 'Provisional answer keys for preliminary examination uploaded with objection raising window.',
    examSlug: 'ossc-cgl'
  },
  {
    id: 'upd-6',
    examName: 'Central Teacher Eligibility Test (CTET)',
    organization: 'Central Board of Secondary Education',
    updateType: 'Result',
    date: 'Sep 12, 2026',
    description: 'CTET scores and DigiLocker eligibility certificates issued for qualified candidates across Paper 1 and 2.',
    examSlug: 'ctet'
  }
];

const examsData = [
  {
    id: 1,
    slug: 'upsc-civil-services',
    name: 'UPSC Civil Services Examination',
    shortName: 'UPSC CSE',
    category: 'UPSC',
    organization: 'Union Public Service Commission',
    qualification: 'Graduate',
    qualificationDetail: 'Bachelor degree in any discipline from a recognized University or equivalent qualification.',
    ageLimit: '21 to 32 Years (Relaxation: OBC 3 yrs, SC/ST 5 yrs, PwBD 10 yrs)',
    status: 'Upcoming',
    description: "Prepare for India's premier civil services examination to join IAS, IPS, IFS, IRS and other prestigious administrative services.",
    overview: 'The UPSC Civil Services Examination (CSE) is a nationwide competitive examination conducted annually by the Union Public Service Commission for recruitment to various higher Civil Services of the Government of India, including the Indian Administrative Service (IAS), Indian Police Service (IPS), Indian Foreign Service (IFS), and Indian Revenue Service (IRS).',
    importantDates: [
      { label: 'Official Notification', value: 'February 2026' },
      { label: 'Application Start Date', value: 'February 2026' },
      { label: 'Last Date to Apply', value: 'March 2026' },
      { label: 'Admit Card Release', value: 'May 2026' },
      { label: 'Preliminary Exam Date', value: 'May 24, 2026' },
      { label: 'Main Examination', value: 'September 2026' }
    ],
    applicationFee: '₹100 (General/OBC/EWS Male). Female candidates, SC, ST, and Persons with Benchmark Disability (PwBD) are exempt from payment.',
    vacancies: 'Approximately 1,000+ Vacancies (Indicative demo figure based on recent recruitment trends).',
    salary: 'Pay Level 10 (7th CPC) starting basic pay ₹56,100/- plus DA, HRA, Transport Allowance, and government perks.',
    selectionProcess: [
      'Stage 1: Preliminary Examination (Objective Type - 2 Papers, Qualifying GS + CSAT)',
      'Stage 2: Main Written Examination (Descriptive Type - 9 Papers)',
      'Stage 3: Personality Test / Interview at Dholpur House, New Delhi'
    ],
    examPattern: [
      { paper: 'Prelims Paper I (GS)', questions: '100 Questions', marks: '200 Marks', duration: '2 Hours', negative: '1/3rd (0.66 marks)' },
      { paper: 'Prelims Paper II (CSAT)', questions: '80 Questions', marks: '200 Marks', duration: '2 Hours', negative: '1/3rd (Qualifying at 33%)' },
      { paper: 'Mains Written (GS + Optional + Essay)', questions: 'Descriptive', marks: '1750 Marks', duration: '5 Days', negative: 'N/A' },
      { paper: 'Interview / Personality Test', questions: 'Board Viva', marks: '275 Marks', duration: '30-45 Mins', negative: 'N/A' }
    ],
    syllabus: [
      { subject: 'Current Affairs & General Studies', topics: 'Indian Polity, Governance, Constitution, History of India, World Geography, Economic Development, Environment & Biodiversity, General Science.' },
      { subject: 'Civil Services Aptitude Test (CSAT)', topics: 'Comprehension, Interpersonal skills, Logical reasoning, Analytical ability, Decision making, General mental ability, Basic numeracy.' },
      { subject: 'Mains General Studies I-IV', topics: 'Indian Heritage & Culture, Governance & International Relations, Technology & Disaster Management, Ethics, Integrity & Aptitude.' }
    ],
    howToApply: [
      'Visit the official UPSC online portal at upsconline.nic.in.',
      'Complete One Time Registration (OTR) profile if not registered already.',
      'Log in with OTR ID and fill out the Civil Services Preliminary Examination form.',
      'Upload recent photograph, signature, and photo ID card proof.',
      'Pay application fee through online banking / UPI / debit card or SBI challan.',
      'Submit the application and download the confirmation slip for reference.'
    ],
    officialWebsite: 'https://upsc.gov.in',
    importantLinks: [
      { title: 'Official UPSC Portal', url: 'https://upsc.gov.in' },
      { title: 'UPSC Online Application (OTR)', url: 'https://upsconline.nic.in' },
      { title: 'UPSC CSE Examination Scheme & Syllabus', url: 'https://upsc.gov.in/examinations' }
    ],
    faqs: [
      { q: 'What is the minimum qualification required for UPSC Civil Services?', a: 'Candidates must hold a graduation degree in any discipline from a recognized central or state university.' },
      { q: 'How many attempts are permitted for UPSC CSE?', a: 'General category candidates have 6 attempts until age 32. OBC candidates have 9 attempts until age 35. SC/ST candidates have unlimited attempts until age 37.' },
      { q: 'Is CSAT Paper II qualifying in Prelims?', a: 'Yes, candidates are required to score a minimum of 33% marks (66 out of 200) in CSAT to qualify for GS Paper I evaluation.' }
    ],
    mcqCategory: 'upsc'
  },
  {
    id: 2,
    slug: 'ssc-cgl',
    name: 'SSC CGL',
    shortName: 'SSC CGL',
    category: 'SSC',
    organization: 'Staff Selection Commission',
    qualification: 'Graduate',
    qualificationDetail: 'Bachelor degree in any stream from a recognized University.',
    ageLimit: '18 to 32 Years (varies based on specific ministry post)',
    status: 'Application Open',
    description: 'Recruitment for Group B and Group C officers in central government ministries, departments, and statutory bodies.',
    overview: 'The Staff Selection Commission Combined Graduate Level Examination (SSC CGL) is one of the most sought-after recruitment drives for appointing officers in prestigious organizations such as CBI, Income Tax, Customs, CAG, and Central Vigilance Commission.',
    importantDates: [
      { label: 'Notification Release', value: 'June 2026' },
      { label: 'Application Window', value: 'June – July 2026' },
      { label: 'Tier-1 CBT Exam', value: 'September 2026' },
      { label: 'Tier-2 CBT Exam', value: 'December 2026' }
    ],
    applicationFee: '₹100 (General/OBC Male). Women, SC, ST, ESM, and PwBD candidates are exempted.',
    vacancies: '15,000+ Vacancies across various ministries (Indicative sample data).',
    salary: 'Pay Level 4 to Level 8 (₹25,500 – ₹1,51,100 basic) depending on the post allocated.',
    selectionProcess: [
      'Tier 1: Computer-Based Objective Test (Qualifying in nature)',
      'Tier 2: Computer-Based Objective Test (Paper 1 & Paper 2) + Data Entry Speed Test (DEST)',
      'Document Verification & Final Merit List based on Tier 2 performance'
    ],
    examPattern: [
      { paper: 'Tier 1: Reasoning & GI', questions: '25 Questions', marks: '50 Marks', duration: '60 Minutes (Combined)', negative: '0.50 marks' },
      { paper: 'Tier 1: General Awareness', questions: '25 Questions', marks: '50 Marks', duration: 'Included above', negative: '0.50 marks' },
      { paper: 'Tier 1: Quantitative Aptitude', questions: '25 Questions', marks: '50 Marks', duration: 'Included above', negative: '0.50 marks' },
      { paper: 'Tier 1: English Comprehension', questions: '25 Questions', marks: '50 Marks', duration: 'Included above', negative: '0.50 marks' }
    ],
    syllabus: [
      { subject: 'General Awareness', topics: 'History, Culture, Geography, Economic Scene, General Policy, Scientific Research, and Current Affairs.' },
      { subject: 'Quantitative Aptitude', topics: 'Arithmetic, Algebra, Geometry, Trigonometry, Mensuration, Statistics, and Data Interpretation.' },
      { subject: 'Reasoning & Intelligence', topics: 'Analogies, Syllogisms, Blood Relations, Series, Coding-Decoding, Paper Folding.' }
    ],
    howToApply: [
      'Register on the new official portal ssc.gov.in using Aadhaar or valid photo ID.',
      'Fill in personal details, educational qualifications, and post preferences.',
      'Capture a live photograph using the SSC webcam tool and upload signature.',
      'Pay online examination fee and submit application.'
    ],
    officialWebsite: 'https://ssc.gov.in',
    importantLinks: [
      { title: 'SSC Official Portal', url: 'https://ssc.gov.in' },
      { title: 'SSC Examination Calendar', url: 'https://ssc.gov.in' }
    ],
    faqs: [
      { q: 'Is Tier 1 score counted in the final CGL merit list?', a: 'No, Tier 1 is qualifying in nature to shortlist candidates for Tier 2.' },
      { q: 'Is there a computer typing test in SSC CGL?', a: 'Yes, DEST (Data Entry Speed Test) is mandatory for all posts in Tier 2 Session II.' }
    ],
    mcqCategory: 'ssc'
  },
  {
    id: 3,
    slug: 'ssc-chsl',
    name: 'SSC CHSL',
    shortName: 'SSC CHSL',
    category: 'SSC',
    organization: 'Staff Selection Commission',
    qualification: '12th Pass',
    qualificationDetail: 'Passed 12th Standard or equivalent examination from a recognized Board or University.',
    ageLimit: '18 to 27 Years (Age relaxation applicable as per rules)',
    status: 'Upcoming',
    description: 'Combined Higher Secondary Level exam for recruitment of Lower Division Clerk (LDC), Junior Secretariat Assistant (JSA), and Data Entry Operator (DEO).',
    overview: 'SSC CHSL is a prime national-level examination providing 10+2 passed candidates opportunities to enter central government services as clerical cadre and data entry operators in central secretariats and ministries.',
    importantDates: [
      { label: 'Notification Date', value: 'April 2026' },
      { label: 'Online Application Last Date', value: 'May 2026' },
      { label: 'Tier-1 CBT Exam', value: 'July 2026' }
    ],
    applicationFee: '₹100 (General/OBC Male). Women, SC, ST, PwD, and ESM candidates are exempt.',
    vacancies: '3,700+ Vacancies (Indicative demo figure).',
    salary: 'Pay Level 2 (₹19,900 – ₹63,200) for LDC/JSA and Level 4 (₹25,500 – ₹81,100) for DEO.',
    selectionProcess: [
      'Tier 1: Computer Based Examination (Objective Type)',
      'Tier 2: Objective Test (Mathematical, Reasoning, English, GA, Computer) + Skill/Typing Test'
    ],
    examPattern: [
      { paper: 'Tier 1: English Language', questions: '25 Questions', marks: '50 Marks', duration: '60 Minutes (Combined)', negative: '0.50 marks' },
      { paper: 'Tier 1: General Intelligence', questions: '25 Questions', marks: '50 Marks', duration: 'Included above', negative: '0.50 marks' },
      { paper: 'Tier 1: Quantitative Aptitude', questions: '25 Questions', marks: '50 Marks', duration: 'Included above', negative: '0.50 marks' },
      { paper: 'Tier 1: General Awareness', questions: '25 Questions', marks: '50 Marks', duration: 'Included above', negative: '0.50 marks' }
    ],
    syllabus: [
      { subject: 'General Awareness', topics: 'Current events, Indian geography, freedom struggle, polity basics, sports, books and authors.' },
      { subject: 'English Language', topics: 'Spotting errors, sentence improvement, active/passive voice, idioms and phrases, comprehension.' }
    ],
    howToApply: [
      'Visit ssc.gov.in and complete One-Time Registration.',
      'Select CHSL examination from active application notifications.',
      'Fill required details, exam center preference, upload live photo and signature.'
    ],
    officialWebsite: 'https://ssc.gov.in',
    importantLinks: [
      { title: 'SSC Portal', url: 'https://ssc.gov.in' }
    ],
    faqs: [
      { q: 'Can 12th appearing candidates apply for SSC CHSL?', a: 'Candidates must possess the essential qualification on or before the cutoff date specified in the official notification.' }
    ],
    mcqCategory: 'ssc'
  },
  {
    id: 4,
    slug: 'ssc-cpo',
    name: 'SSC CPO',
    shortName: 'SSC CPO',
    category: 'SSC',
    organization: 'Staff Selection Commission',
    qualification: 'Graduate',
    qualificationDetail: 'Bachelor degree in any discipline with valid Driving License for LMV (for Delhi Police SI).',
    ageLimit: '20 to 25 Years (Relaxation: OBC 3 yrs, SC/ST 5 yrs)',
    status: 'Upcoming',
    description: 'Recruitment of Sub-Inspectors (SI) in Delhi Police and Central Armed Police Forces (CAPF: BSF, CRPF, CISF, ITBP, SSB).',
    overview: 'The SSC CPO exam provides an opportunity for graduates to serve as executive police officers in Delhi Police and armed police forces securing borders and internal security.',
    importantDates: [
      { label: 'Notification', value: 'March 2026' },
      { label: 'Paper-1 Exam', value: 'June 2026' },
      { label: 'PST & PET', value: 'August 2026' },
      { label: 'Paper-2 Exam', value: 'October 2026' }
    ],
    applicationFee: '₹100 (Exempted for Women/SC/ST/ESM).',
    vacancies: '4,000+ Sub-Inspector Posts (Demo figure).',
    salary: 'Pay Level 6 (₹35,400 to ₹1,12,400) + allowances.',
    selectionProcess: [
      'Paper 1: Computer Based Objective Examination (200 Marks)',
      'Physical Standard Test (PST) & Physical Endurance Test (PET)',
      'Paper 2: English Language & Comprehension (200 Marks)',
      'Detailed Medical Examination (DME)'
    ],
    examPattern: [
      { paper: 'Paper 1: GK, Reasoning, Maths, English', questions: '200 Questions (50 each)', marks: '200 Marks', duration: '2 Hours', negative: '0.25 marks' },
      { paper: 'Paper 2: English Language & Comprehension', questions: '200 Questions', marks: '200 Marks', duration: '2 Hours', negative: '0.25 marks' }
    ],
    syllabus: [
      { subject: 'Paper 1 GK', topics: 'Indian Constitution, Geography, Modern History, Everyday Science, Economics, and National Affairs.' }
    ],
    howToApply: [
      'Submit application online via ssc.gov.in during the open registration window.'
    ],
    officialWebsite: 'https://ssc.gov.in',
    importantLinks: [
      { title: 'SSC Website', url: 'https://ssc.gov.in' }
    ],
    faqs: [
      { q: 'Is there physical testing in SSC CPO?', a: 'Yes, 100m sprint, 1.6km run, long jump, high jump, and shot put are conducted for PET.' }
    ],
    mcqCategory: 'ssc'
  },
  {
    id: 5,
    slug: 'ssc-mts',
    name: 'SSC MTS',
    shortName: 'SSC MTS & Havaldar',
    category: 'SSC',
    organization: 'Staff Selection Commission',
    qualification: '10th Pass',
    qualificationDetail: 'Matriculation (10th Class) examination passed from a recognized Board.',
    ageLimit: '18 to 25 / 27 Years depending on cadre',
    status: 'Application Closed',
    description: 'Multi-Tasking (Non-Technical) Staff and Havaldar in CBIC and CBN for candidates who completed matriculation.',
    overview: 'SSC MTS offers central government permanent employment for 10th pass candidates across ministries, departments, and attached offices across India.',
    importantDates: [
      { label: 'Notification', value: 'May 2026' },
      { label: 'CBT Examination', value: 'October 2026' }
    ],
    applicationFee: '₹100 (Exempted for Women/SC/ST/PwBD).',
    vacancies: '9,500+ Vacancies (Indicative).',
    salary: 'Pay Level 1 (₹18,000 – ₹56,900) under 7th CPC.',
    selectionProcess: [
      'Session 1: Numerical & Reasoning (Qualifying, No Negative Marking)',
      'Session 2: General Awareness & English (Merit determining, Negative Marking: 1 mark)',
      'PST/PET for Havaldar posts only'
    ],
    examPattern: [
      { paper: 'Session 1: Maths & Reasoning', questions: '40 Questions', marks: '120 Marks', duration: '45 Minutes', negative: 'None' },
      { paper: 'Session 2: GA & English', questions: '50 Questions', marks: '150 Marks', duration: '45 Minutes', negative: '1 Mark per wrong' }
    ],
    syllabus: [
      { subject: 'General Awareness', topics: 'Social studies (History, Geography, Art and Culture, Civics, Economics) and General Science up to 10th standard.' }
    ],
    howToApply: ['Apply through ssc.gov.in.'],
    officialWebsite: 'https://ssc.gov.in',
    importantLinks: [{ title: 'SSC Website', url: 'https://ssc.gov.in' }],
    faqs: [{ q: 'Is there an interview in SSC MTS?', a: 'No, selection is strictly based on Session 2 CBT scores.' }],
    mcqCategory: 'ssc'
  },
  {
    id: 6,
    slug: 'ssc-gd-constable',
    name: 'SSC GD Constable',
    shortName: 'SSC GD',
    category: 'Police',
    organization: 'Staff Selection Commission',
    qualification: '10th Pass',
    qualificationDetail: '10th class pass from recognized state or central board.',
    ageLimit: '18 to 23 Years',
    status: 'Upcoming',
    description: 'General Duty Constable in BSF, CISF, CRPF, SSB, ITBP, AR, and SSF under Ministry of Home Affairs.',
    overview: 'SSC GD Constable is one of the largest recruitment exams in India, providing young aspirants an opportunity to serve in paramilitary and central armed police forces.',
    importantDates: [
      { label: 'Notification', value: 'November 2026' },
      { label: 'CBT Exam', value: 'January – February 2027' }
    ],
    applicationFee: '₹100 (Free for SC/ST/Ex-Servicemen and Women).',
    vacancies: '26,000+ Vacancies across CAPFs (Demo sample).',
    salary: 'Pay Level 3 (₹21,700 – ₹69,100).',
    selectionProcess: ['Computer-Based Examination', 'Physical Efficiency Test (PET) & PST', 'Medical Examination'],
    examPattern: [
      { paper: 'CBT: Reasoning, GA, Elementary Maths, English/Hindi', questions: '80 Questions (20 each)', marks: '160 Marks', duration: '60 Minutes', negative: '0.25 marks' }
    ],
    syllabus: [{ subject: 'General Knowledge & General Awareness', topics: 'India and its neighboring countries, sports, history, culture, geography, basic economics, general polity, scientific research.' }],
    howToApply: ['Submit online form on ssc.gov.in.'],
    officialWebsite: 'https://ssc.gov.in',
    importantLinks: [{ title: 'SSC Portal', url: 'https://ssc.gov.in' }],
    faqs: [{ q: 'What is the running requirement in PET for male candidates?', a: '5 km run to be completed within 24 minutes for general areas.' }],
    mcqCategory: 'police'
  },
  {
    id: 7,
    slug: 'rrb-ntpc',
    name: 'RRB NTPC',
    shortName: 'RRB NTPC',
    category: 'Railway',
    organization: 'Railway Recruitment Boards',
    qualification: 'Graduate',
    qualificationDetail: 'Graduate / 12th Pass depending on level (Station Master, Goods Train Manager, Senior Clerk, Junior Clerk).',
    ageLimit: '18 to 33 / 36 Years (with recent age relaxations)',
    status: 'Application Open',
    description: 'Non-Technical Popular Categories in Indian Railways covering Station Master, Commercial Apprentice, Goods Train Manager, and Clerks.',
    overview: 'Railway Recruitment Boards recruit thousands of personnel nationwide through RRB NTPC for operational, commercial, and administrative cadres.',
    importantDates: [
      { label: 'CEN Notification', value: 'September 2026' },
      { label: 'CBT Stage 1 Exam', value: 'December 2026 – January 2027' }
    ],
    applicationFee: '₹500 (₹400 refunded after appearing in CBT 1). ₹250 for SC/ST/Ex-Servicemen/Female (full ₹250 refunded).',
    vacancies: '11,558 Vacancies across Zonal Railways.',
    salary: 'Pay Level 2 to Level 6 (₹19,900 to ₹35,400 basic + DA, HRA, Running allowances).',
    selectionProcess: [
      '1st Stage Computer Based Test (CBT-1) — Screening',
      '2nd Stage Computer Based Test (CBT-2) — Scoring',
      'Computer-Based Aptitude Test (CBAT) for SM or Typing Skill Test for Clerical posts',
      'Document Verification & Medical Fitness'
    ],
    examPattern: [
      { paper: 'CBT 1: General Awareness', questions: '40 Questions', marks: '40 Marks', duration: '90 Minutes (Combined)', negative: '1/3rd mark' },
      { paper: 'CBT 1: Mathematics', questions: '30 Questions', marks: '30 Marks', duration: 'Included above', negative: '1/3rd mark' },
      { paper: 'CBT 1: General Intelligence & Reasoning', questions: '30 Questions', marks: '30 Marks', duration: 'Included above', negative: '1/3rd mark' }
    ],
    syllabus: [
      { subject: 'General Awareness', topics: 'Current Events of National and International Importance, Games and Sports, Art and Culture of India, Indian Literature, Monuments and Places of India, General Science and Life Science up to 10th CBSE.' }
    ],
    howToApply: ['Apply through designated regional RRB portals (rrbcdg.gov.in, rrbbbs.gov.in, rrbmumbai.gov.in, etc.).'],
    officialWebsite: 'https://indianrailways.gov.in',
    importantLinks: [{ title: 'Railway Recruitment Boards Portal', url: 'https://rrbcdg.gov.in' }],
    faqs: [{ q: 'Is the application fee refunded in RRB?', a: 'Yes, partial refund (₹400 for General/OBC, full ₹250 for reserved) is processed after sitting for CBT 1.' }],
    mcqCategory: 'railway'
  },
  {
    id: 8,
    slug: 'rrb-group-d',
    name: 'RRB Group D',
    shortName: 'RRC Group D (Level-1)',
    category: 'Railway',
    organization: 'Railway Recruitment Cell',
    qualification: '10th Pass',
    qualificationDetail: '10th pass from recognized institution OR National Apprenticeship Certificate (NAC) granted by NCVT / ITI.',
    ageLimit: '18 to 33 Years',
    status: 'Upcoming',
    description: 'Track Maintainer Grade IV, Helper/Assistant in Electrical, Mechanical, S&T Departments and Pointsman in Indian Railways.',
    overview: 'RRC Level-1 recruitment offers massive employment in maintenance, engineering, and operational wings of Indian Railways for matriculates and ITI holders.',
    importantDates: [
      { label: 'Upcoming Notification', value: 'Late 2026' },
      { label: 'CBT Exam Window', value: 'Early 2027' }
    ],
    applicationFee: '₹500 (Refundable component ₹400 upon CBT appearance). ₹250 for SC/ST/Women.',
    vacancies: '30,000+ Indicative Vacancies nationwide.',
    salary: 'Pay Level 1 (₹18,000 basic plus applicable railway allowances).',
    selectionProcess: ['Computer-Based Test (CBT)', 'Physical Efficiency Test (PET)', 'Document Verification & Medical'],
    examPattern: [
      { paper: 'General Science', questions: '25 Questions', marks: '25 Marks', duration: '90 Minutes', negative: '1/3rd mark' },
      { paper: 'Mathematics', questions: '25 Questions', marks: '25 Marks', duration: 'Combined', negative: '1/3rd mark' },
      { paper: 'General Intelligence & Reasoning', questions: '30 Questions', marks: '30 Marks', duration: 'Combined', negative: '1/3rd mark' },
      { paper: 'General Awareness & Current Affairs', questions: '20 Questions', marks: '20 Marks', duration: 'Combined', negative: '1/3rd mark' }
    ],
    syllabus: [{ subject: 'General Science', topics: 'Physics, Chemistry, and Life Sciences of 10th standard CBSE standard with practical questions.' }],
    howToApply: ['Apply online via respective regional Railway Recruitment Cell websites.'],
    officialWebsite: 'https://indianrailways.gov.in',
    importantLinks: [{ title: 'Indian Railways Portal', url: 'https://indianrailways.gov.in' }],
    faqs: [{ q: 'Is ITI mandatory for all Group D posts?', a: 'As per railway board rules, certain technical posts require ITI/NAC or 10th pass.' }],
    mcqCategory: 'railway'
  },
  {
    id: 9,
    slug: 'rrb-je',
    name: 'RRB JE',
    shortName: 'RRB Junior Engineer',
    category: 'Railway',
    organization: 'Railway Recruitment Boards',
    qualification: 'Engineering',
    qualificationDetail: 'Three years Diploma or Bachelor of Engineering / Technology in Civil, Mechanical, Electrical, Electronics or allied disciplines.',
    ageLimit: '18 to 36 Years',
    status: 'Exam Soon',
    description: 'Junior Engineer, Depot Material Superintendent (DMS) and Chemical & Metallurgical Assistant (CMA) in Indian Railways.',
    overview: 'RRB Junior Engineer exam selects technical professionals to maintain railway tracks, signals, electric locomotives, rolling stock, and bridges.',
    importantDates: [
      { label: 'CBT 1 Exam', value: 'November – December 2026' },
      { label: 'CBT 2 Exam', value: 'February 2027' }
    ],
    applicationFee: '₹500 (₹400 refundable). ₹250 for SC/ST/Women/PwBD.',
    vacancies: '7,951 Technical Vacancies.',
    salary: 'Pay Level 6 (₹35,400 basic + HRA, DA, Transport Allowance).',
    selectionProcess: ['1st Stage CBT (Screening - Non-Technical)', '2nd Stage CBT (Technical + Basics of Environment & Computers)', 'Document Verification & Medical Test'],
    examPattern: [
      { paper: 'CBT 1 (Maths, Reasoning, Science, GA)', questions: '100 Questions', marks: '100 Marks', duration: '90 Minutes', negative: '1/3rd mark' },
      { paper: 'CBT 2 (Technical Abilities + GA + Physics/Chemistry)', questions: '150 Questions', marks: '150 Marks', duration: '120 Minutes', negative: '1/3rd mark' }
    ],
    syllabus: [{ subject: 'CBT 1 General Awareness & Science', topics: 'Current affairs, basic science up to 10th, Indian geography, railway facts and policies.' }],
    howToApply: ['Submit applications through the official regional RRB online application portal.'],
    officialWebsite: 'https://rrbcdg.gov.in',
    importantLinks: [{ title: 'RRB Central Portal', url: 'https://rrbcdg.gov.in' }],
    faqs: [{ q: 'Is diploma eligible for RRB JE?', a: 'Yes, a 3-year polytechnic engineering diploma in the relevant discipline is fully eligible.' }],
    mcqCategory: 'railway'
  },
  {
    id: 10,
    slug: 'ibps-po',
    name: 'IBPS PO',
    shortName: 'IBPS Probationary Officer',
    category: 'Banking',
    organization: 'Institute of Banking Personnel Selection',
    qualification: 'Graduate',
    qualificationDetail: 'A Degree (Graduation) in any discipline from a recognized University.',
    ageLimit: '20 to 30 Years (OBC 3 yrs, SC/ST 5 yrs relaxation)',
    status: 'Application Open',
    description: 'Probationary Officer / Management Trainee recruitment in 11 participating public sector banks across India.',
    overview: 'IBPS PO is the premier entrance pathway into executive managerial cadres of leading public sector banks including PNB, Bank of Baroda, Canara Bank, and Union Bank of India.',
    importantDates: [
      { label: 'Notification', value: 'August 2026' },
      { label: 'Preliminary Exam', value: 'October 2026' },
      { label: 'Mains Exam', value: 'November 2026' },
      { label: 'Interview', value: 'January – February 2027' }
    ],
    applicationFee: '₹850 for General/OBC/EWS candidates. ₹175 for SC/ST/PWBD candidates.',
    vacancies: '4,455+ PO Vacancies across Public Sector Banks.',
    salary: 'Starting basic pay ₹36,000 (Pay revision applicable under 12th BPS to approx ₹48,480 basic). In-hand: ₹55,000 – ₹65,000+.',
    selectionProcess: ['Phase 1: Online Preliminary Exam', 'Phase 2: Online Mains Exam (Objective + Descriptive)', 'Phase 3: Common Interview (Conducted by Participating Banks & Nodal Bank)'],
    examPattern: [
      { paper: 'Prelims: English Language', questions: '30 Questions', marks: '30 Marks', duration: '20 Minutes', negative: '0.25 marks' },
      { paper: 'Prelims: Quantitative Aptitude', questions: '35 Questions', marks: '35 Marks', duration: '20 Minutes', negative: '0.25 marks' },
      { paper: 'Prelims: Reasoning Ability', questions: '35 Questions', marks: '35 Marks', duration: '20 Minutes', negative: '0.25 marks' },
      { paper: 'Mains: Reasoning, GA/Banking, English, Data Analysis', questions: '155 Qs + Descriptive', marks: '200 + 25 Marks', duration: '3.5 Hours', negative: '0.25 marks' }
    ],
    syllabus: [
      { subject: 'General / Economy / Banking Awareness', topics: 'Banking terminology, RBI monetary policies, NPA, priority sector lending, current economic affairs, Union Budget, financial institutions.' }
    ],
    howToApply: ['Register and apply online on ibps.in during the registration window.'],
    officialWebsite: 'https://ibps.in',
    importantLinks: [{ title: 'IBPS Official Portal', url: 'https://ibps.in' }],
    faqs: [{ q: 'Is there sectional timing in IBPS PO?', a: 'Yes, each section in both Prelims and Mains has strict separate time limits.' }],
    mcqCategory: 'banking'
  },
  {
    id: 11,
    slug: 'ibps-clerk',
    name: 'IBPS Clerk',
    shortName: 'IBPS Customer Service Associate',
    category: 'Banking',
    organization: 'Institute of Banking Personnel Selection',
    qualification: 'Graduate',
    qualificationDetail: 'Graduation in any discipline and proficiency in the official local language of the State/UT.',
    ageLimit: '20 to 28 Years',
    status: 'Result',
    description: 'Clerical Cadre recruitment across participating public sector commercial banks in India.',
    overview: 'IBPS Clerk recruits customer-facing staff, tellers, and administrative assistants for branch banking operations across all Indian states and Union Territories.',
    importantDates: [
      { label: 'Notification', value: 'July 2026' },
      { label: 'Prelims Exam', value: 'August 2026' },
      { label: 'Mains Exam', value: 'October 2026' }
    ],
    applicationFee: '₹850 (General/OBC/EWS) / ₹175 (SC/ST/PwBD).',
    vacancies: '6,128+ Clerical Vacancies.',
    salary: 'Basic Pay ₹19,900 (under 12th BPS revised to approx ₹26,730 basic) with allowances.',
    selectionProcess: ['Preliminary Examination (CBT)', 'Main Examination (CBT) — No Interview for Clerical posts'],
    examPattern: [
      { paper: 'Prelims: English, Reasoning, Numerical Ability', questions: '100 Questions', marks: '100 Marks', duration: '60 Minutes', negative: '0.25 marks' },
      { paper: 'Mains: General/Financial Awareness, English, Reasoning, Quantitative', questions: '190 Questions', marks: '200 Marks', duration: '160 Minutes', negative: '0.25 marks' }
    ],
    syllabus: [{ subject: 'Financial & General Awareness', topics: 'Current affairs, banking terms, static GK, government schemes, financial markets.' }],
    howToApply: ['Apply online at ibps.in.'],
    officialWebsite: 'https://ibps.in',
    importantLinks: [{ title: 'IBPS Website', url: 'https://ibps.in' }],
    faqs: [{ q: 'Is there an interview in IBPS Clerk?', a: 'No, government has abolished interviews for Group B and C non-gazetted clerical posts.' }],
    mcqCategory: 'banking'
  },
  {
    id: 12,
    slug: 'sbi-po',
    name: 'SBI PO',
    shortName: 'State Bank of India PO',
    category: 'Banking',
    organization: 'State Bank of India',
    qualification: 'Graduate',
    qualificationDetail: 'Graduation in any discipline from a recognized University or equivalent qualification.',
    ageLimit: '21 to 30 Years',
    status: 'Upcoming',
    description: 'Probationary Officer in State Bank of India, the largest commercial bank in the country.',
    overview: 'SBI PO offers unmatched career growth, premier compensation packages, and international posting opportunities in banking.',
    importantDates: [
      { label: 'Notification Announcement', value: 'September 2026' },
      { label: 'Phase 1 Prelims Exam', value: 'November 2026' },
      { label: 'Phase 2 Mains Exam', value: 'December 2026' },
      { label: 'Phase 3 Psychometric & Interview', value: 'February 2027' }
    ],
    applicationFee: '₹750 for General/EWS/OBC. Nil for SC/ST/PwBD candidates.',
    vacancies: '2,000+ PO Vacancies in SBI.',
    salary: 'Starting basic ₹41,960 (with 4 advance increments) — CTC approx ₹18 to ₹20 Lakhs per annum with perks.',
    selectionProcess: ['Phase I: Preliminary Exam', 'Phase II: Main Exam (Objective + Descriptive)', 'Phase III: Psychometric Test, Group Discussion & Personal Interview'],
    examPattern: [
      { paper: 'Prelims (English, Quant, Reasoning)', questions: '100 Questions', marks: '100 Marks', duration: '60 Minutes', negative: '0.25 marks' },
      { paper: 'Mains (Reasoning, Data Analysis, GA, English)', questions: '155 Qs + Descriptive', marks: '250 Marks', duration: '3.5 Hours', negative: '0.25 marks' }
    ],
    syllabus: [{ subject: 'General / Economy / Banking Awareness', topics: 'Current financial news, RBI circulars, Indian banking system, fintech innovations, fiscal metrics.' }],
    howToApply: ['Apply on bank.sbi/careers or sbi.co.in/careers.'],
    officialWebsite: 'https://sbi.co.in',
    importantLinks: [{ title: 'SBI Careers', url: 'https://sbi.co.in/careers' }],
    faqs: [{ q: 'Do final year students qualify for SBI PO?', a: 'Yes, candidates in their final semester can apply provided they submit proof of passing at the interview stage.' }],
    mcqCategory: 'banking'
  },
  {
    id: 13,
    slug: 'sbi-clerk',
    name: 'SBI Clerk',
    shortName: 'SBI Junior Associate',
    category: 'Banking',
    organization: 'State Bank of India',
    qualification: 'Graduate',
    qualificationDetail: 'Graduation in any discipline with local language knowledge.',
    ageLimit: '20 to 28 Years',
    status: 'Upcoming',
    description: 'Junior Associates (Customer Support & Sales) across state circles of State Bank of India.',
    overview: 'State Bank of India Junior Associates manage daily customer operations, loan documentation, deposits, and digital banking promotions.',
    importantDates: [
      { label: 'Notification', value: 'October 2026' },
      { label: 'Prelims Exam', value: 'January 2027' }
    ],
    applicationFee: '₹750 (General/OBC/EWS). Nil for SC/ST/PwBD.',
    vacancies: '8,283 Vacancies (State-wise allocation).',
    salary: 'Basic Pay ₹19,900 (plus 2 advance increments to ₹26,730) + allowances.',
    selectionProcess: ['Phase 1: Preliminary Exam', 'Phase 2: Main Exam', 'Test of specified local language (LPT)'],
    examPattern: [
      { paper: 'Prelims (English, Numerical Ability, Reasoning)', questions: '100 Questions', marks: '100 Marks', duration: '60 Minutes', negative: '0.25 marks' },
      { paper: 'Mains (Financial Awareness, English, Quant, Reasoning)', questions: '190 Questions', marks: '200 Marks', duration: '2 Hours 40 Mins', negative: '0.25 marks' }
    ],
    syllabus: [{ subject: 'General & Financial Awareness', topics: 'Banking products, financial abbreviations, awards, summits, sports, and daily national developments.' }],
    howToApply: ['Apply online at sbi.co.in/careers.'],
    officialWebsite: 'https://sbi.co.in',
    importantLinks: [{ title: 'SBI Careers Portal', url: 'https://sbi.co.in/careers' }],
    faqs: [{ q: 'Is there negative marking in SBI Clerk?', a: 'Yes, 1/4th of the marks assigned to the question are deducted for every incorrect response.' }],
    mcqCategory: 'banking'
  },
  {
    id: 14,
    slug: 'rbi-grade-b',
    name: 'RBI Grade B',
    shortName: 'RBI Grade B Officer',
    category: 'Banking',
    organization: 'Reserve Bank of India',
    qualification: 'Graduate',
    qualificationDetail: 'Minimum 60% marks (50% for SC/ST/PwBD) in Graduation or Post-Graduation.',
    ageLimit: '21 to 30 Years (32 for M.Phil / 34 for Ph.D.)',
    status: 'Upcoming',
    description: 'Direct recruitment of Officers in Grade ‘B’ (General / DEPR / DSIM) in the Central Bank of India.',
    overview: 'Reserve Bank of India Grade B is one of the most prestigious regulatory careers in India, managing monetary policy, financial stability, foreign exchange, and banking supervision.',
    importantDates: [
      { label: 'Notification', value: 'July 2026' },
      { label: 'Phase 1 Exam', value: 'September 2026' },
      { label: 'Phase 2 Exam', value: 'October 2026' }
    ],
    applicationFee: '₹850 for General/OBC/EWS candidates. ₹100 for SC/ST/PwBD.',
    vacancies: '290+ Officers in Grade B.',
    salary: 'Basic Pay ₹55,200/- per month. Gross monthly emoluments approx ₹1,16,000+ with furnished lease accommodations.',
    selectionProcess: ['Phase 1: Online Objective Test (200 Marks)', 'Phase 2: Three Papers (Economic & Social Issues, English Writing, Finance & Management)', 'Phase 3: Interview at RBI Executive Centers (75 Marks)'],
    examPattern: [
      { paper: 'Phase 1: GA, English, Quant, Reasoning', questions: '200 Questions (80 GA)', marks: '200 Marks', duration: '120 Minutes', negative: '0.25 marks' },
      { paper: 'Phase 2: Paper 1 (ESI)', questions: '50% Obj + 50% Desc', marks: '100 Marks', duration: '120 Minutes', negative: 'Standard' },
      { paper: 'Phase 2: Paper 2 (English Writing)', questions: 'Descriptive', marks: '100 Marks', duration: '90 Minutes', negative: 'N/A' },
      { paper: 'Phase 2: Paper 3 (Finance & Management)', questions: '50% Obj + 50% Desc', marks: '100 Marks', duration: '120 Minutes', negative: 'Standard' }
    ],
    syllabus: [{ subject: 'Economic & Social Issues (ESI) and Finance', topics: 'Growth and development, macroeconomic indicators, monetary policy transmission, corporate governance, financial markets, fintech regulations.' }],
    howToApply: ['Apply via the RBI opportunities portal on rbi.org.in.'],
    officialWebsite: 'https://rbi.org.in',
    importantLinks: [{ title: 'RBI Opportunities Portal', url: 'https://opportunities.rbi.org.in' }],
    faqs: [{ q: 'Is there a limit on attempts for General category candidates in RBI Grade B?', a: 'Yes, General category candidates can appear in Phase-I examination a maximum of 6 times.' }],
    mcqCategory: 'banking'
  },
  {
    id: 15,
    slug: 'nda',
    name: 'NDA',
    shortName: 'National Defence Academy',
    category: 'Defence',
    organization: 'Union Public Service Commission',
    qualification: '12th Pass',
    qualificationDetail: 'Passed 10+2. Physics, Chemistry and Mathematics mandatory for Air Force and Naval wings.',
    ageLimit: '16.5 to 19.5 Years (Unmarried male and female candidates)',
    status: 'Application Closed',
    description: 'Entry into the Army, Navy and Air Force wings of the National Defence Academy and Indian Naval Academy Course (INAC).',
    overview: 'The National Defence Academy (NDA) in Khadakwasla, Pune, is the joint services academy for cadet training of the Indian Armed Forces.',
    importantDates: [
      { label: 'NDA I Exam', value: 'April 2026' },
      { label: 'NDA II Exam', value: 'September 2026' }
    ],
    applicationFee: '₹100 (Exempted for SC/ST and Female candidates and sons of JCOs/NCOs/ORs).',
    vacancies: '400+ Cadets per term.',
    salary: 'Stipend ₹56,100 per month during cadet training. Upon commissioning as Lieutenant: Level 10 (₹56,100 – ₹1,77,500) + MSP ₹15,500/month.',
    selectionProcess: ['Written Examination conducted by UPSC (900 Marks)', 'SSB Interview (Service Selection Board - 5 Days, 900 Marks)', 'Medical Board Review'],
    examPattern: [
      { paper: 'Mathematics (Code 01)', questions: '120 Questions', marks: '300 Marks', duration: '2.5 Hours', negative: '0.83 marks' },
      { paper: 'General Ability Test (GAT - Code 02)', questions: '150 Questions (English + GK)', marks: '600 Marks', duration: '2.5 Hours', negative: '1.33 marks' }
    ],
    syllabus: [{ subject: 'GAT Part B: General Knowledge', topics: 'Physics, Chemistry, General Science, Social Studies, Geography, and Current Events.' }],
    howToApply: ['Apply online at upsconline.nic.in.'],
    officialWebsite: 'https://upsc.gov.in',
    importantLinks: [{ title: 'UPSC Portal', url: 'https://upsc.gov.in' }],
    faqs: [{ q: 'Are female candidates eligible for NDA?', a: 'Yes, female candidates are eligible for Army, Navy, and Air Force wings of NDA.' }],
    mcqCategory: 'defence'
  },
  {
    id: 16,
    slug: 'cds',
    name: 'CDS',
    shortName: 'Combined Defence Services',
    category: 'Defence',
    organization: 'Union Public Service Commission',
    qualification: 'Graduate',
    qualificationDetail: 'Graduation in any discipline for IMA/OTA. Engineering Degree for Naval Academy. Degree with Physics & Math or Engineering for AFA.',
    ageLimit: '19 to 24 / 25 Years depending on academy',
    status: 'Upcoming',
    description: 'Officer training in Indian Military Academy (IMA), Indian Naval Academy (INA), Air Force Academy (AFA), and Officers Training Academy (OTA).',
    overview: 'UPSC CDS is the premier competitive gateway for graduates aspiring to receive permanent and short-service commissions as officers in the Indian Armed Forces.',
    importantDates: [
      { label: 'CDS I Exam', value: 'April 2026' },
      { label: 'CDS II Exam', value: 'September 2026' }
    ],
    applicationFee: '₹200 (Female and SC/ST candidates are exempted).',
    vacancies: '450+ Cadet Officers.',
    salary: 'Pay Level 10 (₹56,100 basic + Military Service Pay ₹15,500 + allowances).',
    selectionProcess: ['UPSC Written Examination', 'SSB Interview (Stage 1 Screening & Stage 2 Psychology/GTO/Interview)', 'Medical Examination at Armed Forces Hospital'],
    examPattern: [
      { paper: 'English (IMA/INA/AFA/OTA)', questions: '120 Questions', marks: '100 Marks', duration: '2 Hours', negative: '1/3rd mark' },
      { paper: 'General Knowledge (All)', questions: '120 Questions', marks: '100 Marks', duration: '2 Hours', negative: '1/3rd mark' },
      { paper: 'Elementary Mathematics (Except OTA)', questions: '100 Questions', marks: '100 Marks', duration: '2 Hours', negative: '1/3rd mark' }
    ],
    syllabus: [{ subject: 'General Knowledge', topics: 'History of India, Geography of a nature which candidates should be able to answer without special study, Indian Constitution, scientific achievements, and everyday observations.' }],
    howToApply: ['Submit application online via upsconline.nic.in.'],
    officialWebsite: 'https://upsc.gov.in',
    importantLinks: [{ title: 'UPSC CDS Notification', url: 'https://upsc.gov.in' }],
    faqs: [{ q: 'Is Mathematics required for OTA in CDS?', a: 'No, candidates opting only for OTA appear for English and General Knowledge (200 marks total).' }],
    mcqCategory: 'defence'
  },
  {
    id: 17,
    slug: 'ctet',
    name: 'CTET',
    shortName: 'Central Teacher Eligibility Test',
    category: 'Teaching',
    organization: 'Central Board of Secondary Education',
    qualification: 'Graduate',
    qualificationDetail: 'D.El.Ed / B.Ed / Integrated B.El.Ed with minimum qualifying percentage as per NCTE norms.',
    ageLimit: 'Minimum 18 Years (No upper age limit)',
    status: 'Result',
    description: 'Mandatory national qualifying benchmark for teaching appointments in KVS, NVS, Central Tibetan Schools, and CBSE-affiliated institutions.',
    overview: 'CTET is conducted twice a year by the CBSE to determine the eligibility of persons for appointments as teachers for Class I to VIII.',
    importantDates: [
      { label: 'CTET July Session', value: 'July 2026' },
      { label: 'CTET December Session', value: 'December 2026' }
    ],
    applicationFee: 'Single Paper: ₹1000 (Gen/OBC) / ₹500 (SC/ST/Diff. Abled). Both Papers: ₹1200 / ₹600.',
    vacancies: 'Qualifying Eligibility Certificate (Lifetime Validity).',
    salary: 'PRT: Level 6 (₹35,400 basic). TGT: Level 7 (₹44,900 basic) upon school recruitment.',
    selectionProcess: ['Paper 1 (For Classes I-V Primary)', 'Paper 2 (For Classes VI-VIII Elementary)', 'Minimum 60% (90/150 marks) to receive CTET Certificate'],
    examPattern: [
      { paper: 'Child Development & Pedagogy', questions: '30 Questions', marks: '30 Marks', duration: '150 Minutes (Combined)', negative: 'No negative marking' },
      { paper: 'Language I & Language II', questions: '60 Questions (30 each)', marks: '60 Marks', duration: 'Included above', negative: 'No negative marking' },
      { paper: 'Mathematics & Environmental Studies (or SST for Paper 2)', questions: '60 Questions', marks: '60 Marks', duration: 'Included above', negative: 'No negative marking' }
    ],
    syllabus: [{ subject: 'Environmental Studies & Pedagogy', topics: 'Family & Friends, Food, Shelter, Water, Travel, Things We Make and Do, Pedagogical Issues, Concepts of EVS learning.' }],
    howToApply: ['Apply online at ctet.nic.in during active registration sessions.'],
    officialWebsite: 'https://ctet.nic.in',
    importantLinks: [{ title: 'Official CTET Portal', url: 'https://ctet.nic.in' }],
    faqs: [{ q: 'What is the validity of the CTET Certificate?', a: 'The CTET qualifying certificate has lifetime validity for all categories.' }],
    mcqCategory: 'teaching'
  },
  {
    id: 18,
    slug: 'ugc-net',
    name: 'UGC NET',
    shortName: 'UGC National Eligibility Test',
    category: 'Teaching',
    organization: 'National Testing Agency',
    qualification: 'Post Graduate',
    qualificationDetail: 'Master Degree or equivalent with at least 55% marks (50% for reserved categories).',
    ageLimit: 'JRF: Max 30 Years. Assistant Professor: No upper age limit.',
    status: 'Upcoming',
    description: 'National Eligibility Test for Junior Research Fellowship (JRF) and appointment as Assistant Professor in Indian universities and colleges.',
    overview: 'UGC NET determines eligibility for Assistant Professorship and award of Junior Research Fellowship across 83 subjects in humanities, social sciences, languages, and commerce.',
    importantDates: [
      { label: 'June Cycle', value: 'June 2026' },
      { label: 'December Cycle', value: 'December 2026' }
    ],
    applicationFee: 'General: ₹1150, Gen-EWS/OBC-NCL: ₹600, SC/ST/PwD/Third Gender: ₹325.',
    vacancies: 'Nationwide Fellowships & Assistant Professor Eligibility.',
    salary: 'JRF Fellowship: ₹37,000/month + HRA. Assistant Professor Pay Level 10 (₹57,700 basic in UGC 7th CPC).',
    selectionProcess: ['Computer-Based Test (Paper 1 General + Paper 2 Subject Specific) in a single 3-hour session.'],
    examPattern: [
      { paper: 'Paper 1 (Teaching & Research Aptitude)', questions: '50 Questions', marks: '100 Marks', duration: 'Combined 3 Hours', negative: 'No negative marking' },
      { paper: 'Paper 2 (Specific Subject Domain)', questions: '100 Questions', marks: '200 Marks', duration: 'Combined 3 Hours', negative: 'No negative marking' }
    ],
    syllabus: [{ subject: 'Paper 1: Research, Teaching & Higher Education', topics: 'Teaching Aptitude, Research Aptitude, Comprehension, Communication, Mathematical Reasoning, Information & Communication Technology (ICT), People & Environment, Higher Education System.' }],
    howToApply: ['Submit applications online at ugcnet.nta.ac.in.'],
    officialWebsite: 'https://ugcnet.nta.ac.in',
    importantLinks: [{ title: 'NTA UGC NET Portal', url: 'https://ugcnet.nta.ac.in' }],
    faqs: [{ q: 'Is there any negative marking in UGC NET?', a: 'No, there is no negative marking for incorrect answers in UGC NET.' }],
    mcqCategory: 'teaching'
  },
  {
    id: 19,
    slug: 'opsc-oas',
    name: 'OPSC OAS',
    shortName: 'Odisha Civil Services (OAS)',
    category: 'State Government',
    organization: 'Odisha Public Service Commission',
    qualification: 'Graduate',
    qualificationDetail: 'Bachelor degree in any discipline with ability to read, write and speak Odia (passed Middle School with Odia as language).',
    ageLimit: '21 to 38 Years (Upper age relaxation up to 5 years for SC/ST/SEBC/Women)',
    status: 'Upcoming',
    description: 'Odisha Administrative Service (OAS), Odisha Police Service (OPS), Odisha Revenue Service (ORS) and other state civil cadres.',
    overview: 'The Odisha Civil Services Examination is conducted by the Odisha Public Service Commission for filling prestigious Group A and Group B executive administrative positions in the state.',
    importantDates: [
      { label: 'OCSE Notification', value: 'November 2026' },
      { label: 'Preliminary Examination', value: 'February 2027' }
    ],
    applicationFee: 'Nil (Odisha Government has exempted examination fees for state recruitment examinations).',
    vacancies: '680+ Officers across OAS, OPS, OFS, ORS, OES cadres.',
    salary: 'Group A (Pay Level 12: ₹56,100) and Group B (Pay Level 10: ₹44,900) plus state allowances.',
    selectionProcess: [
      'Preliminary Examination (Paper 1 General Studies + Paper 2 Qualifying CSAT)',
      'Main Written Examination (Descriptive 7 Papers: Essay, Odia, English, GS 1-4)',
      'Personality Test / Viva Voce (250 Marks)'
    ],
    examPattern: [
      { paper: 'Prelims Paper 1 (General Studies)', questions: '100 Questions', marks: '200 Marks', duration: '2 Hours', negative: '1/3rd (0.66 marks)' },
      { paper: 'Prelims Paper 2 (CSAT Qualifying at 33%)', questions: '80 Questions', marks: '200 Marks', duration: '2 Hours', negative: '1/3rd (0.83 marks)' },
      { paper: 'Mains Written Exam', questions: 'Descriptive Papers', marks: '1750 Marks', duration: '5 Days', negative: 'N/A' },
      { paper: 'Personality Test', questions: 'Board Interview', marks: '250 Marks', duration: '30 Mins', negative: 'N/A' }
    ],
    syllabus: [
      { subject: 'Odisha History, Geography & Economy', topics: 'History of Odisha, Kalinga Architecture, Mahanadi river system, mineral reserves of Odisha, climate, tribes of Odisha, Panchayati Raj institutions.' },
      { subject: 'National General Studies', topics: 'Indian Constitution, federal structure, modern Indian history, biodiversity, scientific developments.' }
    ],
    howToApply: ['Register and apply online on opsc.gov.in using the state candidates registration system.'],
    officialWebsite: 'https://opsc.gov.in',
    importantLinks: [{ title: 'OPSC Official Website', url: 'https://opsc.gov.in' }],
    faqs: [{ q: 'Is Odia language test mandatory in OPSC OAS?', a: 'Yes, candidates must have passed Middle English School with Odia as a subject, or matriculation with Odia language.' }],
    mcqCategory: 'state-government'
  },
  {
    id: 20,
    slug: 'ossc-cgl',
    name: 'OSSC CGL',
    shortName: 'Odisha SSC CGL',
    category: 'State Government',
    organization: 'Odisha Staff Selection Commission',
    qualification: 'Graduate',
    qualificationDetail: 'Bachelor degree in any discipline and knowledge of computer applications.',
    ageLimit: '21 to 38 Years (Age relaxation applicable)',
    status: 'Admit Card',
    description: 'Combined Graduate Level recruitment for Auditor, Inspector of Supplies, Junior Fisheries Technical Assistant, and Assistant Commercial Tax Officers.',
    overview: 'OSSC CGL selects qualified graduates for Group B and Group C non-gazetted positions across diverse state departments and directorates in Odisha.',
    importantDates: [
      { label: 'Notification', value: 'May 2026' },
      { label: 'Preliminary Exam', value: 'October 2026' },
      { label: 'Main Written Exam', value: 'December 2026' }
    ],
    applicationFee: 'Nil (Exempted for all candidates as per Odisha state policy).',
    vacancies: '595+ Group B & C Vacancies.',
    salary: 'Pay Level 9 (₹35,400) / Level 8 (₹32,000) under ORSP Rules 2017.',
    selectionProcess: ['Stage 1: Preliminary Examination (MCQ CBT / OMR)', 'Stage 2: Main Written Examination', 'Stage 3: Computer Skill Test & Certificate Verification'],
    examPattern: [
      { paper: 'Prelims (Arithmetic, Reasoning, Current Events, Computer)', questions: '150 Questions', marks: '150 Marks', duration: '150 Minutes', negative: '0.25 marks' },
      { paper: 'Mains Paper 1: Odia & English Language', questions: 'Descriptive/MCQ', marks: '100 Marks', duration: '2.5 Hours', negative: 'As per scheme' },
      { paper: 'Mains Paper 2: General Studies', questions: 'Objective', marks: '100 Marks', duration: '2.5 Hours', negative: '0.25 marks' }
    ],
    syllabus: [{ subject: 'General Awareness & Arithmetic', topics: 'Arithmetic of 10th standard, data interpretation, Odisha and national current events, modern history, computer fundamentals.' }],
    howToApply: ['Submit applications online via ossc.gov.in.'],
    officialWebsite: 'https://ossc.gov.in',
    importantLinks: [{ title: 'OSSC Portal', url: 'https://ossc.gov.in' }],
    faqs: [{ q: 'Is there any application fee for OSSC CGL?', a: 'No, all Odisha government job applications are completely free for all categories of candidates.' }],
    mcqCategory: 'state-government'
  },
  {
    id: 21,
    slug: 'osssc-recruitment',
    name: 'OSSSC Recruitment',
    shortName: 'Odisha SSSC CRE (RI, ARI, Amin)',
    category: 'State Government',
    organization: 'Odisha Sub-ordinate Staff Selection Commission',
    qualification: '12th Pass',
    qualificationDetail: 'Higher Secondary (10+2) or equivalent for ARI/Amin; Bachelor degree for Revenue Inspector (RI).',
    ageLimit: '21 to 38 Years',
    status: 'Application Open',
    description: 'Combined Recruitment Examination for Revenue Inspector (RI), Assistant Revenue Inspector (ARI), Amin, and ICDS Supervisor.',
    overview: 'OSSSC CRE conducts recruitment for vital grassroots revenue administration, survey, and district administration roles across Odisha.',
    importantDates: [
      { label: 'Notification Window', value: 'August 2026' },
      { label: 'Preliminary Examination', value: 'November 2026' }
    ],
    applicationFee: 'Nil (Free for all Odisha candidates).',
    vacancies: '2,895+ Revenue & Field Posts.',
    salary: 'Pay Level 9 (RI ₹35,400) and Pay Level 3/4 (ARI/Amin ₹19,900 – ₹21,700).',
    selectionProcess: ['Preliminary Examination (MCQ OMR/CBT)', 'Main Written Examination (MCQ)', 'Practical Skill Test in Basic Computer Skills'],
    examPattern: [
      { paper: 'Prelims: Maths, Reasoning, English, Odia, GK', questions: '100 Questions', marks: '100 Marks', duration: '1.5 Hours', negative: '0.33 marks' },
      { paper: 'Mains: Mathematics, GK, English, Odia, Computer', questions: '180 Questions', marks: '180 Marks', duration: '3 Hours', negative: '0.33 marks' }
    ],
    syllabus: [{ subject: 'General Knowledge & Odia Language', topics: 'Geography of Odisha, historical places, Odisha temples, river projects, Odia grammar, vocabulary, translation.' }],
    howToApply: ['Apply on osssc.gov.in using OTR registration.'],
    officialWebsite: 'https://osssc.gov.in',
    importantLinks: [{ title: 'OSSSC Portal', url: 'https://osssc.gov.in' }],
    faqs: [{ q: 'What posts are included under OSSSC CRE?', a: 'Revenue Inspector (RI), Assistant Revenue Inspector (ARI), Amin, Statistical Field Surveyor, and ICDS Supervisor.' }],
    mcqCategory: 'state-government'
  }
];

// Helper methods for easy querying
const ExamStore = {
  getAllExams: () => examsData,
  getExamBySlug: (slug) => examsData.find(e => e.slug.toLowerCase() === slug.toLowerCase()),
  getExamsByCategory: (category) => {
    if (!category || category === 'All Exams') return examsData;
    return examsData.filter(e => e.category.toLowerCase() === category.toLowerCase());
  },
  getCategories: () => examCategoriesData,
  getStats: () => examStatsData,
  getUpdates: () => examUpdatesData,
  getQuickLinks: () => quickLinksData
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    examStatsData,
    examCategoriesData,
    quickLinksData,
    examUpdatesData,
    examsData,
    ExamStore
  };
}
