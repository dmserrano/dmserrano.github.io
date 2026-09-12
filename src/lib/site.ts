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
    "I am a software engineer with 9+ years of experience. I get excited about building tools that make the developer experience better. Currently working on making agentic workflows safe to run unattended.",
  /** Site-wide social share card. Absolute-ised against `url` at render time. */
  ogImage: '/og.png',
  socials: {
    github: { url: 'https://github.com/dmserrano', label: 'GitHub', icon: 'github' },
    linkedin: { url: 'https://www.linkedin.com/in/dominic-serrano/', label: 'LinkedIn', icon: 'linkedin' },
    email: { url: 'mailto:dmsrojo@gmail.com', label: 'Email', icon: 'email' },
    rss: { url: '/feed.xml', label: 'RSS', icon: 'rss' },
  } satisfies Record<string, SocialLink>,
};
