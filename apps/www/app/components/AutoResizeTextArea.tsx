import React, {useRef, useEffect, TextareaHTMLAttributes} from 'react';
import {Textarea} from '~/components/ui/textarea'; // Adjust import path as needed

interface AutoResizeTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string; // Optional prop for controlled components
}

const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({
  value,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust to content height
    }
  }, [value]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = event.target;
    target.style.height = 'auto'; // Reset height
    target.style.height = `${target.scrollHeight}px`; // Adjust to content height
  };

  return (
    <Textarea
      {...props}
      ref={textareaRef}
      value={value}
      onInput={handleInput}
      style={{overflow: 'hidden', resize: 'none'}} // Prevent scrollbars and manual resizing
    />
  );
};

export default AutoResizeTextarea;
