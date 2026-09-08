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
    src: '/assets/hero/dusk-towers.jpg',
    alt: 'The twin towers of Sridira Lake Creek lit at dusk, reflected in Horamavu Lake',
  },
  {
    src: '/assets/hero/lake-tower.jpg',
    alt: 'Sridira Lake Creek seen across the open water of Horamavu Lake',
  },
  {
    src: '/assets/hero/open-water.jpg',
    alt: 'The open water and wooded far bank of Horamavu Lake',
  },
] as const;

/* ------------------------------------------------------------ at a glance */

export const QUICK_FACTS = [
  { value: '4.48', unit: 'Acres', caption: 'with 70% open spaces' },
  { value: '2', unit: 'Towers', caption: '30+ floors each' },
  { value: '360', unit: 'Homes', caption: 'featuring 12 penthouses' },
  { value: '270°', unit: 'Views', caption: 'corner-facing homes' },
  { value: 'Biophilic', unit: 'Architecture', caption: '' },
  { value: 'Sensorial', unit: 'Living', caption: '' },
] as const;

/* --------------------------------------------------------- open by design */

export const OPEN_BY_DESIGN = {
  eyebrow: 'Life flows with the water',
  heading: 'Where nature and residences merge.',
  body: 'Spaces designed around biophilic principles.',
  features: [
    { icon: 'expand', title: 'Expansive layouts', note: 'Room to live, not just to fit.' },
    { icon: 'view', title: '270° open corner residences', note: 'Light and air from three sides.' },
    { icon: 'water', title: 'Direct lake access', note: 'Horamavu Lake at your doorstep.' },
    { icon: 'leaf', title: 'Curated gardens', note: 'Planted, not landscaped as an afterthought.' },
    { icon: 'shield', title: 'Open sky views', note: 'Nothing built between you and the horizon.' },
  ],
} as const;

/* ------------------------------------------------------------- residences */

export const RESIDENCES = {
  heading: 'The Residences',
  body: 'Designed as corner homes with 270° panoramic views and no direct-facing neighbours, each residence enjoys more space, greater privacy and better ventilation.',
  config: {
    tag: 'The only configuration',
    title: '3 BHK + 3T',
    size: '1715–1870 SFT (SBUA)',
    cta: 'Explore Floor Plans',
    highlights: [
      { label: 'Corner home', note: '270° panoramic views' },
      { label: 'Open sky views', note: 'Nothing built in front' },
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
    items: [
      'Pickleball Court',
      'Cricket Pitch',
      'Tennis Court',
      'Badminton Court',
      'Basketball Court',
      'Jogging Track',
    ],
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
  heading: 'Crafted to elegance.',
  image: '/assets/masterplan/masterplan-diagram-01.jpg',
  /**
   * Ten of the thirty numbered points on the sanctioned plan. The numbers are
   * the brochure's own, so they line up with the diagram rather than being
   * renumbered 1-10.
   */
  legend: [
    { n: 1, label: 'Entrance portal & Drop off plaza' },
    { n: 3, label: 'Jogging track loop 400m' },
    { n: 4, label: 'Pool deck' },
    { n: 6, label: 'Swimming pool with Feature wall' },
    { n: 7, label: "Kid's pool" },
    { n: 9, label: 'Green maze' },
    { n: 11, label: 'Forest trail' },
    { n: 24, label: 'Bamboo forest & trail' },
    { n: 27, label: 'Celebration lawn' },
    { n: 30, label: 'Floating stage in Koi pond' },
  ],
} as const;

/* ------------------------------------------------------------ floor plans */

export type FloorPlan = {
  id: string;
  label: string;
  config: string;
  sft: string;
  /** Orientation, as given in the brochure. */
  facing: string;
  image: string;
  /** Crop window — the brochure scans two layouts per sheet. */
  position: string;
};

export const FLOOR_PLANS: FloorPlan[] = [
  {
    id: 'flat-01',
    label: 'Flat 01',
    config: '3BHK',
    sft: 'SBUA 1835 SFT',
    facing: 'West Facing',
    image: '/assets/floor-plans/flat-01-02.jpg',
    position: '22% 50%',
  },
  {
    id: 'flat-02',
    label: 'Flat 02',
    config: '3BHK',
    sft: 'SBUA 1762 SFT',
    facing: 'North Facing',
    image: '/assets/floor-plans/flat-01-02.jpg',
    position: '78% 50%',
  },
  {
    id: 'flat-03',
    label: 'Flat 03',
    config: '3BHK',
    sft: 'SBUA 1830 SFT',
    facing: 'West Facing',
    image: '/assets/floor-plans/flat-03-04.jpg',
    position: '22% 50%',
  },
  {
    id: 'flat-04',
    label: 'Flat 04',
    config: '3BHK',
    sft: 'SBUA 1830 SFT',
    facing: 'East Facing',
    image: '/assets/floor-plans/flat-03-04.jpg',
    position: '78% 50%',
  },
  {
    id: 'flat-05',
    label: 'Flat 05',
    config: '3BHK',
    sft: 'SBUA 1715 SFT',
    facing: 'East Facing',
    image: '/assets/floor-plans/flat-05-06-context.jpg',
    position: '22% 50%',
  },
  {
    id: 'flat-06',
    label: 'Flat 06',
    config: '3BHK',
    sft: 'SBUA 1870 SFT',
    facing: 'East Facing',
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
      'Main door: Engineered Veneer Finish Door with premium hardware and digital lock provision.',
      'Internal doors: Engineered Veneer Finish Doors with premium hardware',
      'Toilet Doors: Engineered Doors with waterproof laminate finish.',
    ],
  },
  {
    group: 'Windows',
    items: ['Premium uPVC Sliding Windows with mosquito mesh'],
  },
  {
    group: 'Flooring',
    items: [
      'Living, Dining & Kitchen: 800×1600 mm Premium Vitrified Tiles',
      'Master Bedroom: Laminated Wooden Flooring',
      'Other Bedrooms: Premium Vitrified Tiles',
      'Balcony: Anti-skid Tiles',
      'Bathrooms: Designer wall tiles dadoing up to false ceiling for toilets, Premium Anti-skid Tiles for flooring',
    ],
  },
  {
    group: 'Common Areas',
    items: ['Granite and Vitrified Tiles for corridors', 'Granite for staircase areas'],
  },
  {
    group: 'Bathrooms',
    items: [
      'Premium Sanitary Ware & CP Fittings Jaguar or equivalent',
      'Wall Hung WC',
      'Provision for Geyser',
      'Exhaust Fan Provision',
    ],
  },
  {
    group: 'Kitchen & Utility',
    items: [
      'Water Purifier Provision',
      'Chimney & Hob Electrical Point',
      'Utility Sink and Washing Machine Provision',
    ],
  },
  {
    group: 'Balcony Railing',
    items: ['MS railing'],
  },
  {
    group: 'Electrical',
    items: [
      'BESCOM Power Supply',
      '100% DG Backup for all Lighting, Fan Power Points inside apartments',
      'Modular Switches (Legrand/Schneider or equivalent)',
      'ELCB & MCB',
      'TV, Internet & Telephone Points',
      'Split AC Provision',
      'Provision for Home Automation (optional)',
    ],
  },
  {
    group: 'Painting',
    items: [
      'Interior areas: Acrylic Emulsion Paint over Putty Finish',
      'Exterior: Weatherproof Exterior Grade Paint along with texture as per elevation',
    ],
  },
  {
    group: 'Car Parking',
    items: ['Covered Car Park for each Apartment with EV Charging Provision.'],
  },
  {
    group: 'Elevators',
    items: [
      '3 High-Speed Passenger Elevators for each Tower',
      '1 Service/Fire Lift',
      'Reputed Make (Schindler/KONE/Otis/Johnson or equivalent) with Automatic Rescue Device',
    ],
  },
  {
    group: 'Common Features',
    items: [
      'Grand Entrance Lobby',
      'Designer Reception Lobby',
      'CCTV Surveillance for common areas',
      'Boom Barrier',
      'Solar Lighting for Common Areas',
      '100% DG Backup for Common Areas',
      'Sewage Treatment Plant (STP)',
      'Recycled Water for Landscaping & Flushing',
      'Water Softening Plant',
      'Rainwater Harvesting',
      'Organic Waste Converter',
      'Segregation of Waste at Source',
      'Fire Fighting System as per NBC',
      'Visitor Parking',
    ],
  },
] as const;

/* ---------------------------------------------------------------- builder */

export const BUILDER = {
  heading: 'Built by Allure Ventures & SRIDIRA Projects',
  body: 'Technology-driven construction across South India — delivering residential, commercial, and industrial spaces built with precision and purpose.',
  portfolio: [
    { name: 'Allure One', status: 'Completed', note: '' },
    { name: 'Allure Business Park', status: 'Completed', note: 'Hyderabad' },
    { name: 'Allure Avani', status: 'Under construction', note: '450 villas · 50+ acres' },
    { name: 'Sridira Mokila Villas', status: 'Under construction', note: '' },
  ],
  consultants:
    'Principal Architects — Aslam Architects · SMEPF Consultants — Design Tree Consultants · Landscape Architects — Dharitri Landscape',
} as const;

/* -------------------------------------------------------------------- FAQ */

export const FAQS = [
  {
    q: 'What configurations are available at Sridira Lake Creek?',
    a: 'Phase 1 offers a single configuration — 3 BHK, ranging from 1715 to 1870 SFT (SBUA) across six layouts (Flat 01 to Flat 06), in west, north and east facing orientations. Every home is designed as a corner residence with 270° panoramic views. Unlock any floor plan above to see the full layout.',
  },
  {
    q: 'How many towers, floors and homes are there?',
    a: '2 towers of 30+ floors each, holding 360 homes in Phase 1, including 12 penthouses. The project sits on 4.48 acres with 70% open space.',
  },
  {
    q: 'What is included in the 50+ amenities?',
    a: 'Amenities are grouped into six worlds: Wellness (yoga pods, meditation zone, bamboo and palm forests, relaxation trail), Sports & Recreation (pickleball, cricket pitch, tennis, badminton, basketball, jogging track), Kids (play areas, toddler zone, kids amphitheatre, green maze), Nature (urban forest, forest trail, fragrant tree plaza, lakeside path), Water Experiences (swimming pool, kids pool, koi pond, waterfall) and Social (clubhouse, party lawn, amphitheatre, floating stage, workshop plaza).',
  },
  {
    q: 'How far is Sridira Lake Creek from KR Puram, Indiranagar and the airport?',
    a: 'KR Puram and Tin Factory are 4 km away, Indiranagar 5 km, Hebbal 7 km, M.G. Road 10 km and Whitefield 12 km. Kempegowda International Airport is approximately 25 km from the project.',
  },
  {
    q: 'Who is developing Sridira Lake Creek?',
    a: 'The project is developed by Allure Ventures and SRIDIRA Projects — technology-driven builders working across South India. Design consultants include Aslam Architects (architecture), Design Tree Consultants (SMEPF) and Dharitri Landscape (landscape).',
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
