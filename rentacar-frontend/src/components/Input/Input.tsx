import React, { type InputHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className = '', ...props }, ref) => {
        return (
            <div className={styles.inputContainer}>
                {label && <label className={styles.label}>{label}</label>}

                <div className={styles.wrapper}>
                    {icon && <span className={styles.icon}>{icon}</span>}
                    <input
                        ref={ref}
                        className={`${styles.inputField} ${icon ? styles.withIcon : ''} ${error ? styles.errorInput : ''} ${className}`}
                        {...props}
                    />
                </div>

                {error && <span className={styles.errorMessage}>{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
