
import React from 'react';
import { Heart, Meh, Frown } from 'lucide-react';
import { SentimentAnalysis } from '@/types/appraisal';

interface SentimentIndicatorProps {
  sentiment?: SentimentAnalysis;
  className?: string;
}

export const SentimentIndicator: React.FC<SentimentIndicatorProps> = ({ sentiment, className = '' }) => {
  if (!sentiment) return null;

  const getSentimentIcon = () => {
    switch (sentiment.label) {
      case 'positive':
        return <Heart className="h-4 w-4" />;
      case 'neutral':
        return <Meh className="h-4 w-4" />;
      case 'negative':
        return <Frown className="h-4 w-4" />;
      default:
        return <Meh className="h-4 w-4" />;
    }
  };

  const getSentimentClass = () => {
    switch (sentiment.label) {
      case 'positive':
        return 'rldatix-sentiment-positive';
      case 'neutral':
        return 'rldatix-sentiment-neutral';
      case 'negative':
        return 'rldatix-sentiment-negative';
      default:
        return 'rldatix-sentiment-neutral';
    }
  };

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getSentimentClass()} ${className}`}>
      {getSentimentIcon()}
      <span className="capitalize">{sentiment.label}</span>
      <span className="text-xs opacity-80">({Math.round(sentiment.confidence * 100)}%)</span>
    </div>
  );
};
