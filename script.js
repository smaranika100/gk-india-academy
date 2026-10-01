/**
 * GK INDIA ACADEMY — Main Interactive JavaScript
 * Modular, Accessible, and Production-Ready
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initHeaderAndNavigation();
  initDynamicCounters();
  initCurrentAffairs();
  initMcqEngine();
  initSpeedQuiz();
  initStudentPortal();
  initSearchModal();
  initUniversalModal();
  initBackToTop();
  initCookieConsent();
});

/* ==========================================================================
   1. HEADER, STICKY EFFECT & MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initHeaderAndNavigation() {
  const header = document.getElementById('siteHeader');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    highlightActiveNavLink();
  }, { passive: true });

  // Open / Close Drawer
  function openDrawer() {
    mobileDrawer.classList.add('active');
    drawerOverlay.classList.add('active');
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // ── GK Dropdown (Desktop) ──────────────────────────────────────────────────
  const gkNavItem   = document.getElementById('gkNavDropdown');
  const gkDropBtn   = document.getElementById('gkDropdownBtn');

  if (gkNavItem && gkDropBtn) {
    // Toggle on click
    gkDropBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = gkNavItem.classList.toggle('open');
      gkDropBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!gkNavItem.contains(e.target)) {
        gkNavItem.classList.remove('open');
        gkDropBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        gkNavItem.classList.remove('open');
        gkDropBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── GK Accordion (Mobile Drawer) ──────────────────────────────────────────
  const drawerGkToggle   = document.getElementById('drawerGkToggle');
  const drawerGkSubjects = document.getElementById('drawerGkSubjects');

  if (drawerGkToggle && drawerGkSubjects) {
    drawerGkToggle.addEventListener('click', () => {
      const isOpen = drawerGkToggle.classList.toggle('open');
      drawerGkSubjects.classList.toggle('open', isOpen);
      drawerGkToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Highlight navigation link based on scroll position
  function highlightActiveNavLink() {
    const scrollPos = window.scrollY + 100;
    const sections = document.querySelectorAll('section[id], header[id]');

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* ==========================================================================
   2. DYNAMIC COUNTERS (Intersection Observer)
   ========================================================================== */
function initDynamicCounters() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 1200; // ms
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.ceil(current);
            }
          }, stepTime);
        });
        animated = true;
      }
    });
  }, { threshold: 0.3 });

  const statsStrip = document.getElementById('statsStrip');
  if (statsStrip) observer.observe(statsStrip);
}

/* ==========================================================================
   3. CURRENT AFFAIRS MODULE (Structured Data & Interactive Filter)
   ========================================================================== */
const currentAffairsData = [
  {
    id: 1,
    date: 'Sep 21, 2026',
    category: 'National Affairs',
    title: 'PM Unveils National Green Hydrogen Corridor Project',
    summary: 'The Union Cabinet approves phase-two funding for key green energy transit lines connecting western ports to inland renewable clusters.',
    fullContent: `
      <p><strong>New Delhi:</strong> The Government of India has sanctioned Phase II of the National Green Hydrogen Transmission Corridor, allocating ₹14,200 crore to establish dedicated renewable energy corridors across coastal and inland industrial nodes.</p>
      <br/>
      <h4>Exam Relevance & Key Points:</h4>
      <ul>
        <li><strong>Target Capacity:</strong> Production of 5 Million Metric Tonnes (MMT) of green hydrogen per annum by 2030.</li>
        <li><strong>Nodal Ministry:</strong> Ministry of New and Renewable Energy (MNRE).</li>
        <li><strong>UPSC & State PSC Note:</strong> Supports India's Nationally Determined Contributions (NDCs) towards net-zero carbon emissions by 2070.</li>
        <li><strong>Key Question Trend:</strong> SIGHT programme (Strategic Interventions for Green Hydrogen Transition) funding mechanisms.</li>
      </ul>
    `
  },
  {
    id: 2,
    date: 'Sep 20, 2026',
    category: 'International Affairs',
    title: 'India-Nordic Clean Energy Alliance & Global Digital Compact Adopted',
    summary: 'High-level summit endorses joint green maritime shipping routes and ethical artificial intelligence governance standards.',
    fullContent: `
      <p><strong>Copenhagen:</strong> Leaders from India and the five Nordic nations (Denmark, Finland, Iceland, Norway, Sweden) ratified the 2026 Bilateral Green Framework, focusing on offshore wind and circular economy.</p>
      <br/>
      <h4>Exam Relevance & Key Points:</h4>
      <ul>
        <li><strong>Nordic Countries:</strong> Denmark, Finland, Iceland, Norway, Sweden (frequently tested in Geography & IR).</li>
        <li><strong>Global Digital Compact:</strong> UN framework for inclusive connectivity, data privacy protection, and open-source AI.</li>
        <li><strong>Significance for UPSC CSE:</strong> GS Paper II (Bilateral Agreements involving India).</li>
      </ul>
    `
  },
  {
    id: 3,
    date: 'Sep 19, 2026',
    category: 'Government Schemes',
    title: 'PM-Vidyalaxmi Education Loan Scheme Expands Coverage',
    summary: 'Central financial support extended to cover all students admitted to Top 100 NIRF institutions without requiring collateral or third-party guarantee.',
    fullContent: `
      <p>The Union Government expanded the PM-Vidyalaxmi scheme to ensure that meritorious students admitted to any of the top 100 NIRF-ranked higher education institutions receive collateral-free education loans with interest subvention.</p>
      <br/>
      <h4>Exam Relevance & Key Points:</h4>
      <ul>
        <li><strong>Income Limit:</strong> Full interest subvention for students with annual family income up to ₹8 Lakh.</li>
        <li><strong>NIRF:</strong> National Institutional Ranking Framework (launched by Ministry of Education in 2015).</li>
        <li><strong>High-yield for:</strong> Banking exams (IBPS PO, SBI Clerk GA section) and SSC CGL.</li>
      </ul>
    `
  },
  {
    id: 4,
    date: 'Sep 18, 2026',
    category: 'Economy',
    title: 'RBI Monetary Policy: Repo Rate Retained at 6.50%',
    summary: 'The Monetary Policy Committee unanimously votes to preserve the stance while keeping inflation firmly aligned to the 4% target.',
    fullContent: `
      <p>The Reserve Bank of India’s six-member Monetary Policy Committee (MPC) maintained the benchmark policy repo rate unchanged at 6.50%, projecting real GDP growth for India at 7.2% for FY27.</p>
      <br/>
      <h4>Exam Relevance & Key Points:</h4>
      <ul>
        <li><strong>Statutory Mandate:</strong> Section 45ZB of the RBI Act, 1934 (amended in 2016).</li>
        <li><strong>Structure:</strong> 6 members (3 from RBI including Governor as ex-officio Chairperson, 3 external members).</li>
        <li><strong>Target Inflation Band:</strong> 4% (+/- 2% tolerance band).</li>
        <li><strong>Key Terms:</strong> Repo Rate, Standing Deposit Facility (SDF), Marginal Standing Facility (MSF).</li>
      </ul>
    `
  },
  {
    id: 5,
    date: 'Sep 17, 2026',
    category: 'Science & Technology',
    title: 'ISRO Successfully Tests Cryogenic Stage for Gaganyaan Mission',
    summary: 'The High Thrust Cryogenic Engine (CE-20) completed its final endurance qualification test at ISRO Propulsion Complex, Mahendragiri.',
    fullContent: `
      <p>ISRO achieved another milestone towards India’s first human spaceflight mission 'Gaganyaan' by successfully qualifying the CE-20 cryogenic upper stage engine under simulated vacuum conditions.</p>
      <br/>
      <h4>Exam Relevance & Key Points:</h4>
      <ul>
        <li><strong>Launch Vehicle:</strong> LVM3 (human-rated HLVM3).</li>
        <li><strong>Payload Capacity:</strong> 4-tonne class into Geosynchronous Transfer Orbit (GTO).</li>
        <li><strong>Propellants:</strong> Liquid Oxygen (LOX at -183°C) and Liquid Hydrogen (LH2 at -253°C).</li>
        <li><strong>Test Facility:</strong> IPRC Mahendragiri, Tamil Nadu.</li>
      </ul>
    `
  },
  {
    id: 6,
    date: 'Sep 16, 2026',
    category: 'Awards',
    title: '71st National Film Awards & Prestigious Honors Announced',
    summary: 'Ministry of Information & Broadcasting reveals winners honoring excellence in feature films and regional cinematic art.',
    fullContent: `
      <p>The Directorate of Film Festivals, under the Ministry of Information and Broadcasting, announced the winners of the 71st National Film Awards alongside the prestigious Dadasaheb Phalke Award.</p>
      <br/>
      <h4>Exam Relevance & Key Points:</h4>
      <ul>
        <li><strong>Dadasaheb Phalke Award:</strong> India’s highest award in cinema, instituted in 1969 (First recipient: Devika Rani).</li>
        <li><strong>National Film Awards:</strong> First presented in 1954 as State Awards for Films.</li>
        <li><strong>Frequent Exam Question:</strong> Best Feature Film (Golden Lotus / Swarna Kamal) and Lifetime Achievement winners.</li>
      </ul>
    `
  },
  {
    id: 7,
    date: 'Sep 15, 2026',
    category: 'Sports',
    title: 'India Wins 6 Medals at World Athletics Continental Tour',
    summary: 'Indian athletes secured 2 Golds, 3 Silvers, and 1 Bronze with national record timings in javelin throw and 400m steeplechase.',
    fullContent: `
      <p>Indian athletes registered an outstanding medal haul at the World Athletics Continental Tour Gold event. Key highlights include gold medals in men's javelin throw and women's 400m steeplechase.</p>
      <br/>
      <h4>Exam Relevance & Key Points:</h4>
      <ul>
        <li><strong>Sports Administration:</strong> Athletics Federation of India (AFI) affiliated with World Athletics (HQ: Monaco).</li>
        <li><strong>High Frequency in SSC/RRB:</strong> Venues of Olympic Games 2028 (Los Angeles), Commonwealth Games, and Asian Games.</li>
      </ul>
    `
  },
  {
    id: 8,
    date: 'Sep 14, 2026',
    category: 'Important Appointments',
    title: 'Senior Jurist Appointed as New Central Vigilance Commissioner (CVC)',
    summary: 'The President of India administers the oath of office following recommendations of the high-powered statutory committee.',
    fullContent: `
      <p>The President of India has formally appointed the new Central Vigilance Commissioner at Rashtrapati Bhavan, heading the nation's premier integrity oversight institution.</p>
      <br/>
      <h4>Exam Relevance & Key Points:</h4>
      <ul>
        <li><strong>Statutory Body:</strong> Set up on recommendations of the Santhanam Committee (1962-64); granted statutory status via CVC Act, 2003.</li>
        <li><strong>Appointment Committee:</strong> Prime Minister (Head), Union Minister of Home Affairs, and Leader of Opposition in Lok Sabha.</li>
        <li><strong>Tenure:</strong> 4 years or until attaining the age of 65 years, whichever is earlier (not eligible for further employment).</li>
      </ul>
    `
  }
];

function initCurrentAffairs() {
  const caGrid = document.getElementById('currentAffairsGrid');
  const filterPills = document.querySelectorAll('.ca-pill');
  const viewAllBtn = document.getElementById('viewAllCABtn');

  function renderCards(filter = 'all') {
    if (!caGrid) return;
    caGrid.innerHTML = '';

    const filtered = filter === 'all'
      ? currentAffairsData
      : currentAffairsData.filter(item => item.category === filter);

    if (filtered.length === 0) {
      caGrid.innerHTML = `<div class="search-initial-hint" style="grid-column: 1/-1;">No updates in this category right now. Check back shortly!</div>`;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('article');
      card.className = 'ca-card';
      card.innerHTML = `
        <div class="ca-card-top">
          <span class="ca-date"><i class="far fa-calendar-alt"></i> ${item.date}</span>
          <span class="ca-badge">${item.category}</span>
        </div>
        <h3 class="ca-question-title">${item.title}</h3>
        <p class="ca-summary">${item.summary}</p>
        <button class="ca-read-more-btn" onclick="openCurrentAffairModal(${item.id})">
          <span>Read More</span>
          <i class="fas fa-arrow-right"></i>
        </button>
      `;
      caGrid.appendChild(card);
    });
  }

  // Filter click handlers
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderCards(pill.getAttribute('data-filter'));
    });
  });

  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      const allPill = document.querySelector('.ca-pill[data-filter="all"]');
      if (allPill) allPill.classList.add('active');
      renderCards('all');
      caGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Initial render
  renderCards('all');
}

// Global modal trigger for current affairs
window.openCurrentAffairModal = function(id) {
  const item = currentAffairsData.find(x => x.id === id);
  if (!item) return;

  const bodyHtml = `
    <div style="margin-bottom: 14px;">
      <span class="ca-badge" style="font-size:0.8rem;">${item.category}</span>
      <span style="font-size:0.85rem; color:#64748b; margin-left:10px;"><i class="far fa-calendar-alt"></i> ${item.date}</span>
    </div>
    <h3 style="font-size:1.35rem; color:#0f2744; margin-bottom:16px;">${item.title}</h3>
    <div>${item.fullContent}</div>
  `;
  showAppModal(item.title, bodyHtml, 'Practice Related MCQs', () => {
    hideAppModal();
    const mcqSection = document.getElementById('daily-mcq');
    if (mcqSection) mcqSection.scrollIntoView({ behavior: 'smooth' });
  });
};

/* ==========================================================================
   POPULAR STUDY MATERIALS SYLLABUS DATA & MODAL
   ========================================================================== */
const studyMaterialsData = {
  geography: {
    title: 'Indian Geography — Complete Exam Blueprint',
    badge: 'High Weightage',
    chapters: 24,
    description: 'Comprehensive physical, regional, and economic geography tailored for UPSC CSE, SSC CGL & Railway exams.',
    topics: [
      'Physiographic Divisions: The Northern Himalayas (Himadri, Himachal, Shiwaliks)',
      'The Great Northern Plains (Bhabar, Terai, Bhangar, Khadar)',
      'Peninsular Plateau: Central Highlands & Deccan Plateau',
      'Indian Drainage Systems: Himalayan vs Peninsular Rivers & Catchments',
      'Monsoon Mechanisms: El-Niño, La-Niña, Indian Ocean Dipole (IOD)',
      'Soils of India: Alluvial, Black (Regur), Red, Laterite & Conservation',
      'National Parks, Biosphere Reserves & Ramsar Wetland Sites'
    ],
    examTip: 'Himalayan passes, river tributaries (left vs right bank), and mineral belts are asked every year in UPSC & SSC Tier-1.'
  },
  polity: {
    title: 'Indian Polity & Constitution — Master Guide',
    badge: 'Essential Subject',
    chapters: 32,
    description: 'Article-by-article breakdown, landmark Supreme Court rulings, and constitutional amendments.',
    topics: [
      'Historical Background & Constituent Assembly Debates',
      'Preamble: Sovereign, Socialist, Secular, Democratic, Republic',
      'Part III: Fundamental Rights (Articles 12 to 35) & Writs',
      'Part IV: Directive Principles of State Policy & Fundamental Duties',
      'Union Executive: President, Vice-President, Prime Minister & Council',
      'Parliament: Lok Sabha, Rajya Sabha, Money Bill vs Financial Bill',
      'Constitutional Bodies: Article 280 (Finance Commission), Article 324 (ECI), CAG & UPSC'
    ],
    examTip: 'Finance Commission (Art 280), Election Commission (Art 324), and Writ Jurisdiction (Art 32 & 226) carry the highest question frequency.'
  },
  history: {
    title: 'Modern Indian History & National Movement',
    badge: 'Exam Favorite',
    chapters: 18,
    description: 'From the advent of Europeans to Indian Independence, freedom fighters, and constitutional developments.',
    topics: [
      'Advent of European Powers & Battle of Plassey (1757) / Buxar (1764)',
      'The Great Revolt of 1857: Causes, Leaders, Centers & Aftermath',
      'Socio-Religious Reform Movements (Raja Ram Mohan Roy, Arya Samaj, Satyashodhak Samaj)',
      'Foundation of Indian National Congress (1885) & Moderate vs Extremist Era',
      'Partition of Bengal (1905), Swadeshi Movement & Morley-Minto Reforms (1909)',
      'Gandhian Era: Champaran, Kheda, Rowlatt Satyagraha & Non-Cooperation',
      'Civil Disobedience (1930), Round Table Conferences & Quit India Movement (1942)'
    ],
    examTip: 'Chronological sequence of Governor Generals, Viceroys, and INC sessions are pivotal in UPSC Prelims and SSC exams.'
  },
  science: {
    title: 'General Science — Physics, Chemistry & Biology',
    badge: 'SSC & RRB Special',
    chapters: 28,
    description: 'Conceptual science essentials, human anatomy, chemical reactions, and modern space achievements.',
    topics: [
      'Physics: Newton’s Laws of Motion, Gravitation, Work & Energy, Optics & Electromagnetic Waves',
      'Chemistry: Modern Periodic Table, Acids, Bases & Salts, Metals & Metallurgy, Chemical Bonding',
      'Biology: Cell Structure & Organelles, Genetics, DNA/RNA mechanisms',
      'Human Physiology: Circulatory, Digestive, Nervous & Endocrine Systems',
      'Vitamins, Minerals, Nutritional Deficiencies & Major Communicable Diseases',
      'Modern Science: ISRO Space Missions, Nanotechnology & Green Hydrogen'
    ],
    examTip: 'RRB NTPC and SSC exams feature direct application-based questions on SI units, human blood groups, and vitamins.'
  },
  economics: {
    title: 'Indian Economy & Financial Awareness',
    badge: 'Conceptual',
    chapters: 16,
    description: 'Macroeconomics, fiscal & monetary policies, banking sector, Union Budget, and developmental schemes.',
    topics: [
      'National Income Accounting: GDP, GNP, NNP at Factor Cost vs Market Price',
      'Inflation: CPI, WPI, Headline vs Core Inflation, Cost-push vs Demand-pull',
      'RBI & Monetary Policy: Repo Rate, Reverse Repo, CRR, SLR, Open Market Operations (OMO)',
      'Fiscal Policy & Public Finance: Revenue vs Capital Budget, Fiscal Deficit formulas',
      'Banking Sector in India: Scheduled Commercial Banks, Payments Banks, Small Finance Banks, NPA Resolution',
      'External Sector: Balance of Payments (BoP), Current Account Deficit (CAD), Foreign Exchange Reserves',
      'NITI Aayog, Five-Year Plans History & Global Institutions (IMF, World Bank, WTO)'
    ],
    examTip: 'Must-know for Banking (IBPS, SBI GA) and UPSC GS Paper 3. Pay special attention to repo rate transmission and priority sector lending.'
  },
  'current-affairs': {
    title: 'Current Affairs Exam Capsules (Daily & Monthly)',
    badge: 'Updated Daily',
    chapters: 12,
    description: 'High-yield exam-filtered current events covering national, international, economic, and defense developments.',
    topics: [
      'National News: Key bills passed, high-level committees, and national infrastructure projects',
      'International Summits: G20, BRICS, SCO, ASEAN, COP Climate Conferences',
      'Defense & Space: Joint bilateral military exercises, naval inductees, ISRO/DRDO launches',
      'Sports & Honors: Olympic/Asian Games, Cricket World Cups, Grand Slams, Arjuna & Khel Ratna awards',
      'Economy & Banking: Union Budget allocations, Economic Survey findings, RBI circulars',
      'Persons in News, National Appointments & World Organization heads'
    ],
    examTip: 'Focus on government portals, target years of national missions, and bilateral joint military exercise names.'
  },
  'static-gk': {
    title: 'Static GK Booster Capsule',
    badge: 'Score Booster',
    chapters: 40,
    description: 'Fast-revision charts covering geographic wonders, cultural heritage, national symbols, and records.',
    topics: [
      'National Parks, Wildlife Sanctuaries, Tiger Reserves & Elephant Reserves (State-wise list)',
      'Classical & Folk Dances of India: Bharatnatyam, Kathakali, Garba, Bihu, Lavani, Chhau',
      'UNESCO World Heritage Sites in India: Cultural, Natural & Mixed Sites',
      'Ramsar Wetland Sites & Coastal Biosphere Reserves',
      'Important Mountain Passes: Shipki La, Nathu La, Zoji La, Rohtang, Lipulekh',
      'First in India: First President, Prime Minister, Governor-General, Female achievements',
      'Superlatives: Longest Rivers, Highest Dams, Largest Lakes & Highest Peaks'
    ],
    examTip: 'Highest return on time investment for SSC CGL, MTS, and State Police exams. Revise the state-wise tables daily.'
  },
  schemes: {
    title: 'Government Schemes & Initiatives Compendium',
    badge: 'High Yield',
    chapters: 50,
    description: 'Flagship welfare programs, funding patterns, target beneficiaries, and nodal ministries.',
    topics: [
      'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi) — Income support & eligibility',
      'PM-Awas Yojana (Gramin & Urban) — Housing for all targets',
      'Ayushman Bharat — PM-JAY (Pradhan Mantri Jan Arogya Yojana) health cover ₹5 Lakh',
      'Jal Jeevan Mission — Functional Household Tap Connections (FHTC) targets',
      'PM-Vidyalaxmi & PM-USHA higher education financing schemes',
      'Atal Pension Yojana (APY), PM-SVANidhi & Stand-Up India',
      'National Green Hydrogen Mission & PM Surya Ghar Muft Bijli Yojana'
    ],
    examTip: 'Every competitive exam asks for the Nodal Ministry, Launch Year, and exact Financial Outlay of central flagship schemes.'
  }
};

window.openStudyModal = function(subjectKey) {
  const data = studyMaterialsData[subjectKey];
  if (!data) return;

  const topicsList = data.topics.map(t => `<li style="padding: 6px 0; display:flex; align-items:flex-start; gap:8px;"><i class="fas fa-check-circle" style="color:#2563eb; margin-top:4px; font-size:0.85rem;"></i> <span>${t}</span></li>`).join('');

  const bodyHtml = `
    <div style="margin-bottom:16px;">
      <span class="exam-tag-badge" style="font-size:0.8rem; background:#eff6ff; color:#1d4ed8;">${data.badge}</span>
      <span style="font-size:0.85rem; color:#64748b; margin-left:10px;"><i class="fas fa-book-open"></i> ${data.chapters} Standard Syllabus Chapters</span>
    </div>
    <p style="color:#334155; font-size:1.02rem; line-height:1.6; margin-bottom:18px;">${data.description}</p>
    
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:18px; margin-bottom:20px;">
      <h4 style="font-size:1rem; color:#0f2744; margin-bottom:10px; font-weight:700;"><i class="fas fa-list-check" style="color:#1d4ed8;"></i> Key High-Yield Chapter Modules:</h4>
      <ul style="list-style:none; padding:0; margin:0; font-size:0.92rem; color:#475569;">
        ${topicsList}
      </ul>
    </div>

    <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:10px; padding:14px; margin-bottom:14px;">
      <strong style="color:#92400e; font-size:0.92rem; display:block; margin-bottom:4px;"><i class="fas fa-star" style="color:#f59e0b;"></i> Exam Scoring Tip:</strong>
      <span style="font-size:0.88rem; color:#78350f;">${data.examTip}</span>
    </div>
  `;

  showAppModal(data.title, bodyHtml, 'Practice Subject MCQs', () => {
    hideAppModal();
    const mcqSection = document.getElementById('daily-mcq');
    if (mcqSection) mcqSection.scrollIntoView({ behavior: 'smooth' });
  });
};

/* ==========================================================================
   4. INTERACTIVE MCQ PRACTICE ENGINE
   ========================================================================== */
const mcqQuestions = [
  {
    id: 1,
    category: 'Indian Polity & Constitution',
    question: 'Which Article of the Indian Constitution deals with the Finance Commission?',
    options: ['Article 270', 'Article 280', 'Article 300', 'Article 324'],
    correct: 1,
    explanation: 'Article 280 of the Constitution of India provides for a Finance Commission as a quasi-judicial body. It is constituted by the President of India every fifth year or earlier to make recommendations on tax distribution between Union and States.'
  },
  {
    id: 2,
    category: 'Indian Geography — Mountains & Ranges',
    question: 'Which is the highest peak in the Aravalli Mountain Range?',
    options: ['Anamudi', 'Guru Shikhar', 'Doda Betta', 'Dhupgarh'],
    correct: 1,
    explanation: 'Guru Shikhar (1,722 m) in Mount Abu, Rajasthan, is the highest peak of the Aravalli Range. Anamudi is the highest peak of the Western Ghats (Peninsular India).'
  },
  {
    id: 3,
    category: 'Modern Indian History',
    question: 'Who among the following founded the "Servants of India Society" in 1905?',
    options: ['Gopal Krishna Gokhale', 'Bal Gangadhar Tilak', 'Lala Lajpat Rai', 'Dadabhai Naoroji'],
    correct: 0,
    explanation: 'Gopal Krishna Gokhale founded the Servants of India Society in 1905 in Pune to train Indians to devote their lives to the cause of the nation.'
  },
  {
    id: 4,
    category: 'General Science — Physics & Measurement',
    question: 'Which instrument is primarily used to measure atmospheric pressure?',
    options: ['Hygrometer', 'Barometer', 'Ammeter', 'Lactometer'],
    correct: 1,
    explanation: 'A Barometer is used to measure atmospheric pressure (invented by Torricelli). A Hygrometer measures atmospheric humidity, and an Ammeter measures electric current.'
  },
  {
    id: 5,
    category: 'Indian Geography — Northern Plains',
    question: 'The older alluvium plain formed along the river terraces is locally known as:',
    options: ['Khadar', 'Bhangar', 'Bhabar', 'Terai'],
    correct: 1,
    explanation: 'Bhangar is the older alluvium of the plains lying above the flood levels of rivers, containing calcareous concretions (Kankar). Khadar represents the newer, more fertile alluvium.'
  }
];

let currentQuestionIndex = 0;
let userAnswers = {}; // { 0: { selected: 1, isCorrect: true } }
let totalScore = 0;
let bookmarkedQuestionIds = JSON.parse(localStorage.getItem('gkindia_bookmarks') || '[]');

function initMcqEngine() {
  const qNumElem = document.getElementById('mcqQNum');
  const catTagElem = document.getElementById('mcqCategoryTag');
  const scoreElem = document.getElementById('mcqScoreDisplay');
  const questionTextElem = document.getElementById('mcqQuestionText');
  const optionsContainer = document.getElementById('mcqOptionsContainer');
  const explanationBox = document.getElementById('mcqExplanationBox');
  const explanationTextElem = document.getElementById('mcqExplanationText');
  const prevBtn = document.getElementById('prevMcqBtn');
  const nextBtn = document.getElementById('nextMcqBtn');
  const startFullMcqBtn = document.getElementById('startFullMcqBtn');
  const dotsContainer = document.getElementById('mcqQuestionDots');
  const bookmarkBtn = document.getElementById('mcqBookmarkBtn');

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    mcqQuestions.forEach((q, idx) => {
      const dot = document.createElement('button');
      dot.className = 'mcq-qdot';
      dot.setAttribute('aria-label', `Jump to question ${idx + 1}`);
      dot.textContent = idx + 1;

      if (idx === currentQuestionIndex) {
        dot.classList.add('active');
      }
      if (userAnswers[idx]) {
        dot.classList.add('answered');
        if (userAnswers[idx].isCorrect) {
          dot.classList.add('is-correct');
        } else {
          dot.classList.add('is-wrong');
        }
      }

      dot.addEventListener('click', () => {
        currentQuestionIndex = idx;
        renderQuestion(idx);
      });

      dotsContainer.appendChild(dot);
    });
  }

  function updateBookmarkUI() {
    if (!bookmarkBtn) return;
    const q = mcqQuestions[currentQuestionIndex];
    const isBookmarked = bookmarkedQuestionIds.includes(q.id);
    if (isBookmarked) {
      bookmarkBtn.classList.add('bookmarked');
      bookmarkBtn.innerHTML = `<i class="fas fa-bookmark text-gold"></i> <span>Saved</span>`;
    } else {
      bookmarkBtn.classList.remove('bookmarked');
      bookmarkBtn.innerHTML = `<i class="far fa-bookmark"></i> <span>Bookmark</span>`;
    }
    updateBookmarkBadge();
  }

  if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', () => {
      const q = mcqQuestions[currentQuestionIndex];
      const idx = bookmarkedQuestionIds.indexOf(q.id);
      if (idx > -1) {
        bookmarkedQuestionIds.splice(idx, 1);
      } else {
        bookmarkedQuestionIds.push(q.id);
      }
      localStorage.setItem('gkindia_bookmarks', JSON.stringify(bookmarkedQuestionIds));
      updateBookmarkUI();
      renderBookmarksList();
    });
  }

  function renderQuestion(index) {
    const q = mcqQuestions[index];
    if (!q) return;

    qNumElem.textContent = `Question ${index + 1} of ${mcqQuestions.length}`;
    catTagElem.textContent = q.category;
    questionTextElem.textContent = q.question;

    renderDots();
    updateBookmarkUI();

    // Update navigation buttons
    prevBtn.disabled = index === 0;
    if (index === mcqQuestions.length - 1) {
      nextBtn.innerHTML = `Finish Quiz <i class="fas fa-flag-checkered"></i>`;
    } else {
      nextBtn.innerHTML = `Next Question <i class="fas fa-chevron-right"></i>`;
    }

    // Build options
    const optionLabels = ['A', 'B', 'C', 'D'];
    optionsContainer.innerHTML = '';

    const answered = userAnswers[index];

    q.options.forEach((optText, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'mcq-option-btn';
      btn.setAttribute('data-opt', optIdx);

      btn.innerHTML = `
        <span class="option-key">${optionLabels[optIdx]}</span>
        <span class="option-label">${optText}</span>
        <span class="option-status-icon"></span>
      `;

      if (answered) {
        btn.disabled = true;
        if (optIdx === q.correct) {
          btn.classList.add('correct');
        } else if (optIdx === answered.selected && !answered.isCorrect) {
          btn.classList.add('wrong');
        }
      } else {
        btn.addEventListener('click', () => handleOptionSelect(optIdx));
      }

      optionsContainer.appendChild(btn);
    });

    // Explanation Box display
    if (answered) {
      explanationBox.style.display = 'block';
      const isRight = answered.isCorrect;
      explanationTextElem.innerHTML = `
        <strong>${isRight ? '🎉 Correct Answer!' : '❌ Incorrect.'} Option ${optionLabels[q.correct]} (${q.options[q.correct]})</strong><br/>
        ${q.explanation}
      `;
    } else {
      explanationBox.style.display = 'none';
    }

    updateScoreDisplay();
  }

  function handleOptionSelect(selectedIdx) {
    const q = mcqQuestions[currentQuestionIndex];
    const isCorrect = selectedIdx === q.correct;

    userAnswers[currentQuestionIndex] = {
      selected: selectedIdx,
      isCorrect: isCorrect
    };

    renderQuestion(currentQuestionIndex);
  }

  function updateScoreDisplay() {
    const answeredKeys = Object.keys(userAnswers);
    let correctCount = 0;
    answeredKeys.forEach(k => {
      if (userAnswers[k].isCorrect) correctCount++;
    });
    scoreElem.textContent = `${correctCount} / ${answeredKeys.length}`;
  }

  prevBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderQuestion(currentQuestionIndex);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentQuestionIndex < mcqQuestions.length - 1) {
      currentQuestionIndex++;
      renderQuestion(currentQuestionIndex);
    } else {
      // Quiz Finished Summary
      const totalAnswered = Object.keys(userAnswers).length;
      let correctCount = 0;
      Object.keys(userAnswers).forEach(k => {
        if (userAnswers[k].isCorrect) correctCount++;
      });

      const modalHtml = `
        <div style="text-align:center; padding: 12px 0;">
          <div style="font-size:3.5rem; color:#10b981; margin-bottom:12px;"><i class="fas fa-trophy"></i></div>
          <h3 style="font-size:1.6rem; color:#0f2744; margin-bottom:8px;">Great Practice Session!</h3>
          <p style="font-size:1.1rem; color:#334155; margin-bottom:18px;">
            You scored <strong>${correctCount} out of ${mcqQuestions.length}</strong> correct.
          </p>
          <div style="background:#f1f5f9; border-radius:12px; padding:16px; margin-bottom:20px; font-size:0.95rem; text-align:left;">
            <strong>Accuracy Rate:</strong> ${Math.round((correctCount / mcqQuestions.length) * 100)}%<br/>
            <strong>Recommended Step:</strong> Review Indian Polity & Geography revision notes in the Study Materials section.
          </div>
        </div>
      `;
      showAppModal('MCQ Practice Results', modalHtml, 'Restart Quiz', () => {
        userAnswers = {};
        currentQuestionIndex = 0;
        hideAppModal();
        renderQuestion(0);
      });
    }
  });

  if (startFullMcqBtn) {
    startFullMcqBtn.addEventListener('click', () => {
      currentQuestionIndex = 0;
      renderQuestion(0);
      optionsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // Initial render
  renderQuestion(0);
}

/* ==========================================================================
   5. SPEED QUIZ WIDGET (1-MINUTE RAPID CHALLENGE)
   ========================================================================== */
const sprintQuestions = [
  {
    q: 'Under which Article can the President declare a Financial Emergency in India?',
    opts: ['Article 352', 'Article 356', 'Article 360', 'Article 368'],
    correct: 2,
    exp: 'Article 360 empowers the President to proclaim a Financial Emergency if financial stability or credit of India is threatened.'
  },
  {
    q: 'Which river is known as the "Dakshin Ganga" or "Ganges of the South"?',
    opts: ['Krishna', 'Godavari', 'Cauvery', 'Mahanadi'],
    correct: 1,
    exp: 'Godavari is the longest peninsular river and is widely referred to as Dakshin Ganga (or Vridha Ganga).'
  },
  {
    q: 'In which year was the Reserve Bank of India nationalized?',
    opts: ['1935', '1947', '1949', '1955'],
    correct: 2,
    exp: 'The Reserve Bank of India was nationalized on January 1, 1949 under the RBI (Transfer to Public Ownership) Act, 1948.'
  }
];

let sprintTimerInterval = null;
let sprintCurrentIdx = 0;
let sprintUserScore = 0;

function initSpeedQuiz() {
  const startSpeedQuizBtn = document.getElementById('startSpeedQuizBtn');
  const sprintBackdrop = document.getElementById('sprintModalBackdrop');
  const sprintClose = document.getElementById('sprintModalClose');

  if (startSpeedQuizBtn) {
    startSpeedQuizBtn.addEventListener('click', startSprintSprint);
  }

  if (sprintClose) {
    sprintClose.addEventListener('click', closeSprintModal);
  }

  if (sprintBackdrop) {
    sprintBackdrop.addEventListener('click', (e) => {
      if (e.target === sprintBackdrop) closeSprintModal();
    });
  }
}

function startSprintSprint() {
  const sprintBackdrop = document.getElementById('sprintModalBackdrop');
  if (!sprintBackdrop) return;

  sprintBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';

  sprintCurrentIdx = 0;
  sprintUserScore = 0;

  let secondsLeft = 60;
  const timerVal = document.getElementById('sprintLiveTimer');
  const progressFill = document.getElementById('sprintProgressFill');

  if (sprintTimerInterval) clearInterval(sprintTimerInterval);

  if (timerVal) {
    timerVal.textContent = '60s';
    timerVal.style.color = '#0f2744';
  }
  if (progressFill) {
    progressFill.style.width = '100%';
    progressFill.style.backgroundColor = '#1d4ed8';
  }

  sprintTimerInterval = setInterval(() => {
    secondsLeft--;
    if (timerVal) timerVal.textContent = `${secondsLeft}s`;
    if (progressFill) progressFill.style.width = `${(secondsLeft / 60) * 100}%`;

    if (secondsLeft <= 10) {
      if (timerVal) timerVal.style.color = '#ef4444';
      if (progressFill) progressFill.style.backgroundColor = '#ef4444';
    }

    if (secondsLeft <= 0) {
      clearInterval(sprintTimerInterval);
      finishSprintQuiz(true);
    }
  }, 1000);

  renderSprintQuestion();
}

function renderSprintQuestion() {
  const container = document.getElementById('sprintBodyContent');
  if (!container) return;

  const qData = sprintQuestions[sprintCurrentIdx];
  if (!qData) {
    finishSprintQuiz(false);
    return;
  }

  const optLabels = ['A', 'B', 'C', 'D'];
  const optsHtml = qData.opts.map((opt, i) => `
    <button class="sprint-opt-btn" onclick="handleSprintAnswer(${i})">
      <span class="sprint-opt-key">${optLabels[i]}</span>
      <span class="sprint-opt-text">${opt}</span>
    </button>
  `).join('');

  container.innerHTML = `
    <div class="sprint-q-counter">Question ${sprintCurrentIdx + 1} of ${sprintQuestions.length}</div>
    <div class="sprint-q-text">${qData.q}</div>
    <div class="sprint-opts-grid">${optsHtml}</div>
  `;
}

window.handleSprintAnswer = function(chosenIdx) {
  const qData = sprintQuestions[sprintCurrentIdx];
  if (chosenIdx === qData.correct) {
    sprintUserScore++;
  }

  sprintCurrentIdx++;
  if (sprintCurrentIdx < sprintQuestions.length) {
    renderSprintQuestion();
  } else {
    finishSprintQuiz(false);
  }
};

function finishSprintQuiz(isTimeout = false) {
  if (sprintTimerInterval) clearInterval(sprintTimerInterval);
  const container = document.getElementById('sprintBodyContent');
  if (!container) return;

  const timerVal = document.getElementById('sprintLiveTimer');
  if (timerVal) timerVal.textContent = 'Done';

  container.innerHTML = `
    <div class="sprint-result-box">
      <div class="sprint-result-icon"><i class="fas fa-medal text-gold"></i></div>
      <h4 class="sprint-result-title">${isTimeout ? 'Time is Up!' : 'Challenge Completed!'}</h4>
      <p class="sprint-result-score">You scored <strong>${sprintUserScore} out of ${sprintQuestions.length}</strong> in this 1-minute sprint.</p>
      <div class="sprint-advice">
        ${sprintUserScore === 3
          ? '🎯 <strong>Flawless Speed!</strong> Your rapid recall is in the top 5% of test-takers today.'
          : '⚡ <strong>Good Pace!</strong> Practice daily to build automatic reflexes for SSC CGL Tier 1 & Railway CBT.'
        }
      </div>
      <div style="margin-top:20px; display:flex; gap:12px; justify-content:center;">
        <button class="btn btn-primary btn-sm" onclick="startSprintSprint()">Try Again</button>
        <button class="btn btn-secondary btn-sm" onclick="closeSprintModal()">Close</button>
      </div>
    </div>
  `;
}

function closeSprintModal() {
  if (sprintTimerInterval) clearInterval(sprintTimerInterval);
  const sprintBackdrop = document.getElementById('sprintModalBackdrop');
  if (sprintBackdrop) {
    sprintBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   STUDENT PORTAL & BOOKMARKS ENGINE
   ========================================================================== */
function initStudentPortal() {
  const backdrop = document.getElementById('portalModalBackdrop');
  const closeBtn = document.getElementById('portalModalClose');
  const tabs = document.querySelectorAll('.portal-tab');
  const portalHeaderBtn = document.getElementById('portalHeaderBtn');
  const drawerPortalLink = document.getElementById('drawerPortalLink');

  if (portalHeaderBtn) portalHeaderBtn.addEventListener('click', openStudentPortal);
  if (drawerPortalLink) drawerPortalLink.addEventListener('click', (e) => {
    e.preventDefault();
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (drawerOverlay) drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
    openStudentPortal();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeStudentPortal);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeStudentPortal();
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-tab');
      document.querySelectorAll('.portal-tab-content').forEach(c => c.classList.remove('active'));

      if (target === 'login') {
        document.getElementById('portalTabLogin').classList.add('active');
      } else if (target === 'register') {
        document.getElementById('portalTabRegister').classList.add('active');
      } else if (target === 'bookmarks') {
        document.getElementById('portalTabBookmarks').classList.add('active');
        renderBookmarksList();
      }
    });
  });

  updateBookmarkBadge();
}

function openStudentPortal() {
  const backdrop = document.getElementById('portalModalBackdrop');
  if (backdrop) {
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateBookmarkBadge();
    renderBookmarksList();
  }
}

function closeStudentPortal() {
  const backdrop = document.getElementById('portalModalBackdrop');
  if (backdrop) {
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function updateBookmarkBadge() {
  const badge = document.getElementById('bookmarkCountBadge');
  if (badge) {
    badge.textContent = bookmarkedQuestionIds.length;
  }
}

function renderBookmarksList() {
  const listContainer = document.getElementById('portalBookmarksList');
  if (!listContainer) return;

  if (bookmarkedQuestionIds.length === 0) {
    listContainer.innerHTML = `
      <div style="text-align:center; padding: 32px 16px; color:#64748b;">
        <i class="far fa-bookmark" style="font-size:2.5rem; color:#cbd5e1; margin-bottom:12px; display:block;"></i>
        <h4 style="font-size:1.1rem; color:#0f2744; margin-bottom:6px;">No Bookmarked Questions Yet</h4>
        <p style="font-size:0.9rem;">Click the "Bookmark" button on any MCQ while practicing to save difficult questions for fast revision.</p>
      </div>
    `;
    return;
  }

  const bookmarkedItems = mcqQuestions.filter(q => bookmarkedQuestionIds.includes(q.id));
  listContainer.innerHTML = bookmarkedItems.map(q => `
    <div class="bookmarked-item-card">
      <div class="bm-header">
        <span class="ca-badge" style="font-size:0.75rem;">${q.category}</span>
        <button class="bm-remove-btn" onclick="removeBookmark(${q.id})" title="Remove bookmark"><i class="fas fa-trash-alt"></i></button>
      </div>
      <div class="bm-question">Q: ${q.question}</div>
      <div class="bm-answer"><strong>Correct:</strong> ${q.options[q.correct]}</div>
      <p class="bm-explanation">${q.explanation}</p>
    </div>
  `).join('');
}

window.removeBookmark = function(id) {
  const idx = bookmarkedQuestionIds.indexOf(id);
  if (idx > -1) {
    bookmarkedQuestionIds.splice(idx, 1);
    localStorage.setItem('gkindia_bookmarks', JSON.stringify(bookmarkedQuestionIds));
    updateBookmarkBadge();
    renderBookmarksList();
    const currentQ = mcqQuestions[currentQuestionIndex];
    if (currentQ && currentQ.id === id) {
      const bookmarkBtn = document.getElementById('mcqBookmarkBtn');
      if (bookmarkBtn) {
        bookmarkBtn.classList.remove('bookmarked');
        bookmarkBtn.innerHTML = `<i class="far fa-bookmark"></i> <span>Bookmark</span>`;
      }
    }
  }
};

window.handleLoginSubmit = function() {
  const email = document.getElementById('loginEmail').value;
  alert(`Welcome back to GK India Academy!\nLogged in successfully as: ${email}`);
  closeStudentPortal();
};

window.handleRegisterSubmit = function() {
  const name = document.getElementById('regName').value;
  const exam = document.getElementById('regExam').value;
  alert(`Registration Successful!\nWelcome, ${name}. Your personalized ${exam} study portal is ready.`);
  closeStudentPortal();
};

/* ==========================================================================
   6. QUICK SEARCH MODAL & INSTANT RESULTS
   ========================================================================== */
function initSearchModal() {
  if (window.GlobalSearch) {
    // Handled comprehensively by search.js with multi-feature indexing & shortcuts
    return;
  }
  const searchToggleBtn = document.getElementById('searchToggleBtn');
  const searchModalBackdrop = document.getElementById('searchModalBackdrop');
  if (!searchModalBackdrop) return;
  const searchModalClose = document.getElementById('searchModalClose');
  const globalSearchInput = document.getElementById('globalSearchInput');
  const mobileSearchInput = document.getElementById('mobileSearchInput');
  const searchResultsContainer = document.getElementById('searchResultsContainer');
  const quickTags = document.querySelectorAll('.quick-tag-pill');

  function openSearchModal(prefill = '') {
    searchModalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (globalSearchInput) {
      globalSearchInput.value = prefill;
      globalSearchInput.focus();
      if (prefill) performSearch(prefill);
    }
  }

  function closeSearchModal() {
    searchModalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (searchToggleBtn) searchToggleBtn.addEventListener('click', () => openSearchModal());
  if (searchModalClose) searchModalClose.addEventListener('click', closeSearchModal);

  searchModalBackdrop.addEventListener('click', (e) => {
    if (e.target === searchModalBackdrop) closeSearchModal();
  });

  // Keyboard shortcut: '/' opens search
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openSearchModal();
    } else if (e.key === 'Escape' && searchModalBackdrop.classList.contains('active')) {
      closeSearchModal();
    }
  });

  if (mobileSearchInput) {
    mobileSearchInput.addEventListener('click', () => {
      const drawer = document.getElementById('mobileDrawer');
      const overlay = document.getElementById('drawerOverlay');
      if (drawer) drawer.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      openSearchModal(mobileSearchInput.value);
    });
  }

  // Quick tag buttons
  quickTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const term = tag.getAttribute('data-search');
      if (globalSearchInput) globalSearchInput.value = term;
      performSearch(term);
    });
  });

  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });
  }

  function performSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      searchResultsContainer.innerHTML = `<div class="search-initial-hint">Start typing above to instantly locate questions, syllabus notes, and exam modules.</div>`;
      return;
    }

    const matches = [];

    // Search Current Affairs
    currentAffairsData.forEach(item => {
      if (item.title.toLowerCase().includes(q) || item.summary.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)) {
        matches.push({
          type: 'Current Affairs',
          title: item.title,
          desc: item.summary,
          action: () => {
            closeSearchModal();
            openCurrentAffairModal(item.id);
          }
        });
      }
    });

    // Search MCQs
    mcqQuestions.forEach((item, idx) => {
      if (item.question.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)) {
        matches.push({
          type: 'Daily MCQ',
          title: `Q: ${item.question}`,
          desc: `Category: ${item.category}`,
          action: () => {
            closeSearchModal();
            location.href = '#daily-mcq';
          }
        });
      }
    });

    // Search Exams
    const examKeywords = [
      { name: 'UPSC Civil Services Exam', tag: 'Exam Portal', target: '#exam-prep' },
      { name: 'SSC CGL, CHSL, CPO', tag: 'Exam Portal', target: '#exam-prep' },
      { name: 'Railway RRB NTPC & Group D', tag: 'Exam Portal', target: '#exam-prep' },
      { name: 'Banking IBPS, SBI, RBI', tag: 'Exam Portal', target: '#exam-prep' },
      { name: 'State Government Exams (PSC)', tag: 'Exam Portal', target: '#exam-prep' },
      { name: 'Teaching Exams CTET & State TET', tag: 'Exam Portal', target: '#exam-prep' }
    ];

    examKeywords.forEach(ex => {
      if (ex.name.toLowerCase().includes(q)) {
        matches.push({
          type: ex.tag,
          title: ex.name,
          desc: 'Comprehensive syllabus capsules and curated MCQs.',
          action: () => {
            closeSearchModal();
            location.href = ex.target;
          }
        });
      }
    });

    // Render Search Results
    if (matches.length === 0) {
      searchResultsContainer.innerHTML = `<div class="search-initial-hint">No matches found for "<strong>${query}</strong>". Try searching for "Polity", "Himalaya", "UPSC" or "MCQs".</div>`;
      return;
    }

    searchResultsContainer.innerHTML = matches.map((m, i) => `
      <div class="search-result-item" data-index="${i}">
        <span class="ca-badge" style="font-size:0.68rem; margin-bottom:4px; display:inline-block;">${m.type}</span>
        <div class="search-result-title">${m.title}</div>
        <div class="search-result-desc">${m.desc}</div>
      </div>
    `).join('');

    // Attach click events
    document.querySelectorAll('.search-result-item').forEach((elem, i) => {
      elem.addEventListener('click', () => {
        matches[i].action();
      });
    });
  }
}

/* ==========================================================================
   7. UNIVERSAL APPLICATION MODAL
   ========================================================================== */
function initUniversalModal() {
  const modalBackdrop = document.getElementById('appModalBackdrop');
  const closeBtn = document.getElementById('appModalCloseBtn');
  const dismissBtn = document.getElementById('appModalDismissBtn');

  if (closeBtn) closeBtn.addEventListener('click', hideAppModal);
  if (dismissBtn) dismissBtn.addEventListener('click', hideAppModal);

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) hideAppModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      hideAppModal();
    }
  });
}

function showAppModal(title, bodyHtml, actionText = 'OK', actionCallback = null) {
  const modalBackdrop = document.getElementById('appModalBackdrop');
  const titleElem = document.getElementById('appModalTitle');
  const bodyElem = document.getElementById('appModalBody');
  const actionBtn = document.getElementById('appModalActionBtn');

  if (!modalBackdrop) return;

  titleElem.textContent = title;
  bodyElem.innerHTML = bodyHtml;

  if (actionText) {
    actionBtn.style.display = 'inline-flex';
    actionBtn.textContent = actionText;
    actionBtn.onclick = actionCallback || hideAppModal;
  } else {
    actionBtn.style.display = 'none';
  }

  modalBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function hideAppModal() {
  const modalBackdrop = document.getElementById('appModalBackdrop');
  if (modalBackdrop) {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Global modal for Exam Cards
window.openExamModal = function(examName, subtitle, description) {
  const modalContent = `
    <div style="margin-bottom:14px;">
      <span class="exam-tag-badge" style="font-size:0.8rem;">Competitive Exam Portal</span>
    </div>
    <h3 style="font-size:1.4rem; color:#0f2744; margin-bottom:6px;">${examName}</h3>
    <h4 style="font-size:1rem; color:#1d4ed8; font-weight:600; margin-bottom:14px;">${subtitle}</h4>
    <p style="color:#475569; line-height:1.65; margin-bottom:20px;">${description}</p>
    <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:10px; padding:16px;">
      <strong style="color:#0f2744; display:block; margin-bottom:8px;"><i class="fas fa-check-circle text-accent"></i> GK India Academy Highlights:</strong>
      <ul style="padding-left: 20px; list-style: disc; font-size:0.9rem; color:#334155;">
        <li>100% Free daily topic capsules and standard syllabus revision sets.</li>
        <li>Practice sets with negative marking simulation.</li>
        <li>Current affairs coverage filtered for official exam question patterns.</li>
      </ul>
    </div>
  `;
  showAppModal(`${examName} Preparation Guide`, modalContent, 'Practice MCQs Now', () => {
    hideAppModal();
    location.href = '#daily-mcq';
  });
};

// Global modal for Video Player Preview
window.openVideoPlayer = function(title, description) {
  const modalContent = `
    <div style="position:relative; aspect-ratio:16/9; background:#000; border-radius:12px; overflow:hidden; margin-bottom:16px; display:flex; align-items:center; justify-content:center; color:#fff;">
      <div style="text-align:center; padding:20px;">
        <i class="fab fa-youtube" style="font-size:3.5rem; color:#ff0000; margin-bottom:12px; display:block;"></i>
        <h4 style="font-size:1.1rem; margin-bottom:6px;">Watch on YouTube Official Channel</h4>
        <p style="font-size:0.85rem; color:#cbd5e1;">GK India Academy — Free High Definition Video Lectures</p>
      </div>
    </div>
    <h3 style="font-size:1.2rem; color:#0f2744; margin-bottom:10px;">${title}</h3>
    <p style="color:#64748b; font-size:0.92rem; line-height:1.6;">${description}</p>
  `;
  showAppModal('Video Lecture Preview', modalContent, 'Watch on YouTube', () => {
    window.open('https://www.youtube.com', '_blank');
  });
};

// Global modal for Policy / Important Links & Interactive Contact Form
window.openPolicyModal = function(title, content) {
  if (title === 'Contact Us') {
    openContactModal();
    return;
  }
  const modalContent = `
    <h3 style="font-size:1.3rem; color:#0f2744; margin-bottom:14px;">${title}</h3>
    <p style="font-size:0.95rem; color:#475569; line-height:1.7;">${content}</p>
  `;
  showAppModal(title, modalContent, 'Close', hideAppModal);
};

window.openContactModal = function() {
  const formHtml = `
    <div style="font-family: inherit;">
      <p style="font-size: 0.9rem; color: #475569; margin-bottom: 12px;">
        Have questions about civil services or government exam preparation, syllabus topics, or quiz issues? Send our team a message below or email directly to <strong><a href="mailto:gkindiaacademy100@gmail.com" style="color:#2563eb;">gkindiaacademy100@gmail.com</a></strong>.
      </p>
      <div style="margin-bottom: 14px; text-align: right;">
        <a href="contact.html" style="font-size: 0.82rem; color: #2563eb; font-weight: 600; text-decoration: none;">
          <i class="fas fa-arrow-up-right-from-square"></i> Open Full Contact Page
        </a>
      </div>
      <form id="publicContactForm" onsubmit="event.preventDefault(); window.handlePublicContactSubmit();">
        <div style="margin-bottom: 12px;">
          <label style="display:block; font-size:0.8rem; font-weight:700; color:#0f2744; margin-bottom:4px;">Full Name *</label>
          <input type="text" id="publicContactName" required style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:8px; font-size:0.9rem;" placeholder="e.g. Rahul Sharma" />
        </div>
        <div style="margin-bottom: 12px;">
          <label style="display:block; font-size:0.8rem; font-weight:700; color:#0f2744; margin-bottom:4px;">Email Address *</label>
          <input type="email" id="publicContactEmail" required style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:8px; font-size:0.9rem;" placeholder="e.g. rahul.sharma@gmail.com" />
        </div>
        <div style="margin-bottom: 12px;">
          <label style="display:block; font-size:0.8rem; font-weight:700; color:#0f2744; margin-bottom:4px;">Subject / Target Exam *</label>
          <input type="text" id="publicContactSubject" required style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:8px; font-size:0.9rem;" placeholder="e.g. UPSC CSE 2026 Prelims Test Series Inquiry" />
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display:block; font-size:0.8rem; font-weight:700; color:#0f2744; margin-bottom:4px;">Your Message / Query *</label>
          <textarea id="publicContactMessage" required rows="4" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:8px; font-size:0.9rem; resize:vertical;" placeholder="Please describe your question or suggestion in detail..."></textarea>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%; padding:11px; font-weight:700; font-size:0.92rem; display:flex; align-items:center; justify-content:center; gap:8px;">
          <i class="fas fa-paper-plane"></i> Send Inquiry to Admin
        </button>
      </form>
    </div>
  `;
  showAppModal('Contact GK India Academy', formHtml, 'Cancel', hideAppModal);
};

window.handlePublicContactSubmit = function() {
  const name = document.getElementById('publicContactName')?.value?.trim();
  const email = document.getElementById('publicContactEmail')?.value?.trim();
  const subject = document.getElementById('publicContactSubject')?.value?.trim();
  const message = document.getElementById('publicContactMessage')?.value?.trim();

  if (!name || !email || !message) return;

  const key = 'GK_ADMIN_DATA_MESSAGES_V1';
  let list = [];
  try {
    const raw = localStorage.getItem(key);
    if (raw) list = JSON.parse(raw);
  } catch (_) {}

  const newMsg = {
    id: 'msg-' + Date.now().toString(36),
    name,
    email,
    subject: subject || 'General Candidate Inquiry',
    message,
    date: new Date().toISOString(),
    status: 'unread',
    replyNote: ''
  };

  list.unshift(newMsg);
  try {
    localStorage.setItem(key, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('gk:new_message', { detail: newMsg }));
  } catch (_) {}

  const successHtml = `
    <div style="text-align:center; padding:20px 10px;">
      <div style="width:52px; height:52px; background:#ecfdf5; color:#10b981; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:1.5rem; margin-bottom:14px;">
        <i class="fas fa-check"></i>
      </div>
      <h3 style="color:#0f2744; font-size:1.2rem; margin-bottom:8px;">Thank You, ${name}!</h3>
      <p style="color:#475569; font-size:0.9rem; line-height:1.6;">
        Your inquiry has been submitted directly to the GK India Academy administration desk. Our educators will review it and reply to <strong>${email}</strong>.
      </p>
    </div>
  `;
  showAppModal('Inquiry Submitted', successHtml, 'Done', hideAppModal);
};

/* ==========================================================================
   8. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   9. COOKIE & PRIVACY CONSENT BANNER COMPONENT
   ========================================================================== */
function initCookieConsent() {
  const CONSENT_KEY = 'gk_cookie_consent';
  try {
    const existingConsent = localStorage.getItem(CONSENT_KEY);
    if (existingConsent) return; // User already made a choice
  } catch (_) {
    return;
  }

  // Detect subfolder for path prefixes
  const isSubfolder = window.location.pathname.includes('/subjects/') || 
                      window.location.pathname.includes('/mcqs/') || 
                      window.location.pathname.includes('/government-exams/');
  const prefix = isSubfolder ? '../' : '';

  const banner = document.createElement('div');
  banner.className = 'cookie-banner is-active';
  banner.id = 'gkCookieBanner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Cookie and Privacy Consent');

  banner.innerHTML = `
    <div class="cookie-banner-header">
      <i class="fas fa-cookie-bite cookie-banner-icon"></i>
      <span class="cookie-banner-title">Cookie &amp; Privacy Notice</span>
    </div>
    <p class="cookie-banner-desc">
      GK India Academy uses local storage and minimal cookies to remember your bookmarks and mock test progress. We do not track you across external sites. Review our <a href="${prefix}cookie-policy.html">Cookie Policy</a> and <a href="${prefix}privacy-policy.html">Privacy Policy</a>.
    </p>
    <div class="cookie-banner-actions">
      <button type="button" class="cookie-btn-accept" id="btnAcceptCookies">Accept All</button>
      <button type="button" class="cookie-btn-decline" id="btnDeclineCookies">Essential Only</button>
    </div>
  `;

  document.body.appendChild(banner);

  const btnAccept = document.getElementById('btnAcceptCookies');
  const btnDecline = document.getElementById('btnDeclineCookies');

  function dismissBanner(choice) {
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch (_) {}
    banner.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(20px)';
    setTimeout(() => {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }, 280);
  }

  if (btnAccept) {
    btnAccept.addEventListener('click', () => dismissBanner('accepted'));
  }
  if (btnDecline) {
    btnDecline.addEventListener('click', () => dismissBanner('essential'));
  }
}

