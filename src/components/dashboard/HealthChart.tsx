'use client';

import { Card } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface HealthChartProps {
  title: string;
  subtitle?: string;
  data: Array<{ label: string; value: number }>;
  color?: string;
  maxValue?: number;
}

export const HealthChart = ({
  title,
  subtitle,
  data,
  color = 'bg-green-500',
  maxValue,
}: HealthChartProps) => {
  const max = maxValue || Math.max(...data.map((d) => d.value));

  return (
    <Card className="p-4 md:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center">
          <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {item.value}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${color} rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
