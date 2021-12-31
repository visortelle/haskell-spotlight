import s from './Input.module.css';
import { useEffect, useRef } from 'react';

const Input = ({ value, placeholder, onChange, focusOnMount }: { placeholder: string, value: string, onChange: (v: string) => void, focusOnMount?: boolean }) => {
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (focusOnMount) {
      inputRef?.current?.focus();
    }
  }, [focusOnMount]);

  return (
    <div className={s.input}>
      <input
        ref={inputRef}
        className={`${s.inputInput}`}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
