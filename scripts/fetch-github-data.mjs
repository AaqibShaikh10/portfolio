#!/usr/bin/env node

/**
 * Fetches GitHub profile and repository data for AaqibShaikh10.
 * Writes the result to src/data/github.json.
 *
 * Usage:
 *   node scripts/fetch-github-data.mjs
 *
 * Set GITHUB_TOKEN env var for higher rate limits (optional).
 */

const USERNAME = 'AaqibShaikh10';
const OUTPUT = new URL('../src/data/github.json', import.meta.url);

const headers = { 'User-Agent': 'portfolio-fetch' };
if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
}

function removeEmojis(text) {
    if (!text) return '';
    return text
        .replace(
            /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}\u{2B50}\u{2764}]/gu,
            ''
        )
        .replace(/\s{2,}/g, ' ')
        .trim();
}

async function fetchJSON(url) {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
    return res.json();
}

async function main() {
    console.log('Fetching GitHub data...');

    const profile = await fetchJSON(`https://api.github.com/users/${USERNAME}`);
    const repos = await fetchJSON(
        `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`
    );

    const publicRepos = repos.filter((r) => !r.fork && r.name !== USERNAME);

    const data = {
        profile: {
            name: profile.name || profile.login,
            login: profile.login,
            bio: removeEmojis(profile.bio),
            location: profile.location,
            avatar_url: profile.avatar_url,
            html_url: profile.html_url,
            followers: profile.followers,
            following: profile.following,
            public_repos: profile.public_repos,
        },
        repositories: publicRepos.map((r) => ({
            name: r.name,
            full_name: r.full_name,
            html_url: r.html_url,
            description: removeEmojis(r.description),
            language: r.language,
            stargazers_count: r.stargazers_count,
            forks_count: r.forks_count,
            topics: r.topics || [],
            homepage: r.homepage,
            updated_at: r.updated_at,
            created_at: r.created_at,
        })),
        featuredProjects: [],
        skills: [],
        generatedAt: new Date().toISOString(),
    };

    const { writeFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    writeFileSync(fileURLToPath(OUTPUT), JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Wrote ${fileURLToPath(OUTPUT)}`);
    console.log(
        'Note: featuredProjects and skills are left empty — curate them manually in github.json.'
    );
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
