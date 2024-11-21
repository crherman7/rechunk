import {Button} from './ui/button';
import * as Text from './ui/text';

/**
 * Props for the `ButtonLink` component.
 *
 * @property to - The URL or path to navigate to.
 * @property label - The text label displayed inside the button.
 * @property icon - Optional React node to display as an icon alongside the label.
 * @property external - Indicates if the link should open in a new tab (defaults to `false`).
 */
export interface ButtonLinkProps {
  /** The URL or path to navigate to. */
  to: string;
  /** The text label displayed inside the button. */
  label: string;
  /** Optional React node to display as an icon alongside the label. */
  icon?: React.ReactNode;
  /** Indicates if the link should open in a new tab. Defaults to `false`. */
  external?: boolean;
}

/**
 * Renders a button that acts as a link. Supports both internal and external links.
 *
 * - If `external` is `true`, renders an `<a>` tag with proper security attributes.
 * - If `external` is `false`, renders a regular `Button` component for internal navigation.
 *
 * @example
 * ```tsx
 * <ButtonLink to="https://example.com" label="External Link" external />
 *
 * <ButtonLink to="/dashboard" label="Go to Dashboard" icon={<DashboardIcon />} />
 * ```
 *
 * @param props - {@link ButtonLinkProps}
 * @returns A `Button` component wrapped in a link if `external` is true.
 */
export function ButtonLink({
  to,
  label,
  icon,
  external = false,
}: ButtonLinkProps) {
  // Shared content for the button's inner elements
  const sharedContent = (
    <>
      <Text.P>{label}</Text.P>
      {icon}
    </>
  );

  return external ? (
    <a
      href={to}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center"
      aria-label={label}
      role="button">
      <Button>{sharedContent}</Button>
    </a>
  ) : (
    <Button>{sharedContent}</Button>
  );
}
