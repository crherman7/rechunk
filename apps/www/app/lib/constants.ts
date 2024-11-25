/**
 * A date format string compatible with `date-fns` for consistent date rendering across the application.
 *
 * - **Format Breakdown**:
 *   - `eeee`: Full name of the day (e.g., "Monday").
 *   - `MMMM`: Full name of the month (e.g., "January").
 *   - `do`: Day of the month with ordinal suffix (e.g., "1st", "2nd").
 *   - `yyyy`: Full numeric year (e.g., "2024").
 *   - `'at'`: Literal text "at".
 *   - `hh:mm a`: Hour and minute in 12-hour format with AM/PM (e.g., "02:30 PM").
 *
 * @example
 * ```tsx
 * import { format } from 'date-fns';
 *
 * const date = new Date();
 * const formattedDate = format(date, DATE_FORMAT);
 * console.log(formattedDate); // "Monday, January 1st, 2024 at 02:30 PM"
 * ```
 *
 * @remarks
 * This format is suitable for user-facing timestamps and displays a friendly, verbose format.
 * For ISO-compliant or machine-readable formats, use a different constant or function.
 */
export const DATE_FORMAT = "eeee, MMMM do, yyyy 'at' hh:mm a";
