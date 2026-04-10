import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls the window to the top on every route change.
 *
 * Placed inside <BrowserRouter> so it has access to the router context.
 * Uses 'instant' behavior so there's no awkward scroll animation between pages —
 * the new page simply starts at the top, like a normal browser navigation.
 */
export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname]);

    return null;
}
