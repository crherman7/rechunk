import {Input} from './ui/input';

export const LabeledInput = ({
  label,
  value,
  className = '',
}: {
  label: string;
  value: string | undefined;
  className?: string;
}) => (
  <div className="w-fit min-w-[350px] space-y-0.5">
    <p className="text-sm text-muted-foreground">{label}</p>
    <Input
      className={`pointer-events-none w-full text-xs ${className}`}
      disabled
      placeholder={value || ''}
    />
  </div>
);
