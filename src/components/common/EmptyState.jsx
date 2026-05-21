import React from 'react';
import { HelpCircle } from 'lucide-react';
import Button from './Button';

const EmptyState = ({ 
  title = 'No records compiled', 
  description = 'There are no active cards or logs in this workspace folder yet.', 
  icon: IconComponent = HelpCircle,
  actionLabel = '',
  onAction = null
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center select-none w-full animate-fade-in bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 rounded-16 shadow-sm">
      <div className="relative mb-4 flex items-center justify-center">
        {/* Glowing aura rings */}
        <div className="absolute w-12 h-12 bg-brand-500/10 dark:bg-brand-500/5 rounded-full animate-ping opacity-60" />
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-darkBg-950 border border-slate-150/15 text-slate-400 relative">
          <IconComponent className="w-7 h-7 text-slate-400 dark:text-slate-500" />
        </div>
      </div>
      <h3 className="text-sm font-extrabold text-slate-805 dark:text-slate-150 tracking-tight leading-none">
        {title}
      </h3>
      <p className="text-[10.5px] text-slate-450 mt-2 max-w-[280px] leading-relaxed">
        {description}
      </p>
      {onAction && actionLabel && (
        <div className="mt-4">
          <Button
            variant="primary"
            size="sm"
            onClick={onAction}
            className="font-bold"
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
