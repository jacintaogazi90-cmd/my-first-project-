import { testimonials } from '@/lib/hotel';
import Reveal from '@/components/Reveal';
import RevealItem from '@/components/RevealItem';

export default function Testimonials() {
  return (
    <Reveal variant="stagger" className="mt-14 grid gap-8 md:grid-cols-3">
      {testimonials.map((testimonial) => (
        <RevealItem key={testimonial.name} as="figure" className="border-t border-ink-900/15 pt-8">
          <blockquote className="font-display text-display-sm font-light leading-snug text-ink-900">
            “{testimonial.quote}”
          </blockquote>
          <figcaption className="mt-6 text-body-sm text-muted-onLight">
            <span className="font-medium text-ink-900">{testimonial.name}</span>
            <span className="mx-2 text-brass-deep" aria-hidden="true">·</span>
            {testimonial.detail}
          </figcaption>
        </RevealItem>
      ))}
    </Reveal>
  );
}
