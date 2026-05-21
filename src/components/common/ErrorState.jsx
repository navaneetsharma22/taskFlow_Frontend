import React from 'react';
import { AlertOctagon } from 'lucide-react';
import Button from './Button';

const ErrorState = ({ 
  title = 'Something went wrong', 
  description = 'We encountered an error loading this workspace folder. Please try refreshing.', 
  onRetry = null,
  retryLabel = 'Try Again'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center select-none w-full animate-fade-in bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 rounded-16 shadow-sm">
      <div className="relative mb-4 flex items-center justify-center">
        {/* Glowing red aura rings */}
        <div className="absolute w-12 h-12 bg-red-500/10 dark:bg-red-500/5 rounded-full animate-ping opacity-60" />
        <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100/10 text-red-500 relative">
          <AlertOctagon className="w-7 h-7 text-red-500" />
        </div>
      </div>
      <h3 className="text-sm font-extrabold text-slate-805 dark:text-slate-150 tracking-tight leading-none">
        {title}
      </h3>
      <p className="text-[10.5px] text-slate-450 mt-2 max-w-[280px] leading-relaxed">
        {description}
      </p>
      {onRetry && (
        <div className="mt-4">
          <Button
            variant="danger"
            size="sm"
            onClick={onRetry}
            className="font-bold"
          >
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
