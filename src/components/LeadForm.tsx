'use client';

import { useId, useState } from 'react';
import { Check, Loader2, Phone, ShieldCheck } from 'lucide-react';
import { trackLead } from '@/lib/analytics';
import { CONTACT } from '@/lib/site';
import { cn } from '@/lib/cn';
import { useLead } from './LeadProvider';

const BROCHURE_URL = process.env.NEXT_PUBLIC_BROCHURE_URL || '';

type Variant = 'modal' | 'inline' | 'compact';

type Props = {
  source: string;
  intent?: string;
  variant?: Variant;
  /** Called after a successful submit — used by the modal to auto-dismiss. */
  onSuccess?: () => void;
  className?: string;
};

type FieldErrors = Partial<Record<'name' | 'phone' | 'email' | 'consent' | 'form', string>>;

/** UTM params are forwarded to GHL so spend can be attributed per campaign. */
function readUtm(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  params.forEach((value, key) => {
    if (key.startsWith('utm_') || key === 'gclid' || key === 'fbclid') utm[key] = value;
  });
  return utm;
}

export default function LeadForm({ source, intent, variant = 'inline', onSuccess, className }: Props) {
  const uid = useId();
  const { markUnlocked } = useLead();

  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [firstName, setFirstName] = useState('');

  const compact = variant === 'compact';
  const onDark = variant === 'compact';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'submitting') return;

    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get('name') || '').trim(),
      phone: String(data.get('phone') || '').replace(/\D/g, ''),
      email: String(data.get('email') || '').trim(),
      configuration: String(data.get('configuration') || '3 BHK + 3T'),
      visitSlot: String(data.get('visitSlot') || '') || undefined,
      consent: data.get('consent') === 'on',
      source,
      intent,
      pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
      utm: readUtm(),
    };

    // Mirror the server rules so the visitor is not bounced off a round trip.
    const next: FieldErrors = {};
    if (payload.name.length < 2) next.name = 'Please enter your full name.';
    if (!/^\d{10}$/.test(payload.phone.replace(/^91(?=\d{10}$)/, ''))) next.phone = 'Enter a valid 10-digit mobile number.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email)) next.email = 'Enter a valid email address.';
    if (!payload.consent) next.consent = 'Please accept so we can contact you.';

    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    setErrors({});
    setStatus('submitting');

    try {
      const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT || '/api/lead';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        errors?: FieldErrors;
        message?: string;
      };

      if (!res.ok || !json.ok) {
        setStatus('idle');
        setErrors(
          json.errors ?? {
            form: json.message || 'Something went wrong. Please call us and we will help right away.',
          },
        );
        return;
      }

      trackLead({ source, intent });
      setFirstName(payload.name.split(' ')[0]);
      markUnlocked();
      setStatus('done');
      onSuccess?.();
    } catch {
      setStatus('idle');
      setErrors({ form: 'Network error. Please check your connection or call us directly.' });
    }
  }

  if (status === 'done') {
    return (
      <div
        className={cn(
          'flex flex-col items-start gap-4 rounded-card p-6 text-left',
          onDark ? 'bg-paper/10 text-paper' : 'bg-mist-50 text-ink',
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <span
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-full',
            onDark ? 'bg-paper text-navy-900' : 'bg-teal-800 text-paper',
          )}
        >
          <Check className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="font-display text-2xl leading-none">Thank you, {firstName}.</p>
          <p className={cn('mt-3 text-sm leading-relaxed', onDark ? 'text-mist-200' : 'text-ink-soft')}>
            Your details are with our sales team. Expect a callback within {CONTACT.callbackHours} hours with
            pricing, availability and floor plans for Sridira Lake Creek.
          </p>
        </div>

        {BROCHURE_URL ? (
          <a
            href={BROCHURE_URL}
            download
            className={cn('btn btn-sm', onDark ? 'btn-on-dark' : 'btn-primary')}
          >
            Download brochure
          </a>
        ) : (
          <p className={cn('text-xs leading-relaxed', onDark ? 'text-mist-300' : 'text-ink-faint')}>
            {/* TODO(launch): set NEXT_PUBLIC_BROCHURE_URL to serve the PDF instantly. */}
            The brochure and full floor plans are on their way to {"your inbox"}. Floor plans on this page are now
            unlocked.
          </p>
        )}

        <a
          href={`tel:${CONTACT.phone}`}
          className={cn(
            'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] link-underline',
            onDark ? 'text-paper' : 'text-teal-800',
          )}
        >
          <Phone className="h-3.5 w-3.5" aria-hidden />
          Or call {CONTACT.phoneDisplay}
        </a>
      </div>
    );
  }

  const labelCls = cn(
    'mb-1.5 block text-[0.6875rem] font-semibold uppercase tracking-[0.16em]',
    onDark ? 'text-mist-300' : 'text-ink-faint',
  );
  const fieldCls = cn(
    'w-full rounded-md border-[0.8px] bg-transparent px-3.5 py-3 text-[0.95rem] outline-none transition-colors duration-200',
    onDark
      ? 'border-paper/25 text-paper placeholder:text-mist-300/60 focus:border-paper'
      : 'border-hairline text-ink placeholder:text-ink-faint/70 focus:border-teal-800',
  );
  const errCls = 'mt-1.5 text-xs text-red-600';

  return (
    <form onSubmit={handleSubmit} noValidate className={cn('w-full', className)}>
      <div className={cn('grid gap-4', compact ? 'grid-cols-1' : 'sm:grid-cols-2')}>
        <div className={compact ? '' : 'sm:col-span-2'}>
          <label className={labelCls} htmlFor={`${uid}-name`}>
            Full name
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            required
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${uid}-name-err` : undefined}
            className={cn(fieldCls, errors.name && 'border-red-500')}
          />
          {errors.name && (
            <p id={`${uid}-name-err`} className={errCls}>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label className={labelCls} htmlFor={`${uid}-phone`}>
            Phone
          </label>
          <div
            className={cn(
              'flex items-stretch overflow-hidden rounded-md border-[0.8px] transition-colors duration-200',
              onDark ? 'border-paper/25 focus-within:border-paper' : 'border-hairline focus-within:border-teal-800',
              errors.phone && 'border-red-500',
            )}
          >
            <span
              className={cn(
                'flex items-center border-r-[0.8px] px-3 text-sm',
                onDark ? 'border-paper/25 text-mist-200' : 'border-hairline bg-mist-50 text-ink-soft',
              )}
            >
              +91
            </span>
            <input
              id={`${uid}-phone`}
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              placeholder="10-digit mobile"
              required
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? `${uid}-phone-err` : undefined}
              className={cn(
                'w-full bg-transparent px-3.5 py-3 text-[0.95rem] outline-none',
                onDark ? 'text-paper placeholder:text-mist-300/60' : 'text-ink placeholder:text-ink-faint/70',
              )}
            />
          </div>
          {errors.phone && (
            <p id={`${uid}-phone-err`} className={errCls}>
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label className={labelCls} htmlFor={`${uid}-email`}>
            Email
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${uid}-email-err` : undefined}
            className={cn(fieldCls, errors.email && 'border-red-500')}
          />
          {errors.email && (
            <p id={`${uid}-email-err`} className={errCls}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Only one configuration exists in Phase 1, so this rides along hidden. */}
        <input type="hidden" name="configuration" value="3 BHK + 3T · 1700–1870 Sft" />

        {!compact && (
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor={`${uid}-visit`}>
              Preferred site visit <span className="normal-case tracking-normal opacity-70">(optional)</span>
            </label>
            <input
              id={`${uid}-visit`}
              name="visitSlot"
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              className={cn(fieldCls, onDark && '[color-scheme:dark]')}
            />
          </div>
        )}
      </div>

      {/* TRAI / DPDP Act consent — required for Indian real-estate lead capture. */}
      <div className="mt-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            required
            aria-invalid={!!errors.consent}
            className={cn(
              'mt-0.5 h-4 w-4 shrink-0 rounded-sm border-[0.8px] accent-teal-800',
              onDark ? 'border-paper/40' : 'border-hairline',
            )}
          />
          <span className={cn('text-xs leading-relaxed', onDark ? 'text-mist-200' : 'text-ink-soft')}>
            I agree to be contacted via call/SMS/WhatsApp regarding this project.
          </span>
        </label>
        {errors.consent && <p className={errCls}>{errors.consent}</p>}
      </div>

      {errors.form && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">
          {errors.form}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className={cn('btn mt-5 w-full', onDark ? 'btn-on-dark' : 'btn-primary')}
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Sending
          </>
        ) : (
          'Get pricing & floor plans'
        )}
      </button>

      <p
        className={cn(
          'mt-3 flex items-center justify-center gap-1.5 text-[0.6875rem]',
          onDark ? 'text-mist-300' : 'text-ink-faint',
        )}
      >
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
        Your details stay with the Sridira sales team.
      </p>
    </form>
  );
}
