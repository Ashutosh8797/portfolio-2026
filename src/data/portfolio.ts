export interface Project {
  id: string;
  title: string;
  category: string;
  technologies: string[];
  description: string;
  features: string[];
  visual: string;
  githubUrl: string | null;
  liveUrl: string | null;
}

export interface StatItem {
  label: string;
  value: string;
}

export const personalInfo = {
  name: 'Ashutosh Kumar Sinha',
  displayName: 'ASHUTOSH KUMAR',
  location: 'Vijayawada, India',
  email: 'tashu6355@gmail.com',
  phone: '+91 8294380872',
  github: 'https://github.com/Ashutosh8797',
  portfolio: 'https://ashu-1.netlify.app/',
  /**
   * Set these to real values before deploying. They are intentionally `null`
   * so the UI never renders a link to a page that does not exist.
   *   linkedin:  'https://www.linkedin.com/in/<your-handle>'
   *   resumeUrl: '/Ashutosh_Kumar_Resume.pdf'  (drop the file in public/)
   */
  linkedin: null as string | null,
  resumeUrl: null as string | null,
};

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  period: string;
  grade: string;
  details?: string[];
  specialization?: string;
  coursework?: string[];
}

export const education: EducationEntry[] = [
  {
    id: 'btech',
    institution: 'KL University',
    degree: 'B.Tech in Computer Science',
    period: '2023 — 2027',
    grade: 'CGPA: 6.7 / 10',
    specialization: 'Artificial Intelligence and Autonomous Systems',
    coursework: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming',
      'AI/ML Fundamentals',
      'Database Management Systems',
      'Probability & Statistics',
      'Computer Networks',
    ],
  },
  {
    id: 'intermediate',
    institution: 'Trimurti Inter College',
    degree: 'Intermediate (12th)',
    period: 'Apr 2021 — Mar 2023',
    grade: '72%',
  },
  {
    id: 'ssc',
    institution: 'Christ Church Diocesan School',
    degree: 'SSC (10th)',
    period: 'April 2021',
    grade: '67.6%',
  },
];

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

/** In-page anchors. The Resume entry is appended only when a real file exists. */
export const navigation: NavItem[] = [
  { label: 'Home', href: '#hero' },
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'About', href: '#about' },
  ...(personalInfo.resumeUrl
    ? [{ label: 'Resume', href: personalInfo.resumeUrl, external: true }]
    : []),
];

export const roles = [
  'AI Developer',
  'Full-Stack Developer',
  'Computer Vision Developer',
  'Problem Solver',
];

export const projects = [
  {
    id: 'ai-campus-assistant',
    title: 'AI Campus Assistant',
    category: 'Full-Stack · AI',
    technologies: ['React', 'Node.js', 'Express.js', 'MongoDB'],
    description: 'An AI-powered campus management platform combining academic support, campus knowledge, safety assistance, maintenance requests, Lost & Found, and student services.',
    features: [
      'REST APIs',
      'MongoDB',
      'Authentication',
      'Responsive interface',
      'Campus service integration',
    ],
    visual: 'ai-campus',
    githubUrl: 'https://github.com/Ashutosh8797/ai-campus-assistant',
    liveUrl: null,
  },
  {
    id: 'vehicle-detection',
    title: 'Vehicle Detection System',
    category: 'Computer Vision',
    technologies: ['Python', 'OpenCV', 'YOLO'],
    description: 'A real-time computer vision system for detecting vehicles from image and video streams using object detection and bounding boxes.',
    features: [
      'Computer vision',
      'Detection boxes',
      'Video processing',
      'AI perception',
    ],
    visual: 'vehicle-detection',
    githubUrl: 'https://github.com/Ashutosh8797/vehicle-detection-system',
    liveUrl: null,
  },
  {
    id: 'kl-attendance-calculator',
    title: 'KL Attendance Calculator',
    category: 'Web Application',
    technologies: ['React', 'Vite', 'JavaScript'],
    description: 'A responsive attendance calculator that computes current attendance, required classes, and projected attendance to help students track attendance requirements.',
    features: [
      'Attendance calculation',
      'Required classes tracking',
      'Projected attendance',
      'Responsive design',
    ],
    visual: 'attendance-calculator',
    githubUrl: 'https://github.com/Ashutosh8797/kl-attendance-calculator',
    liveUrl: 'https://kl-attendance-calculator.netlify.app/',
  },
  {
    id: 'lost-found-platform',
    title: 'Lost & Found Platform',
    category: 'Full-Stack',
    technologies: ['React', 'Node.js', 'Express.js', 'MongoDB'],
    description: 'A campus-focused platform for reporting, searching, and recovering lost or misplaced items.',
    features: [
      'Item reporting',
      'Search functionality',
      'Campus-focused',
      'MongoDB storage',
    ],
    visual: 'lost-found',
    githubUrl: 'https://github.com/Ashutosh8797/lost-found-platform',
    liveUrl: null,
  },
];

export const skills = {
  languages: ['C', 'Python', 'Java', 'JavaScript'],
  fundamentals: [
    'Data Structures & Algorithms',
    'Object-Oriented Programming',
    'DBMS',
    'Software Design',
  ],
  aiMl: [
    'Artificial Intelligence',
    'Machine Learning',
    'Computer Vision',
    'YOLO',
    'OpenCV',
    'Prompt Engineering',
  ],
  webDevelopment: [
    'React',
    'Vite',
    'Node.js',
    'Express.js',
    'REST APIs',
    'HTML',
    'CSS',
    'TailwindCSS',
  ],
  databasesTools: [
    'MongoDB',
    'MySQL',
    'Git',
    'GitHub',
    'VS Code',
    'Postman',
  ],
  hardwareEdge: [
    'Raspberry Pi',
    'Arduino',
    'Sensors',
    'Edge Computing',
  ],
};

export const journalEntries = [
  {
    id: 'ai-campus-assistant',
    title: 'Building an AI Campus Assistant',
    topic: 'Full-Stack · AI',
    description: 'Developing a comprehensive campus management platform with AI-powered academic support, safety features, and student services integration.',
  },
  {
    id: 'computer-vision-yolo',
    title: 'Exploring Computer Vision with YOLO',
    topic: 'AI · Computer Vision',
    description: 'Building real-time object detection systems using YOLO for vehicle detection and autonomous navigation applications.',
  },
  {
    id: 'ai-autonomous-systems',
    title: 'Learning AI & Autonomous Systems',
    topic: 'Autonomous Systems',
    description: 'Deep diving into autonomous systems, sensor fusion, and edge computing for robotics and self-driving technologies.',
  },
  {
    id: 'react-node-projects',
    title: 'Building Projects with React & Node.js',
    topic: 'Web Development',
    description: 'Creating full-stack applications with modern React patterns, Node.js backends, and scalable architecture.',
  },
];

export interface Exploration {
  id: string;
  title: string;
  description: string;
  rotation: number;
  /** Placement within the 300vh stage, as a percentage. */
  pos: { x: number; y: number };
  /** Vertical travel direction while the stage is pinned. */
  drift: -1 | 1;
}

export const explorations: Exploration[] = [
  {
    id: 'ai-ml',
    title: 'AI / Machine Learning',
    description: 'Neural networks, deep learning, and intelligent systems',
    rotation: -3,
    pos: { x: 3, y: 3 },
    drift: 1,
  },
  {
    id: 'computer-vision',
    title: 'Computer Vision',
    description: 'Object detection, image processing, and visual AI',
    rotation: 2,
    pos: { x: 37, y: 11 },
    drift: -1,
  },
  {
    id: 'full-stack',
    title: 'Full-Stack Development',
    description: 'End-to-end web applications and scalable architectures',
    rotation: -2,
    pos: { x: 68, y: 20 },
    drift: 1,
  },
  {
    id: 'edge-computing',
    title: 'Raspberry Pi / Edge Computing',
    description: 'IoT, sensors, and distributed computing at the edge',
    rotation: 4,
    pos: { x: 4, y: 44 },
    drift: -1,
  },
  {
    id: 'autonomous-systems',
    title: 'Autonomous Systems',
    description: 'Robotics, navigation, and autonomous decision-making',
    rotation: -4,
    pos: { x: 38, y: 57 },
    drift: 1,
  },
  {
    id: 'creative-coding',
    title: 'Creative Coding / UI',
    description: 'Generative art, interactions, and polished interfaces',
    rotation: 3,
    pos: { x: 69, y: 70 },
    drift: -1,
  },
];

export const certifications = [
  {
    id: 'oracle-foundation',
    title: 'Oracle Certified Foundation Associate',
    issuer: 'Oracle',
    url: null,
  },
  {
    id: 'cambridge-linguaskill',
    title: 'Cambridge Linguaskill English Certification',
    issuer: 'Cambridge University Press & Assessment',
    url: null,
  },
  {
    id: 'jpmorgan-simulation',
    title: 'JPMorgan Software Engineering Job Simulation',
    issuer: 'JPMorgan Chase & Co.',
    url: null,
  },
  {
    id: 'aviatrix-multicloud',
    title: 'Aviatrix Multicloud Network Associate',
    issuer: 'Aviatrix',
    url: null,
  },
];

export const certificationsDriveUrl =
  'https://drive.google.com/drive/folders/1NewnqGHXu7-EFmtYovpQ12D-wpj3J-ra?usp=sharing';

export const stats = [
  { label: 'B.Tech Journey', value: '2023–27' },
  { label: 'Featured Projects', value: '4+' },
  { label: 'Technical Domains', value: '6+' },
];

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

/** Only real, reachable destinations are listed. */
export const footerLinks: FooterLink[] = [
  ...(personalInfo.linkedin ? [{ label: 'LinkedIn', href: personalInfo.linkedin }] : []),
  { label: 'GitHub', href: personalInfo.github },
  { label: 'Email', href: `mailto:${personalInfo.email}` },
  ...(personalInfo.resumeUrl
    ? [{ label: 'Resume', href: personalInfo.resumeUrl, external: true }]
    : []),
];