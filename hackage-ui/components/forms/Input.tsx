import s from './Input.module.css';
import { RefObject, useEffect, useRef } from 'react';

type InputProps = {
  placeholder: string,
  onFocus?: () => void,
  onBlur?: () => void,
  onChange: (v: string) => void,
  onInputRef: (ref: RefObject<HTMLInputElement>) => void,
  value: string,
  focusOnMount?: boolean
};

const Input = ({ value, placeholder, onChange, onFocus, onBlur, onInputRef, focusOnMount }: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusOnMount) {
      inputRef?.current?.focus();
    }
  }, [focusOnMount]);

  useEffect(() => {
    onInputRef(inputRef);
  }, [onInputRef, inputRef]);

  return (
    <div className={s.input}>
      <input
        ref={inputRef}
        className={`${s.inputInput}`}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus || (() => {})}
        onBlur={onBlur || (() => {})}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
