export interface Project {
  tag: string;
  title: string;
  text: string;
  date: string;
  url: string;
}

export const projects: Project[] = [
  {
    tag: 'Desktop App',
    title: 'WP Pond',
    text: 'A native local WordPress development app for Windows and Ubuntu — no Docker, no VM. Any PHP from 5.6 to 8.5, any WordPress release, MariaDB or MySQL, nginx or Apache, chosen per site.',
    date: 'Nov 2026',
    url: '/wp-pond/',
  },
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
];
