'use client';

import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  bgColor?: string;
  iconColor?: string;
}

export const StatsCard = ({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendValue,
  bgColor = 'bg-green-100 dark:bg-green-900',
  iconColor = 'text-green-600 dark:text-green-400',
}: StatsCardProps) => {
  return (
    <Card className="p-4 md:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </h3>
            {unit && (
              <span className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">
                {unit}
              </span>
            )}
          </div>
          {trend && trendValue && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={`text-xs font-semibold ${
                  trend === 'up'
                    ? 'text-green-600 dark:text-green-400'
                    : trend === 'down'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                vs last week
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${bgColor} flex items-center justify-center shadow-lg`}>
          <Icon className={`w-6 h-6 md:w-7 md:h-7 ${iconColor}`} />
        </div>
      </div>
    </Card>
  );
};
