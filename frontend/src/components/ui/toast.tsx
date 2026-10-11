import { cn } from '@/lib/cn';
import React, { useState } from 'react';

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

export const useToast = () => {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([]);

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36);
    setToasts((prev) => [...prev, { ...props, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return { toast, toasts };
};

export const Toast = React.forwardRef<HTMLDivElement, ToastProps & { id: string }>(({ title, description, variant = 'default', id, ...props }, ref) => {
  const variantStyles = {
    default: 'bg-card border-border text-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    success: 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100',
  };

  return (
    <div
      ref={ref}
      className={cn('rounded-lg border p-4 shadow-lg animate-slide-in', variantStyles[variant])}
      {...props}
    >
      {title && <div className="font-semibold">{title}</div>}
      {description && <div className="text-sm mt-1">{description}</div>}
    </div>
  );
});

Toast.displayName = 'Toast';
