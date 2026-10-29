export interface UserProfile {
  name: string;
  email: string;
  edu: string;
  year: string;
  department?: string;
  interests: string[];
  skills: string[];
  aspiration: string;
  guest?: boolean;
}

export interface AssessmentAnswers {
  interest: (number | null)[];
  aptitude: (number | null)[];
  personality: (number | null)[];
}

export interface SelfReflection {
  text: string;
  conf: string;
  env: string[];
}

export interface CareerModel {
  id: string;
  name: string;
  icon: string;
  desc: string;
  dims: { [key: string]: number };
  style: { [key: string]: number };
  apt: number;
  skills: string[];
  tags: string[];
  requiredDegree?: string;
  growthOutlook?: string;
  averageSalary?: string;
}

export interface CareerScoreResult {
  c: CareerModel;
  total: number;
  iFit: number;
  aFit: number;
  sFit: number;
  kFit: number;
  gFit: number;
  have: string[];
  missing: string[];
  aiInsights?: {
    personalizedWhy?: string;
    suggestedProjects?: string[];
    learningStrategy?: string;
  };
}

export interface CheckinRecord {
  level: string;
  skill: string;
  date: string;
}

export interface JournalRecord {
  text: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'fallback' | 'fallback_error';
}

export interface AppState {
  user: UserProfile | null;
  ans: AssessmentAnswers;
  refl: SelfReflection;
  assessed: boolean;
  target: string;
  done: Record<string, boolean>;
  checkins: CheckinRecord[];
  journal: JournalRecord[];
  settings: {
    personal: boolean;
    remind: boolean;
    anon: boolean;
    scale: number;
  };
  compare: string[];
  skills?: string[];
  aspiration?: string;
  edu?: string;
  year?: string;
}

export const DIMS: Record<string, string> = {
  B: 'Build',
  A: 'Analyse',
  C: 'Create',
  P: 'People',
  L: 'Lead',
};

export const STYLES: Record<string, string> = {
  S: 'Independent',
  T: 'Team',
  L: 'Leading',
  X: 'Experimenting',
};

export const INTERESTS_LIST = [
  'Technology',
  'AI & Machine Learning',
  'Design & UI/UX',
  'Problem Solving',
  'Data & Analytics',
  'Business & Startups',
  'Cybersecurity',
  'Helping & Mentoring',
];

export const SKILLS_LIST = [
  'Java',
  'Python',
  'JavaScript',
  'HTML/CSS',
  'Git & GitHub',
  'DSA (Data Structures)',
  'SQL & Databases',
  'Unit Testing',
  'Communication',
  'Statistics',
  'Machine Learning',
  'Data Visualization',
  'Figma',
  'UX Research',
  'Networking',
  'Security Basics',
  'Product Thinking',
  'Leadership & Agile',
];

export const ENVS_LIST = [
  'Hybrid',
  'Remote',
  'On-site',
  'Collaborative',
  'Independent',
  'Learning-focused',
  'Fast-paced',
];

export const INTEREST_QUESTIONS: [string, [string, string][]][] = [
  [
    'Which activity sounds most enjoyable?',
    [
      ['Building an app to solve a real problem', 'B'],
      ['Analysing business trends & metrics', 'A'],
      ['Creating visual designs & user journeys', 'C'],
      ['Helping and mentoring junior peers', 'P'],
      ['Leading a team toward an ambitious goal', 'L'],
    ],
  ],
  [
    'You have a free weekend with no commitments. What do you pick?',
    [
      ['Tinker with a new development framework or tool', 'B'],
      ['Dig into an interesting puzzle or Kaggle dataset', 'A'],
      ['Sketch, design, or write an article/mockup', 'C'],
      ['Volunteer or connect with peers & communities', 'P'],
      ['Organise a workshop, study group, or event', 'L'],
    ],
  ],
  [
    'Which role in a major capstone project excites you most?',
    [
      ['Architecting the backend and prototype code', 'B'],
      ['Gathering research data and uncovering trends', 'A'],
      ['Crafting the presentation, UI flow, and visual brand', 'C'],
      ['Pitching, presenting, and explaining to stakeholders', 'P'],
      ['Coordinating milestones, sprints, and deliverables', 'L'],
    ],
  ],
  [
    'What kind of challenge brings you the highest satisfaction?',
    [
      ['Refactoring a slow system to make it robust & scalable', 'B'],
      ['Discovering why numbers changed and predicting outcomes', 'A'],
      ['Making something that feels intuitive and pleasant to use', 'C'],
      ['Understanding what end-users genuinely struggle with', 'P'],
      ['Deciding which high-impact problems are worth solving', 'L'],
    ],
  ],
  [
    'Pick a video or article rabbit hole you would eagerly fall into:',
    [
      ['How distributed systems and mobile engines are built', 'B'],
      ['Modern AI architectures and data intelligence explained', 'A'],
      ['Design systems, micro-interactions, and visual ergonomics', 'C'],
      ['Human psychology, team dynamics, and coaching', 'P'],
      ['Tech leadership, product philosophy, and startup scaling', 'L'],
    ],
  ],
  [
    'At an intense 36-hour hackathon, what is your chosen duty?',
    [
      ['Core Developer / Systems Implementer', 'B'],
      ['Data Specialist / Algorithm Engineer', 'A'],
      ['UX Architect / Interaction Designer', 'C'],
      ['Product Storyteller / Pitch Communicator', 'P'],
      ['Team Captain / Project Orchestrator', 'L'],
    ],
  ],
  [
    'Which toolset would you most want to achieve true mastery in?',
    [
      ['IDE, compilers, debuggers, and performance profilers', 'B'],
      ['Data query engines, notebooks, and statistical suites', 'A'],
      ['Design canvases, motion tools, and prototyping labs', 'C'],
      ['Facilitation, coaching, and negotiation skills', 'P'],
      ['Roadmapping, backlog prioritization, and metrics tracking', 'L'],
    ],
  ],
  [
    'What gives you that "that was a great day" feeling when logging off?',
    [
      ['Shipping a cleanly tested feature that works flawlessly', 'B'],
      ['Solving a tricky mathematical or analytical puzzle', 'A'],
      ['Completing a high-fidelity design that delights testers', 'C'],
      ['Resolving a team blocker and seeing a teammate thrive', 'P'],
      ['Aligning an entire team around a crystal-clear roadmap', 'L'],
    ],
  ],
];

export const APTITUDE_QUESTIONS: [string, string[], number][] = [
  [
    'A code review pipeline has 4 successive validation stages. Each stage eliminates 50% of the remaining edge-case bugs. What fraction of original bugs remain after 2 stages?',
    ['1/2 (50%)', '1/4 (25%)', '1/8 (12.5%)', '1/16 (6.25%)'],
    1,
  ],
  [
    'Identify the next number in this sequence: 2, 6, 12, 20, 30, ... ?',
    ['38', '40', '42', '44'],
    2,
  ],
  [
    'If 5 automated server instances process 5 batch jobs in 5 minutes, how many minutes will 100 identical instances take to process 100 batch jobs?',
    ['1 minute', '5 minutes', '20 minutes', '100 minutes'],
    1,
  ],
  [
    'A cloud hosting bill increased by 20% in Month 1, then was optimized down by 20% in Month 2. Compared to the original cost, the new cost is:',
    ['Identical (0% change)', '4% lower (-4%)', '4% higher (+4%)', '2% lower (-2%)'],
    1,
  ],
  [
    'Logical statement: "All software engineers are analytical thinkers. Some analytical thinkers are creative designers." Which deduction MUST be true?',
    [
      'All creative designers are software engineers',
      'Some analytical thinkers are creative designers',
      'No software engineer is creative',
      'All analytical thinkers are software engineers',
    ],
    1,
  ],
  [
    'What is the decimal equivalent of the binary number 1011 (base 2)?',
    ['9', '10', '11', '13'],
    2,
  ],
  [
    'An automated crawler downloads 60 MB of data in 45 seconds. At this constant rate, what is its throughput in MB per minute?',
    ['75 MB/min', '80 MB/min', '90 MB/min', '120 MB/min'],
    1,
  ],
  [
    'If A=1, B=2, C=3 ... Z=26, what is the numerical sum of the word "DATA"?',
    ['28', '29', '30', '31'],
    1,
  ],
];

export const PERSONALITY_QUESTIONS: [string, [string, string][]][] = [
  [
    'In your daily work or project routine, you flourish most when you can:',
    [
      ['Solve challenging technical puzzles with uninterrupted focus', 'S'],
      ['Collaborate continuously with an energetic team', 'T'],
      ['Lead discussions and coordinate tasks across people', 'L'],
      ['Freely experiment with unconventional, creative ideas', 'X'],
    ],
  ],
  [
    'When you hit a major roadblock or technical bug:',
    [
      ['I isolate the problem methodically on my own first', 'S'],
      ['I bounce ideas off colleagues or teammates immediately', 'T'],
      ['I step back to assess impact, prioritize, and delegate', 'L'],
      ['I pivot to test alternative prototypes or architectures', 'X'],
    ],
  ],
  [
    'Your optimal approach to handling approaching deadlines:',
    [
      ['Granular checklists with heads-down deep work sessions', 'S'],
      ['Daily stand-ups and continuous status syncs with teammates', 'T'],
      ['Setting milestone gates and driving team accountability', 'L'],
      ['Adaptive iteration, adapting features dynamically as I go', 'X'],
    ],
  ],
  [
    'In a collaborative multidisciplinary team, you naturally tend to:',
    [
      ['Take deep ownership of a crucial, complex module', 'S'],
      ['Act as the glue that keeps every team member connected', 'T'],
      ['Set strategic priorities and eliminate team friction', 'L'],
      ['Brainstorm novel features and challenge conventional thinking', 'X'],
    ],
  ],
  [
    'What is the most rewarding attribute you seek in your dream career?',
    [
      ['Deep technical craft mastery and intellectual rigor', 'S'],
      ['Strong sense of community, camaraderie, and belonging', 'T'],
      ['Leadership leverage and company-level business impact', 'L'],
      ['Autonomy, creative license, and freedom to innovate', 'X'],
    ],
  ],
  [
    'Which type of constructive feedback accelerates your growth most?',
    [
      ['Precise, detailed technical code/design reviews in writing', 'S'],
      ['An informal 1-on-1 coffee chat discussing perspectives', 'T'],
      ['Direct, KPI-driven feedback on milestone outcomes', 'L'],
      ['Open-ended, exploratory feedback exploring what could be', 'X'],
    ],
  ],
  [
    'Which physical/virtual working environment gives you peak energy?',
    [
      ['A serene, focused space with low distractions', 'S'],
      ['A vibrant, communicative collaborative studio', 'T'],
      ['A fast-moving mission control with high responsibility', 'L'],
      ['An experimental R&D sandbox where failure is learning', 'X'],
    ],
  ],
  [
    'How do you absorb a complex new topic most effectively?',
    [
      ['Self-paced documentation deep dives and personal code sandboxes', 'S'],
      ['Collaborative study sessions, pair programming, and discussion', 'T'],
      ['Teaching the concept or managing a pilot initiative', 'L'],
      ['Deconstructing open-source examples and rapid tinkering', 'X'],
    ],
  ],
];

export const CAREERS_DATA: CareerModel[] = [
  {
    id: 'swe',
    name: 'Software Engineer',
    icon: '💻',
    desc: 'Architect, code, test, and scale mission-critical software systems and applications.',
    dims: { B: 1.0, A: 0.6, C: 0.3, P: 0.2, L: 0.2 },
    style: { S: 0.8, T: 0.6, L: 0.2, X: 0.5 },
    apt: 0.65,
    skills: ['Java', 'DSA (Data Structures)', 'SQL & Databases', 'Git & GitHub', 'Unit Testing', 'Communication'],
    tags: ['software', 'developer', 'engineer', 'swe', 'programmer', 'backend', 'full stack'],
    growthOutlook: '+25% (Much faster than average)',
    averageSalary: '$110,000 - $165,000',
  },
  {
    id: 'ml',
    name: 'AI / ML Engineer',
    icon: '🤖',
    desc: 'Design, train, optimize, and deploy neural networks and intelligent data pipelines.',
    dims: { B: 0.7, A: 1.0, C: 0.3, P: 0.1, L: 0.1 },
    style: { S: 0.8, T: 0.4, L: 0.1, X: 0.8 },
    apt: 0.75,
    skills: ['Python', 'Statistics', 'Machine Learning', 'DSA (Data Structures)', 'SQL & Databases', 'Git & GitHub'],
    tags: ['ai', 'ml', 'machine learning', 'data scientist', 'deep learning', 'nlp'],
    growthOutlook: '+36% (Extremely high demand)',
    averageSalary: '$130,000 - $190,000',
  },
  {
    id: 'da',
    name: 'Data Analyst',
    icon: '📊',
    desc: 'Transform complex data streams into actionable intelligence to steer business and product strategy.',
    dims: { B: 0.3, A: 1.0, C: 0.3, P: 0.4, L: 0.3 },
    style: { S: 0.6, T: 0.6, L: 0.3, X: 0.4 },
    apt: 0.6,
    skills: ['SQL & Databases', 'Python', 'Statistics', 'Data Visualization', 'Communication'],
    tags: ['data', 'analyst', 'analytics', 'bi', 'business intelligence'],
    growthOutlook: '+23% (Rapid growth)',
    averageSalary: '$85,000 - $125,000',
  },
  {
    id: 'ux',
    name: 'UI / UX Designer',
    icon: '🎨',
    desc: 'Synthesize user behavior research into delightful, accessible, and high-impact digital experiences.',
    dims: { B: 0.3, A: 0.4, C: 1.0, P: 0.6, L: 0.2 },
    style: { S: 0.4, T: 0.7, L: 0.2, X: 0.9 },
    apt: 0.5,
    skills: ['Figma', 'UX Research', 'HTML/CSS', 'Communication', 'Data Visualization'],
    tags: ['design', 'ux', 'ui', 'designer', 'product design', 'visual design'],
    growthOutlook: '+16% (Faster than average)',
    averageSalary: '$90,000 - $140,000',
  },
  {
    id: 'sec',
    name: 'Cybersecurity Analyst',
    icon: '🛡️',
    desc: 'Safeguard infrastructure, networks, and cloud assets by identifying and neutralizing threats.',
    dims: { B: 0.7, A: 0.9, C: 0.2, P: 0.2, L: 0.3 },
    style: { S: 0.8, T: 0.5, L: 0.3, X: 0.5 },
    apt: 0.7,
    skills: ['Networking', 'Security Basics', 'Python', 'Git & GitHub', 'Communication'],
    tags: ['security', 'cyber', 'infosec', 'pentesting', 'soc'],
    growthOutlook: '+32% (Critical global shortage)',
    averageSalary: '$105,000 - $155,000',
  },
  {
    id: 'pm',
    name: 'Product Manager',
    icon: '🧭',
    desc: 'Define product vision, align cross-functional engineering teams, and deliver user value.',
    dims: { B: 0.4, A: 0.7, C: 0.5, P: 0.8, L: 1.0 },
    style: { S: 0.2, T: 0.8, L: 1.0, X: 0.5 },
    apt: 0.6,
    skills: ['Product Thinking', 'Communication', 'Leadership & Agile', 'SQL & Databases', 'Data Visualization'],
    tags: ['product', 'manager', 'pm', 'management', 'agile'],
    growthOutlook: '+18% (Strong demand)',
    averageSalary: '$115,000 - $175,000',
  },
  {
    id: 'web',
    name: 'Full-Stack Web Developer',
    icon: '🌐',
    desc: 'Engineer performant, responsive web apps utilizing cutting-edge client and server technologies.',
    dims: { B: 1.0, A: 0.4, C: 0.6, P: 0.3, L: 0.2 },
    style: { S: 0.6, T: 0.6, L: 0.2, X: 0.7 },
    apt: 0.55,
    skills: ['JavaScript', 'HTML/CSS', 'Git & GitHub', 'SQL & Databases', 'Unit Testing'],
    tags: ['web', 'frontend', 'front-end', 'full stack', 'javascript', 'react'],
    growthOutlook: '+20% (Consistent high demand)',
    averageSalary: '$95,000 - $145,000',
  },
];
