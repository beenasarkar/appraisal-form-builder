
import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScoreInputProps {
  value?: number;
  onChange: (score: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export const ScoreInput: React.FC<ScoreInputProps> = ({ 
  value = 0, 
  onChange, 
  min = 1, 
  max = 10, 
  className = '' 
}) => {
  const scores = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {scores.map((score) => (
        <Button
          key={score}
          variant={value === score ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(score)}
          className={`w-10 h-10 p-0 ${
            value === score 
              ? 'rldatix-button-primary shadow-md' 
              : 'hover:bg-[hsl(var(--rldatix-light-blue))] hover:text-[hsl(var(--rldatix-navy))]'
          }`}
        >
          {score}
        </Button>
      ))}
      {value > 0 && (
        <div className="flex items-center ml-4 text-sm text-muted-foreground">
          <Star className="h-4 w-4 mr-1 text-[hsl(var(--rldatix-blue))]" />
          Score: {value}/{max}
        </div>
      )}
    </div>
  );
};
