/**
 * GK India Academy - Admin Central Data Store
 * Provides persistent local state, rich initial datasets, full CRUD operations,
 * Draft/Publish toggling, filtering, search helpers, and stats.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AdminStore = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STORAGE_KEYS = {
    TOPICS: 'GK_ADMIN_DATA_TOPICS_V1',
    QUESTIONS: 'GK_ADMIN_DATA_QUESTIONS_V1',
    AFFAIRS: 'GK_ADMIN_DATA_AFFAIRS_V1',
    EXAMS: 'GK_ADMIN_DATA_EXAMS_V1',
    MATERIALS: 'GK_ADMIN_DATA_MATERIALS_V1',
    MESSAGES: 'GK_ADMIN_DATA_MESSAGES_V1'
  };

  const listeners = [];

  function subscribe(fn) {
    if (typeof fn === 'function') {
      listeners.push(fn);
    }
    return function unsubscribe() {
      const idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }

  function emitChange(event, payload) {
    listeners.forEach(fn => {
      try { fn(event, payload); } catch (e) { console.error('AdminStore listener error:', e); }
    });
  }

  // --- Seed Data Generators ---
  function getSeedTopics() {
    return [
      {
        id: 'top-1',
        title: 'Indus Valley Civilization & Ancient Cities',
        slug: 'indus-valley-civilization',
        subject: 'Indian History',
        description: 'Urban planning, Harappan seals, trade routes, Great Bath, and town planning architecture for UPSC & SSC.',
        questionsCount: 45,
        status: 'published',
        createdAt: '2026-01-12'
      },
      {
        id: 'top-2',
        title: 'Fundamental Rights & Constitutional Remedies (Art 12-35)',
        slug: 'fundamental-rights-remedies',
        subject: 'Indian Polity',
        description: 'Six core freedoms, writ jurisdiction (Habeas Corpus, Mandamus, Quo-Warranto), and basic structure doctrine.',
        questionsCount: 62,
        status: 'published',
        createdAt: '2026-01-18'
      },
      {
        id: 'top-3',
        title: 'Indian River Systems & Himalayan Drainage',
        slug: 'indian-river-systems-himalayas',
        subject: 'Indian Geography',
        description: 'Indus, Ganga, and Brahmaputra drainage networks, tributaries, river projects, and major dams.',
        questionsCount: 38,
        status: 'published',
        createdAt: '2026-01-25'
      },
      {
        id: 'top-4',
        title: 'Reserve Bank of India: Monetary Policy & Inflation Targets',
        slug: 'rbi-monetary-policy-inflation',
        subject: 'Indian Economy',
        description: 'Repo rate, reverse repo, CRR, SLR, MPC framework, CPI/WPI metrics and economic indicators.',
        questionsCount: 29,
        status: 'published',
        createdAt: '2026-02-05'
      },
      {
        id: 'top-5',
        title: 'India Space Missions: Gaganyaan, Chandrayaan & Aditya-L1',
        slug: 'isro-space-missions-milestones',
        subject: 'General Science',
        description: 'ISRO achievements, cryogenic engines, LVM3 launch vehicles, space probes, and future solar astronomy.',
        questionsCount: 34,
        status: 'published',
        createdAt: '2026-02-14'
      },
      {
        id: 'top-6',
        title: 'Modern Indian History: 1857 Revolt to Independence 1947',
        slug: 'modern-indian-freedom-struggle',
        subject: 'Indian History',
        description: 'Chronology of freedom movements, Quit India, Non-Cooperation, Round Table Conferences, and Subhash Chandra Bose.',
        questionsCount: 54,
        status: 'published',
        createdAt: '2026-02-22'
      },
      {
        id: 'top-7',
        title: 'Biodiversity Hotspots & Biosphere Reserves of India',
        slug: 'biodiversity-hotspots-biospheres',
        subject: 'Environment & Ecology',
        description: 'Western Ghats, Indo-Burma, Eastern Himalayas, endemic species, Wildlife Protection Act, and Ramsar sites.',
        questionsCount: 22,
        status: 'draft',
        createdAt: '2026-03-02'
      },
      {
        id: 'top-8',
        title: 'UNESCO World Heritage Sites & Classical Dances of India',
        slug: 'unesco-heritage-classical-dances',
        subject: 'Art & Culture',
        description: '8 Sangeet Natak Akademi classical dances, temple architecture (Nagara, Dravida, Vesara), and GI tags.',
        questionsCount: 18,
        status: 'draft',
        createdAt: '2026-03-10'
      }
    ];
  }

  function getSeedQuestions() {
    return [
      {
        id: 'q-1',
        question: 'Which Article of the Indian Constitution is described by Dr. B.R. Ambedkar as the "Heart and Soul of the Constitution"?',
        topicId: 'top-2',
        subject: 'Indian Polity',
        options: ['Article 19', 'Article 21', 'Article 32', 'Article 44'],
        correctIndex: 2,
        explanation: 'Article 32 guarantees the Right to Constitutional Remedies, empowering individuals to move the Supreme Court directly via writs for the enforcement of fundamental rights.',
        difficulty: 'Easy',
        status: 'published',
        createdAt: '2026-01-15'
      },
      {
        id: 'q-2',
        question: 'Which of the following Indus Valley sites is famous for an ancient dockyard connected to the Sabarmati river basin?',
        topicId: 'top-1',
        subject: 'Indian History',
        options: ['Kalibangan', 'Lothal', 'Mohenjo-daro', 'Banawali'],
        correctIndex: 1,
        explanation: 'Lothal in Gujarat was a prominent port city of the Harappan civilization with a massive tidal dockyard facilitating maritime trade across the Arabian Sea.',
        difficulty: 'Easy',
        status: 'published',
        createdAt: '2026-01-16'
      },
      {
        id: 'q-3',
        question: 'The Majuli Island, recognized as the world\'s largest river island, is located on which river?',
        topicId: 'top-3',
        subject: 'Indian Geography',
        options: ['Ganga', 'Godavari', 'Brahmaputra', 'Narmada'],
        correctIndex: 2,
        explanation: 'Majuli is a picturesque river island situated on the Brahmaputra River in Assam, known as the cultural capital of Assamese Vaishnavite heritage.',
        difficulty: 'Medium',
        status: 'published',
        createdAt: '2026-01-28'
      },
      {
        id: 'q-4',
        question: 'In India, the Monetary Policy Committee (MPC) consists of how many members, and who acts as its ex-officio Chairperson?',
        topicId: 'top-4',
        subject: 'Indian Economy',
        options: [
          '5 members, Union Finance Minister',
          '6 members, Governor of RBI',
          '7 members, Chief Economic Advisor',
          '6 members, Secretary of Department of Economic Affairs'
        ],
        correctIndex: 1,
        explanation: 'The Monetary Policy Committee has 6 members (3 from RBI and 3 appointed by Central Government). The Governor of the Reserve Bank of India serves as its ex-officio Chairperson.',
        difficulty: 'Hard',
        status: 'published',
        createdAt: '2026-02-08'
      },
      {
        id: 'q-5',
        question: 'Which heavy-lift launch vehicle was configured by ISRO for launching the Gaganyaan crew module into low earth orbit?',
        topicId: 'top-5',
        subject: 'General Science',
        options: ['PSLV-C56', 'GSLV Mk II', 'LVM3 (GSLV Mk III)', 'SSLV-D2'],
        correctIndex: 2,
        explanation: 'The Launch Vehicle Mark-3 (LVM3), human-rated as HLVM3, is selected for India’s crewed Gaganyaan missions due to its robust safety and heavy lift capacity.',
        difficulty: 'Medium',
        status: 'published',
        createdAt: '2026-02-18'
      },
      {
        id: 'q-6',
        question: 'Who founded the "Forward Bloc" inside the Indian National Congress in 1939 after resigning as Congress President?',
        topicId: 'top-6',
        subject: 'Indian History',
        options: ['Subhash Chandra Bose', 'Bhagat Singh', 'Jawaharlal Nehru', 'C. Rajagopalachari'],
        correctIndex: 0,
        explanation: 'Netaji Subhash Chandra Bose formed the All India Forward Bloc in 1939 to rally left-wing elements within Congress and intensify the anti-imperialist struggle.',
        difficulty: 'Medium',
        status: 'published',
        createdAt: '2026-02-25'
      },
      {
        id: 'q-7',
        question: 'Which of the following is NOT one of the recognized biodiversity hotspots in India?',
        topicId: 'top-7',
        subject: 'Environment & Ecology',
        options: ['Western Ghats', 'Himalayas', 'Sundaland (Nicobar Islands)', 'Thar Desert Basin'],
        correctIndex: 3,
        explanation: 'The 4 biodiversity hotspots in India are the Himalayas, Indo-Burma, Western Ghats & Sri Lanka, and Sundaland (Nicobar islands). The Thar desert is not a recognized global biodiversity hotspot.',
        difficulty: 'Medium',
        status: 'draft',
        createdAt: '2026-03-05'
      },
      {
        id: 'q-8',
        question: 'Sattriya dance, an official classical dance tradition of India, originated in which Indian state?',
        topicId: 'top-8',
        subject: 'Art & Culture',
        options: ['Manipur', 'Odisha', 'Assam', 'Kerala'],
        correctIndex: 2,
        explanation: 'Sattriya originated in 15th-century Assam under the Bhakti saint Mahapurusha Srimanta Sankaradeva within monastic institutions known as Satras.',
        difficulty: 'Hard',
        status: 'draft',
        createdAt: '2026-03-12'
      }
    ];
  }

  function getSeedAffairs() {
    return [
      {
        id: 'ca-1',
        title: 'India Inaugurates Strategic 2026 Deep-Sea Port Terminal on Western Coast',
        category: 'Economy & Infrastructure',
        date: '2026-03-22',
        summary: 'State-of-the-art automated terminal commissioned to boost trade corridors and cut logistics turnaround times by 35%.',
        content: 'The mega maritime hub integrates dedicated green rail freight corridors, automated container gantries, and 100% renewable shoreside electric power. It forms a key node in the India-Middle East-Europe Economic Corridor (IMEC).',
        tags: ['Infrastructure', 'Maritime', 'Trade', 'IMEC'],
        status: 'published',
        createdAt: '2026-03-22'
      },
      {
        id: 'ca-2',
        title: 'ISRO & NASA NISAR Satellite Mission Enters Final Orbital Operations Phase',
        category: 'Science & Technology',
        date: '2026-03-18',
        summary: 'Joint synthetic aperture radar satellite systematically tracks earth surface deformations, glaciers, and forest biomass.',
        content: 'Equipped with dual-frequency L-band and S-band radar systems, NISAR delivers high-resolution millimeter-level earth observation data globally every 12 days to predict natural hazards and climate variations.',
        tags: ['ISRO', 'NASA', 'NISAR', 'Earth Observation'],
        status: 'published',
        createdAt: '2026-03-18'
      },
      {
        id: 'ca-3',
        title: 'National Green Hydrogen Mission Crosses Milestone 1.2 MMT Production Capacity',
        category: 'Environment & Energy',
        date: '2026-03-14',
        summary: 'Ministry of New & Renewable Energy awards electrolyser incentive packages to establish green ammonia export hubs.',
        content: 'India accelerates toward its target of 5 Million Metric Tonnes (MMT) per annum green hydrogen by 2030, reducing carbon emissions and reliance on fossil fuel imports.',
        tags: ['Renewable Energy', 'Hydrogen', 'Net Zero', 'Economy'],
        status: 'published',
        createdAt: '2026-03-14'
      },
      {
        id: 'ca-4',
        title: 'India Wins 12 Medals at World Shooting Championship 2026 in Munich',
        category: 'Sports & Awards',
        date: '2026-03-09',
        summary: 'Indian marksmen and markswomen clinch 5 Gold, 4 Silver, and 3 Bronze medals in 10m Air Rifle and Pistol events.',
        content: 'The contingent topped the medal table in junior categories and secured additional Olympic quota slots for the upcoming quadrennial games.',
        tags: ['Sports', 'Shooting', 'Championship', 'Medals'],
        status: 'published',
        createdAt: '2026-03-09'
      },
      {
        id: 'ca-5',
        title: 'Defence Ministry Inks Contract for 4th Generation Indigenous Fighter Jet Radars',
        category: 'Defense & Security',
        date: '2026-02-28',
        summary: 'Uttam AESA Radar systems to be manufactured domestically under Make-in-India for Tejas Mk-1A and Mk-2 aircraft.',
        content: 'Developed by LRDE (DRDO), the Uttam Active Electronically Scanned Array radar delivers electronic warfare counter-measures, multi-target tracking, and superior dogfight situational awareness.',
        tags: ['Defence', 'DRDO', 'Tejas', 'AESA Radar'],
        status: 'draft',
        createdAt: '2026-02-28'
      }
    ];
  }

  function getSeedExams() {
    return [
      {
        id: 'ex-1',
        title: 'UPSC Civil Services Examination (CSE) 2026',
        agency: 'UPSC',
        category: 'UPSC',
        eligibility: 'Bachelor\'s Degree in any discipline from a recognized University. Age: 21-32 years (Relaxations as per rules).',
        totalVacancies: '1,056+ Posts',
        examDates: 'Prelims: May 24, 2026 | Mains: Sept 18-27, 2026',
        stages: 'Stage 1: Preliminary Exam (GS 1 + CSAT) → Stage 2: Main Written Exam (9 Papers) → Stage 3: Personality Test (Interview)',
        syllabusSummary: 'Comprehensive Indian Polity, Modern & Ancient History, Geography, Economy, Ecology, Ethics, Governance and Optional Subject.',
        notificationUrl: 'https://upsc.gov.in',
        status: 'published',
        createdAt: '2026-01-10'
      },
      {
        id: 'ex-2',
        title: 'SSC Combined Graduate Level (CGL) Examination 2026',
        agency: 'Staff Selection Commission (SSC)',
        category: 'SSC',
        eligibility: 'Bachelor\'s Degree from a recognized University. Age: 18-32 years depending on post code.',
        totalVacancies: '14,500+ Posts',
        examDates: 'Tier-1: July 2026 | Tier-2: October 2026',
        stages: 'Tier-1: Computer Based Test (Reasoning, GK, Math, English) → Tier-2: Paper I (Math, Reasoning, English, GS, Computer, Typing)',
        syllabusSummary: 'General Intelligence, Quantitative Aptitude, General Awareness (Current Affairs, Science, History), English Comprehension.',
        notificationUrl: 'https://ssc.gov.in',
        status: 'published',
        createdAt: '2026-01-20'
      },
      {
        id: 'ex-3',
        title: 'RRB Non-Technical Popular Categories (NTPC) 2026',
        agency: 'Railway Recruitment Boards (RRB)',
        category: 'Railway',
        eligibility: '12th Pass / Graduate depending on level (Level 2 to Level 6). Age: 18-33 years.',
        totalVacancies: '11,558 Posts',
        examDates: 'CBT-1: August-September 2026 | CBT-2: November 2026',
        stages: '1st Stage CBT → 2nd Stage CBT → Typing Skill Test / CBAT (as applicable) → Document Verification & Medical',
        syllabusSummary: 'General Awareness (40 marks), Mathematics (30 marks), General Intelligence & Reasoning (30 marks).',
        notificationUrl: 'https://indianrailways.gov.in',
        status: 'published',
        createdAt: '2026-02-01'
      },
      {
        id: 'ex-4',
        title: 'IBPS Probationary Officer (PO / MT) XIV 2026',
        agency: 'Institute of Banking Personnel Selection',
        category: 'Banking',
        eligibility: 'Graduation in any discipline. Age: 20-30 years.',
        totalVacancies: '4,450+ Posts',
        examDates: 'Prelims: October 2026 | Mains: November 2026',
        stages: 'Preliminary Exam (Online) → Main Exam (Online Objective + Descriptive) → Common Interview',
        syllabusSummary: 'Banking Awareness, Financial GK, Reasoning Ability, Quantitative Aptitude, English Language & Descriptive Essay.',
        notificationUrl: 'https://ibps.in',
        status: 'published',
        createdAt: '2026-02-15'
      },
      {
        id: 'ex-5',
        title: 'NDA & NA Examination (I) 2026',
        agency: 'UPSC / Ministry of Defence',
        category: 'Defence',
        eligibility: '12th Class pass (Physics & Math for Air Force / Navy). Unmarried male/female candidates.',
        totalVacancies: '400 Posts',
        examDates: 'Written Exam: April 2026 | SSB Interviews: July-Sept 2026',
        stages: 'Written Examination (Math 300 marks + GAT 600 marks) → 5-Day SSB Interview & Medical Testing',
        syllabusSummary: 'Mathematics (Calculus, Trigonometry, Matrices) and General Ability Test (English, Physics, Chemistry, GS, Current Affairs).',
        notificationUrl: 'https://upsc.gov.in',
        status: 'draft',
        createdAt: '2026-02-20'
      }
    ];
  }

  function getSeedMaterials() {
    return [
      {
        id: 'sm-1',
        title: 'Indian Polity 395 Articles & Constitutional Amendments Pocket Guide',
        subject: 'Indian Polity',
        fileType: 'PDF Document',
        fileSize: '4.8 MB',
        pages: '64 Pages',
        downloadUrl: '#',
        description: 'Complete high-yield table of Fundamental Rights, Directive Principles, Parliamentary committees, and 106 Constitutional Amendments.',
        status: 'published',
        createdAt: '2026-01-20'
      },
      {
        id: 'sm-2',
        title: 'Indian Rivers, Tributaries & Major Multipurpose Dams Map Chart',
        subject: 'Indian Geography',
        fileType: 'Formula / Map Sheet',
        fileSize: '6.2 MB',
        pages: '18 Pages',
        downloadUrl: '#',
        description: 'Color-coded drainage basin charts, river origins, left/right bank tributaries, waterfalls, and national waterways.',
        status: 'published',
        createdAt: '2026-02-04'
      },
      {
        id: 'sm-3',
        title: 'Modern Indian History Timeline (1757 Battle of Plassey to 1947 Independence)',
        subject: 'Indian History',
        fileType: 'Quick Revision Notes',
        fileSize: '3.5 MB',
        pages: '42 Pages',
        downloadUrl: '#',
        description: 'Chronological summary of British Viceroy acts, Indian National Congress sessions, tribal & peasant revolts, and revolutionary movements.',
        status: 'published',
        createdAt: '2026-02-16'
      },
      {
        id: 'sm-4',
        title: 'Government Exam Quantitative Formulas & Mental Math Tricks Handbook',
        subject: 'Exam Preparation',
        fileType: 'Formula / Map Sheet',
        fileSize: '2.9 MB',
        pages: '36 Pages',
        downloadUrl: '#',
        description: 'Shortcut tricks for Percentage, Ratio, Speed-Time-Distance, Work-Time, Permutations, and Data Interpretation.',
        status: 'published',
        createdAt: '2026-02-28'
      },
      {
        id: 'sm-5',
        title: '2025-2026 Current Affairs Annual Digest: National & Global Milestones',
        subject: 'Current Affairs',
        fileType: 'PDF Document',
        fileSize: '8.4 MB',
        pages: '110 Pages',
        downloadUrl: '#',
        description: 'Curated monthly roundups covering Science, Economy, Summits, Government Schemes, Sports, and Military Exercises.',
        status: 'draft',
        createdAt: '2026-03-10'
      }
    ];
  }

  function getSeedMessages() {
    return [
      {
        id: 'msg-1',
        name: 'Saurabh Pandey',
        email: 'saurabh.pandey98@gmail.com',
        subject: 'Question on UPSC CSE Prelims 2026 Mock Test Schedule',
        message: 'Dear GK India Academy Team, I have been using your subject MCQs daily. Will you be organizing a full-length All-India Mock Test Series before May 2026? Also, can we download PDF answer keys with detailed explanations?',
        date: '2026-03-25T11:24:00',
        status: 'unread',
        replyNote: ''
      },
      {
        id: 'msg-2',
        name: 'Priyanka Ghosh',
        email: 'priyanka.ghosh.wb@outlook.com',
        subject: 'Request for West Bengal WBCS & SSC CGL Bilingual Quizzes',
        message: 'Hello sir/ma\'am, thank you for the wonderful free content on Indian Polity. Could you please also add questions specific to State PSC and provide Hindi/Bengali bilingual translations if possible? Keep up the great work!',
        date: '2026-03-24T16:45:00',
        status: 'unread',
        replyNote: ''
      },
      {
        id: 'msg-3',
        name: 'Devendra Meena',
        email: 'devendra.meena.rail@yahoo.com',
        subject: 'RRB NTPC Practice Sets & General Science Doubts',
        message: 'I have a query on Question #42 in the Indian Geography section regarding the Western Ghats passes. Is Thal Ghat between Mumbai and Nashik? Please verify.',
        date: '2026-03-22T09:15:00',
        status: 'read',
        replyNote: 'Verified question accuracy and sent confirmation email on March 22.'
      },
      {
        id: 'msg-4',
        name: 'Ananya Deshmukh',
        email: 'ananya.d@gmail.com',
        subject: 'Correction submitted for Article 32 writ jurisdiction',
        message: 'Thank you for updating the explanation in the Polity section! The explanation on Habeas Corpus and Quo-Warranto is now crystal clear.',
        date: '2026-03-19T14:30:00',
        status: 'replied',
        replyNote: 'Thanked candidate for active contribution to student community.'
      }
    ];
  }

  // --- Load / Save from LocalStorage with fallback to seed data ---
  function loadCollection(key, seedFn) {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading from localStorage for key:', key, e);
    }
    const defaults = seedFn();
    saveCollection(key, defaults);
    return defaults;
  }

  function saveCollection(key, items) {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (e) {
      console.error('Error writing to localStorage for key:', key, e);
    }
  }

  // --- Collection Accessors ---
  function getTopics() {
    return loadCollection(STORAGE_KEYS.TOPICS, getSeedTopics);
  }

  function getQuestions() {
    return loadCollection(STORAGE_KEYS.QUESTIONS, getSeedQuestions);
  }

  function getCurrentAffairs() {
    return loadCollection(STORAGE_KEYS.AFFAIRS, getSeedAffairs);
  }

  function getExams() {
    return loadCollection(STORAGE_KEYS.EXAMS, getSeedExams);
  }

  function getStudyMaterials() {
    return loadCollection(STORAGE_KEYS.MATERIALS, getSeedMaterials);
  }

  function getContactMessages() {
    return loadCollection(STORAGE_KEYS.MESSAGES, getSeedMessages);
  }

  // --- Generic Helpers ---
  function getCollectionKey(name) {
    switch (name) {
      case 'topics': return STORAGE_KEYS.TOPICS;
      case 'questions': return STORAGE_KEYS.QUESTIONS;
      case 'currentAffairs':
      case 'affairs': return STORAGE_KEYS.AFFAIRS;
      case 'exams': return STORAGE_KEYS.EXAMS;
      case 'studyMaterials':
      case 'materials': return STORAGE_KEYS.MATERIALS;
      case 'messages':
      case 'contactMessages': return STORAGE_KEYS.MESSAGES;
      default: return null;
    }
  }

  function getCollectionGetter(name) {
    switch (name) {
      case 'topics': return getTopics;
      case 'questions': return getQuestions;
      case 'currentAffairs':
      case 'affairs': return getCurrentAffairs;
      case 'exams': return getExams;
      case 'studyMaterials':
      case 'materials': return getStudyMaterials;
      case 'messages':
      case 'contactMessages': return getContactMessages;
      default: return null;
    }
  }

  // --- CRUD Operations ---

  // 1. ADD
  function add(collectionName, item) {
    const key = getCollectionKey(collectionName);
    const getter = getCollectionGetter(collectionName);
    if (!key || !getter) throw new Error('Unknown collection: ' + collectionName);

    const items = getter();
    const prefix = collectionName.slice(0, 3).toLowerCase();
    const newItem = {
      ...item,
      id: item.id || `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: item.createdAt || new Date().toISOString().split('T')[0]
    };

    items.unshift(newItem);
    saveCollection(key, items);
    emitChange('add', { collection: collectionName, item: newItem });
    return newItem;
  }

  // 2. UPDATE
  function update(collectionName, id, updates) {
    const key = getCollectionKey(collectionName);
    const getter = getCollectionGetter(collectionName);
    if (!key || !getter) throw new Error('Unknown collection: ' + collectionName);

    const items = getter();
    const index = items.findIndex(it => it.id === id);
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    saveCollection(key, items);
    emitChange('update', { collection: collectionName, item: items[index] });
    return items[index];
  }

  // 3. DELETE
  function remove(collectionName, id) {
    const key = getCollectionKey(collectionName);
    const getter = getCollectionGetter(collectionName);
    if (!key || !getter) throw new Error('Unknown collection: ' + collectionName);

    const items = getter();
    const index = items.findIndex(it => it.id === id);
    if (index === -1) return false;

    const removed = items.splice(index, 1)[0];
    saveCollection(key, items);
    emitChange('delete', { collection: collectionName, id, removed });
    return true;
  }

  // 4. TOGGLE DRAFT / PUBLISH
  function togglePublish(collectionName, id) {
    const key = getCollectionKey(collectionName);
    const getter = getCollectionGetter(collectionName);
    if (!key || !getter) throw new Error('Unknown collection: ' + collectionName);

    const items = getter();
    const item = items.find(it => it.id === id);
    if (!item) return null;

    item.status = item.status === 'published' ? 'draft' : 'published';
    item.updatedAt = new Date().toISOString();

    saveCollection(key, items);
    emitChange('togglePublish', { collection: collectionName, item });
    return item;
  }

  // 5. CONTACT MESSAGES ACTIONS
  function markMessageStatus(id, newStatus, replyNote) {
    const messages = getContactMessages();
    const msg = messages.find(m => m.id === id);
    if (!msg) return null;

    msg.status = newStatus;
    if (replyNote !== undefined) {
      msg.replyNote = replyNote;
    }
    msg.updatedAt = new Date().toISOString();

    saveCollection(STORAGE_KEYS.MESSAGES, messages);
    emitChange('updateMessageStatus', { message: msg });
    return msg;
  }

  function addContactMessage(messageData) {
    return add('messages', {
      name: messageData.name || 'Anonymous Aspirant',
      email: messageData.email || '',
      subject: messageData.subject || 'General Inquiry',
      message: messageData.message || '',
      date: new Date().toISOString(),
      status: 'unread',
      replyNote: ''
    });
  }

  // 6. METRICS & KPI AGGREGATOR
  function getStats() {
    const topics = getTopics();
    const questions = getQuestions();
    const affairs = getCurrentAffairs();
    const exams = getExams();
    const materials = getStudyMaterials();
    const messages = getContactMessages();

    return {
      topics: {
        total: topics.length,
        published: topics.filter(t => t.status === 'published').length,
        draft: topics.filter(t => t.status === 'draft').length
      },
      questions: {
        total: questions.length,
        published: questions.filter(q => q.status === 'published').length,
        draft: questions.filter(q => q.status === 'draft').length,
        easy: questions.filter(q => q.difficulty === 'Easy').length,
        medium: questions.filter(q => q.difficulty === 'Medium').length,
        hard: questions.filter(q => q.difficulty === 'Hard').length
      },
      affairs: {
        total: affairs.length,
        published: affairs.filter(a => a.status === 'published').length,
        draft: affairs.filter(a => a.status === 'draft').length
      },
      exams: {
        total: exams.length,
        published: exams.filter(e => e.status === 'published').length,
        draft: exams.filter(e => e.status === 'draft').length
      },
      materials: {
        total: materials.length,
        published: materials.filter(m => m.status === 'published').length,
        draft: materials.filter(m => m.status === 'draft').length
      },
      messages: {
        total: messages.length,
        unread: messages.filter(m => m.status === 'unread').length,
        read: messages.filter(m => m.status === 'read').length,
        replied: messages.filter(m => m.status === 'replied').length
      }
    };
  }

  // 7. RESTORE DEFAULT INITIAL DATA
  function resetAllData() {
    saveCollection(STORAGE_KEYS.TOPICS, getSeedTopics());
    saveCollection(STORAGE_KEYS.QUESTIONS, getSeedQuestions());
    saveCollection(STORAGE_KEYS.AFFAIRS, getSeedAffairs());
    saveCollection(STORAGE_KEYS.EXAMS, getSeedExams());
    saveCollection(STORAGE_KEYS.MATERIALS, getSeedMaterials());
    saveCollection(STORAGE_KEYS.MESSAGES, getSeedMessages());
    emitChange('reset', {});
    return true;
  }

  return {
    // Queries
    getTopics,
    getQuestions,
    getCurrentAffairs,
    getExams,
    getStudyMaterials,
    getContactMessages,
    getStats,

    // CRUD
    add,
    update,
    remove,
    togglePublish,

    // Messages
    markMessageStatus,
    addContactMessage,

    // System
    resetAllData,
    subscribe
  };
});
