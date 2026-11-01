export interface Project {
  tag: string;
  title: string;
  text: string;
  date: string;
  url: string;
}

export const projects: Project[] = [
  {
    tag: 'WordPress Plugin',
    title: 'ThumbPress',
    text: 'A thumbnail and media optimization plugin used by thousands of WordPress sites to keep asset libraries clean, fast, and disk-efficient.',
    date: 'Dec 2023',
    url: 'https://thumbpress.co',
  },
  {
    tag: 'WordPress Plugin',
    title: 'Share Logins',
    text: 'Cross-site login sharing for the WordPress ecosystem — one credential, many sites, zero friction.',
    date: 'Feb 2022',
    url: 'https://codexpert.io/share-logins',
  },
  {
    tag: 'Page Builder Add-on',
    title: 'CoDesigner',
    text: 'A feature-rich Elementor add-on that extends the editor with advanced widgets and design utilities.',
    date: 'Sep 2022',
    url: 'https://codexpert.io/codesigner',
  },
];
