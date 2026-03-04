export interface GitHubProfile {
    name: string;
    login: string;
    bio: string | null;
    location: string | null;
    avatar_url: string;
    html_url: string;
    followers: number;
    following: number;
    public_repos: number;
}

export interface Repository {
    name: string;
    full_name: string;
    html_url: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    topics: string[];
    homepage: string | null;
    updated_at: string;
    created_at: string;
}

export interface FeaturedProject {
    name: string;
    title: string;
    summary: string;
    bullets: string[];
    tech: string[];
    repoUrl: string;
    demoUrl: string | null;
    language: string | null;
    stars: number;
    forks: number;
    updatedAt: string;
}

export interface SkillCategory {
    category: string;
    items: string[];
}

export interface SiteData {
    profile: GitHubProfile;
    repositories: Repository[];
    featuredProjects: FeaturedProject[];
    skills: SkillCategory[];
    generatedAt: string;
}
