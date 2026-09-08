export interface SocialLink {
  url: string;
  label: string;
  icon: 'github' | 'linkedin' | 'email' | 'rss';
}

export const siteConfig = {
  title: 'Dominic Serrano',
  shortTitle: 'dmserrano',
  author: 'Dominic Serrano',
  role: 'software developer / dog lover / coffee enthusiast',
  url: 'https://dominicserrano.com',
  description:
    "I'm a curious builder who first fell in love with JavaScript. Now I'm pushing the boundaries of what I can build.",
  socials: {
    github: { url: 'https://github.com/dmserrano', label: 'GitHub', icon: 'github' },
    linkedin: { url: 'https://www.linkedin.com/in/dominic-serrano/', label: 'LinkedIn', icon: 'linkedin' },
    email: { url: 'mailto:dmsrojo@gmail.com', label: 'Email', icon: 'email' },
    rss: { url: '/feed.xml', label: 'RSS', icon: 'rss' },
  } satisfies Record<string, SocialLink>,
};
