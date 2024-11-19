import {cn} from '~/lib/utils';

interface H1Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  > {}

export function H1({className, children, ...props}: H1Props) {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-6xl font-extrabold tracking-tight lg:text-8xl',
        className,
      )}
      {...props}>
      {children}
    </h1>
  );
}

interface H2Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  > {}

export function H2({className, children, ...props}: H2Props) {
  return (
    <h2
      className={cn(
        'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
        className,
      )}
      {...props}>
      {children}
    </h2>
  );
}

interface H3Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  > {}

export function H3({className, children, ...props}: H3Props) {
  return (
    <h3
      className={cn(
        'scroll-m-20 text-2xl font-semibold tracking-tight',
        className,
      )}
      {...props}>
      {children}
    </h3>
  );
}

interface H4Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  > {}

export function H4({className, children, ...props}: H4Props) {
  return (
    <h4
      className={cn(
        'scroll-m-20 text-xl font-semibold tracking-tight',
        className,
      )}
      {...props}>
      {children}
    </h4>
  );
}

interface PProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {}

export function P({className, children, ...props}: PProps) {
  return (
    <p
      className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
      {...props}>
      {children}
    </p>
  );
}

interface BlockquoteProps
  extends React.DetailedHTMLProps<
    React.BlockquoteHTMLAttributes<HTMLQuoteElement>,
    HTMLQuoteElement
  > {}

export function Blockquote({className, children, ...props}: BlockquoteProps) {
  return (
    <blockquote
      className={cn('mt-6 border-l-2 pl-6 italic', className)}
      {...props}>
      {children}
    </blockquote>
  );
}

interface InlineCodeProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {}

export function InlineCode({className, children, ...props}: InlineCodeProps) {
  return (
    <code
      className={cn(
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
        className,
      )}
      {...props}>
      {children}
    </code>
  );
}

interface LeadProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {}

export function Lead({className, children, ...props}: LeadProps) {
  return (
    <p className={cn('text-xl text-muted-foreground', className)} {...props}>
      {children}
    </p>
  );
}

interface LargeProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

export function Large({className, children, ...props}: LargeProps) {
  return (
    <div className={cn('text-lg font-semibold', className)} {...props}>
      {children}
    </div>
  );
}

interface SmallProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {}

export function Small({className, children, ...props}: SmallProps) {
  return (
    <small
      className={cn('text-sm font-medium leading-none', className)}
      {...props}>
      {children}
    </small>
  );
}

interface MutedProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {}

export function Muted({className, children, ...props}: MutedProps) {
  return (
    <p className={cn('text-xs text-muted-foreground', className)} {...props}>
      {children}
    </p>
  );
}
