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
    text: 'A native desktop app written in Rust for Windows and Ubuntu — no Docker, no VM. It supervises bundled PHP 5.6 to 8.5, MariaDB or MySQL, and nginx or Apache directly on the host, chosen per site.',
    date: 'Nov 2026',
    url: '/wp-pond/',
  },
  {
    tag: 'Full-Stack App',
    title: 'NextCommerce',
    text: 'A production-shaped e-commerce platform — NestJS 10 and MySQL behind a Next.js 14 storefront, with RabbitMQ events, Redis caching, Docker and Kubernetes manifests. The live demo runs on Cloudflare Workers.',
    date: 'May 2026',
    url: 'https://nextcommerce.naymul.workers.dev',
  },
  {
    tag: 'Media Optimization',
    title: 'ThumbPress',
    text: 'A thumbnail and media optimization plugin running on thousands of sites, keeping asset libraries clean, fast, and disk-efficient.',
    date: 'Dec 2023',
    url: 'https://thumbpress.co',
  },
];
