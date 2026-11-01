// Site copy. The hero, manifesto and services copy comes from the original
// site. Projects are concept work built from the pepper sequences and are
// labelled as concepts wherever they appear.

export const CONTACT_EMAIL = 'rizwanwaseem757@gmail.com';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/rizwan-waseem/';

export const NAV = [
  { label: 'Studio', href: '#studio' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Playground', href: '#playground' },
  { label: 'Contact', href: '#contact' },
];

export const HERO = {
  intro:
    'At Thirtysixstudio, we build digital assets and immersive experiences for purposeful brands.',
};

export const MANIFESTO =
  "We're a boutique production studio focused on design, animation, and technology, constantly rethinking what digital craft can do for present-day ads and campaigns.";

export const PRINCIPLES = [
  {
    title: 'Every frame is designed',
    body: 'An animation is a few hundred still images. We art-direct each one, not just the first and the last.',
  },
  {
    title: 'Motion needs a reason',
    body: 'Movement should explain, guide or delight. If it does none of those, we cut it.',
  },
  {
    title: 'Built to ship',
    body: 'Ideas are only finished once they run smoothly on the phone in your pocket.',
  },
];

export const SERVICES_INTRO =
  "We provide you with captivating design, interactive animations, reliable code, and immaculate project coordination. Whether you need a campaign built from scratch or assistance at a specific phase, we've got you covered.";

export const SERVICES = [
  {
    title: 'Design',
    body: 'Art direction, identity systems and campaign design that hold up from billboard to banner.',
    tags: ['Art direction', 'Identity', 'Campaign design'],
  },
  {
    title: 'Animation',
    body: '2D and 3D motion, product films and the short loops that make people stop scrolling.',
    tags: ['3D motion', 'Product film', 'Social loops'],
  },
  {
    title: 'Technology',
    body: 'Interactive sites, canvas and WebGL experiences, built on code that stays reliable.',
    tags: ['Interactive web', 'WebGL', 'Creative code'],
  },
  {
    title: 'Production',
    body: 'Project coordination from the first call to final delivery, so every phase lands on time.',
    tags: ['Producing', 'Planning', 'Delivery'],
  },
];

// `sequence` indexes lib/frames SEQUENCES (0–6). `ground` picks the panel colour.
export const PROJECTS = [
  {
    title: 'Heat Index',
    summary: 'A launch campaign for a small-batch hot sauce, told one rotating pepper at a time.',
    disciplines: ['Campaign', '3D motion', 'Web'],
    year: '2026',
    sequence: 0,
    ground: 'ink',
  },
  {
    title: 'Night Market',
    summary: 'Identity and motion system for a late-night street food festival.',
    disciplines: ['Identity', 'Motion system'],
    year: '2026',
    sequence: 2,
    ground: 'red',
  },
  {
    title: 'Slow Burn',
    summary: 'Opening titles for a cooking series about heat, patience and fire.',
    disciplines: ['Title sequence', 'Typography'],
    year: '2025',
    sequence: 3,
    ground: 'paper',
  },
  {
    title: 'Seed Library',
    summary: 'An interactive microsite for a community seed bank, where every variety can be spun and inspected.',
    disciplines: ['Interactive web', 'Canvas'],
    year: '2025',
    sequence: 5,
    ground: 'ink',
  },
  {
    title: 'Green Room',
    summary: 'A retail film and in-store loop for a produce market reopening.',
    disciplines: ['Film', 'Retail screens'],
    year: '2025',
    sequence: 6,
    ground: 'red',
  },
];

export const PROCESS = [
  {
    title: 'Listen',
    body: 'We start with your audience, the brief and the constraints. Then we agree what success looks like before anything is drawn.',
  },
  {
    title: 'Shape',
    body: 'Concepts, style frames and motion tests. You see the idea moving early, while it is still cheap to change.',
  },
  {
    title: 'Make',
    body: 'Design, animation and engineering run side by side, so nothing is lost in handover.',
  },
  {
    title: 'Launch',
    body: 'We test on real devices, ship, and stay on hand for the first weeks the work is live.',
  },
];
