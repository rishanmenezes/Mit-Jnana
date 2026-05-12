/**
 * Search aliases: maps common abbreviations / short forms to full subject names.
 * Keys MUST be lowercase. Values are arrays of full subject names (case-insensitive
 * matching is applied at search time).
 *
 * When a user's query matches a key here, notes whose subject matches any of the
 * associated full names will also be included in results.
 */
const SEARCH_ALIASES = {
  /* ── First Year (common across streams) ── */
  'math':       ['Applied Mathematics for CS Engineering Stream', 'Applied Mathematics for ME Stream', 'Applied Mathematics for CV Engineering Stream', 'Applied Mathematics for EEE Stream'],
  'maths':      ['Applied Mathematics for CS Engineering Stream', 'Applied Mathematics for ME Stream', 'Applied Mathematics for CV Engineering Stream', 'Applied Mathematics for EEE Stream'],
  'mathematics':['Applied Mathematics for CS Engineering Stream', 'Applied Mathematics for ME Stream', 'Applied Mathematics for CV Engineering Stream', 'Applied Mathematics for EEE Stream'],
  'm1':         ['Applied Mathematics for CS Engineering Stream', 'Applied Mathematics for ME Stream', 'Applied Mathematics for CV Engineering Stream', 'Applied Mathematics for EEE Stream'],
  'm2':         ['Applied Mathematics for CS Engineering Stream', 'Applied Mathematics for ME Stream', 'Applied Mathematics for CV Engineering Stream', 'Applied Mathematics for EEE Stream'],

  'physics':    ['Applied Physics for CS Engineering Stream', 'Applied Physics for ME Stream', 'Applied Physics for CV Engineering Stream', 'Applied Physics for EEE Stream'],
  'phy':        ['Applied Physics for CS Engineering Stream', 'Applied Physics for ME Stream', 'Applied Physics for CV Engineering Stream', 'Applied Physics for EEE Stream'],

  'chemistry':  ['Applied Chemistry for CSE Stream', 'Applied Chemistry for ME Stream', 'Applied Chemistry for CV Stream', 'Applied Chemistry for EEE Stream'],
  'chem':       ['Applied Chemistry for CSE Stream', 'Applied Chemistry for ME Stream', 'Applied Chemistry for CV Stream', 'Applied Chemistry for EEE Stream'],

  'ppc':        ['Principles of Programming using C'],
  'c programming': ['Principles of Programming using C', 'Introduction to C Programming'],
  'icp':        ['Introduction to C Programming'],

  'python':     ['Introduction to Python Programming'],
  'ipp':        ['Introduction to Python Programming'],

  'caed':       ['Computer-Aided Engineering Drawing'],
  'drawing':    ['Computer-Aided Engineering Drawing'],
  'engineering drawing': ['Computer-Aided Engineering Drawing'],

  'idt':        ['Innovation and Design Thinking'],

  'sfh':        ['Scientific Foundation of Health'],
  'health':     ['Scientific Foundation of Health'],

  'bio':        ['Biology for Engineers'],
  'biology':    ['Biology for Engineers'],
  'bfe':        ['Biology for Engineers'],

  'kannada':    ['Kannada (Samskrutika / Balake)'],
  'samskrutika':['Kannada (Samskrutika / Balake)'],
  'balake':     ['Kannada (Samskrutika / Balake)'],

  'pwse':       ['Professional Writing Skills in English'],
  'pws':        ['Professional Writing Skills in English'],
  'writing':    ['Professional Writing Skills in English'],

  'comm english': ['Communicative English'],
  'communicative': ['Communicative English'],

  'ai for everyone': ['AI for Everyone'],

  /* ── First Year (ME-specific) ── */
  'eme':        ['Elements of Mechanical Engineering'],
  'rse':        ['Renewable Sources of Energy'],
  'renewable':  ['Renewable Sources of Energy'],

  /* ── First Year (CV-specific) ── */
  'em':         ['Engineering Mechanics'],
  'engg mechanics': ['Engineering Mechanics'],
  'ime':        ['Introduction to Mechanical Engineering'],

  /* ── First Year (ECE-specific) ── */
  'basic electronics': ['Basic Electronics'],
  'iee':        ['Introduction to Electrical Engineering'],
  'electrical': ['Introduction to Electrical Engineering'],
  'ies':        ['Introduction to Embedded System'],
  'embedded':   ['Introduction to Embedded System'],

  /* ── Semester 3 ── */
  'm3':         ['Mathematics III'],
  'math 3':     ['Mathematics III'],
  'maths 3':    ['Mathematics III'],
  'math3':      ['Mathematics III'],

  'som':        ['Strength of Materials'],
  'strength':   ['Strength of Materials'],

  'fm':         ['Fluid Mechanics', 'Financial Management'],
  'fluid':      ['Fluid Mechanics'],

  'eg':         ['Engineering Geology'],
  'geology':    ['Engineering Geology'],

  'ldco':       ['Logic Design and Computer Organization'],
  'ldc':        ['Logic Design and Computer Organization'],
  'logic design': ['Logic Design and Computer Organization'],
  'computer organization': ['Logic Design and Computer Organization'],

  'os':         ['Operating Systems'],

  'dsa':        ['Data Structures and Applications'],
  'ds':         ['Data Structures and Applications', 'Data Science'],
  'data structures': ['Data Structures and Applications'],

  'se':         ['Software Engineering'],

  'oops':       ['Object Oriented Programming using Java'],
  'oop':        ['Object Oriented Programming using Java'],
  'oopj':       ['Object Oriented Programming using Java'],
  'java':       ['Object Oriented Programming using Java'],

  'cpp':        ['C++ Programming'],
  'c++':        ['C++ Programming'],

  'mc':         ['Microcontroller'],
  'micro':      ['Microcontroller'],
  'microcontroller': ['Microcontroller'],

  'na':         ['Network Analysis'],

  'adsd':       ['Analog and Digital System Design'],
  'analog':     ['Analog and Digital System Design', 'Analog Communication Systems'],

  'dsdv':       ['Digital System Design using Verilog'],
  'verilog':    ['Digital System Design using Verilog'],

  'mom':        ['Mechanics of Materials'],

  'mcf':        ['Metal Casting and Forming'],
  'casting':    ['Metal Casting and Forming'],

  'mse':        ['Material Science and Engineering'],
  'material science': ['Material Science and Engineering'],

  'bt':         ['Basic Thermodynamics'],
  'thermo':     ['Basic Thermodynamics', 'Applied Thermodynamics'],
  'thermodynamics': ['Basic Thermodynamics', 'Applied Thermodynamics'],

  'imdm':       ['Introduction to Modelling and Design for Manufacturing'],

  /* ── Semester 4 ── */
  'm4':         ['Mathematics IV'],
  'math 4':     ['Mathematics IV'],
  'maths 4':    ['Mathematics IV'],
  'math4':      ['Mathematics IV'],

  'bim':        ['Building Information Modeling'],

  'ct':         ['Concrete Technology'],
  'concrete':   ['Concrete Technology'],

  'wre':        ['Water Resources Engineering'],

  'wwm':        ['Waste Water Management'],

  'aos':        ['Analysis of Structures'],

  'uhv':        ['Universal Human Values'],
  'human values': ['Universal Human Values'],

  'ada':        ['Analysis and Design of Algorithms'],
  'algorithms': ['Analysis and Design of Algorithms'],
  'algorithm':  ['Analysis and Design of Algorithms'],
  'daa':        ['Analysis and Design of Algorithms'],

  'dbms':       ['Database Management Systems', 'Advanced Database Management Systems'],
  'database':   ['Database Management Systems', 'Advanced Database Management Systems'],

  'ai':         ['Introduction to Artificial Intelligence', 'Artificial Intelligence', 'AI for Everyone', 'Agentic AI', 'Agentic AI Systems'],
  'iai':        ['Introduction to Artificial Intelligence'],
  'artificial intelligence': ['Introduction to Artificial Intelligence', 'Artificial Intelligence'],

  'la':         ['Linear Algebra'],
  'linear algebra': ['Linear Algebra'],

  'ids':        ['Introduction to Data Science'],

  'bc':         ['Business Communication'],

  'emw':        ['Electromagnetic Waves'],
  'electromagnetic': ['Electromagnetic Waves'],

  'acs':        ['Analog Communication Systems'],

  'ss':         ['Signals and Systems'],
  's&s':        ['Signals and Systems'],
  'signals':    ['Signals and Systems'],

  'pe':         ['Power Electronics'],
  'power electronics': ['Power Electronics'],

  'cs':         ['Control Systems'],
  'control':    ['Control Systems'],

  'at':         ['Applied Thermodynamics'],

  'msm':        ['Machining Science and Metrology'],
  'metrology':  ['Machining Science and Metrology'],

  'kom':        ['Kinematics of Machines'],
  'kinematics': ['Kinematics of Machines'],

  'ntm':        ['Non-Traditional Machining'],

  'ida':        ['Introduction to Data Analytics'],
  'data analytics': ['Introduction to Data Analytics'],

  'ics':        ['Introduction to Cyber Security'],
  'cyber security': ['Introduction to Cyber Security', 'Cyber Security'],

  'gt':         ['Graph Theory'],
  'graph':      ['Graph Theory'],

  'st':         ['Software Testing'],
  'testing':    ['Software Testing'],

  /* ── Semester 5 ── */
  'rcc':        ['Reinforced Cement Concrete'],
  'concrete':   ['Reinforced Cement Concrete', 'Concrete Technology'],

  'he':         ['Highway Engineering'],
  'highway':    ['Highway Engineering'],

  'gte':        ['Geotechnical Engineering', 'Applied Geotechnical Engineering'],
  'geotech':    ['Geotechnical Engineering', 'Applied Geotechnical Engineering'],
  'geotechnical': ['Geotechnical Engineering', 'Applied Geotechnical Engineering'],

  'sbm':        ['Sustainable Building Materials'],

  'rmipr':      ['Research Methodology and IPR'],
  'rm':         ['Research Methodology and IPR'],
  'ipr':        ['Research Methodology and IPR'],
  'research':   ['Research Methodology and IPR', 'Marketing Research and Management'],

  'evs':        ['Environmental Studies'],
  'es':         ['Environmental Studies'],
  'environment': ['Environmental Studies'],
  'environmental': ['Environmental Studies'],

  'toc':        ['Theory of Computation'],
  'tc':         ['Theory of Computation'],
  'computation': ['Theory of Computation'],

  'cn':         ['Computer Networks', 'Computer Communication Networks'],
  'networks':   ['Computer Networks', 'Computer Communication Networks'],
  'networking': ['Computer Networks', 'Computer Communication Networks'],

  'adbms':      ['Advanced Database Management Systems'],

  'cc':         ['Cloud Computing'],
  'cloud':      ['Cloud Computing'],

  'ml':         ['Machine Learning', 'Advanced Machine Learning'],
  'machine learning': ['Machine Learning', 'Advanced Machine Learning'],

  'data science': ['Data Science', 'Introduction to Data Science'],

  'nosql':      ['NoSQL Databases'],

  'bda':        ['Big Data Analytics'],
  'big data':   ['Big Data Analytics'],

  'or':         ['Operations Research'],
  'operations': ['Operations Research'],

  'fom':        ['Fundamentals of Management'],
  'management': ['Fundamentals of Management', 'Financial Management', 'Marketing Research and Management'],

  'mrm':        ['Marketing Research and Management'],
  'marketing':  ['Marketing Research and Management'],

  'ccn':        ['Computer Communication Networks'],

  'arm':        ['ARM Controller'],

  'dc':         ['Digital Communication'],

  'itc':        ['Information Theory and Coding'],
  'information theory': ['Information Theory and Coding'],

  'ann':        ['Artificial Neural Networks'],
  'neural':     ['Artificial Neural Networks'],
  'neural networks': ['Artificial Neural Networks'],

  'dom':        ['Dynamics of Machines'],
  'dynamics':   ['Dynamics of Machines'],

  'tm':         ['Turbo Machines'],
  'turbo':      ['Turbo Machines'],

  'mechatronics': ['Mechatronics'],

  'cadm':       ['Computer Aided Design and Manufacturing'],
  'cad':        ['Computer Aided Design and Manufacturing', 'Computer-Aided Engineering Drawing'],
  'cam':        ['Computer Aided Design and Manufacturing'],
  'cad/cam':    ['Computer Aided Design and Manufacturing'],

  'iot':        ['Internet of Things', 'Internet of Things System Architecture'],
  'internet of things': ['Internet of Things', 'Internet of Things System Architecture'],

  'blockchain': ['Blockchain Technology'],

  /* ── Semester 6 ── */
  'steel':      ['Steel Structures'],

  'age':        ['Applied Geotechnical Engineering'],

  'sd':         ['Sustainable Development'],
  'sustainable': ['Sustainable Development', 'Sustainable Building Materials'],

  'fsd':        ['Full Stack Development'],
  'full stack':  ['Full Stack Development'],
  'fullstack':  ['Full Stack Development'],

  'aml':        ['Advanced Machine Learning'],

  'genai':      ['Generative AI'],
  'generative': ['Generative AI'],
  'gen ai':     ['Generative AI'],

  'agentic':    ['Agentic AI', 'Agentic AI Systems'],

  'vlsi':       ['CMOS VLSI Design'],
  'cmos':       ['CMOS VLSI Design'],

  'ns':         ['Network Security'],

  'dsp':        ['Digital Signal Processing'],
  'signal processing': ['Digital Signal Processing'],

  'ht':         ['Heat Transfer'],
  'heat':       ['Heat Transfer'],

  'md':         ['Machine Design'],

  'ndt':        ['Non-Destructive Testing'],

  'iotsa':      ['Internet of Things System Architecture'],

  'cccf':       ['Cyber Crime and Cyber Forensics'],
  'cyber crime': ['Cyber Crime and Cyber Forensics'],
  'forensics':  ['Cyber Crime and Cyber Forensics'],

  /* ── Branch abbreviations ── */
  'cse':        [],  // handled by branch field directly
  'ece':        [],
  'ise':        [],
  'csai':       [],
  'csds':       [],
  'csbs':       [],
  'me':         [],
  'cv':         [],
  'ce':         [],
}

export default SEARCH_ALIASES
