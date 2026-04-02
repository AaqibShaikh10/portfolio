import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NotFound() {
    const { pathname } = useLocation();

    useEffect(() => {
        document.title = '404 - Page Not Found | Aaqib Shaikh';
        return () => {
            document.title = 'Aaqib Shaikh - Software Engineer';
        };
    }, []);

    return (
        <main className="not-found">
            <div className="container not-found-inner">
                {/* Terminal window */}
                <div className="not-found-terminal">
                    <div className="not-found-terminal-bar">
                        <span className="terminal-dot terminal-dot-red" />
                        <span className="terminal-dot terminal-dot-yellow" />
                        <span className="terminal-dot terminal-dot-green" />
                        <span className="terminal-bar-title">bash</span>
                    </div>
                    <div className="not-found-terminal-body">
                        <p className="terminal-line">
                            <span className="terminal-prompt">aaqib@portfolio</span>
                            <span className="terminal-path">:~$</span>
                            <span className="terminal-cmd"> GET {pathname}</span>
                        </p>
                        <p className="terminal-output terminal-error">
                            Error: 404 Not Found
                        </p>
                        <p className="terminal-output terminal-dim">
                            The resource at <span className="terminal-highlight">"{pathname}"</span> does not exist on this server.
                        </p>
                        <p className="terminal-output terminal-dim">
                            Traceback: route not matched, no fallback handler registered.
                        </p>
                        <p className="terminal-line" style={{ marginTop: '1rem' }}>
                            <span className="terminal-prompt">aaqib@portfolio</span>
                            <span className="terminal-path">:~$</span>
                            <span className="terminal-cmd"> </span>
                            <span className="terminal-cursor" />
                        </p>
                    </div>
                </div>

                {/* Big 404 */}
                <div className="not-found-hero">
                    <div className="not-found-code">404</div>
                    <h1 className="not-found-title">Lost in the stack trace.</h1>
                    <p className="not-found-desc">
                        Whatever you were looking for isn't here. It might have moved,
                        been deleted, or never existed. Happens to the best of us.
                    </p>
                    <div className="not-found-actions">
                        <Link to="/" className="btn btn-primary">
                            Go home
                        </Link>
                        <Link to="/blog" className="btn">
                            Read the blog
                        </Link>
                        <a href="/#contact" className="btn">
                            Get in touch
                        </a>
                    </div>
                </div>

                {/* Quick links */}
                <div className="not-found-links">
                    <p className="not-found-links-label">Maybe you meant:</p>
                    <div className="not-found-links-grid">
                        <Link to="/#about" className="not-found-link-card">
                            <span className="not-found-link-icon">/about</span>
                            <span className="not-found-link-desc">Background and skills</span>
                        </Link>
                        <Link to="/#work" className="not-found-link-card">
                            <span className="not-found-link-icon">/work</span>
                            <span className="not-found-link-desc">Projects I've shipped</span>
                        </Link>
                        <Link to="/blog" className="not-found-link-card">
                            <span className="not-found-link-icon">/blog</span>
                            <span className="not-found-link-desc">Technical writing</span>
                        </Link>
                        <Link to="/#contact" className="not-found-link-card">
                            <span className="not-found-link-icon">/contact</span>
                            <span className="not-found-link-desc">Send me a message</span>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
