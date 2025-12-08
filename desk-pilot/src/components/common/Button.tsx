import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export const Button = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    ...props
}: ButtonProps) => {
    return (
        <button
            className={clsx(
                'btn',
                `btn-${variant}`,
                `btn-${size}`,
                fullWidth && 'btn-full',
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};
