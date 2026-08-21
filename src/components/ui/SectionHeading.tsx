import Reveal from '@/components/Reveal';
import RevealItem from '@/components/RevealItem';

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = 'dark',
  align = 'left',
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  tone?: 'dark' | 'light';
  align?: 'left' | 'center';
}) {
  const eyebrowColour = tone === 'dark' ? 'text-brass' : 'text-brass-deep';
  const introColour = tone === 'dark' ? 'text-muted-onDark' : 'text-muted-onLight';

  return (
    <Reveal variant="stagger" className={`max-w-prose ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <RevealItem as="p" short className={`eyebrow ${eyebrowColour}`}>
        {eyebrow}
      </RevealItem>
      <RevealItem as="h2" short className="mt-4 font-display text-display-md font-light">
        {title}
      </RevealItem>
      {intro ? (
        <RevealItem as="p" short className={`mt-5 text-body-lg ${introColour}`}>
          {intro}
        </RevealItem>
      ) : null}
    </Reveal>
  );
}
