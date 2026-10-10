import * as React from 'react';
import { Card, CardContent } from './card';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  trend?: {
    value: number;
    label?: string;
    isPositive?: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ title, value, change, trend, icon, className = '' }: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h4 className="text-3xl font-semibold text-slate-900">{value}</h4>
            {change && (
              <span className={`text-sm font-medium ${
                change.trend === 'up' ? 'text-green-600' : 
                change.trend === 'down' ? 'text-red-600' : 'text-slate-500'
              }`}>
                {change.trend === 'up' ? '↑' : change.trend === 'down' ? '↓' : ''} {Math.abs(change.value)}%
              </span>
            )}
            {trend && (
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}% {trend.label ? `(${trend.label})` : ''}
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center text-teal-600">
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
