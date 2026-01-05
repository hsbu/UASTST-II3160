import React from 'react';
import clsx from 'clsx';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  title?: string;
  className?: string;
  onClose?: () => void;
}

export default function Alert({
  children,
  variant = 'info',
  title,
  className,
  onClose,
}: AlertProps) {
  const variantStyles: Record<AlertVariant, { bg: string; text: string; border: string }> = {
    info: {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
    },
    success: {
      bg: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-200',
    },
    warning: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
    },
    error: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={clsx(
        'p-4 rounded-lg border',
        styles.bg,
        styles.text,
        styles.border,
        className
      )}
      role="alert"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={clsx('ml-4 -mr-1 -mt-1 p-1 rounded hover:opacity-75', styles.text)}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
