/**
 * Single source of truth for every string, stat and asset path on the site.
 * Copy is taken verbatim from the brochure / hoarding creatives — do not
 * paraphrase the specification bullets, buyers read them line by line.
 */

export const PROJECT = {
  name: 'Sridira Lake Creek',
  shortName: 'Lake Creek',
  locality: 'Horamavu, Bengaluru',
  tagline: 'Enjoy life from a new point of view.',
  positioning:
    'Lakeside living, in the city — set beside the waters of Horamavu Lake, these thoughtfully designed residences open to uninterrupted views, abundant natural light and a constant connection to the outdoors.',
  phase: 'Phase 1',
} as const;

/**
 * Defaults are the real details printed on the back page of the digital
 * brochure; every one stays env-overridable for staging and campaign numbers.
 */
export const CONTACT = {
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+917411995037',
  phoneDisplay: process.env.NEXT_PUBLIC_CONTACT_PHONE_DISPLAY || '+91 74119 95037',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@sridiralakecreek.in',
  /**
   * The live domain — not the sridiralakecreek.in address printed in the
   * brochure, which does not serve this site. Drives the canonical URL, the
   * Open Graph tags, robots.txt and sitemap.xml, so it has to be the real one.
   */
  site: 'www.sdlakecreek.online',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sdlakecreek.online',
  address: 'Sy no 75/2, 64/4 & 64/6, Horamavu Agara, Bengaluru, Karnataka 560043',
  addressShort: 'Horamavu Agara, Bengaluru',
  /** Kept separate from the call number so the two can diverge later. */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917411995037',
  /** TODO(launch): Karnataka RERA registration is mandatory before advertising. */
  rera: process.env.NEXT_PUBLIC_RERA_NUMBER || 'RERA No: [TO BE CONFIRMED]',
  callbackHours: process.env.NEXT_PUBLIC_CALLBACK_HOURS || '24',
} as const;

/**
 * The brochure ships with the site, so the download always works. Point
 * NEXT_PUBLIC_BROCHURE_URL at a CDN copy if you'd rather serve it elsewhere.
 */
export const BROCHURE_URL =
  process.env.NEXT_PUBLIC_BROCHURE_URL || '/brochure/sridira-lake-creek-brochure.pdf';
export const BROCHURE_FILENAME = 'Sridira-Lake-Creek-Brochure.pdf';

export const whatsappHref = (phone: string = CONTACT.whatsapp) =>
  `https://wa.me/${phone.replace(/[^\d]/g, '')}?text=Hi%2C%20I%27m%20interested%20in%20Sridira%20Lake%20Creek`;

export const NAV = [
  { label: 'Amenities', href: '#amenities' },
  { label: 'Floor Plans', href: '#floor-plans' },
  { label: 'Location', href: '#location' },
  { label: 'Specifications', href: '#specifications' },
  { label: 'FAQ', href: '#faq' },
] as const;

/* ------------------------------------------------------------------ hero */

export const HERO_IMAGES = [
  {
    src: '/assets/hero-exterior/cover-01.jpg',
    alt: 'Sridira Lake Creek towers at dusk overlooking Horamavu Lake',
  },
  {
    src: '/assets/hoarding-banners/hoarding-003-006.jpg',
    alt: 'Lake-facing elevation of Sridira Lake Creek, Horamavu',
  },
  {
    src: '/assets/hero-exterior/intro-lakeside-02.jpg',
    alt: 'Lakeside approach to the Sridira Lake Creek residences',
  },
] as const;

/* ------------------------------------------------------------ at a glance */

export const QUICK_FACTS = [
  { value: '4.48', unit: 'Acres', caption: 'with 70% open spaces' },
  { value: '2', unit: 'Towers', caption: '28 floors each' },
  { value: '336', unit: 'Homes', caption: 'in Phase 1' },
  { value: '270°', unit: 'Views', caption: 'corner-facing homes' },
  { value: '50+', unit: 'Amenities', caption: 'biophilic architecture' },
] as const;

/* --------------------------------------------------------- open by design */

export const OPEN_BY_DESIGN = {
  eyebrow: 'Open by design',
  heading: 'Life moves differently by the water.',
  body: 'Spaces designed around biophilic principles.',
  features: [
    { icon: 'expand', title: 'Expansive layouts', note: 'Room to live, not just to fit.' },
    { icon: 'view', title: '270° open corner residences', note: 'Light and air from three sides.' },
    { icon: 'water', title: 'Direct lake access', note: 'Horamavu Lake at your doorstep.' },
    { icon: 'leaf', title: 'Curated gardens', note: 'Planted, not landscaped as an afterthought.' },
    { icon: 'shield', title: 'No-neighbour concept', note: 'No home faces another, directly.' },
  ],
} as const;

/* ------------------------------------------------------------- residences */

export const RESIDENCES = {
  heading: 'The Residences',
  body: 'Designed as corner homes with 270° panoramic views and no direct-facing neighbours, each residence enjoys more space, greater privacy and better ventilation.',
  config: {
    tag: 'The only configuration',
    title: '3 BHK + 3T',
    size: '1700–1870 Sft',
    cta: 'Explore Floor Plans',
    highlights: [
      { label: 'Corner home', note: '270° panoramic views' },
      { label: 'No-neighbour', note: 'No direct-facing unit' },
      { label: 'Cross ventilation', note: 'Openings on three sides' },
      { label: 'Lake orientation', note: 'Towards Horamavu Lake' },
    ],
  },
} as const;

/* -------------------------------------------------------------- amenities */

export const AMENITY_CATEGORIES = [
  {
    name: 'Wellness',
    icon: 'wellness',
    items: ['Yoga Pods', 'Meditation Zone', 'Bamboo Forest', 'Palm Forest', 'Relaxation Trail'],
  },
  {
    name: 'Sports & Recreation',
    icon: 'sports',
    items: ['Pickleball Court', 'Cricket Pitch', 'Badminton Court', 'Basketball Court', 'Jogging Track'],
  },
  {
    name: 'Kids',
    icon: 'kids',
    items: ['Kids Play Area', 'Toddler Play Area', 'Kids Amphitheatre', 'Green Maze'],
  },
  {
    name: 'Nature',
    icon: 'nature',
    items: ['Urban Forest', 'Forest Trail', 'Fragrant Tree Plaza', 'Lakeside Path'],
  },
  {
    name: 'Water Experiences',
    icon: 'water',
    items: ['Swimming Pool', 'Kids Pool', 'Koi Pond', 'Waterfall'],
  },
  {
    name: 'Social',
    icon: 'social',
    items: ['Clubhouse', 'Party Lawn', 'Amphitheatre', 'Floating Stage', 'Workshop Plaza'],
  },
] as const;

/**
 * Full-bleed renders lifted from the digital brochure. The earlier
 * `amenities-detail-*` files were flattened cutouts on a black field — they
 * rendered as solid black panels and are no longer used anywhere.
 */
export const AMENITY_IMAGES = [
  {
    src: '/assets/gallery/clubhouse.jpg',
    alt: 'The Sridira Lake Creek clubhouse, with planted terraces over a glazed double-height frontage',
  },
  {
    src: '/assets/gallery/gym.jpg',
    alt: 'Fitness studio with floor-to-ceiling glazing and a timber-battened ceiling',
  },
  {
    src: '/assets/gallery/pool.jpg',
    alt: 'The swimming pool and deck at Sridira Lake Creek',
  },
  {
    src: '/assets/gallery/kids.jpg',
    alt: "Children's play area set among landscaped lawns",
  },
  {
    src: '/assets/gallery/sports.jpg',
    alt: 'Half basketball court in the sports zone',
  },
  {
    src: '/assets/gallery/deck.jpg',
    alt: 'Timber pool deck and cabana lit at dusk',
  },
] as const;

/* --------------------------------------------------------------- location */

export const LOCATION = {
  heading: 'At the centre of where Bengaluru is going. Apart from its noise.',
  body: 'As Bengaluru continues to grow eastward and northward, Horamavu finds itself at the centre of this transformation. Well connected to major tech hubs, business districts, and everyday conveniences, it is fast emerging as one of the city’s most sought-after addresses for both living and investing.',
  distances: [
    { place: 'KR Puram & Tin Factory', distance: '4 km' },
    { place: 'Indiranagar', distance: '5 km' },
    { place: 'Hebbal', distance: '7 km' },
    { place: 'M.G. Road', distance: '10 km' },
    { place: 'Whitefield', distance: '12 km' },
    { place: 'Kempegowda International Airport', distance: '25 km' },
  ],
  mapEmbed: 'https://www.google.com/maps?q=Horamavu%20Lake%2C%20Bengaluru%2C%20Karnataka&z=13&output=embed',
  mapLink: 'https://www.google.com/maps/search/?api=1&query=Horamavu+Lake,+Bengaluru',
} as const;

/* ------------------------------------------------------------ master plan */

export const MASTER_PLAN = {
  heading: 'Crafted around your lifestyle.',
  image: '/assets/masterplan/masterplan-diagram-01.jpg',
  /** Condensed from the 30-point brochure legend to the visitor-relevant highlights. */
  legend: [
    'Entrance portal',
    'Drop-off plaza',
    'Clubhouse entry plaza',
    'Pool deck & swimming pool',
    "Kid's pool",
    'Jogging track loop (400m)',
    'Green maze',
    'Forest trail',
    'Urban forest',
    'Tree bosquet sitout',
  ],
} as const;

/* ------------------------------------------------------------ floor plans */

export type FloorPlan = {
  id: string;
  label: string;
  config: string;
  sft: string;
  plinth: string;
  image: string;
  /** Crop window — the brochure scans two layouts per sheet. */
  position: string;
};

export const FLOOR_PLANS: FloorPlan[] = [
  {
    id: 'flat-01',
    label: 'Flat 01',
    config: '3BHK + 3T',
    sft: '1810 Sft',
    plinth: 'Plinth 126.42 Sqm',
    image: '/assets/floor-plans/flat-01-02.jpg',
    position: '22% 50%',
  },
  {
    id: 'flat-02',
    label: 'Flat 02',
    config: '3BHK + 3T',
    sft: '1765 Sft',
    plinth: 'Plinth 123.33 Sqm',
    image: '/assets/floor-plans/flat-01-02.jpg',
    position: '78% 50%',
  },
  {
    id: 'flat-03',
    label: 'Flat 03',
    config: '3BHK + 3T',
    sft: '1831 Sft',
    plinth: 'Plinth 127.92 Sqm',
    image: '/assets/floor-plans/flat-03-04.jpg',
    position: '22% 50%',
  },
  {
    id: 'flat-04',
    label: 'Flat 04',
    config: '3BHK + 3T',
    sft: '1830 Sft',
    plinth: 'Plinth 127.81 Sqm',
    image: '/assets/floor-plans/flat-03-04.jpg',
    position: '78% 50%',
  },
  {
    id: 'flat-05',
    label: 'Flat 05',
    config: '3BHK + 3T',
    sft: '1700 Sft',
    plinth: 'Plinth 118.81 Sqm',
    image: '/assets/floor-plans/flat-05-06-context.jpg',
    position: '22% 50%',
  },
  {
    id: 'flat-06',
    label: 'Flat 06',
    config: '3BHK + 3T',
    sft: '1870 Sft',
    plinth: 'Plinth 130.59 Sqm',
    image: '/assets/floor-plans/flat-05-06-context.jpg',
    position: '78% 50%',
  },
];

/* --------------------------------------------------------- specifications */

export const SPECIFICATIONS = [
  {
    group: 'Structure',
    items: ["RCC 'Shear Wall Structural System' as per the relevant IS Codes"],
  },
  {
    group: 'Doors',
    items: [
      'Main door — Engineered wooden door with premium hardware.',
      'Internal doors — Engineered wooden door with premium hardware.',
      'Toilet doors — Flush doors with laminate finish.',
    ],
  },
  {
    group: 'Windows & Sliding Doors',
    items: [
      '2.5 track uPVC windows and 3 track uPVC sliding doors with clear glass and mosquito mesh provision (Aparna/Wintech/NCL or equivalent)',
    ],
  },
  {
    group: 'Flooring — Apartment',
    items: [
      'Vitrified tiles in living, dining & kitchen.',
      'Master bedroom — laminated wooden flooring.',
      'Other bedrooms — vitrified tiles.',
      'Balcony & utility — anti-skid ceramic flooring.',
      'Toilets — vitrified/ceramic tiles and dado up to 7 feet / ceiling height.',
    ],
  },
  {
    group: 'Flooring — Common',
    items: [
      'Corridors — Granite/vitrified tiles.',
      'Staircase — granite flooring.',
      'Lift lobby — granite flooring.',
    ],
  },
  {
    group: 'Toilets',
    items: [
      'Sanitary fixtures of reputed make in all bathrooms.',
      'Chromium plated fittings of reputed make.',
      'Plumbing & electrical provision for geysers.',
      'Electrical provision for exhaust fans.',
    ],
  },
  {
    group: 'Kitchen/Utility',
    items: [
      'Provision for water purifier and sink in kitchen.',
      'Provision for sink and washing machine in utility.',
      'Provision for chimney and hob.',
    ],
  },
  {
    group: 'Balcony Railing',
    items: ['MS handrail as per design.'],
  },
  {
    group: 'Electrical',
    items: [
      'One TV point in living room and MBR.',
      'Bescom power supply — 5KW 3-phase supply.',
      'Power backup of 2KW for apartment (lighting circuit).',
      'Concealed copper wiring with modular switches.',
      'ELCB for safety.',
      'Internet points in bedrooms, living & family room.',
      'Split AC provision in all rooms and living room.',
    ],
  },
  {
    group: 'Painting',
    items: [
      'Interior — smooth putty finish with premium emulsion paint.',
      'Exterior — weatherproof emulsion.',
    ],
  },
  {
    group: 'Car Parking',
    items: ['Covered car parking in basement.'],
  },
  {
    group: 'Elevators',
    items: [
      '3 passenger elevators per tower.',
      '1 separate service lift per tower.',
      'Automatic high-speed elevators.',
    ],
  },
  {
    group: 'Common Area',
    items: [
      '100% power backup for common areas.',
      'Grand entrance with security room & compound wall.',
      'Solar-powered common lighting.',
      'EV charging provision.',
      'Underground electrical, plumbing & drainage lines.',
      'Sewage Treatment Plant (STP), rainwater harvesting & WTP.',
      'Visitor parking.',
    ],
  },
] as const;

/* ---------------------------------------------------------------- builder */

export const BUILDER = {
  heading: 'Built by Allure Ventures & SRIDIRA Projects',
  body: 'Technology-driven construction across Telangana, Karnataka & Andhra Pradesh — delivering residential, commercial, and industrial spaces built with precision and purpose.',
  portfolio: [
    { name: 'Allure One', status: 'Completed', note: '' },
    { name: 'Allure Business Park', status: 'Completed', note: 'Hyderabad' },
    { name: 'Allure Avani', status: 'Under construction', note: '450 villas · 50+ acres' },
    { name: 'Sridira Mokila Villas', status: 'Under construction', note: '' },
  ],
  consultants:
    'Principal Architects — Aslam Architects · MEP Consultants — Design Tree Consultants · Landscape Architects — Dharitri Landscape',
} as const;

/* -------------------------------------------------------------------- FAQ */

export const FAQS = [
  {
    q: 'What configurations are available at Sridira Lake Creek?',
    a: 'Phase 1 offers a single configuration — 3 BHK + 3T, ranging from 1700 to 1870 Sft across six layouts (Flat 01 to Flat 06). Every home is designed as a corner residence with 270° panoramic views and no direct-facing neighbours. Unlock any floor plan above to see the full layout and plinth areas.',
  },
  {
    q: 'What is included in the 50+ amenities?',
    a: 'Amenities are grouped into six worlds: Wellness (yoga pods, meditation zone, bamboo and palm forests, relaxation trail), Sports & Recreation (pickleball, cricket pitch, badminton, basketball, jogging track), Kids (play areas, toddler zone, kids amphitheatre, green maze), Nature (urban forest, forest trail, fragrant tree plaza, lakeside path), Water Experiences (swimming pool, kids pool, koi pond, waterfall) and Social (clubhouse, party lawn, amphitheatre, floating stage, workshop plaza).',
  },
  {
    q: 'How far is Sridira Lake Creek from KR Puram, Indiranagar and the airport?',
    a: 'KR Puram and Tin Factory are 4 km away, Indiranagar 5 km, Hebbal 7 km, M.G. Road 10 km and Whitefield 12 km. Kempegowda International Airport is approximately 25 km from the project.',
  },
  {
    q: 'Who is developing Sridira Lake Creek?',
    a: 'The project is developed by Allure Ventures and SRIDIRA Projects — technology-driven builders working across Telangana, Karnataka and Andhra Pradesh, led by directors Dilip C. Byra and Ravi Anem. Design consultants include Aslam Architects (architecture), Design Tree Consultants (MEP) and Dharitri Landscape (landscape).',
  },
  {
    q: 'Is Sridira Lake Creek RERA registered?',
    a: 'RERA No: [TO BE CONFIRMED]. The Karnataka RERA registration number for this project has not been shared with us yet and will be published here as soon as it is issued. Please request it from the sales team before making any booking decision.',
  },
  {
    q: 'What is the possession timeline?',
    a: 'TBD — confirm with sales team. A possession date has not been announced for Phase 1. Register your interest and our team will share the current construction schedule on your callback.',
  },
] as const;

/* -------------------------------------------------------------- lead form */

export const LEAD_SOURCES = {
  headerCta: 'header-cta',
  heroPrimary: 'hero-primary-cta',
  heroBrochure: 'hero-brochure',
  residences: 'residences-config-card',
  amenities: 'amenities-section',
  floorPlan: 'floor-plan-unlock',
  inline: 'inline-form-block',
  masterPlan: 'master-plan',
  finalCta: 'final-cta-banner',
  footer: 'footer-form',
  exitIntent: 'exit-intent-modal',
  mobileBar: 'mobile-action-bar',
} as const;

export type LeadSource = (typeof LEAD_SOURCES)[keyof typeof LEAD_SOURCES];
