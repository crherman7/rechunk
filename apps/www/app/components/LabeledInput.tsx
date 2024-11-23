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
  <div className="space-y-0.5 w-fit min-w-[350px]">
    <p className="text-sm text-muted-foreground">{label}</p>
    <Input
      className={`w-full text-xs pointer-events-none ${className}`}
      disabled
      placeholder={value || ''}
    />
  </div>
);
