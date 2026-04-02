#!/usr/bin/env node

/**
 * Generates public/sitemap.xml for aaqibshaikh.me.
 *
 * Blog posts are parsed from src/data/blogPosts.ts using a lightweight
 * regex approach — no TypeScript compilation needed at generation time.
 * This script is intentionally dependency-free beyond Node built-ins.
 *
 * Usage:
 *   node scripts/generate-sitemap.mjs
 *
 * Added to the build command so it runs on every Cloudflare Pages deploy.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const SITE_URL = 'https://aaqibshaikh.me';

// Parse blog posts from the TypeScript source using regex.
// We extract slug and date — both are simple string literals.
function parseBlogPosts() {
    const src = readFileSync(resolve(ROOT, 'src/data/blogPosts.ts'), 'utf-8');

    const posts = [];
    // Match each object literal block that has a slug and date
    const blockRegex = /\{\s*id:\s*\d+[\s\S]*?(?=,\s*\{\s*id:|];)/g;
    let match;

    while ((match = blockRegex.exec(src)) !== null) {
        const block = match[0];

        const slugMatch = block.match(/slug:\s*'([^']+)'/);
        const dateMatch = block.match(/date:\s*'([^']+)'/);

        if (slugMatch && dateMatch) {
            posts.push({ slug: slugMatch[1], date: dateMatch[1] });
        }
    }

    return posts;
}

function xmlEscape(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function buildSitemap(posts) {
    const today = new Date().toISOString().split('T')[0];

    const staticPages = [
        { url: `${SITE_URL}/`, priority: '1.0', changefreq: 'monthly', lastmod: today },
        { url: `${SITE_URL}/blog`, priority: '0.8', changefreq: 'weekly', lastmod: today },
    ];

    const postPages = posts.map((p) => ({
        url: `${SITE_URL}/blog/${xmlEscape(p.slug)}`,
        priority: '0.7',
        changefreq: 'monthly',
        lastmod: p.date,
    }));

    const allPages = [...staticPages, ...postPages];

    const urlElements = allPages
        .map(
            (p) => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
        )
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>
`;
}

const posts = parseBlogPosts();
const xml = buildSitemap(posts);

const outPath = resolve(ROOT, 'public/sitemap.xml');
writeFileSync(outPath, xml, 'utf-8');

console.log(`Sitemap written to public/sitemap.xml`);
console.log(`  Static pages: 2`);
console.log(`  Blog posts:   ${posts.length}`);
console.log(`  Total URLs:   ${2 + posts.length}`);
