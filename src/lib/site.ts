export interface SocialLink {
  url: string;
  label: string;
  icon: 'github' | 'linkedin' | 'email' | 'rss';
}

export const siteConfig = {
  title: 'Dominic Serrano',
  shortTitle: 'dmserrano',
  author: 'Dominic Serrano',
  url: 'https://dominicserrano.com',
  description:
    "Senior Full Stack / Frontend Engineer with 9+ years of experience, React and TypeScript at the core. Most recently spent 4 years at FortyAU shipping production features across the stack and building real AI agent workflows — engineering systems where LLMs are a dependable part of the architecture.",
  socials: {
    github: { url: 'https://github.com/dmserrano', label: 'GitHub', icon: 'github' },
    linkedin: { url: 'https://www.linkedin.com/in/dominic-serrano/', label: 'LinkedIn', icon: 'linkedin' },
    email: { url: 'mailto:dmsrojo@gmail.com', label: 'Email', icon: 'email' },
    rss: { url: '/feed.xml', label: 'RSS', icon: 'rss' },
  } satisfies Record<string, SocialLink>,
};
