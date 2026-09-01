import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { CONTACT, LEAD_SOURCES, NAV, PROJECT } from '@/lib/site';
import { PetalField, Wordmark } from './brand/BrandGraphics';
import LeadForm from './LeadForm';

/* TODO(launch): swap the "#" hrefs for the project's real social handles. */
const SOCIALS = [
  { label: 'Instagram', icon: Instagram, href: '#' },
  { label: 'Facebook', icon: Facebook, href: '#' },
  { label: 'LinkedIn', icon: Linkedin, href: '#' },
  { label: 'YouTube', icon: Youtube, href: '#' },
];

export default function Footer() {
  return (
    <footer className="on-dark relative isolate overflow-hidden bg-navy-950 pt-16 md:pt-20">
      <div className="absolute inset-0 text-paper">
        <PetalField opacity={0.04} />
      </div>
      <div className="shell relative">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.7fr_1fr] lg:gap-14">
          {/* Identity + contact */}
          <div>
            <div className="text-paper">
              <Wordmark variant="stacked" className="w-[11rem]" />
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-mist-300">
              Lake-facing 3 BHK corner residences beside Horamavu Lake — 2 towers, 28 floors, 4.48 acres and 70% open
              space.
            </p>

            <ul className="mt-7 space-y-3 text-sm">
              <li>
                <a href={`tel:${CONTACT.phone}`} className="inline-flex items-center gap-3 text-mist-200 hover:text-paper">
                  <Phone className="h-4 w-4 shrink-0" aria-hidden />
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-3 text-mist-200 hover:text-paper">
                  <Mail className="h-4 w-4 shrink-0" aria-hidden />
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-mist-200">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                {CONTACT.addressShort}
              </li>
            </ul>

            <ul className="mt-7 flex items-center gap-2.5">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-[0.8px] border-paper/20 text-mist-200 transition-colors hover:border-paper/60 hover:text-paper"
                  >
                    <social.icon className="h-4 w-4" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav */}
          <nav aria-label="Footer">
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-mist-400">Explore</p>
            <ul className="mt-5 space-y-3.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="link-underline text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-mist-200 hover:text-paper"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={CONTACT.siteUrl}
                  className="link-underline text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-mist-200 hover:text-paper"
                >
                  {CONTACT.site}
                </a>
              </li>
            </ul>
          </nav>

          {/* Compact capture */}
          <div className="rounded-card border-[0.8px] border-paper/15 bg-paper/[0.04] p-6">
            <p className="eyebrow-on-dark">Get project information</p>
            <p className="mt-3 font-display text-[1.5rem] leading-tight text-paper">
              Pricing, plans and the brochure.
            </p>
            <div className="mt-5">
              <LeadForm source={LEAD_SOURCES.footer} variant="compact" />
            </div>
          </div>
        </div>

        {/* Compliance strip */}
        <div className="mt-14 border-t-[0.8px] border-paper/10 py-7">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="rounded-full border-[0.8px] border-amber-400/40 px-3 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-amber-300">
              {CONTACT.rera}
            </span>
            <span className="text-xs text-mist-400">
              {/* TODO(launch): Karnataka RERA registration is legally required before advertising or selling. */}
              Karnataka RERA registration is pending confirmation and will be published here once issued.
            </span>
          </div>

          <p className="mt-5 max-w-4xl text-[0.6875rem] leading-relaxed text-mist-400">
            Disclaimer: All images, plans and specifications are artistic impressions and indicative only. Areas,
            amenities and specifications are subject to change as per approvals from the competent authorities. Prices,
            payment plans and possession timelines are shared on request and are not published on this website. This
            website does not constitute an offer or contract.
          </p>

          <div className="mt-6 flex flex-col gap-3 text-[0.6875rem] text-mist-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {PROJECT.name}. Developed by Allure Ventures &amp; SRIDIRA Projects.
            </p>
            <p>Possession timeline: TBD — confirm with sales team.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
