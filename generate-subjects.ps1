$root = $PSScriptRoot
$subjectsDir = Join-Path $root "subjects"

$subjects = @(
    @{
        Slug = "indian-history"
        Title = "Indian History"
        Icon = "fa-monument"
        Tag = "Indian History"
        Intro = "Comprehensive study material for Ancient, Medieval, and Modern Indian History, Indian Freedom Struggle, and prominent historical personalities for UPSC, SSC, and State Exams."
        BadgeExams = @("UPSC", "SSC CGL", "RRB NTPC", "State PSC", "Teaching Exams")
        Topics = @(
            "Indus Valley Civilization & Ancient Cities",
            "Vedic Period & Vedic Literature",
            "Buddhism & Jainism Doctrines",
            "Mauryan Empire & Ashoka Inscriptions",
            "Gupta Golden Age & Classical Art",
            "Post-Gupta Period & Harshavardhana",
            "South Indian Dynasties (Cholas, Pallavas)",
            "Delhi Sultanate Administration & Architecture",
            "Mughal Empire (Babur to Aurangzeb)",
            "Maratha Empire & Chhatrapati Shivaji",
            "Advent of Europeans & British Expansion",
            "Revolt of 1857 & Impact on Crown Rule",
            "Social & Religious Reform Movements",
            "Indian National Congress & Freedom Struggle",
            "Governors-General & Viceroys of India"
        )
        PrevSlug = "indian-geography"
        PrevTitle = "Indian Geography"
        NextSlug = "indian-polity"
        NextTitle = "Indian Polity"
    },
    @{
        Slug = "indian-polity"
        Title = "Indian Polity"
        Icon = "fa-scale-balanced"
        Tag = "Indian Polity"
        Intro = "Complete coverage of Indian Constitution, Governance, Political System, Panchayati Raj, Public Policy, Rights Issues, and Constitutional Bodies."
        BadgeExams = @("UPSC", "SSC CGL", "State PSC", "CDS", "Banking")
        Topics = @(
            "Making of Constitution & Preamble",
            "Fundamental Rights (Articles 12-35)",
            "Directive Principles of State Policy (DPSP)",
            "Fundamental Duties (Article 51A)",
            "President of India & Vice President",
            "Prime Minister & Union Council of Ministers",
            "Parliament: Lok Sabha, Rajya Sabha & Procedures",
            "Supreme Court of India & Judicial Review",
            "High Courts & Subordinate Judiciary",
            "Governor & State Legislature Dynamics",
            "Panchayati Raj & 73rd/74th Amendments",
            "Election Commission of India & Electoral Reforms",
            "Comptroller and Auditor General (CAG) & Attorney General",
            "Major Constitutional Amendments (42nd, 44th, 86th, 101st)",
            "Emergency Provisions (Articles 352, 356, 360)"
        )
        PrevSlug = "indian-history"
        PrevTitle = "Indian History"
        NextSlug = "indian-economy"
        NextTitle = "Indian Economy"
    },
    @{
        Slug = "indian-economy"
        Title = "Indian Economy"
        Icon = "fa-chart-line"
        Tag = "Indian Economy"
        Intro = "Essential concepts of Indian Economy, Economic Planning, Monetary & Fiscal Policies, Banking, Inflation, Agriculture, and External Trade."
        BadgeExams = @("UPSC", "SSC CGL", "RBI Grade B", "IBPS PO", "State PSC")
        Topics = @(
            "National Income Accounting (GDP, GNP, NNP)",
            "Economic Planning in India & NITI Aayog",
            "Reserve Bank of India & Monetary Policy Tools",
            "Commercial Banking Structure & Banking Reforms",
            "Inflation Metrics: CPI, WPI & Mitigation",
            "Union Budget, Revenue vs Capital Expenditure",
            "Indian Tax System, Direct Taxes & GST Framework",
            "Agricultural Economy, MSP & Food Security",
            "Industrial Sector, Make in India & MSMEs",
            "Foreign Trade, Balance of Payments & Forex Reserves",
            "Capital Markets, SEBI & Stock Exchanges",
            "Poverty Estimation & Inequality Reduction",
            "Financial Inclusion (Jan Dhan, UPI, Direct Benefit Transfer)",
            "Infrastructure Development & PM Gati Shakti",
            "International Institutions (IMF, World Bank, WTO)"
        )
        PrevSlug = "indian-polity"
        PrevTitle = "Indian Polity"
        NextSlug = "general-science"
        NextTitle = "General Science"
    },
    @{
        Slug = "general-science"
        Title = "General Science"
        Icon = "fa-atom"
        Tag = "General Science"
        Intro = "Everyday Physics, Chemistry, Biology, and Contemporary Scientific Discoveries tailored for competitive examinations."
        BadgeExams = @("RRB NTPC", "SSC CGL", "UPSC", "State PSC", "Defence")
        Topics = @(
            "Mechanics, Gravitation & Laws of Motion",
            "Optics, Reflection, Refraction & Human Eye",
            "Sound, Waves & Electromagnetic Spectrum",
            "Electricity, Magnetism & Everyday Circuits",
            "Nuclear Physics & Radioactivity",
            "Atomic Structure & Chemical Periodic Table",
            "Acids, Bases, Salts & pH Scale in Daily Life",
            "Metals, Non-Metals & Important Alloys",
            "Carbon Compounds & Organic Chemistry",
            "Cell Biology, Organelles & Cell Division",
            "Human Anatomy: Circulatory, Digestive & Nervous Systems",
            "Infectious Diseases, Immunity & Vaccines",
            "Vitamins, Minerals & Deficiency Disorders",
            "Plant Physiology, Photosynthesis & Hormones",
            "Space Technology, ISRO Missions & Chandrayaan"
        )
        PrevSlug = "indian-economy"
        PrevTitle = "Indian Economy"
        NextSlug = "environment-ecology"
        NextTitle = "Environment & Ecology"
    },
    @{
        Slug = "environment-ecology"
        Title = "Environment & Ecology"
        Icon = "fa-leaf"
        Tag = "Environment & Ecology"
        Intro = "Ecology principles, Biodiversity, Wildlife Conservation, Climate Change, International Conventions, and National Parks of India."
        BadgeExams = @("UPSC CSE", "State PSC", "Forest Service", "SSC CGL")
        Topics = @(
            "Ecosystem Ecology, Trophic Levels & Food Webs",
            "Biogeochemical Cycles (Carbon, Nitrogen, Phosphorus)",
            "Biodiversity Conservation & Hotspots in India",
            "National Parks of India: State-wise Directory",
            "Wildlife Sanctuaries & Biosphere Reserves",
            "Project Tiger & Critical Tiger Habitats",
            "Ramsar Wetlands of International Importance",
            "IUCN Red List Categories & Endangered Fauna",
            "Climate Change, IPCC Reports & Greenhouse Effect",
            "Air, Water, Plastic & E-Waste Management",
            "Renewable Energy & India Net-Zero 2070 Target",
            "Wildlife Protection Act 1972 & Forest Rights Act",
            "International Environmental Agreements (UNFCCC, CBD)",
            "State of India Forest Report (ISFR) Key Findings",
            "Sustainable Development Goals (SDGs 2030)"
        )
        PrevSlug = "general-science"
        PrevTitle = "General Science"
        NextSlug = "art-culture"
        NextTitle = "Art & Culture"
    },
    @{
        Slug = "art-culture"
        Title = "Art & Culture"
        Icon = "fa-palette"
        Tag = "Art & Culture"
        Intro = "Indian Architecture, Classical & Folk Dances, Music, Paintings, UNESCO World Heritage Sites, Fairs, Festivals, and Literature."
        BadgeExams = @("UPSC CSE", "State PSC", "SSC CGL", "Teaching")
        Topics = @(
            "Indian Temple Architecture (Nagara, Dravida, Vesara)",
            "Rock-Cut Architecture (Ajanta, Ellora, Elephanta)",
            "Indo-Islamic Monuments & Mughal Architecture",
            "Eight Classical Dance Forms of India",
            "Folk Dances Across Indian States",
            "Hindustani and Carnatic Classical Music Systems",
            "Traditional Musical Instruments of India",
            "Folk Painting Traditions (Madhubani, Pattachitra, Warli)",
            "UNESCO World Cultural & Natural Heritage Sites in India",
            "Important Fairs & Cultural Festivals of India",
            "Puppetry Forms & Traditional Theatre of India",
            "Martial Arts Traditions (Kalaripayattu, Thang-Ta, Gatka)",
            "Ancient Literature, Epics & Sangam Texts",
            "Six Schools of Classical Indian Philosophy",
            "Bhakti Movement & Sufi Saints Contribution"
        )
        PrevSlug = "environment-ecology"
        PrevTitle = "Environment & Ecology"
        NextSlug = "static-gk"
        NextTitle = "Static GK"
    },
    @{
        Slug = "static-gk"
        Title = "Static GK"
        Icon = "fa-star"
        Tag = "Static GK"
        Intro = "Fact-based static general knowledge covering Firsts in India, World Superlatives, Currencies, Capitals, Dams, Stadiums, and Airports."
        BadgeExams = @("SSC CGL", "Railway NTPC", "Banking", "Police", "Defence")
        Topics = @(
            "First in India: Male & Female Personalities",
            "First in the World: Explorers, Leaders & Pioneers",
            "Superlatives of India: Longest, Highest, Largest",
            "Superlatives of the World: Extreme Geographical Facts",
            "World Countries, Capitals & Official Currencies",
            "International Organizations & Global Headquarters",
            "Major Multipurpose Dams & Reservoirs in India",
            "Major Sea Ports of India & Coastlines",
            "International & Domestic Airports in India",
            "National Symbols, Emblem, Anthem & Heritage Animals",
            "Prominent Cricket & Multi-Sport Stadiums",
            "Thermal, Hydel & Nuclear Power Plants in India",
            "Famous Nicknames of Indian Cities (Sobriquets)",
            "Folk Cultures, Tribes & Habitat Distribution",
            "Major Scientific Inventions & Notable Inventors"
        )
        PrevSlug = "art-culture"
        PrevTitle = "Art & Culture"
        NextSlug = "computer-knowledge"
        NextTitle = "Computer Knowledge"
    },
    @{
        Slug = "computer-knowledge"
        Title = "Computer Knowledge"
        Icon = "fa-computer"
        Tag = "Computer Knowledge"
        Intro = "Computer fundamentals, Operating Systems, Networking, Internet, MS Office shortcuts, and Cyber Security for Banking & SSC exams."
        BadgeExams = @("IBPS PO/Clerk", "SBI PO", "SSC CGL Tier-2", "RRB NTPC")
        Topics = @(
            "Generations of Computers & Architecture",
            "Hardware Components, Input & Output Peripherals",
            "Memory Hierarchy: Registers, Cache, RAM, ROM, SSD",
            "Operating Systems (Windows, Linux, Mobile OS)",
            "Microsoft Word: Formatting, Macros & Shortcut Keys",
            "Microsoft Excel: Formulas, Functions, VLOOKUP & Pivots",
            "Microsoft PowerPoint: Presentations & Slide Master",
            "Computer Networking: OSI Model, Topologies & Devices",
            "Internet Protocols: TCP/IP, HTTP/HTTPS, DNS & FTP",
            "Cyber Security, Types of Malware & Phishing Defence",
            "Database Concepts: DBMS, RDBMS, Primary Keys & SQL",
            "Binary, Hexadecimal & Number System Conversions",
            "Cloud Computing Models (IaaS, PaaS, SaaS)",
            "Common Computer Abbreviations & Acronyms",
            "Comprehensive Windows & Office Keyboard Shortcuts"
        )
        PrevSlug = "static-gk"
        PrevTitle = "Static GK"
        NextSlug = "sports"
        NextTitle = "Sports"
    },
    @{
        Slug = "sports"
        Title = "Sports"
        Icon = "fa-medal"
        Tag = "Sports"
        Intro = "National & International sports events, Olympic Games, Grand Slams, Cricket, Trophies, Terminology, and Famous Athletes."
        BadgeExams = @("SSC CGL", "Railway NTPC", "State PSC", "Police", "Banking")
        Topics = @(
            "Olympic Games: History, Motto, Symbols & Indian Medalists",
            "Paralympic Games & India Remarkable Achievements",
            "Asian Games & Commonwealth Games Medal Records",
            "ICC Cricket World Cups, T20 World Cups & Records",
            "FIFA World Cup & Prestigious Football Tournaments",
            "Tennis Grand Slams (Australian, French, Wimbledon, US)",
            "Badminton BWF World Tours & Thomas/Uber Cups",
            "National Games of India & Khelo India Youth Games",
            "Famous Sports Trophies, Cups & Associated Games",
            "Legendary Sports Personalities of India",
            "Sports Terminology & Technical Jargon",
            "Number of Players, Pitch & Court Dimensions",
            "National Sports of Different Countries Around the World",
            "National Sports Awards: Khel Ratna, Arjuna, Dronacharya",
            "Sports Headquarters & Governing Bodies (IOC, FIFA, ICC)"
        )
        PrevSlug = "computer-knowledge"
        PrevTitle = "Computer Knowledge"
        NextSlug = "awards-honours"
        NextTitle = "Awards & Honours"
    },
    @{
        Slug = "awards-honours"
        Title = "Awards & Honours"
        Icon = "fa-trophy"
        Tag = "Awards & Honours"
        Intro = "Civilian awards, Military decorations, Literary prizes, International honors, and Cinema awards for all competitive exams."
        BadgeExams = @("UPSC", "SSC CGL", "Railway", "Banking", "State PSC")
        Topics = @(
            "Bharat Ratna: Complete Recipient List & History",
            "Padma Vibhushan, Padma Bhushan & Padma Shri Rules",
            "Wartime & Peacetime Gallantry Awards (Param Vir Chakra)",
            "Nobel Prizes: Category-wise Pioneers & Indian Laureates",
            "Ramon Magsaysay Award: Asia Nobel & Indian Winners",
            "Man Booker Prize & International Booker Honors",
            "Dadasaheb Phalke Award & National Film Awards",
            "Academy Awards (Oscars) & Golden Globe Recognition",
            "Jnanpith Award & Sahitya Akademi Recognitions",
            "Saraswati Samman, Vyas Samman & Bihari Puraskar",
            "Shanti Swarup Bhatnagar Prize for Science & Tech",
            "International Gandhi Peace Prize & Indira Peace Prize",
            "Abel Prize, Fields Medal & World Food Prize",
            "Pulitzer Prize, Emmy Awards & Grammy Honors",
            "Major International Human Rights & Climate Honors"
        )
        PrevSlug = "sports"
        PrevTitle = "Sports"
        NextSlug = "important-days"
        NextTitle = "Important Days"
    },
    @{
        Slug = "important-days"
        Title = "Important Days"
        Icon = "fa-calendar-days"
        Tag = "Important Days"
        Intro = "Chronological calendar of National and International commemorative days, UN themes, and historical anniversaries throughout the year."
        BadgeExams = @("SSC CGL", "Banking Exams", "Railway NTPC", "State PSC")
        Topics = @(
            "Important Days in January (Youth Day, Army Day, Republic Day)",
            "Important Days in February (Cancer Day, National Science Day)",
            "Important Days in March (Women Day, Consumer Day, Water Day)",
            "Important Days in April (Health Day, Earth Day, Heritage Day)",
            "Important Days in May (Labour Day, Red Cross Day, Biodiversity)",
            "Important Days in June (Environment Day, Yoga Day, Statistics)",
            "Important Days in July (Doctors Day, World Population, Kargil)",
            "Important Days in August (Handloom Day, Independence, Sports Day)",
            "Important Days in September (Teachers Day, Hindi Diwas, Ozone)",
            "Important Days in October (Gandhi Jayanti, Air Force, UN Day)",
            "Important Days in November (Children Day, Constitution Day)",
            "Important Days in December (AIDS Day, Navy Day, Human Rights)",
            "National Awareness Weeks Celebrated in India",
            "United Nations Decades & International Theme Years",
            "Historical Milestones & National Anniversaries Calendar"
        )
        PrevSlug = "awards-honours"
        PrevTitle = "Awards & Honours"
        NextSlug = "indian-geography"
        NextTitle = "Indian Geography"
    }
)

foreach ($s in $subjects) {
    $outPath = Join-Path $subjectsDir "$($s.Slug).html"
    
    $topicCardsHtml = ""
    $i = 1
    foreach ($t in $s.Topics) {
        $numStr = if ($i -lt 10) { "Topic 0$i" } else { "Topic $i" }
        $topicCardsHtml += @"
          <div class="topic-card">
            <span class="topic-card-num">$numStr</span>
            <h3 class="topic-card-title">$t</h3>
            <a href="../mcqs/index.html?category=$($s.Slug)" class="topic-card-btn"><i class="fas fa-book-open"></i> Practice MCQs</a>
          </div>

"@
        $i++
    }

    $badgeHtml = ""
    foreach ($b in $s.BadgeExams) {
        $badgeHtml += "<span class=`"exam-badge-pill`"><i class=`"fas fa-check-circle`"></i> $b</span>`n          "
    }

    $pageHtml = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>$($s.Title) | GK India Academy</title>
  <meta name="description" content="$($s.Intro)" />
  <link rel="icon" type="image/png" href="../assets/logo.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <link rel="stylesheet" href="../styles.css" />
  <link rel="stylesheet" href="../search.css" />
</head>
<body>
  <!-- Top Announcement Bar -->
  <div class="top-announcement-bar">
    <div class="container announcement-content">
      <div class="announcement-left">
        <span class="badge-new">NEW</span>
        <span class="announcement-text"><i class="fas fa-bullhorn"></i> Daily Current Affairs &amp; 2026 Exam Practice Sets are now live!</span>
      </div>
      <div class="announcement-right">
        <a href="../index.html#daily-mcq" class="announcement-link"><i class="fas fa-bolt"></i> Daily 1-Min Quiz</a>
        <span class="divider-dot">•</span>
        <a href="../index.html#youtube" class="announcement-link"><i class="fab fa-youtube text-red"></i> Watch Video Classes</a>
      </div>
    </div>
  </div>

  <!-- Header -->
  <header class="site-header" id="siteHeader">
    <div class="container header-container">
      <a href="../index.html" class="brand-logo-wrap" aria-label="GK India Academy Home">
        <img src="../assets/logo.png" alt="GK India Academy Logo" class="brand-logo-img" onerror="this.style.display='none'; this.nextElementSibling.classList.add('logo-fallback-visible');" />
        <div class="brand-logo-fallback"><i class="fas fa-graduation-cap"></i></div>
        <div class="brand-text-block">
          <span class="brand-title">GK INDIA ACADEMY</span>
          <span class="brand-tagline">Prepare Smart. Learn More. Succeed.</span>
        </div>
      </a>
      <nav class="desktop-nav" aria-label="Main Navigation">
        <ul class="nav-links-list">
          <li><a href="../index.html" class="nav-link">Home</a></li>
          <li class="nav-item-dropdown" id="gkNavDropdown">
            <button class="nav-link-dropdown active" id="gkDropdownBtn" aria-haspopup="true" aria-expanded="false">
              GK <i class="fas fa-chevron-down dropdown-caret"></i>
            </button>
            <div class="gk-dropdown-menu" id="gkDropdownMenu" role="menu">
              <div class="dropdown-section-label"><i class="fas fa-book-open"></i> Subjects</div>
              <a href="indian-geography.html" class="dropdown-subject-link" role="menuitem"><span class="subj-icon"><i class="fas fa-mountain-sun"></i></span> Indian Geography</a>
              <a href="indian-history.html" class="dropdown-subject-link" role="menuitem"><span class="subj-icon"><i class="fas fa-monument"></i></span> Indian History</a>
              <a href="indian-polity.html" class="dropdown-subject-link" role="menuitem"><span class="subj-icon"><i class="fas fa-scale-balanced"></i></span> Indian Polity</a>
              <a href="indian-economy.html" class="dropdown-subject-link" role="menuitem"><span class="subj-icon"><i class="fas fa-chart-line"></i></span> Indian Economy</a>
              <a href="general-science.html" class="dropdown-subject-link" role="menuitem"><span class="subj-icon"><i class="fas fa-atom"></i></span> General Science</a>
              <a href="environment-ecology.html" class="dropdown-subject-link" role="menuitem"><span class="subj-icon"><i class="fas fa-leaf"></i></span> Environment &amp; Ecology</a>
              <a href="art-culture.html" class="dropdown-subject-link" role="menuitem"><span class="subj-icon"><i class="fas fa-palette"></i></span> Art &amp; Culture</a>
              <a href="static-gk.html" class="dropdown-subject-link" role="menuitem"><span class="subj-icon"><i class="fas fa-star"></i></span> Static GK</a>
              <a href="computer-knowledge.html" class="dropdown-subject-link" role="menuitem"><span class="subj-icon"><i class="fas fa-computer"></i></span> Computer Knowledge</a>
              <a href="sports.html" class="dropdown-subject-link" role="menuitem"><span class="subj-icon"><i class="fas fa-medal"></i></span> Sports</a>
              <a href="awards-honours.html" class="dropdown-subject-link" role="menuitem"><span class="subj-icon"><i class="fas fa-trophy"></i></span> Awards &amp; Honours</a>
              <a href="important-days.html" class="dropdown-subject-link" role="menuitem"><span class="subj-icon"><i class="fas fa-calendar-days"></i></span> Important Days</a>
            </div>
          </li>
          <li><a href="../index.html#current-affairs" class="nav-link">Current Affairs</a></li>
          <li><a href="../index.html#exam-prep" class="nav-link">Exams</a></li>
          <li><a href="../index.html#youtube" class="nav-link">Videos</a></li>
          <li><a href="../index.html#why-us" class="nav-link">About</a></li>
          <li><a href="../index.html#start-learning" class="nav-link">Contact</a></li>
        </ul>
      </nav>
      <div class="header-actions">
        <button class="btn-global-search-trigger" id="globalSearchBtn" aria-label="Search Academy" title="Search Academy (Ctrl+K or /)">
          <i class="fas fa-search"></i>
          <span class="search-trigger-text">Search...</span>
          <kbd class="search-kbd-badge">Ctrl+K</kbd>
        </button>
        <a href="../index.html#categories" class="btn btn-primary btn-header-cta">
          <span>Start Learning</span><i class="fas fa-arrow-right"></i>
        </a>
        <button class="hamburger-btn" id="hamburgerBtn" aria-label="Toggle Navigation Menu" aria-expanded="false">
          <span class="hamburger-line"></span><span class="hamburger-line"></span><span class="hamburger-line"></span>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Drawer -->
  <div class="mobile-drawer-overlay" id="drawerOverlay"></div>
  <aside class="mobile-nav-drawer" id="mobileDrawer" aria-label="Mobile Navigation">
    <div class="drawer-header">
      <div class="drawer-brand">
        <img src="../assets/logo.png" alt="Logo" class="drawer-logo-img" onerror="this.style.display='none'" />
        <div><strong class="drawer-brand-title">GK INDIA ACADEMY</strong><p class="drawer-brand-sub">Prepare Smart. Learn More. Succeed.</p></div>
      </div>
      <button class="drawer-close-btn" id="drawerCloseBtn" aria-label="Close Menu"><i class="fas fa-times"></i></button>
    </div>
    <ul class="drawer-links-list">
      <li><a href="../index.html" class="drawer-link"><i class="fas fa-home"></i> Home</a></li>
      <li class="drawer-gk-section">
        <button class="drawer-gk-toggle open" id="drawerGkToggle" aria-expanded="true">
          <span class="drawer-gk-label"><i class="fas fa-book-open"></i> GK</span>
          <i class="fas fa-chevron-down drawer-gk-caret"></i>
        </button>
        <div class="drawer-gk-subjects open" id="drawerGkSubjects">
          <a href="indian-geography.html" class="drawer-gk-subject-link"><i class="fas fa-mountain-sun"></i> Indian Geography</a>
          <a href="indian-history.html" class="drawer-gk-subject-link"><i class="fas fa-monument"></i> Indian History</a>
          <a href="indian-polity.html" class="drawer-gk-subject-link"><i class="fas fa-scale-balanced"></i> Indian Polity</a>
          <a href="indian-economy.html" class="drawer-gk-subject-link"><i class="fas fa-chart-line"></i> Indian Economy</a>
          <a href="general-science.html" class="drawer-gk-subject-link"><i class="fas fa-atom"></i> General Science</a>
          <a href="environment-ecology.html" class="drawer-gk-subject-link"><i class="fas fa-leaf"></i> Environment &amp; Ecology</a>
          <a href="art-culture.html" class="drawer-gk-subject-link"><i class="fas fa-palette"></i> Art &amp; Culture</a>
          <a href="static-gk.html" class="drawer-gk-subject-link"><i class="fas fa-star"></i> Static GK</a>
          <a href="computer-knowledge.html" class="drawer-gk-subject-link"><i class="fas fa-computer"></i> Computer Knowledge</a>
          <a href="sports.html" class="drawer-gk-subject-link"><i class="fas fa-medal"></i> Sports</a>
          <a href="awards-honours.html" class="drawer-gk-subject-link"><i class="fas fa-trophy"></i> Awards &amp; Honours</a>
          <a href="important-days.html" class="drawer-gk-subject-link"><i class="fas fa-calendar-days"></i> Important Days</a>
        </div>
      </li>
      <li><a href="../index.html#current-affairs" class="drawer-link"><i class="fas fa-newspaper"></i> Current Affairs</a></li>
      <li><a href="../index.html#exam-prep" class="drawer-link"><i class="fas fa-award"></i> Exams</a></li>
      <li><a href="../index.html#youtube" class="drawer-link text-youtube"><i class="fab fa-youtube"></i> YouTube Channel</a></li>
    </ul>
    <div class="drawer-footer">
      <a href="../index.html#categories" class="btn btn-primary btn-block"><span>Start Learning</span><i class="fas fa-arrow-right"></i></a>
    </div>
  </aside>

  <main>
    <!-- Breadcrumb -->
    <div class="breadcrumb-bar">
      <div class="container">
        <nav class="breadcrumb-list" aria-label="Breadcrumb">
          <a href="../index.html">Home</a>
          <span class="breadcrumb-sep"><i class="fas fa-chevron-right"></i></span>
          <a href="../gk.html">GK</a>
          <span class="breadcrumb-sep"><i class="fas fa-chevron-right"></i></span>
          <a href="../gk.html">Subjects</a>
          <span class="breadcrumb-sep"><i class="fas fa-chevron-right"></i></span>
          <span class="breadcrumb-current">$($s.Title)</span>
        </nav>
      </div>
    </div>

    <!-- Subject Hero -->
    <section class="subject-hero">
      <div class="container subject-hero-content">
        <div class="subject-tag-pill"><i class="fas $($s.Icon)"></i> GK Subjects</div>
        <h1 class="subject-hero-title">$($s.Title)</h1>
        <p class="subject-hero-intro">$($s.Intro)</p>
        <div class="subject-hero-exam-badges">
          $badgeHtml
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="subject-content-section">
      <div class="container">

        <!-- Stat Strip -->
        <div class="subject-stat-strip">
          <div class="subject-stat-item">
            <div class="subject-stat-icon"><i class="fas fa-layer-group"></i></div>
            <div class="subject-stat-info"><strong>15 Topics</strong><span>Organized chapters</span></div>
          </div>
          <div class="subject-stat-item">
            <div class="subject-stat-icon"><i class="fas fa-question-circle"></i></div>
            <div class="subject-stat-info"><strong>100+ MCQs</strong><span>Practice questions</span></div>
          </div>
          <div class="subject-stat-item">
            <div class="subject-stat-icon"><i class="fas fa-graduation-cap"></i></div>
            <div class="subject-stat-info"><strong>High Weightage</strong><span>UPSC &amp; SSC</span></div>
          </div>
          <div class="subject-stat-item">
            <div class="subject-stat-icon"><i class="fas fa-calendar-check"></i></div>
            <div class="subject-stat-info"><strong>Updated 2026</strong><span>Exam-aligned content</span></div>
          </div>
        </div>

        <!-- Important Topics -->
        <div class="subject-section-title">
          <span class="icon-circle"><i class="fas fa-list-check"></i></span>
          Important Topics
        </div>
        <p class="subject-section-subtitle">Click any topic card to explore practice MCQs and high-yield notes for that chapter.</p>

        <div class="topic-cards-grid">
$topicCardsHtml
        </div>

        <!-- MCQ Section -->
        <div class="subject-mcq-section">
          <div style="position:relative; z-index:1;">
            <div class="subject-tag-pill" style="background:rgba(245,158,11,0.2); border-color:rgba(245,158,11,0.4);">
              <i class="fas fa-question-circle"></i> MCQ Practice
            </div>
            <h2 class="subject-mcq-title">$($s.Title) MCQs</h2>
            <p class="subject-mcq-desc">Practice important multiple-choice questions on $($s.Title) topics. Test your preparation for UPSC, SSC, Banking and Railway exams.</p>
            <div class="subject-mcq-cta">
              <a href="../mcqs/index.html?category=$($s.Slug)" class="btn btn-primary btn-lg">
                <i class="fas fa-play"></i> Practice MCQs
              </a>
              <a href="../mcqs/index.html" class="btn btn-secondary-white btn-lg">
                <i class="fas fa-list"></i> View All Questions
              </a>
            </div>
          </div>
        </div>

        <!-- Subject Navigation (Prev/Next) -->
        <div class="subject-nav-bar">
          <a href="$($s.PrevSlug).html" class="subject-nav-btn prev-btn">
            <i class="fas fa-arrow-left"></i>
            <span class="nav-btn-label">
              <span class="nav-btn-dir">Previous Subject</span>
              <span class="nav-btn-title">$($s.PrevTitle)</span>
            </span>
          </a>
          <a href="../gk.html" class="subject-nav-btn center-btn">
            <i class="fas fa-th-large"></i>
            <span class="nav-btn-label">
              <span class="nav-btn-dir">Browse All</span>
              <span class="nav-btn-title">GK Subjects</span>
            </span>
          </a>
          <a href="$($s.NextSlug).html" class="subject-nav-btn next-btn">
            <span class="nav-btn-label" style="text-align:right;">
              <span class="nav-btn-dir">Next Subject</span>
              <span class="nav-btn-title">$($s.NextTitle)</span>
            </span>
            <i class="fas fa-arrow-right"></i>
          </a>
        </div>

      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container footer-top-container">
      <div class="footer-grid">
        <div class="footer-col col-brand">
          <div class="footer-logo-block">
            <img src="../assets/logo.png" alt="GK India Academy" class="footer-logo-img" onerror="this.style.display='none'" />
            <div>
              <span class="footer-brand-name">GK INDIA ACADEMY</span>
              <span class="footer-tagline">Prepare Smart. Learn More. Succeed.</span>
            </div>
          </div>
          <p class="footer-about-text">An educational platform for General Knowledge, Current Affairs, MCQs and competitive-exam preparation.</p>
        </div>
        <div class="footer-col">
          <h4 class="footer-col-title">GK Subjects</h4>
          <ul class="footer-nav-list">
            <li><a href="indian-geography.html"><i class="fas fa-chevron-right"></i> Indian Geography</a></li>
            <li><a href="indian-history.html"><i class="fas fa-chevron-right"></i> Indian History</a></li>
            <li><a href="indian-polity.html"><i class="fas fa-chevron-right"></i> Indian Polity</a></li>
            <li><a href="indian-economy.html"><i class="fas fa-chevron-right"></i> Indian Economy</a></li>
            <li><a href="general-science.html"><i class="fas fa-chevron-right"></i> General Science</a></li>
            <li><a href="environment-ecology.html"><i class="fas fa-chevron-right"></i> Environment &amp; Ecology</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4 class="footer-col-title">More Subjects</h4>
          <ul class="footer-nav-list">
            <li><a href="art-culture.html"><i class="fas fa-chevron-right"></i> Art &amp; Culture</a></li>
            <li><a href="static-gk.html"><i class="fas fa-chevron-right"></i> Static GK</a></li>
            <li><a href="computer-knowledge.html"><i class="fas fa-chevron-right"></i> Computer Knowledge</a></li>
            <li><a href="sports.html"><i class="fas fa-chevron-right"></i> Sports</a></li>
            <li><a href="awards-honours.html"><i class="fas fa-chevron-right"></i> Awards &amp; Honours</a></li>
            <li><a href="important-days.html"><i class="fas fa-chevron-right"></i> Important Days</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4 class="footer-col-title">Quick Links</h4>
          <ul class="footer-nav-list">
            <li><a href="../index.html"><i class="fas fa-chevron-right"></i> Home</a></li>
            <li><a href="../gk.html"><i class="fas fa-chevron-right"></i> GK Subjects</a></li>
            <li><a href="../index.html#daily-mcq"><i class="fas fa-chevron-right"></i> MCQs</a></li>
            <li><a href="../index.html#exam-prep"><i class="fas fa-chevron-right"></i> Exams</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-bottom-bar">
      <div class="container footer-bottom-flex">
        <p class="copyright-text">&copy; 2026 GK India Academy. All Rights Reserved.</p>
        <div class="footer-bottom-links">
          <span>Made with <i class="fas fa-heart text-red"></i> for Indian Students &amp; Aspirants</span>
        </div>
      </div>
    </div>
  </footer>

  <script>
    const gkNavItem = document.getElementById('gkNavDropdown');
    const gkDropBtn = document.getElementById('gkDropdownBtn');
    if (gkNavItem && gkDropBtn) {
      gkDropBtn.addEventListener('click', (e) => { e.stopPropagation(); const o = gkNavItem.classList.toggle('open'); gkDropBtn.setAttribute('aria-expanded', o ? 'true' : 'false'); });
      document.addEventListener('click', (e) => { if (!gkNavItem.contains(e.target)) { gkNavItem.classList.remove('open'); gkDropBtn.setAttribute('aria-expanded', 'false'); } });
    }
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');
    const closeDrawer = () => { mobileDrawer.classList.remove('active'); drawerOverlay.classList.remove('active'); document.body.style.overflow = ''; };
    if (hamburgerBtn) hamburgerBtn.addEventListener('click', () => { mobileDrawer.classList.add('active'); drawerOverlay.classList.add('active'); document.body.style.overflow = 'hidden'; });
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
    const drawerGkToggle = document.getElementById('drawerGkToggle');
    const drawerGkSubjects = document.getElementById('drawerGkSubjects');
    if (drawerGkToggle) drawerGkToggle.addEventListener('click', () => { const o = drawerGkToggle.classList.toggle('open'); drawerGkSubjects.classList.toggle('open', o); });
    window.addEventListener('scroll', () => { document.getElementById('siteHeader').classList.toggle('scrolled', window.scrollY > 30); });
  </script>
  <script src="../search.js"></script>
</body>
</html>
"@

    Set-Content -Path $outPath -Value $pageHtml -Encoding UTF8
    Write-Host "Generated: $($s.Slug).html"
}
