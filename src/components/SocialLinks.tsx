import { useTranslation } from 'react-i18next';

const SOCIALS = [
  {
    network: 'Instagram',
    href: 'https://www.instagram.com/jrodolforojas/',
    icon: (
      <>
        <rect
          x="2.5"
          y="2.5"
          width="19"
          height="19"
          rx="5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="12" cy="12" r="4.4" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.6" cy="6.4" r="1.3" fill="currentColor" />
      </>
    ),
  },
  {
    network: 'GitHub',
    href: 'https://github.com/jrodolforojas',
    icon: (
      <path
        fill="currentColor"
        d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"
      />
    ),
  },
  {
    network: 'X',
    href: 'https://x.com/jrodolforojas',
    icon: (
      <path
        fill="currentColor"
        d="M18.9 1.2h3.7l-8 9.2L24 22.8h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9Zm-1.3 19.4h2L6.5 3.2H4.3Z"
      />
    ),
  },
] as const;

export function SocialLinks() {
  const { t } = useTranslation();
  return (
    <ul className="socials">
      {SOCIALS.map((social) => (
        <li key={social.network}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('socialLabel', { network: social.network })}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              {social.icon}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
