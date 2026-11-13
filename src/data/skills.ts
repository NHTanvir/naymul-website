export interface SkillGroup {
  icon: string;
  label: string;
  caption: string;
  items: [icon: string, name: string][];
}

export const skillGroups: SkillGroup[] = [
  {
    icon: 'fa-brands fa-rust',
    label: 'Rust & Systems',
    caption: 'Native binaries that run anywhere',
    items: [
      ['fa-brands fa-rust', 'Rust'],
      ['fa-solid fa-desktop', 'Tauri'],
      ['fa-solid fa-bolt', 'Tokio'],
      ['fa-solid fa-lock', 'rustls'],
      ['fa-solid fa-database', 'SQLite'],
      ['fa-solid fa-box', 'Cargo'],
    ],
  },
  {
    icon: 'fa-brands fa-react',
    label: 'Frontend & Mobile',
    caption: 'React, React Native, and modern UIs',
    items: [
      ['fa-brands fa-react', 'React'],
      ['fa-brands fa-react', 'React Native'],
      ['fa-brands fa-js', 'JavaScript'],
      ['fa-brands fa-html5', 'HTML5'],
      ['fa-brands fa-css3-alt', 'CSS3'],
      ['fa-brands fa-sass', 'Sass'],
    ],
  },
  {
    icon: 'fa-solid fa-server',
    label: 'Backend & APIs',
    caption: 'Node.js services and data layers',
    items: [
      ['fa-brands fa-node-js', 'Node.js'],
      ['fa-solid fa-bolt', 'Express'],
      ['fa-solid fa-database', 'MongoDB'],
      ['fa-solid fa-database', 'MySQL'],
      ['fa-brands fa-php', 'PHP'],
    ],
  },
  {
    icon: 'fa-solid fa-wand-magic-sparkles',
    label: 'AI & DevOps',
    caption: 'Ship smarter, deploy faster',
    items: [
      ['fa-solid fa-wand-magic-sparkles', 'AI / LLMs'],
      ['fa-brands fa-git-alt', 'Git'],
      ['fa-brands fa-docker', 'Docker'],
      ['fa-brands fa-aws', 'AWS'],
      ['fa-brands fa-npm', 'npm'],
    ],
  },
  {
    icon: 'fa-solid fa-shield-halved',
    label: 'Security & Tooling',
    caption: 'Intercepting proxies and browser extensions',
    items: [
      ['fa-solid fa-tower-broadcast', 'MITM proxies'],
      ['fa-solid fa-lock', 'TLS & CA'],
      ['fa-brands fa-chrome', 'Chrome MV3'],
      ['fa-solid fa-bug', 'Fuzzing'],
      ['fa-solid fa-user-lock', 'JWT & OAuth'],
      ['fa-solid fa-terminal', 'CLI tooling'],
    ],
  },
  {
    icon: 'fa-brands fa-cloudflare',
    label: 'Cloud & Delivery',
    caption: 'Ship it where it has to run',
    items: [
      ['fa-brands fa-cloudflare', 'Cloudflare Workers'],
      ['fa-solid fa-dharmachakra', 'Kubernetes'],
      ['fa-brands fa-github', 'GitHub Actions'],
      ['fa-solid fa-server', 'nginx'],
      ['fa-brands fa-linux', 'Linux'],
      ['fa-solid fa-download', 'Installers'],
    ],
  },
];
