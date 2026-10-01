/**
 * GK INDIA ACADEMY — GLOBAL SEARCH & OMNI-PALETTE CONTROLLER
 * Comprehensive search across:
 * 1. Topics
 * 2. Questions (MCQs)
 * 3. Current Affairs
 * 4. Government Exams
 * 5. Study Materials
 */

(function () {
  'use strict';

  // --- 1. Centralized Academy Search Database ---
  const SEARCH_DATABASE = [
    // --- TOPICS ---
    {
      id: 'top-1',
      type: 'topic',
      category: 'Indian History',
      title: 'Indus Valley Civilization & Ancient Cities',
      description: 'Urban planning, Harappan seals, trade routes, Great Bath, and town planning architecture for UPSC & SSC.',
      url: '/subjects/indian-geography.html#history',
      badgeClass: 'badge-topic',
      icon: 'fa-monument',
      keywords: ['harappa', 'mohenjo-daro', 'lothal', 'ancient history', 'seals', 'great bath', 'bronze age']
    },
    {
      id: 'top-2',
      type: 'topic',
      category: 'Indian Polity',
      title: 'Fundamental Rights & Constitutional Remedies (Art 12-35)',
      description: 'Six core freedoms, writ jurisdiction (Habeas Corpus, Mandamus, Quo-Warranto), and basic structure doctrine.',
      url: '/subjects/indian-geography.html#polity',
      badgeClass: 'badge-topic',
      icon: 'fa-scale-balanced',
      keywords: ['constitution', 'article 32', 'article 21', 'dr ambedkar', 'writs', 'supreme court', 'fundamental duties']
    },
    {
      id: 'top-3',
      type: 'topic',
      category: 'Indian Geography',
      title: 'Indian River Systems & Himalayan Drainage',
      description: 'Indus, Ganga, and Brahmaputra drainage networks, tributaries, river projects, and major dams.',
      url: '/subjects/indian-geography.html',
      badgeClass: 'badge-topic',
      icon: 'fa-mountain-sun',
      keywords: ['ganga', 'brahmaputra', 'indus', 'yamuna', 'tributaries', 'dams', 'majuli island', 'drainage']
    },
    {
      id: 'top-4',
      type: 'topic',
      category: 'Indian Economy',
      title: 'Reserve Bank of India: Monetary Policy & Inflation Targets',
      description: 'Repo rate, reverse repo, CRR, SLR, MPC framework, CPI/WPI metrics and economic indicators.',
      url: '/subjects/indian-geography.html#economy',
      badgeClass: 'badge-topic',
      icon: 'fa-chart-line',
      keywords: ['rbi', 'repo rate', 'inflation', 'mpc', 'banking', 'crr', 'slr', 'gdp']
    },
    {
      id: 'top-5',
      type: 'topic',
      category: 'General Science',
      title: 'India Space Missions: Gaganyaan, Chandrayaan & Aditya-L1',
      description: 'ISRO achievements, cryogenic engines, LVM3 launch vehicles, space probes, and future solar astronomy.',
      url: '/subjects/indian-geography.html#science',
      badgeClass: 'badge-topic',
      icon: 'fa-atom',
      keywords: ['isro', 'chandrayaan', 'gaganyaan', 'aditya-l1', 'lvm3', 'pslv', 'satellites']
    },
    {
      id: 'top-6',
      type: 'topic',
      category: 'Indian History',
      title: 'Modern Indian History: 1857 Revolt to Independence 1947',
      description: 'Chronology of freedom movements, Quit India, Non-Cooperation, Round Table Conferences, and Subhash Chandra Bose.',
      url: '/subjects/indian-geography.html#history',
      badgeClass: 'badge-topic',
      icon: 'fa-flag',
      keywords: ['1857 revolt', 'gandhi', 'subhash chandra bose', 'quit india', 'inc', 'freedom struggle']
    },
    {
      id: 'top-7',
      type: 'topic',
      category: 'Environment & Ecology',
      title: 'Biodiversity Hotspots & Biosphere Reserves of India',
      description: 'Western Ghats, Indo-Burma, Eastern Himalayas, endemic species, Wildlife Protection Act, and Ramsar sites.',
      url: '/subjects/indian-geography.html#environment',
      badgeClass: 'badge-topic',
      icon: 'fa-leaf',
      keywords: ['western ghats', 'himalayas', 'ramsar', 'national parks', 'wildlife', 'ecology']
    },
    {
      id: 'top-8',
      type: 'topic',
      category: 'Art & Culture',
      title: 'UNESCO World Heritage Sites & Classical Dances of India',
      description: '8 Sangeet Natak Akademi classical dances, temple architecture (Nagara, Dravida, Vesara), and GI tags.',
      url: '/subjects/indian-geography.html#art',
      badgeClass: 'badge-topic',
      icon: 'fa-palette',
      keywords: ['unesco', 'bharatnatyam', 'sattriya', 'kathakali', 'temple architecture', 'dances']
    },

    // --- QUESTIONS (MCQs) ---
    {
      id: 'q-1',
      type: 'question',
      category: 'Indian Polity MCQ',
      title: 'Which Article is described as the "Heart and Soul of the Constitution"?',
      description: 'Article 32 guarantees the Right to Constitutional Remedies, empowering individuals to move Supreme Court via writs.',
      url: '/mcqs/all',
      badgeClass: 'badge-mcq',
      icon: 'fa-circle-question',
      keywords: ['heart and soul', 'article 32', 'dr ambedkar', 'constitution remedies', 'polity mcq']
    },
    {
      id: 'q-2',
      type: 'question',
      category: 'Indian History MCQ',
      title: 'Which Indus Valley site is famous for an ancient dockyard on the Sabarmati?',
      description: 'Lothal in Gujarat was a prominent port city of the Harappan civilization with a massive tidal dockyard.',
      url: '/mcqs/all',
      badgeClass: 'badge-mcq',
      icon: 'fa-circle-question',
      keywords: ['lothal', 'dockyard', 'indus valley', 'gujarat', 'harappa mcq']
    },
    {
      id: 'q-3',
      type: 'question',
      category: 'Indian Geography MCQ',
      title: 'The Majuli Island, recognized as the world’s largest river island, is on which river?',
      description: 'Majuli is situated on the Brahmaputra River in Assam, known as the cultural capital of Vaishnavite heritage.',
      url: '/mcqs/all',
      badgeClass: 'badge-mcq',
      icon: 'fa-circle-question',
      keywords: ['majuli', 'brahmaputra', 'river island', 'assam', 'geography mcq']
    },
    {
      id: 'q-4',
      type: 'question',
      category: 'Indian Economy MCQ',
      title: 'What does the term "Repo Rate" stand for in RBI monetary operations?',
      description: 'Rate at which the Reserve Bank of India lends short-term funds to commercial banks against approved securities.',
      url: '/mcqs/banking',
      badgeClass: 'badge-mcq',
      icon: 'fa-circle-question',
      keywords: ['repo rate', 'rbi', 'monetary policy', 'banking mcq', 'interest rate']
    },
    {
      id: 'q-5',
      type: 'question',
      category: 'General Science MCQ',
      title: 'What is the chemical formula of "Quick Lime"?',
      description: 'Quick Lime is Calcium Oxide (CaO). Slaked lime is Calcium Hydroxide [Ca(OH)2], limestone is Calcium Carbonate (CaCO3).',
      url: '/mcqs/ssc',
      badgeClass: 'badge-mcq',
      icon: 'fa-circle-question',
      keywords: ['quick lime', 'cao', 'calcium oxide', 'science mcq', 'chemistry']
    },
    {
      id: 'q-6',
      type: 'question',
      category: 'General Science MCQ',
      title: 'Which heavy-lift launch vehicle was configured by ISRO for Gaganyaan?',
      description: 'The Launch Vehicle Mark-3 (LVM3 / HLVM3) is human-rated for India’s crewed space orbital missions.',
      url: '/mcqs/upsc',
      badgeClass: 'badge-mcq',
      icon: 'fa-circle-question',
      keywords: ['isro', 'gaganyaan', 'lvm3', 'gslv mk iii', 'space mcq']
    },
    {
      id: 'q-7',
      type: 'question',
      category: 'General Science MCQ',
      title: 'Which law of physics explains hydraulic brakes in locomotives and automobiles?',
      description: 'Pascal’s Law states that pressure applied to an enclosed fluid is transmitted undiminished in all directions.',
      url: '/mcqs/railway',
      badgeClass: 'badge-mcq',
      icon: 'fa-circle-question',
      keywords: ['pascals law', 'hydraulic brakes', 'physics mcq', 'railway mcq']
    },

    // --- CURRENT AFFAIRS ---
    {
      id: 'ca-1',
      type: 'current-affairs',
      category: 'Economy & Infrastructure',
      title: 'India Inaugurates Strategic 2026 Deep-Sea Port Terminal on Western Coast',
      description: 'State-of-the-art automated terminal commissioned to boost trade corridors and cut logistics turnaround times by 35%.',
      url: '/#current-affairs',
      badgeClass: 'badge-affair',
      icon: 'fa-newspaper',
      keywords: ['deep sea port', 'infrastructure', 'trade corridor', 'imec', 'western coast', 'maritime']
    },
    {
      id: 'ca-2',
      type: 'current-affairs',
      category: 'Science & Technology',
      title: 'ISRO & NASA NISAR Satellite Mission Enters Final Orbital Operations Phase',
      description: 'Joint synthetic aperture radar systematically tracks earth deformations, glaciers, and forest biomass every 12 days.',
      url: '/#current-affairs',
      badgeClass: 'badge-affair',
      icon: 'fa-newspaper',
      keywords: ['nisar', 'isro', 'nasa', 'radar satellite', 'earth observation', 'space news']
    },
    {
      id: 'ca-3',
      type: 'current-affairs',
      category: 'Environment & Energy',
      title: 'National Green Hydrogen Mission Crosses Milestone 1.2 MMT Capacity',
      description: 'Ministry of New & Renewable Energy awards electrolyser incentive packages to establish green ammonia export hubs.',
      url: '/#current-affairs',
      badgeClass: 'badge-affair',
      icon: 'fa-newspaper',
      keywords: ['green hydrogen', 'renewable energy', 'net zero', 'ammonia', 'mnre', 'clean energy']
    },
    {
      id: 'ca-4',
      type: 'current-affairs',
      category: 'Sports & Honors',
      title: 'India Wins 12 Medals at World Shooting Championship 2026 in Munich',
      description: 'Indian marksmen and markswomen clinch 5 Gold, 4 Silver, and 3 Bronze medals in 10m Air Rifle and Pistol events.',
      url: '/#current-affairs',
      badgeClass: 'badge-affair',
      icon: 'fa-newspaper',
      keywords: ['shooting championship', 'munich', 'gold medal', 'sports current affairs', 'rifle']
    },
    {
      id: 'ca-5',
      type: 'current-affairs',
      category: 'Defense & Security',
      title: 'Defence Ministry Inks Contract for 4th Generation Indigenous Fighter Jet Radars',
      description: 'Uttam AESA Radar systems to be manufactured domestically under Make-in-India for Tejas Mk-1A and Mk-2 aircraft.',
      url: '/#current-affairs',
      badgeClass: 'badge-affair',
      icon: 'fa-newspaper',
      keywords: ['uttam radar', 'aesa', 'tejas', 'drdo', 'make in india', 'defense news']
    },

    // --- GOVERNMENT EXAMS ---
    {
      id: 'ex-1',
      type: 'exam',
      category: 'UPSC Recruitment',
      title: 'UPSC Civil Services Examination (CSE) 2026',
      description: 'Recruitment for IAS, IPS, IFS, IRS. Eligibility: Graduate degree. Prelims: May 24, 2026 | Mains: Sept 2026.',
      url: '/government-exams/detail.html?exam=upsc-civil-services',
      badgeClass: 'badge-exam',
      icon: 'fa-landmark',
      keywords: ['upsc', 'ias', 'ips', 'civil services', 'cse 2026', 'prelims', 'mains']
    },
    {
      id: 'ex-2',
      type: 'exam',
      category: 'SSC Recruitment',
      title: 'SSC Combined Graduate Level (CGL) Examination 2026',
      description: 'Recruitment for 14,500+ Group B & C posts. Eligibility: Bachelor’s degree. Tier-1 Computer Based Test.',
      url: '/government-exams/detail.html?exam=ssc-cgl',
      badgeClass: 'badge-exam',
      icon: 'fa-briefcase',
      keywords: ['ssc', 'cgl', 'staff selection commission', 'tier 1', 'tier 2', 'inspector', 'assistant']
    },
    {
      id: 'ex-3',
      type: 'exam',
      category: 'Railway Recruitment',
      title: 'RRB Non-Technical Popular Categories (NTPC) 2026',
      description: 'Recruitment for 11,558+ Station Master, Goods Guard, and Clerk posts. Eligibility: 12th / Graduate.',
      url: '/government-exams/detail.html?exam=rrb-ntpc',
      badgeClass: 'badge-exam',
      icon: 'fa-train',
      keywords: ['rrb', 'ntpc', 'railway exam', 'station master', 'goods guard', 'railway recruitment']
    },
    {
      id: 'ex-4',
      type: 'exam',
      category: 'Banking Recruitment',
      title: 'IBPS Probationary Officer (PO / MT) XIV 2026',
      description: 'Recruitment for 4,450+ Bank PO vacancies across nationalized commercial banks. Eligibility: Any Graduate.',
      url: '/government-exams/detail.html?exam=ibps-po',
      badgeClass: 'badge-exam',
      icon: 'fa-university',
      keywords: ['ibps', 'bank po', 'probationary officer', 'sbi', 'banking exam', 'prelims']
    },
    {
      id: 'ex-5',
      type: 'exam',
      category: 'Teaching Recruitment',
      title: 'Central Teacher Eligibility Test (CTET) 2026',
      description: 'National eligibility benchmark for appointment as primary (Paper 1) and upper-primary (Paper 2) teachers.',
      url: '/government-exams/detail.html?exam=ctet',
      badgeClass: 'badge-exam',
      icon: 'fa-chalkboard-user',
      keywords: ['ctet', 'teaching exam', 'cbse ctet', 'paper 1', 'paper 2', 'bed', 'deled']
    },
    {
      id: 'ex-6',
      type: 'exam',
      category: 'Defence Recruitment',
      title: 'NDA & NA Examination (I) 2026',
      description: 'Joint services entrance for Army, Navy, and Air Force wings of National Defence Academy. 12th Pass.',
      url: '/government-exams/detail.html?exam=nda',
      badgeClass: 'badge-exam',
      icon: 'fa-shield-halved',
      keywords: ['nda', 'national defence academy', 'cds', 'armed forces', 'khadakwasla', 'defence exam']
    },

    // --- STUDY MATERIALS ---
    {
      id: 'sm-1',
      type: 'study-material',
      category: 'Indian Polity Notes',
      title: 'Indian Polity 395 Articles & Constitutional Amendments Pocket Guide',
      description: 'Comprehensive high-yield table of Fundamental Rights, Directive Principles, Parliamentary Committees, and Amendments.',
      url: '/#study-materials',
      badgeClass: 'badge-material',
      icon: 'fa-book-open',
      keywords: ['polity guide', '395 articles', 'constitutional amendments', 'fundamental rights', 'study material pdf']
    },
    {
      id: 'sm-2',
      type: 'study-material',
      category: 'Geography Notes',
      title: 'Indian Rivers, Tributaries & Major Multipurpose Dams Map Chart',
      description: 'Color-coded drainage basin charts, river origins, left/right bank tributaries, waterfalls, and national waterways.',
      url: '/#study-materials',
      badgeClass: 'badge-material',
      icon: 'fa-map',
      keywords: ['river map', 'tributaries', 'dams chart', 'drainage map', 'geography notes pdf']
    },
    {
      id: 'sm-3',
      type: 'study-material',
      category: 'History Notes',
      title: 'Modern Indian History Timeline (1757 Battle of Plassey to 1947 Independence)',
      description: 'Chronological summary of British Viceroy acts, Indian National Congress sessions, tribal & peasant revolts.',
      url: '/#study-materials',
      badgeClass: 'badge-material',
      icon: 'fa-clock-rotate-left',
      keywords: ['history timeline', 'freedom struggle notes', 'plassey to independence', 'viceroys list', 'modern history pdf']
    },
    {
      id: 'sm-4',
      type: 'study-material',
      category: 'Aptitude & Formulas',
      title: 'Government Exam Quantitative Formulas & Mental Math Tricks Handbook',
      description: 'Shortcut tricks for Percentage, Ratio, Speed-Time-Distance, Work-Time, Permutations, and Data Interpretation.',
      url: '/#study-materials',
      badgeClass: 'badge-material',
      icon: 'fa-calculator',
      keywords: ['math shortcuts', 'quantitative formulas', 'mental math', 'speed time distance', 'aptitude tricks']
    },
    {
      id: 'sm-5',
      type: 'study-material',
      category: 'Current Affairs Digest',
      title: '2025-2026 Current Affairs Annual Digest: National & Global Milestones',
      description: 'Curated monthly roundups covering Science, Economy, Summits, Government Schemes, Sports, and Military Exercises.',
      url: '/#study-materials',
      badgeClass: 'badge-material',
      icon: 'fa-file-lines',
      keywords: ['current affairs digest', 'annual current affairs', 'exam capsule', '2026 roundups', 'current affairs pdf']
    },
    {
      id: 'page-contact',
      type: 'topic',
      category: 'Help Desk & Support',
      title: 'Contact GK India Academy — Official Academic Email & Inquiries',
      description: 'Reach our editorial desk at gkindiaacademy100@gmail.com. Submit question key corrections, exam syllabus queries, and join YouTube & Telegram groups.',
      url: '/contact.html',
      badgeClass: 'badge-topic',
      icon: 'fa-headset',
      keywords: ['contact', 'email', 'support', 'help', 'gkindiaacademy100@gmail.com', 'inquiry', 'correction', 'feedback', 'telegram', 'youtube channel']
    }
  ];

  // Popular search queries for instant discovery
  const POPULAR_SEARCHES = [
    'Fundamental Rights',
    'UPSC CSE 2026',
    'Indian River Systems',
    'Monetary Policy & RBI',
    'ISRO Space Missions',
    'SSC CGL Examination',
    'Quick Lime',
    'Indus Valley Civilization',
    'Study Materials PDF'
  ];

  // Active state
  let currentActiveTab = 'all';
  let focusedResultIndex = -1;
  let currentQuery = '';

  // --- 2. Build and Inject Search Modal Markup into Document ---
  function injectSearchModal() {
    if (document.getElementById('globalSearchModal')) return;

    const modalHtml = `
      <div id="globalSearchModal" class="search-modal-overlay" role="dialog" aria-modal="true" aria-label="Global Academy Search">
        <div class="search-modal-card" id="searchModalCard">
          
          <!-- Search Header Input -->
          <div class="search-input-wrapper">
            <i class="fas fa-search search-input-icon"></i>
            <input 
              type="text" 
              id="globalSearchInput" 
              class="search-main-input" 
              placeholder="Search topics, questions, current affairs, exams, notes..." 
              autocomplete="off" 
              spellcheck="false" 
              aria-label="Search Academy"
            />
            <button type="button" id="searchClearBtn" class="search-clear-btn" aria-label="Clear Search Input" title="Clear">
              <i class="fas fa-times"></i>
            </button>
            <span class="search-esc-badge" id="searchCloseBtn" title="Close Search (Esc)">ESC</span>
          </div>

          <!-- Category Filter Pills -->
          <div class="search-filter-pills" id="searchFilterPills" role="tablist">
            <button type="button" class="search-pill-btn is-active" data-type="all" role="tab" aria-selected="true">
              <i class="fas fa-globe"></i> All (<span id="count-all">0</span>)
            </button>
            <button type="button" class="search-pill-btn" data-type="topic" role="tab" aria-selected="false">
              <i class="fas fa-layer-group"></i> Topics (<span id="count-topic">0</span>)
            </button>
            <button type="button" class="search-pill-btn" data-type="question" role="tab" aria-selected="false">
              <i class="fas fa-circle-question"></i> Questions (<span id="count-question">0</span>)
            </button>
            <button type="button" class="search-pill-btn" data-type="current-affairs" role="tab" aria-selected="false">
              <i class="fas fa-newspaper"></i> Current Affairs (<span id="count-current-affairs">0</span>)
            </button>
            <button type="button" class="search-pill-btn" data-type="exam" role="tab" aria-selected="false">
              <i class="fas fa-award"></i> Exams (<span id="count-exam">0</span>)
            </button>
            <button type="button" class="search-pill-btn" data-type="study-material" role="tab" aria-selected="false">
              <i class="fas fa-book-open"></i> Study Materials (<span id="count-study-material">0</span>)
            </button>
          </div>

          <!-- Results Scroll Area -->
          <div class="search-results-container" id="searchResultsContainer">
            <!-- Results or Default Popular Searches rendered here -->
          </div>

          <!-- Modal Footer with Keyboard Shortcuts -->
          <div class="search-modal-footer">
            <div class="search-footer-shortcuts">
              <span class="shortcut-hint"><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
              <span class="shortcut-hint"><kbd>↵</kbd> Select</span>
              <span class="shortcut-hint"><kbd>ESC</kbd> Close</span>
            </div>
            <div>
              <strong>GK India Academy</strong> Search Engine
            </div>
          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  // --- 3. Helper: Highlight Matching Substrings ---
  function highlightMatch(text, query) {
    if (!query || !text) return text;
    const cleanQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${cleanQuery})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  // --- 4. Search Filter Algorithm ---
  function searchDatabase(query, filterType) {
    if (!query || !query.trim()) {
      return [];
    }

    const q = query.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);

    const matches = SEARCH_DATABASE.filter(item => {
      // Filter by category pill if not 'all'
      if (filterType !== 'all' && item.type !== filterType) {
        return false;
      }

      const titleLower = item.title.toLowerCase();
      const descLower = item.description.toLowerCase();
      const catLower = item.category.toLowerCase();
      const keywordsStr = (item.keywords || []).join(' ').toLowerCase();

      // Check if all tokens match anywhere in title, desc, category, or keywords
      return tokens.every(token => {
        return (
          titleLower.includes(token) ||
          descLower.includes(token) ||
          catLower.includes(token) ||
          keywordsStr.includes(token)
        );
      });
    });

    // Score relevance: Title matches rank higher
    matches.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const aStarts = aTitle.startsWith(q);
      const bStarts = bTitle.startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });

    return matches;
  }

  // Update counter badges on filter pills
  function updatePillCounts(query) {
    const types = ['all', 'topic', 'question', 'current-affairs', 'exam', 'study-material'];
    types.forEach(t => {
      const count = searchDatabase(query, t).length;
      const el = document.getElementById(`count-${t}`);
      if (el) el.textContent = count;
    });
  }

  // --- 5. Render Search Results or Popular Searches ---
  function renderSearchResults() {
    const container = document.getElementById('searchResultsContainer');
    const clearBtn = document.getElementById('searchClearBtn');
    if (!container) return;

    if (currentQuery.trim()) {
      if (clearBtn) clearBtn.style.display = 'flex';
    } else {
      if (clearBtn) clearBtn.style.display = 'none';
    }

    // A. Empty Input: Display Popular Searches & Category Shortcuts
    if (!currentQuery.trim()) {
      updatePillCounts('');
      container.innerHTML = `
        <div class="search-default-state">
          <div class="search-state-title">
            <i class="fas fa-fire text-orange"></i> Popular Search Topics
          </div>
          <div class="search-tags-cloud">
            ${POPULAR_SEARCHES.map(tag => `
              <button type="button" class="search-tag-chip" data-search="${tag}">
                <i class="fas fa-magnifying-glass" style="font-size:0.75rem; color:#f59e0b;"></i>
                <span>${tag}</span>
              </button>
            `).join('')}
          </div>

          <div class="search-state-title" style="margin-top: 24px;">
            <i class="fas fa-layer-group text-blue"></i> Quick Resource Navigation
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-top: 10px;">
            <a href="/mcqs/all" class="search-tag-chip" style="justify-content: flex-start;">
              <i class="fas fa-circle-question text-green"></i> Practice MCQs Portal
            </a>
            <a href="/government-exams" class="search-tag-chip" style="justify-content: flex-start;">
              <i class="fas fa-award text-purple"></i> Government Exams
            </a>
            <a href="/subjects/indian-geography.html" class="search-tag-chip" style="justify-content: flex-start;">
              <i class="fas fa-book-open text-gold"></i> GK Subjects Directory
            </a>
            <a href="/#current-affairs" class="search-tag-chip" style="justify-content: flex-start;">
              <i class="fas fa-newspaper text-orange"></i> Daily Current Affairs
            </a>
          </div>
        </div>
      `;

      // Wire tag chips
      container.querySelectorAll('.search-tag-chip[data-search]').forEach(chip => {
        chip.addEventListener('click', () => {
          const val = chip.getAttribute('data-search');
          const input = document.getElementById('globalSearchInput');
          if (input) {
            input.value = val;
            currentQuery = val;
            renderSearchResults();
          }
        });
      });
      return;
    }

    // B. Query Active: Run Search Filter
    updatePillCounts(currentQuery);
    const results = searchDatabase(currentQuery, currentActiveTab);

    // B1. No results found
    if (results.length === 0) {
      container.innerHTML = `
        <div class="search-no-results">
          <i class="fas fa-file-circle-question"></i>
          <h4>No results found for "${escapeHtml(currentQuery)}"</h4>
          <p>Try searching for broader keywords like <strong>"Polity"</strong>, <strong>"UPSC"</strong>, <strong>"Ganga"</strong>, or <strong>"MCQ"</strong>.</p>
        </div>
      `;
      return;
    }

    // B2. Render Matching Result Items
    const categoryLabels = {
      'topic': 'Topic',
      'question': 'MCQ Question',
      'current-affairs': 'Current Affairs',
      'exam': 'Govt Exam',
      'study-material': 'Study Notes'
    };

    let resultsHtml = `
      <div class="search-meta-bar">
        <span>Found <strong>${results.length}</strong> matching results</span>
        <span>Filter: <strong>${currentActiveTab.toUpperCase()}</strong></span>
      </div>
    `;

    results.forEach((item, idx) => {
      const isSelected = (idx === focusedResultIndex);
      const highlightedTitle = highlightMatch(item.title, currentQuery);
      const highlightedDesc = highlightMatch(item.description, currentQuery);

      resultsHtml += `
        <a href="${item.url}" class="search-result-item ${isSelected ? 'is-selected' : ''}" data-idx="${idx}" data-url="${item.url}">
          <div class="search-item-icon-box ${item.badgeClass}">
            <i class="fas ${item.icon}"></i>
          </div>
          <div class="search-item-content">
            <div class="search-item-top">
              <span class="search-item-tag ${item.badgeClass}">${categoryLabels[item.type] || item.type}</span>
              <span class="search-item-meta">• ${escapeHtml(item.category)}</span>
            </div>
            <div class="search-item-title">${highlightedTitle}</div>
            <div class="search-item-desc">${highlightedDesc}</div>
          </div>
          <div class="search-item-arrow"><i class="fas fa-chevron-right"></i></div>
        </a>
      `;
    });

    container.innerHTML = resultsHtml;

    // Item click / hover listener
    container.querySelectorAll('.search-result-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        container.querySelectorAll('.search-result-item').forEach(i => i.classList.remove('is-selected'));
        el.classList.add('is-selected');
        focusedResultIndex = parseInt(el.getAttribute('data-idx'), 10);
      });
      el.addEventListener('click', () => {
        closeSearchModal();
      });
    });
  }

  // --- 6. Modal Open / Close Logic ---
  function openSearchModal(initialQuery = '') {
    const modal = document.getElementById('globalSearchModal');
    const input = document.getElementById('globalSearchInput');
    if (!modal) return;

    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    if (input) {
      if (initialQuery) {
        input.value = initialQuery;
        currentQuery = initialQuery;
      }
      setTimeout(() => input.focus(), 50);
    }
    renderSearchResults();
  }

  function closeSearchModal() {
    const modal = document.getElementById('globalSearchModal');
    if (!modal) return;

    modal.classList.remove('is-active');
    document.body.style.overflow = '';
    focusedResultIndex = -1;
  }

  // Helper escape
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // --- 7. Event Handlers & Initializer ---
  function initGlobalSearch() {
    injectSearchModal();

    const modal = document.getElementById('globalSearchModal');
    const input = document.getElementById('globalSearchInput');
    const clearBtn = document.getElementById('searchClearBtn');
    const closeBtn = document.getElementById('searchCloseBtn');
    const filterPills = document.getElementById('searchFilterPills');

    // 1. Live Input debounced
    let debounceTimer;
    if (input) {
      input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          currentQuery = input.value;
          focusedResultIndex = -1;
          renderSearchResults();
        }, 120);
      });
    }

    // 2. Clear input
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (input) {
          input.value = '';
          currentQuery = '';
          input.focus();
          renderSearchResults();
        }
      });
    }

    // 3. Close button
    if (closeBtn) closeBtn.addEventListener('click', closeSearchModal);

    // 4. Click outside card to close
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeSearchModal();
      });
    }

    // 5. Category Pills click
    if (filterPills) {
      filterPills.querySelectorAll('.search-pill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          filterPills.querySelectorAll('.search-pill-btn').forEach(b => {
            b.classList.remove('is-active');
            b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('is-active');
          btn.setAttribute('aria-selected', 'true');
          currentActiveTab = btn.getAttribute('data-type') || 'all';
          renderSearchResults();
        });
      });
    }

    // 6. Global Keyboard Shortcuts: Ctrl+K / Cmd+K / Slash ('/') to Open
    window.addEventListener('keydown', (e) => {
      const activeEl = document.activeElement;
      const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);

      // Open on Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const isOpen = modal && modal.classList.contains('is-active');
        if (isOpen) closeSearchModal();
        else openSearchModal();
        return;
      }

      // Open on '/' if not typing in an input
      if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        openSearchModal();
        return;
      }

      // If modal is active:
      if (modal && modal.classList.contains('is-active')) {
        // Close on ESC
        if (e.key === 'Escape') {
          e.preventDefault();
          closeSearchModal();
          return;
        }

        // Arrow navigation
        const items = modal.querySelectorAll('.search-result-item');
        if (items.length > 0) {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            focusedResultIndex = (focusedResultIndex + 1) % items.length;
            highlightFocusedItem(items);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            focusedResultIndex = (focusedResultIndex - 1 + items.length) % items.length;
            highlightFocusedItem(items);
          } else if (e.key === 'Enter') {
            if (focusedResultIndex >= 0 && items[focusedResultIndex]) {
              e.preventDefault();
              const url = items[focusedResultIndex].getAttribute('data-url');
              if (url) {
                closeSearchModal();
                window.location.href = url;
              }
            }
          }
        }
      }
    });

    function highlightFocusedItem(items) {
      items.forEach((item, idx) => {
        if (idx === focusedResultIndex) {
          item.classList.add('is-selected');
          item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
          item.classList.remove('is-selected');
        }
      });
    }

    // 7. Wire all trigger buttons present on page
    document.querySelectorAll('.btn-global-search-trigger, #globalSearchBtn, #mobileSearchBtn, #searchToggleBtn, .search-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openSearchModal();
      });
    });

    const mobileInput = document.getElementById('mobileSearchInput');
    if (mobileInput) {
      mobileInput.addEventListener('click', (e) => {
        e.preventDefault();
        const drawer = document.getElementById('mobileDrawer');
        const overlay = document.getElementById('drawerOverlay');
        if (drawer) drawer.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        openSearchModal(mobileInput.value);
      });
    }
  }

  // Expose API globally
  window.GlobalSearch = {
    open: openSearchModal,
    close: closeSearchModal,
    search: searchDatabase
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalSearch);
  } else {
    initGlobalSearch();
  }
})();
