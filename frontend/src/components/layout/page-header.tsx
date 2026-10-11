import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  isLoading?: boolean;
}

export function PageHeader({ title, description, action, isLoading }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-8">
      <div className="flex-1">
        {isLoading ? (
          <Skeleton className="h-8 w-48 mb-2" />
        ) : (
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        )}
        {description && !isLoading && <p className="text-muted-foreground text-sm mt-1">{description}</p>}
      </div>
      {action && !isLoading && <div>{action}</div>}
    </div>
  );
}

interface StatsGridProps {
  children: React.ReactNode;
}

export function StatsGrid({ children }: StatsGridProps) {
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">{children}</div>;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export function StatCard({ title, value, change, trend, icon, isLoading }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{title}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <>
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              {change && (
                <p className={cn('text-xs font-medium mt-2', trend === 'up' ? 'text-green-600' : 'text-red-600')}>
                  {trend === 'up' ? '↑' : '↓'} {change}
                </p>
              )}
            </>
          )}
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
    </div>
  );
}
