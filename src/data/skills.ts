export interface SkillGroup {
  icon: string;
  label: string;
  caption: string;
  items: [icon: string, name: string][];
}

export const skillGroups: SkillGroup[] = [
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
      ['fa-brands fa-wordpress', 'WordPress'],
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
];
