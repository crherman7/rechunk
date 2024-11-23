import AutoResizeTextarea from './AutoResizeTextArea';

export const LabeledTextarea = ({
  label,
  value,
  className = '',
}: {
  label: string;
  value: string | undefined;
  className?: string;
}) => (
  <div className="space-y-0.5">
    <p className="text-sm text-muted-foreground">{label}</p>
    <AutoResizeTextarea
      disabled
      className={`resize-none text-xs w-fit min-w-[525px] pointer-events-none text-slate-500 ${className}`}
      value={value}
    />
  </div>
);
