import type { SkillCategory } from "./content-types";

export const skills: SkillCategory[] = [
  {
    category: "Programming Languages",
    items: ["TypeScript", "JavaScript", "Python", "Java", "C++", "Go"],
  },
  {
    category: "Frontend Development",
    items: ["Svelte", "React", "Vue.js", "HTML5", "CSS3", "Tailwind CSS"],
  },
  {
    category: "Backend Development",
    items: ["Node.js", "Express.js", "FastAPI", "Spring Boot", "Django"],
  },
  {
    category: "Database & Storage",
    items: ["PostgreSQL", "MongoDB", "Redis", "Firebase", "Elasticsearch"],
  },
  {
    category: "Cloud & DevOps",
    items: ["AWS", "Google Cloud Platform", "Azure", "Docker", "Kubernetes", "Terraform"],
  },
  {
    category: "Tools & Frameworks",
    items: ["Git", "GitHub Actions", "Jest", "Vite", "Webpack", "GraphQL"],
  },
];
