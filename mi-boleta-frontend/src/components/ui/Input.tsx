import type { InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  icon?: string;
}

export function Input({ label, error, icon, id, className = '', ...props }: InputProps) {
  const fieldId = id || props.name || '';

  return (
    <div className={`form-field ${error ? 'has-error' : ''} ${className}`}>
      {label && <label htmlFor={fieldId}>{label}</label>}
      <div className={icon ? 'input-with-icon' : 'input-wrapper'}>
        {icon && <span className="input-icon">{icon}</span>}
        <input id={fieldId} {...props} />
      </div>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string | null;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({ label, error, options, placeholder, id, className = '', ...props }: SelectProps) {
  const fieldId = id || props.name || '';

  return (
    <div className={`form-field ${error ? 'has-error' : ''} ${className}`}>
      {label && <label htmlFor={fieldId}>{label}</label>}
      <select id={fieldId} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string | null;
}

export function Textarea({ label, error, id, className = '', ...props }: TextareaProps) {
  const fieldId = id || props.name || '';

  return (
    <div className={`form-field ${error ? 'has-error' : ''} ${className}`}>
      {label && <label htmlFor={fieldId}>{label}</label>}
      <textarea id={fieldId} {...props} />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
