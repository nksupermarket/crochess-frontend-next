import React, { HTMLInputTypeAttribute } from 'react';

interface InputFieldProps {
  label: string;
  error: string;
  type: HTMLInputTypeAttribute;
  autoFocus: boolean;
  onBlur: (e: React.FormEvent<HTMLInputElement>) => void;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | number;
}

export default function InputField({
  label,
  error,
  ...inputProps
}: InputFieldProps) {
  const rootClasses = ['input-wrapper'];
  if (error) rootClasses.push('error');

  return (
    <div className={rootClasses.join(' ')}>
      {label && (
        <label>
          <span className="caps-title">{label}</span>
          {error && <span className="error-msg"> - {error}</span>}
        </label>
      )}
      <input {...inputProps} />
    </div>
  );
}
