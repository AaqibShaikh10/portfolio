import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NAV_LINKS = [
    { label: 'About', href: '/#about' },
    { label: 'Work', href: '/#work' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Contact', href: '/#contact' },
];

function getInitialTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    function toggleTheme() {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    }

    return (
        <header className={`header${scrolled ? ' scrolled' : ''}`}>
            <div className="container header-inner">
                <a href="/" className="header-brand">
                    <span className="header-name">Aaqib Shaikh</span>
                    <span className="header-dot" />
                </a>
                <nav className="header-nav">
                    {NAV_LINKS.map((link) => (
                        <a key={link.href} href={link.href}>
                            {link.label}
                        </a>
                    ))}
                    <Link to="/blog">Blogs</Link>
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? 'Dark' : 'Light'}
                    </button>
                    <a href="/#contact" className="header-nav-cta">
                        Get in touch
                    </a>
                </nav>
                <div className="header-mobile-actions">
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? 'Dark' : 'Light'}
                    </button>
                    <button
                        className="menu-toggle"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        aria-expanded={menuOpen}
                        aria-label="Toggle navigation menu"
                    >
                        {menuOpen ? 'Close' : 'Menu'}
                    </button>
                </div>
            </div>
            <nav className={`mobile-nav${menuOpen ? ' open' : ''}`}>
                {NAV_LINKS.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                    >
                        {link.label}
                    </a>
                ))}
                <Link to="/blog" onClick={() => setMenuOpen(false)}>
                    Blogs
                </Link>
                <a href="/#contact" onClick={() => setMenuOpen(false)}>
                    Get in touch
                </a>
            </nav>
        </header>
    );
}

