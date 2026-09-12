export interface SocialLink {
  url: string;
  label: string;
  icon: 'github' | 'linkedin' | 'email' | 'rss';
}

export const siteConfig = {
  title: 'Dominic Serrano',
  shortTitle: 'dmserrano',
  author: 'Dominic Serrano',
  role: 'software developer / dog lover / coffee snob in denial',
  url: 'https://dominicserrano.com',
  description:
    "Software engineer, 9 years in. I build tools that make developers' lives easier — currently working on making agentic workflows reliable, affordable, and safe.",
  /** Site-wide social share card. Absolute-ised against `url` at render time. */
  ogImage: '/og.png',
  socials: {
    github: { url: 'https://github.com/dmserrano', label: 'GitHub', icon: 'github' },
    linkedin: { url: 'https://www.linkedin.com/in/dominic-serrano/', label: 'LinkedIn', icon: 'linkedin' },
    email: { url: 'mailto:dmsrojo@gmail.com', label: 'Email', icon: 'email' },
    rss: { url: '/feed.xml', label: 'RSS', icon: 'rss' },
  } satisfies Record<string, SocialLink>,
};
