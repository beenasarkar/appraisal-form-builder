
import React from 'react';
import { cn } from '@/lib/utils';

interface TrafficLightProps {
  status: 'not-started' | 'in-progress' | 'complete';
  interactive?: boolean;
  onChange?: (status: 'not-started' | 'in-progress' | 'complete') => void;
  size?: 'sm' | 'md' | 'lg';
}

export const TrafficLight: React.FC<TrafficLightProps> = ({ 
  status, 
  interactive = false, 
  onChange,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  const handleClick = () => {
    if (!interactive || !onChange) return;
    
    const nextStatus = {
      'not-started': 'in-progress' as const,
      'in-progress': 'complete' as const,
      'complete': 'not-started' as const
    };
    
    onChange(nextStatus[status]);
  };

  const getStatusColor = () => {
    switch (status) {
      case 'not-started':
        return 'bg-red-500';
      case 'in-progress':
        return 'bg-amber-500';
      case 'complete':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'not-started':
        return 'Not Started';
      case 'in-progress':
        return 'In Progress';
      case 'complete':
        return 'Complete';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div
        className={cn(
          'rounded-full border-2 border-gray-200 shadow-sm transition-all',
          sizeClasses[size],
          getStatusColor(),
          interactive && 'cursor-pointer hover:scale-110 hover:shadow-md'
        )}
        onClick={handleClick}
        title={getStatusText()}
      />
      {size !== 'sm' && (
        <span className="text-sm font-medium text-gray-700">
          {getStatusText()}
        </span>
      )}
    </div>
  );
};
