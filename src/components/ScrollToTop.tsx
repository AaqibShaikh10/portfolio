import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            // Clean route change (e.g. /blog → /) — snap to top
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            return;
        }

        // Hash navigation (e.g. /#work from /blog).
        // React needs to first unmount the old page and mount the new one,
        // so the target element may not be in the DOM yet when this effect runs.
        // Solution: wait one animation frame, then retry until the element appears.
        const id = hash.replace('#', '');

        const scrollToId = (attemptsLeft: number) => {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else if (attemptsLeft > 0) {
                setTimeout(() => scrollToId(attemptsLeft - 1), 50);
            }
        };

        // One rAF to let React flush the DOM, then start trying
        requestAnimationFrame(() => scrollToId(10));
    }, [pathname, hash]);

    return null;
}
