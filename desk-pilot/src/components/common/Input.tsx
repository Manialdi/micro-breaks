import { type InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="input-wrapper">
                {label && <label className="input-label">{label}</label>}
                <input
                    ref={ref}
                    className={clsx('input-field', error && 'input-error', className)}
                    {...props}
                />
                {error && <span className="input-error-text">{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';
