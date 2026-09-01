import Amenities from '@/components/Amenities';
import Builder from '@/components/Builder';
import ExitIntentModal from '@/components/ExitIntentModal';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';
import FloorPlans from '@/components/FloorPlans';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import InlineLeadBlock from '@/components/InlineLeadBlock';
import { LeadProvider } from '@/components/LeadProvider';
import LeadModal from '@/components/LeadModal';
import Location from '@/components/Location';
import MasterPlan from '@/components/MasterPlan';
import MobileActionBar from '@/components/MobileActionBar';
import OpenByDesign from '@/components/OpenByDesign';
import Residences from '@/components/Residences';
import Specifications from '@/components/Specifications';
import StatBar from '@/components/StatBar';
import WhatsAppFab from '@/components/WhatsAppFab';
import { AMENITY_CATEGORIES, BUILDER, CONTACT, FAQS, FLOOR_PLANS, PROJECT } from '@/lib/site';

/**
 * Structured data. No price is published anywhere on this site, so no `offers`
 * node claims one — the listing describes the product and leaves pricing to the
 * sales conversation.
 */
function StructuredData() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'RealEstateListing',
        '@id': `${CONTACT.siteUrl}/#listing`,
        name: PROJECT.name,
        url: CONTACT.siteUrl,
        description: PROJECT.positioning,
        image: `${CONTACT.siteUrl}/og.jpg`,
        datePosted: '2026-01-01',
        about: { '@id': `${CONTACT.siteUrl}/#residence` },
        provider: {
          '@type': 'Organization',
          name: 'Allure Ventures & SRIDIRA Projects',
          description: BUILDER.body,
        },
      },
      {
        '@type': 'Residence',
        '@id': `${CONTACT.siteUrl}/#residence`,
        name: PROJECT.name,
        description: PROJECT.positioning,
        url: CONTACT.siteUrl,
        image: `${CONTACT.siteUrl}/og.jpg`,
        numberOfRooms: 3,
        petsAllowed: true,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Horamavu',
          addressLocality: 'Bengaluru',
          addressRegion: 'Karnataka',
          addressCountry: 'IN',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 13.0289, longitude: 77.6584 },
        floorSize: {
          '@type': 'QuantitativeValue',
          minValue: 1700,
          maxValue: 1870,
          unitCode: 'FTK',
        },
        amenityFeature: AMENITY_CATEGORIES.flatMap((category) =>
          category.items.map((item) => ({
            '@type': 'LocationFeatureSpecification',
            name: item,
            value: true,
          })),
        ),
        containsPlace: FLOOR_PLANS.map((plan) => ({
          '@type': 'Apartment',
          name: `${plan.label} — ${plan.config}`,
          numberOfRooms: 3,
          floorSize: { '@type': 'QuantitativeValue', value: parseInt(plan.sft, 10), unitCode: 'FTK' },
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${CONTACT.siteUrl}/#faq`,
        mainEntity: FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Content is static and author-controlled.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default function Page() {
  return (
    <LeadProvider>
      <StructuredData />
      <Header />

      <main>
        <Hero />
        <StatBar />
        <OpenByDesign />
        <Residences />
        <Amenities />
        <Location />
        <MasterPlan />
        <FloorPlans />
        <InlineLeadBlock />
        <Specifications />
        <Builder />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />

      <LeadModal />
      <WhatsAppFab />
      <MobileActionBar />
      <ExitIntentModal />
    </LeadProvider>
  );
}
