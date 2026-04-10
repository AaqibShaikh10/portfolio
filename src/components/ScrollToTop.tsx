import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls to top on route changes, but skips when the URL has a hash
 * (e.g. /#about, /#contact) so the browser's native anchor scroll works.
 */
export default function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        // If there's a hash, let the browser scroll to the anchor naturally.
        // If no hash (clean route change like / → /blog), snap to top.
        if (!hash) {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
    }, [pathname, hash]);

    return null;
}
