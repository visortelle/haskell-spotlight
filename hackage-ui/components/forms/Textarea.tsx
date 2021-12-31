import s from './Textarea.module.css';
import { useEffect, useRef } from 'react';

const Textarea = ({ value, placeholder, rows, onChange, focusOnMount }: { placeholder: string, value: string, rows: number, onChange: (v: string) => void, focusOnMount?: boolean }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (focusOnMount) {
      textareaRef?.current?.focus();
    }
  }, [focusOnMount]);

  return (
    <div className={s.textarea}>
      <textarea
        ref={textareaRef}
        className={`${s.textareaTextarea}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
};

export default Textarea;
