/**
 * Design system for Sridira Lake Creek.
 *
 * Colour and type come straight off the official Brand Guidelines deck:
 *   Primary   — Charcoal Black #231F20 · Ivory #ECEDE5 · Navy Blue #063258 · Teal #006064
 *   Secondary — bone, gold, forest, sky, deep teal, azure (+ tints)
 *   Type      — Coax (display) over Raleway (body)
 * Coax is not licensable for web, so Bodoni Moda stands in for headline text and
 * the real Coax wordmark ships as artwork in /public/brand.
 *
 * Structural rhythm (88/112 section padding, 1248 shell, 0.8px hairlines, pill
 * buttons, 1.0 display leading) follows the ASBL Legacy reference.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // ---- Primary palette (exact brand values) ----
        paper: '#ECEDE5', // IVORY — the page ground
        panel: '#F5F6EF', // raised surface on ivory
        ink: {
          DEFAULT: '#231F20', // CHARCOAL BLACK
          soft: '#4C4849',
          faint: '#7C7876',
        },
        navy: {
          950: '#04203A',
          900: '#063258', // NAVY BLUE — primary dark band
          800: '#0A4173',
          700: '#12558F',
          600: '#2D6FA8',
        },
        teal: {
          950: '#00373A',
          900: '#004B4E',
          800: '#006064', // TEAL — secondary dark band
          700: '#007A7F',
          600: '#0E969B',
          100: '#D7E6E6',
        },
        // ---- Secondary palette ----
        sky: {
          400: '#73B5CC',
          300: '#BAE3F7',
          600: '#0089BF',
          500: '#6DA9DB',
        },
        gold: '#C69D64',
        forest: {
          700: '#256934',
          600: '#4E7C38',
        },
        petrol: '#174C5B',
        // ---- Ivory-toned neutrals, for muted text and hairlines ----
        mist: {
          50: '#F7F8F3',
          100: '#E4E6DC',
          200: '#D3D6C8',
          300: '#B7BBAA',
          400: '#9BA08D',
        },
        hairline: '#D3D6C8',
      },
      fontFamily: {
        // Bodoni Moda stands in for Coax; Raleway is the brand body face.
        display: ['var(--font-display)', 'Bodoni Moda', 'Didot', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'Raleway', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.75rem, 8.5vw, 4.5rem)', { lineHeight: '1', letterSpacing: '-0.005em' }],
        'display-lg': ['clamp(2.125rem, 6vw, 3.5rem)', { lineHeight: '1.02', letterSpacing: '0' }],
        'display-md': ['clamp(1.75rem, 4.6vw, 3rem)', { lineHeight: '1.05' }],
        'display-sm': ['clamp(1.5rem, 3.4vw, 2.25rem)', { lineHeight: '1.1' }],
        stat: ['clamp(2rem, 5.5vw, 3rem)', { lineHeight: '1' }],
        eyebrow: ['0.75rem', { lineHeight: '1', letterSpacing: '0.2em' }],
        // The brand deck sets its own section titles in light, very wide caps.
        'brand-title': ['clamp(1.5rem, 3.6vw, 2.375rem)', { lineHeight: '1.15', letterSpacing: '0.1em' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.7' }],
      },
      letterSpacing: {
        brand: '0.2em',
        'brand-wide': '0.32em',
      },
      borderRadius: {
        card: '0.75rem',
        organic: '2rem',
        'organic-lg': '4.5rem',
      },
      spacing: {
        section: '5.5rem',
        'section-lg': '7rem',
      },
      maxWidth: {
        shell: '78rem',
        prose: '43rem',
      },
      boxShadow: {
        lift: '0 1px 2px rgba(35,31,32,0.04), 0 12px 32px -12px rgba(35,31,32,0.18)',
        'lift-lg': '0 2px 4px rgba(35,31,32,0.05), 0 28px 60px -24px rgba(4,32,58,0.35)',
      },
      transitionTimingFunction: {
        brand: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'none' },
        },
        drift: {
          '0%,100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-14px,0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both',
        drift: 'drift 14s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
