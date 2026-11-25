// Every date below was checked on 25 Nov 2026 against the exam body's own notice,
// or against two education news sites quoting it when the body's site was unreachable.
// `sure: true`  → the exam body has announced this date.
// `sure: false` → not announced yet; the date is our estimate from last year's cycle,
//                 and `approx` says how precise it is ("month" or "week").
// Update VERIFIED_ON whenever the file is re-checked.

export const VERIFIED_ON = '2026-11-25'

export const STREAMS = [
  { id: 'engineering', label: 'Engineering' },
  { id: 'medical', label: 'Medical' },
  { id: 'management', label: 'Management' },
  { id: 'law', label: 'Law' },
  { id: 'design', label: 'Design and architecture' },
  { id: 'science', label: 'Science and general' },
]

// kind: apply (window opens), close (last date to apply), admit, exam, result, other
const d = (kind, label, date, sure = true, extra = {}) => ({ kind, label, date, sure, ...extra })
const est = (kind, label, date, approx = 'month') => d(kind, label, date, false, { approx })

export const EXAMS = [
  // ── Engineering ───────────────────────────────────────────────
  {
    id: 'jee-main', name: 'JEE Main', full: 'Joint Entrance Examination (Main) 2027',
    stream: 'engineering', level: 'ug', body: 'National Testing Agency',
    link: 'https://jeemain.nta.nic.in',
    about: 'Entrance for NITs, IIITs and other centrally funded institutes, and the qualifier for JEE Advanced. Held in two sessions.',
    deadlines: [
      d('close', 'Session 1 applications close', '2026-11-22'),
      d('admit', 'Session 1 city slip', '2026-12-30', false, { approx: 'week' }),
      d('admit', 'Session 1 admit card', '2027-01-13'),
      d('exam', 'Session 1 exam', '2027-01-20', true, { end: '2027-01-28' }),
      est('result', 'Session 1 result', '2027-02-12', 'week'),
      est('apply', 'Session 2 applications open', '2027-02-01'),
      est('exam', 'Session 2 exam', '2027-04-02'),
    ],
  },
  {
    id: 'jee-advanced', name: 'JEE Advanced', full: 'Joint Entrance Examination (Advanced) 2027',
    stream: 'engineering', level: 'ug', body: 'IIT Delhi',
    link: 'https://jeeadv.ac.in',
    about: 'The IIT entrance. Open only to the top 2.5 lakh JEE Main candidates. IIT Delhi organises the 2027 exam.',
    deadlines: [
      est('apply', 'Registration opens', '2027-04-24', 'week'),
      d('exam', 'Exam', '2027-05-23'),
      est('result', 'Result', '2027-06-01'),
    ],
  },
  {
    id: 'bitsat', name: 'BITSAT', full: 'BITS Admission Test 2027',
    stream: 'engineering', level: 'ug', body: 'BITS Pilani',
    link: 'https://www.bitsadmission.com',
    about: 'Online test for BE, BPharm and integrated MSc at BITS Pilani, Goa and Hyderabad. Two sessions.',
    deadlines: [
      est('apply', 'Session 1 applications open', '2026-12-15', 'week'),
      est('close', 'Session 1 applications close', '2027-03-16'),
      est('exam', 'Session 1 exam', '2027-04-15'),
      est('exam', 'Session 2 exam', '2027-05-24'),
    ],
  },
  {
    id: 'viteee', name: 'VITEEE', full: 'VIT Engineering Entrance Examination 2027',
    stream: 'engineering', level: 'ug', body: 'Vellore Institute of Technology',
    link: 'https://viteee.vit.ac.in',
    about: 'Entrance for BTech at VIT Vellore, Chennai, Bhopal and Andhra Pradesh campuses.',
    deadlines: [
      d('apply', 'Applications open', '2026-10-20'),
      d('close', 'Applications close', '2027-03-31'),
      d('exam', 'Exam window', '2027-04-28', true, { end: '2027-05-02' }),
    ],
  },
  {
    id: 'srmjeee', name: 'SRMJEEE', full: 'SRM Joint Engineering Entrance Exam (UG) 2027',
    stream: 'engineering', level: 'ug', body: 'SRM Institute of Science and Technology',
    link: 'https://www.srmist.edu.in',
    about: 'Entrance for BTech at SRM campuses. Two phases; you can sit both.',
    deadlines: [
      d('close', 'Phase 1 applications close', '2027-04-02'),
      d('exam', 'Phase 1 exam', '2027-04-17', true, { end: '2027-04-18' }),
      d('exam', 'Phase 2 exam', '2027-06-19', true, { end: '2027-06-20' }),
    ],
  },
  {
    id: 'met', name: 'MET', full: 'Manipal Entrance Test 2027',
    stream: 'engineering', level: 'ug', body: 'Manipal Academy of Higher Education',
    link: 'https://manipal.edu',
    about: 'Entrance for BTech and other programmes at Manipal, Jaipur and Sikkim campuses.',
    deadlines: [
      d('apply', 'Phase 1 applications open', '2026-10-19'),
      d('close', 'Phase 1 applications close', '2027-03-15'),
      est('exam', 'Phase 1 exam', '2027-04-15'),
    ],
  },
  {
    id: 'mht-cet', name: 'MHT CET', full: 'Maharashtra Common Entrance Test 2027',
    stream: 'engineering', level: 'ug', body: 'State CET Cell, Maharashtra',
    link: 'https://cetcell.mahacet.org',
    about: 'State entrance for engineering, pharmacy and agriculture colleges in Maharashtra. PCM and PCB groups sit on different days.',
    deadlines: [
      est('apply', 'Applications open', '2026-12-15'),
      d('exam', 'PCB group, first attempt', '2027-04-08', true, { end: '2027-04-13' }),
      d('exam', 'PCM group, first attempt', '2027-04-16', true, { end: '2027-04-26' }),
      d('exam', 'PCM group, second attempt', '2027-05-10', true, { end: '2027-05-15' }),
    ],
  },
  {
    id: 'wbjee', name: 'WBJEE', full: 'West Bengal Joint Entrance Examination 2027',
    stream: 'engineering', level: 'ug', body: 'WBJEE Board',
    link: 'https://wbjeeb.nic.in',
    about: 'State entrance for engineering, pharmacy and architecture colleges in West Bengal. Pen and paper.',
    deadlines: [
      est('apply', 'Applications open', '2026-12-20'),
      est('exam', 'Exam', '2027-05-17', 'week'),
    ],
  },
  {
    id: 'kcet', name: 'KCET', full: 'Karnataka Common Entrance Test 2027',
    stream: 'engineering', level: 'ug', body: 'Karnataka Examinations Authority',
    link: 'https://cetonline.karnataka.gov.in/kea',
    about: 'State entrance for engineering, farm science, pharmacy and other courses in Karnataka.',
    deadlines: [
      est('apply', 'Applications open', '2027-01-15'),
      est('exam', 'Exam', '2027-04-16'),
    ],
  },
  {
    id: 'comedk', name: 'COMEDK UGET', full: 'COMEDK Undergraduate Entrance Test 2027',
    stream: 'engineering', level: 'ug', body: 'Consortium of Medical, Engineering and Dental Colleges of Karnataka',
    link: 'https://www.comedk.org',
    about: 'Entrance for private engineering colleges in Karnataka.',
    deadlines: [
      est('apply', 'Applications open', '2027-02-10'),
      est('exam', 'Exam', '2027-05-09'),
    ],
  },
  {
    id: 'ap-eapcet', name: 'AP EAPCET', full: 'Andhra Pradesh EAPCET 2027',
    stream: 'engineering', level: 'ug', body: 'APSCHE',
    link: 'https://cets.apsche.ap.gov.in',
    about: 'State entrance for engineering, agriculture and pharmacy in Andhra Pradesh.',
    deadlines: [
      est('apply', 'Applications open', '2027-03-10'),
      est('exam', 'Exam', '2027-05-18'),
    ],
  },
  {
    id: 'ts-eapcet', name: 'TS EAPCET', full: 'Telangana EAPCET 2027',
    stream: 'engineering', level: 'ug', body: 'TGCHE',
    link: 'https://eapcet.tgche.ac.in',
    about: 'State entrance for engineering, agriculture and pharmacy in Telangana.',
    deadlines: [
      est('apply', 'Applications open', '2027-03-01'),
      est('exam', 'Exam', '2027-05-04'),
    ],
  },
  {
    id: 'keam', name: 'KEAM', full: 'Kerala Engineering Architecture Medical 2027',
    stream: 'engineering', level: 'ug', body: 'Commissioner for Entrance Examinations, Kerala',
    link: 'https://cee.kerala.gov.in',
    about: 'State entrance for engineering and pharmacy in Kerala.',
    deadlines: [
      est('apply', 'Applications open', '2027-01-20'),
      est('exam', 'Exam', '2027-04-20'),
    ],
  },
  {
    id: 'gate', name: 'GATE', full: 'Graduate Aptitude Test in Engineering 2027',
    stream: 'engineering', level: 'pg', body: 'IIT Madras',
    link: 'https://gate2027.iitm.ac.in',
    about: 'For MTech and PhD admissions and PSU hiring. 30 papers, including a new Robotics and Automation paper.',
    deadlines: [
      d('admit', 'Exam city slip', '2027-01-04'),
      d('exam', 'Exam days', '2027-02-06', true, { end: '2027-02-21', note: 'Feb 6, 7, 13, 14, 20 and 21; your paper sits on one of these' }),
      d('result', 'Result', '2027-03-19'),
    ],
  },

  // ── Medical ───────────────────────────────────────────────────
  {
    id: 'neet-ug', name: 'NEET UG', full: 'National Eligibility cum Entrance Test (UG) 2027',
    stream: 'medical', level: 'ug', body: 'National Testing Agency',
    link: 'https://neet.nta.nic.in',
    about: 'The single entrance for MBBS, BDS and AYUSH seats across India. NTA has not published the 2027 schedule.',
    deadlines: [
      est('apply', 'Applications open', '2027-02-08'),
      est('close', 'Applications close', '2027-03-08'),
      est('exam', 'Exam', '2027-05-02'),
      est('result', 'Result', '2027-06-14'),
    ],
  },
  {
    id: 'neet-pg', name: 'NEET PG', full: 'NEET PG 2027',
    stream: 'medical', level: 'pg', body: 'NBEMS',
    link: 'https://natboard.edu.in',
    about: 'Entrance for MD, MS and PG diploma seats. NBEMS has not published the 2027 schedule.',
    deadlines: [
      est('exam', 'Exam', '2027-07-15'),
    ],
  },
  {
    id: 'ini-cet', name: 'INI-CET', full: 'INI-CET, July 2027 session',
    stream: 'medical', level: 'pg', body: 'AIIMS New Delhi',
    link: 'https://www.aiimsexams.ac.in',
    about: 'PG medical entrance for AIIMS, JIPMER, PGIMER and NIMHANS. The January 2027 session exam was held on 1 Nov 2026.',
    deadlines: [
      est('apply', 'Applications open', '2027-03-20'),
      est('exam', 'Exam', '2027-05-16'),
    ],
  },
  {
    id: 'aiapget', name: 'AIAPGET', full: 'All India AYUSH PG Entrance Test 2027',
    stream: 'medical', level: 'pg', body: 'National Testing Agency',
    link: 'https://exams.nta.nic.in/aiapget',
    about: 'Entrance for MD and MS in Ayurveda, Yoga, Unani, Siddha and Homeopathy.',
    deadlines: [
      est('apply', 'Applications open', '2027-05-01'),
      est('exam', 'Exam', '2027-07-04'),
    ],
  },

  // ── Management ────────────────────────────────────────────────
  {
    id: 'cat', name: 'CAT', full: 'Common Admission Test 2026',
    stream: 'management', level: 'pg', body: 'IIM Indore',
    link: 'https://iimcat.ac.in',
    about: 'MBA entrance for the IIMs and most top B-schools, for the 2027 to 29 batch.',
    deadlines: [
      d('close', 'Applications closed', '2026-09-22'),
      d('admit', 'Admit card out', '2026-11-04'),
      d('exam', 'Exam', '2026-11-29'),
      est('result', 'Result', '2027-01-04', 'week'),
    ],
  },
  {
    id: 'xat', name: 'XAT', full: 'Xavier Aptitude Test 2027',
    stream: 'management', level: 'pg', body: 'XLRI Jamshedpur',
    link: 'https://xatonline.in',
    about: 'Accepted by XLRI, XIMB, IMT, TAPMI and 160+ institutes.',
    deadlines: [
      d('close', 'Applications close', '2026-12-06'),
      est('admit', 'Admit card', '2026-12-20', 'week'),
      d('exam', 'Exam, 2 pm to 5 pm', '2027-01-03'),
      est('result', 'Result', '2027-01-20', 'week'),
    ],
  },
  {
    id: 'snap', name: 'SNAP', full: 'Symbiosis National Aptitude Test 2026',
    stream: 'management', level: 'pg', body: 'Symbiosis International University',
    link: 'https://www.snaptest.org',
    about: 'MBA entrance for Symbiosis institutes. Up to three attempts; the best score counts.',
    deadlines: [
      d('close', 'Applications close', '2026-11-25'),
      d('admit', 'Test 1 admit card', '2026-12-07'),
      d('exam', 'Test 1', '2026-12-13'),
      d('exam', 'Test 2', '2026-12-19'),
      d('exam', 'Test 3', '2026-12-26'),
      est('result', 'Result', '2027-01-12'),
    ],
  },
  {
    id: 'nmat', name: 'NMAT', full: 'NMAT by GMAC 2026',
    stream: 'management', level: 'pg', body: 'GMAC',
    link: 'https://www.mba.com/exams/nmat',
    about: 'MBA entrance for NMIMS and other schools. You pick your own test date inside the window.',
    deadlines: [
      d('close', 'Registration closed', '2026-10-10'),
      d('exam', 'Test window', '2026-11-02', true, { end: '2026-12-20' }),
    ],
  },
  {
    id: 'cmat', name: 'CMAT', full: 'Common Management Admission Test 2027',
    stream: 'management', level: 'pg', body: 'National Testing Agency',
    link: 'https://cmat.nta.nic.in',
    about: 'MBA and PGDM entrance accepted by AICTE approved institutes.',
    deadlines: [
      est('apply', 'Applications open', '2026-12-01', 'week'),
      d('exam', 'Exam', '2027-02-07'),
    ],
  },
  {
    id: 'mat', name: 'MAT', full: 'Management Aptitude Test, December 2026',
    stream: 'management', level: 'pg', body: 'AIMA',
    link: 'https://mat.aima.in',
    about: 'Held several times a year and accepted by 600+ B-schools. Paper and computer modes run on different dates.',
    deadlines: [
      d('close', 'Paper test applications close', '2026-12-14'),
      d('exam', 'Paper based test', '2026-12-20'),
      d('close', 'Computer test applications close', '2026-12-21'),
      d('exam', 'Computer based test', '2026-12-27'),
    ],
  },
  {
    id: 'micat', name: 'MICAT', full: 'MICA Admission Test 2027',
    stream: 'management', level: 'pg', body: 'MICA Ahmedabad',
    link: 'https://www.mica.ac.in',
    about: 'Entrance for the PGDM in strategic marketing and communication at MICA. Two rounds a year.',
    deadlines: [
      d('close', 'MICAT 1 applications close', '2026-11-21'),
      est('close', 'MICAT 2 applications close', '2027-01-29', 'week'),
      est('exam', 'MICAT 2 exam', '2027-02-13', 'week'),
    ],
  },
  {
    id: 'ipmat', name: 'IPMAT Indore', full: 'Integrated Programme in Management Aptitude Test 2027',
    stream: 'management', level: 'ug', body: 'IIM Indore',
    link: 'https://www.iimidr.ac.in',
    about: 'Entrance for the five year integrated MBA at IIM Indore, straight after Class 12.',
    deadlines: [
      est('apply', 'Applications open', '2027-02-15'),
      est('exam', 'Exam', '2027-04-24', 'week'),
    ],
  },
  {
    id: 'jipmat', name: 'JIPMAT', full: 'Joint Integrated Programme in Management Admission Test 2027',
    stream: 'management', level: 'ug', body: 'National Testing Agency',
    link: 'https://exams.nta.nic.in/jipmat',
    about: 'Entrance for the five year integrated MBA at IIM Bodh Gaya and IIM Jammu.',
    deadlines: [
      est('apply', 'Applications open', '2027-04-05'),
      est('exam', 'Exam', '2027-06-06', 'week'),
    ],
  },
  {
    id: 'npat', name: 'NPAT', full: 'NMIMS Programs After Twelfth 2027',
    stream: 'management', level: 'ug', body: 'NMIMS',
    link: 'https://www.nmims.edu',
    about: 'Entrance for undergraduate business, commerce and economics programmes at NMIMS campuses.',
    deadlines: [
      est('apply', 'Applications open', '2026-12-10'),
      est('exam', 'Test window opens', '2027-01-15'),
    ],
  },

  // ── Law ───────────────────────────────────────────────────────
  {
    id: 'clat', name: 'CLAT', full: 'Common Law Admission Test 2027',
    stream: 'law', level: 'ug', body: 'Consortium of NLUs',
    link: 'https://consortiumofnlus.ac.in',
    about: 'Entrance for the five year law degree at 24 National Law Universities. Held in December, before the admission year.',
    deadlines: [
      d('close', 'Applications closed', '2026-10-31'),
      d('exam', 'Exam, 2 pm to 4 pm', '2026-12-06'),
      est('result', 'Result', '2026-12-20', 'week'),
      est('other', 'Counselling begins', '2026-12-28', 'week'),
    ],
  },
  {
    id: 'ailet', name: 'AILET', full: 'All India Law Entrance Test 2027',
    stream: 'law', level: 'ug', body: 'National Law University Delhi',
    link: 'https://nationallawuniversitydelhi.in',
    about: 'Entrance for BA LLB at NLU Delhi, which does not take CLAT.',
    deadlines: [
      d('close', 'Applications closed', '2026-11-10'),
      d('admit', 'Admit card', '2026-11-30'),
      d('exam', 'Exam, 2 pm to 4 pm', '2026-12-13'),
      est('result', 'Result', '2026-12-18', 'week'),
    ],
  },
  {
    id: 'slat', name: 'SLAT', full: 'Symbiosis Law Admission Test 2027',
    stream: 'law', level: 'ug', body: 'Symbiosis International University',
    link: 'https://www.slat-test.org',
    about: 'Entrance for five year law programmes at Symbiosis law schools. Two attempts; the best score counts.',
    deadlines: [
      d('close', 'Applications close', '2026-12-04'),
      d('exam', 'SLAT 1', '2026-12-19'),
      d('exam', 'SLAT 2', '2026-12-26'),
      d('result', 'Result', '2027-01-12'),
    ],
  },
  {
    id: 'mh-cet-law', name: 'MH CET Law', full: 'MAH LLB 5 Year CET 2027',
    stream: 'law', level: 'ug', body: 'State CET Cell, Maharashtra',
    link: 'https://cetcell.mahacet.org',
    about: 'State entrance for five year LLB colleges in Maharashtra.',
    deadlines: [
      est('apply', 'Applications open', '2027-01-20'),
      est('exam', 'Exam', '2027-04-30'),
    ],
  },

  // ── Design and architecture ──────────────────────────────────
  {
    id: 'nid-dat', name: 'NID DAT', full: 'NID Design Aptitude Test 2027',
    stream: 'design', level: 'ug', body: 'National Institute of Design',
    link: 'https://admissions.nid.edu',
    about: 'Entrance for BDes and MDes at the seven NIDs. Prelims first, then a studio test for those shortlisted.',
    deadlines: [
      d('close', 'Applications close, 11:59 pm', '2026-11-30'),
      d('other', 'Form correction window', '2026-12-01', true, { end: '2026-12-03' }),
      d('admit', 'Prelims admit card', '2026-12-10'),
      d('exam', 'Prelims', '2026-12-20'),
      d('result', 'BDes prelims result', '2027-03-16'),
      est('exam', 'Mains studio test', '2027-04-25'),
    ],
  },
  {
    id: 'nift', name: 'NIFT', full: 'NIFT Entrance Examination 2027',
    stream: 'design', level: 'ug', body: 'National Testing Agency for NIFT',
    link: 'https://exams.nta.nic.in/niftee',
    about: 'Entrance for BDes, BFTech, MDes, MFM and MFTech at 20 NIFT campuses.',
    deadlines: [
      d('close', 'Applications closed', '2026-11-21'),
      d('other', 'Form correction window', '2026-11-22', true, { end: '2026-11-25' }),
      d('admit', 'Admit card', '2027-01-04'),
      d('exam', 'Exam', '2027-01-10'),
      est('result', 'Final result', '2027-05-05'),
    ],
  },
  {
    id: 'uceed', name: 'UCEED', full: 'Undergraduate Common Entrance Exam for Design 2027',
    stream: 'design', level: 'ug', body: 'IIT Bombay',
    link: 'https://www.uceed.iitb.ac.in',
    about: 'Entrance for BDes at the IITs and other participating institutes.',
    deadlines: [
      d('close', 'Applications closed', '2026-11-06'),
      d('admit', 'Admit card', '2027-01-01'),
      d('exam', 'Exam, 9 am to 12 noon', '2027-01-17'),
      d('result', 'Result', '2027-03-06'),
    ],
  },
  {
    id: 'ceed', name: 'CEED', full: 'Common Entrance Exam for Design 2027',
    stream: 'design', level: 'pg', body: 'IIT Bombay',
    link: 'https://www.ceed.iitb.ac.in',
    about: 'Entrance for MDes and design PhD at the IITs and IISc.',
    deadlines: [
      d('close', 'Applications closed', '2026-11-06'),
      d('admit', 'Admit card', '2027-01-01'),
      d('exam', 'Exam, 9 am to 12 noon', '2027-01-17'),
      d('result', 'Result', '2027-03-03'),
    ],
  },
  {
    id: 'nata', name: 'NATA', full: 'National Aptitude Test in Architecture 2027',
    stream: 'design', level: 'ug', body: 'Council of Architecture',
    link: 'https://www.nata.in',
    about: 'Aptitude test for BArch. Several attempts across two phases; the best score counts.',
    deadlines: [
      est('apply', 'Applications open', '2027-03-01'),
      est('exam', 'Phase 1 tests begin', '2027-04-03'),
      est('exam', 'Phase 2 test', '2027-08-07'),
    ],
  },
  {
    id: 'nchm-jee', name: 'NCHM JEE', full: 'NCHM Joint Entrance Examination 2027',
    stream: 'design', level: 'ug', body: 'National Testing Agency',
    link: 'https://exams.nta.nic.in/nchm',
    about: 'Entrance for BSc in Hospitality and Hotel Administration at the IHMs.',
    deadlines: [
      est('apply', 'Applications open', '2027-02-10'),
      est('exam', 'Exam', '2027-04-26', 'week'),
    ],
  },

  // ── Science and general ──────────────────────────────────────
  {
    id: 'cuet-ug', name: 'CUET UG', full: 'Common University Entrance Test (UG) 2027',
    stream: 'science', level: 'ug', body: 'National Testing Agency',
    link: 'https://cuet.nta.nic.in',
    about: 'Entrance for undergraduate programmes at 240+ universities, including DU, JNU and BHU.',
    deadlines: [
      est('apply', 'Applications open', '2027-01-05'),
      est('close', 'Applications close', '2027-02-04'),
      est('exam', 'Exams begin', '2027-05-15'),
      est('result', 'Result', '2027-07-04'),
    ],
  },
  {
    id: 'cuet-pg', name: 'CUET PG', full: 'Common University Entrance Test (PG) 2027',
    stream: 'science', level: 'pg', body: 'National Testing Agency',
    link: 'https://exams.nta.nic.in/cuet-pg',
    about: 'Entrance for postgraduate programmes at central and participating universities.',
    deadlines: [
      est('apply', 'Applications open', '2026-12-15'),
      d('exam', 'Exam days, proposed', '2027-03-02', true, { end: '2027-03-31', note: 'NTA calendar dates; subject wise schedule to follow' }),
    ],
  },
  {
    id: 'iit-jam', name: 'IIT JAM', full: 'Joint Admission Test for Masters 2027',
    stream: 'science', level: 'pg', body: 'IIT Kharagpur',
    link: 'https://jam.iitkgp.ac.in',
    about: 'Entrance for MSc and related programmes at the IITs and IISc.',
    deadlines: [
      d('close', 'Applications closed', '2026-10-24'),
      d('exam', 'Exam', '2027-02-14'),
      d('result', 'Result', '2027-03-18'),
    ],
  },
  {
    id: 'iiser-iat', name: 'IISER IAT', full: 'IISER Aptitude Test 2027',
    stream: 'science', level: 'ug', body: 'IISER Admissions',
    link: 'https://www.iiseradmission.in',
    about: 'Entrance for the BS-MS programme at the seven IISERs and IISc.',
    deadlines: [
      est('apply', 'Applications open', '2027-04-01'),
      est('exam', 'Exam', '2027-06-06', 'week'),
    ],
  },
  {
    id: 'nest', name: 'NEST', full: 'National Entrance Screening Test 2027',
    stream: 'science', level: 'ug', body: 'NISER and UM-DAE CEBS',
    link: 'https://www.nestexam.in',
    about: 'Entrance for the five year integrated MSc at NISER Bhubaneswar and CEBS Mumbai.',
    deadlines: [
      est('apply', 'Applications open', '2027-01-20'),
      est('exam', 'Exam', '2027-06-19', 'week'),
    ],
  },
]
