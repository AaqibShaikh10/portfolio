import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSortedPosts } from '../data/blogPosts';

const posts = getSortedPosts();

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function Blog() {
    useEffect(() => {
        document.title = 'Blog - Aaqib Shaikh';

        // Update/create description meta
        let descEl = document.querySelector<HTMLMetaElement>('meta[name="description"]');
        if (!descEl) {
            descEl = document.createElement('meta');
            descEl.name = 'description';
            document.head.appendChild(descEl);
        }
        descEl.content =
            'Technical writing by Aaqib Shaikh on AI systems, software engineering, and infrastructure.';

        // Canonical
        let canonEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (!canonEl) {
            canonEl = document.createElement('link');
            canonEl.rel = 'canonical';
            document.head.appendChild(canonEl);
        }
        canonEl.href = 'https://aaqibshaikh.me/blog';

        return () => {
            document.title = 'Aaqib Shaikh - Software Engineer';
        };
    }, []);

    return (
        <main>
            <section className="hero" style={{ paddingTop: 'var(--space-9)', paddingBottom: 'var(--space-9)' }}>
                <div className="container">
                    <span className="section-label">Writing</span>
                    <h1 className="hero-name" style={{ fontSize: 'var(--text-5xl)', marginBottom: 'var(--space-4)' }}>
                        Blog
                    </h1>
                    <p className="hero-tagline" style={{ marginBottom: 0 }}>
                        Notes on AI systems, software engineering, and the infrastructure that connects them.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="blog-list">
                        {posts.map((post) => (
                            <article key={post.id} className="blog-card">
                                <div className="blog-card-meta">
                                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                                    <span className="blog-card-separator">·</span>
                                    <span>{post.readTime}</span>
                                </div>
                                <h2 className="blog-card-title">
                                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                                </h2>
                                <p className="blog-card-excerpt">{post.excerpt}</p>
                                <div className="blog-card-footer">
                                    <div className="blog-card-tags">
                                        {post.tags.map((tag) => (
                                            <span key={tag} className="blog-tag">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <Link
                                        to={`/blog/${post.slug}`}
                                        className="blog-card-read-more"
                                    >
                                        Read more →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
