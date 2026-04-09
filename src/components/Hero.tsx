import type { GitHubProfile } from '../data/types';

interface HeroProps {
    profile: GitHubProfile;
}

export default function Hero({ profile }: HeroProps) {
    return (
        <section className="hero">
            <div className="container">
                <div className="hero-grid">
                    <div className="hero-content">
                        <p className="hero-eyebrow">Software Engineer / Karachi, Pakistan</p>
                        <h1 className="hero-name">Aaqib Shaikh</h1>
                        <p className="hero-tagline">
                            Building AI systems for healthcare diagnostics, media
                            authentication, and multilingual NLP.
                        </p>
                        <p className="hero-description">
                            Focused on deepfake detection, clinical prediction models, and
                            retrieval-augmented generation. Python and TypeScript across the
                            full stack.
                        </p>
                        <div className="hero-actions">
                            <a href="#work" className="btn btn-primary">
                                View work
                            </a>
                            <a
                                href={profile.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn"
                            >
                                GitHub
                            </a>
                            <a href="#contact" className="btn">
                                Contact
                            </a>
                        </div>
                    </div>
                    <div className="hero-photo-wrap">
                        <picture>
                            <source srcSet="/aaqib.webp" type="image/webp" />
                            <img
                                src="/aaqib.png"
                                alt="Aaqib Shaikh"
                                className="hero-photo"
                                loading="eager"
                                decoding="async"
                            />
                        </picture>
                    </div>
                </div>
            </div>
        </section>
    );
}
