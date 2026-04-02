import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSortedPosts, getPostBySlug } from '../data/blogPosts';

const allPosts = getSortedPosts();

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function injectOrUpdate(selector: string, creator: () => HTMLElement, updater: (el: HTMLElement) => void) {
    let el = document.querySelector<HTMLElement>(selector);
    if (!el) {
        el = creator();
        document.head.appendChild(el);
    }
    updater(el);
    return el;
}

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const post = slug ? getPostBySlug(slug) : undefined;

    useEffect(() => {
        if (!post) return;

        const canonicalUrl = `https://aaqibshaikh.me/blog/${post.slug}`;

        document.title = `${post.title} - Aaqib Shaikh`;

        // Description meta
        injectOrUpdate(
            'meta[name="description"]',
            () => { const m = document.createElement('meta'); m.name = 'description'; return m; },
            (el) => { (el as HTMLMetaElement).content = post.excerpt; }
        );

        // Canonical
        injectOrUpdate(
            'link[rel="canonical"]',
            () => { const l = document.createElement('link'); l.rel = 'canonical'; return l; },
            (el) => { (el as HTMLLinkElement).href = canonicalUrl; }
        );

        // JSON-LD BlogPosting
        const ldId = 'blog-post-ld';
        let ld = document.getElementById(ldId) as HTMLScriptElement | null;
        if (!ld) {
            ld = document.createElement('script');
            ld.id = ldId;
            ld.type = 'application/ld+json';
            document.head.appendChild(ld);
        }
        ld.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            author: {
                '@type': 'Person',
                name: 'Aaqib Shaikh',
                url: 'https://aaqibshaikh.me',
            },
            datePublished: post.date,
            url: canonicalUrl,
            publisher: {
                '@type': 'Person',
                name: 'Aaqib Shaikh',
            },
        });

        return () => {
            document.title = 'Aaqib Shaikh - Software Engineer';
            document.getElementById(ldId)?.remove();
        };
    }, [post]);

    if (!post) {
        return (
            <main>
                <section className="section">
                    <div className="container">
                        <span className="section-label">404</span>
                        <h1 className="section-title">Post not found</h1>
                        <p className="section-subtitle">
                            That post doesn't exist -- maybe the URL changed.
                        </p>
                        <Link to="/blog" className="btn btn-primary">
                            ← Back to Blog
                        </Link>
                    </div>
                </section>
            </main>
        );
    }

    const postIndex = allPosts.findIndex((p) => p.slug === post.slug);
    const prevPost = postIndex < allPosts.length - 1 ? allPosts[postIndex + 1] : null;
    const nextPost = postIndex > 0 ? allPosts[postIndex - 1] : null;

    return (
        <main>
            {/* Post header */}
            <section
                className="hero"
                style={{ paddingTop: 'var(--space-9)', paddingBottom: 'var(--space-9)' }}
            >
                <div className="container">
                    <Link to="/blog" className="blog-back-link">
                        ← Back to Blog
                    </Link>
                    <div className="blog-post-meta" style={{ marginTop: 'var(--space-5)' }}>
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                        <span className="blog-card-separator">·</span>
                        <span>{post.readTime}</span>
                    </div>
                    <h1
                        className="hero-name"
                        style={{
                            fontSize: 'var(--text-4xl)',
                            marginTop: 'var(--space-4)',
                            marginBottom: 'var(--space-5)',
                        }}
                    >
                        {post.title}
                    </h1>
                    <div className="blog-card-tags">
                        {post.tags.map((tag) => (
                            <span key={tag} className="blog-tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Post content */}
            <section className="section">
                <div className="container">
                    <div
                        className="blog-post-content"
                        /* Content is authored in blogPosts.ts, no user input, XSS risk is zero */
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Prev / Next navigation */}
                    <nav className="blog-post-nav">
                        <div className="blog-post-nav-prev">
                            {prevPost && (
                                <>
                                    <span className="blog-post-nav-label">← Older</span>
                                    <Link to={`/blog/${prevPost.slug}`} className="blog-post-nav-link">
                                        {prevPost.title}
                                    </Link>
                                </>
                            )}
                        </div>
                        <div className="blog-post-nav-next">
                            {nextPost && (
                                <>
                                    <span className="blog-post-nav-label">Newer →</span>
                                    <Link to={`/blog/${nextPost.slug}`} className="blog-post-nav-link">
                                        {nextPost.title}
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>

                    <div style={{ marginTop: 'var(--space-6)' }}>
                        <Link to="/blog" className="btn">
                            ← Back to Blog
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
