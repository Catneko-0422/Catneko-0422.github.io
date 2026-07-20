export const GITHUB_USERNAME = 'Catneko-0422';

export const TAGS = ['All', 'python', 'csharp', 'typescript'];

export const languageColors: Record<string, string> = {
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-400',
  Python: 'bg-green-500',
  'C#': 'bg-purple-500',
  HTML: 'bg-orange-500',
  CSS: 'bg-blue-400',
  Rust: 'bg-orange-600',
  Go: 'bg-cyan-500',
  Java: 'bg-red-500',
  Shell: 'bg-gray-400',
  Dockerfile: 'bg-blue-600',
};

export type Repository = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  language: string;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
};
