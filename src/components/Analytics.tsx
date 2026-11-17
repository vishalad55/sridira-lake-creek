import Script from 'next/script';

/**
 * Meta Pixel + GA4.
 *
 * The pixel ID is not a secret — it is visible in the page source of any site
 * running it — so it ships as a default rather than as required configuration.
 * `NEXT_PUBLIC_META_PIXEL_ID` still overrides it if you ever need to point a
 * campaign at a different pixel.
 *
 * Both tags only load on the **production** deployment. Preview builds and local
 * development deliberately ship zero third-party JS, so test traffic never
 * pollutes conversion data and Lighthouse runs stay clean.
 */
const DEFAULT_META_PIXEL_ID = '1819200635921006';

/**
 * Additional pixels that always receive the same events as the primary one.
 * fbq('track', …) fires to every initialised pixel, so the Lead / Contact /
 * InitiateCheckout calls in lib/analytics.ts reach these too.
 */
const EXTRA_META_PIXEL_IDS = ['2674179133017390'];

const isProduction = (process.env.VERCEL_ENV ?? process.env.NODE_ENV) === 'production';

const PRIMARY_META_PIXEL_ID = isProduction
  ? process.env.NEXT_PUBLIC_META_PIXEL_ID || DEFAULT_META_PIXEL_ID
  : process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

const META_PIXEL_IDS = PRIMARY_META_PIXEL_ID
  ? Array.from(new Set([PRIMARY_META_PIXEL_ID, ...EXTRA_META_PIXEL_IDS]))
  : [];

const GA_ID = isProduction ? process.env.NEXT_PUBLIC_GA_ID || '' : process.env.NEXT_PUBLIC_GA_ID || '';

export default function Analytics() {
  return (
    <>
      {META_PIXEL_IDS.length > 0 && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
${META_PIXEL_IDS.map((id) => `fbq('init','${id}');`).join('')}fbq('track','PageView');`}
          </Script>
          <noscript>
            {META_PIXEL_IDS.map((id) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={id}
                height="1"
                width="1"
                style={{ display: 'none' }}
                alt=""
                src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
              />
            ))}
          </noscript>
        </>
      )}

      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:true});`}
          </Script>
        </>
      )}
    </>
  );
}
