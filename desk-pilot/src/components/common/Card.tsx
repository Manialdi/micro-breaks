import { type ReactNode, type CSSProperties } from 'react';
import clsx from 'clsx';

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    style?: CSSProperties;
}

export const Card = ({ children, className, title, padding = 'md', style }: CardProps) => {
    return (
        <div
            className={clsx(
                'bg-white rounded-lg border border-slate-200 shadow-sm',
                className
            )}
            style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                padding: padding === 'none' ? 0 : `var(--spacing-${padding})`,
                ...style
            }}
        >
            {title && (
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{title}</h3>
                </div>
            )}
            {children}
        </div>
    );
};
