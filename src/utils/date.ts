const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Format an ISO date string to "Mon YYYY" format.
 */
export function formatDate(iso: string): string {
    const d = new Date(iso);
    return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
