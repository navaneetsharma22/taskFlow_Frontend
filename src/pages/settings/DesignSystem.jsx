import React, { useState } from 'react';
import { 
  Sparkles, 
  Palette, 
  Type, 
  Activity, 
  Grid, 
  Layout, 
  Eye, 
  RefreshCw, 
  HelpCircle,
  FileCode2,
  Box
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const DesignSystem = () => {
  const [loadingDemo, setLoadingDemo] = useState(false);

  const colors = [
    { name: 'Primary Blue', hex: '#2563EB', class: 'bg-brand-500', desc: 'Core CTAs, primary states, links' },
    { name: 'Background Dark', hex: '#0F172A', class: 'bg-darkBg-950', desc: 'Main page body wrapper in dark theme' },
    { name: 'Card Dark', hex: '#1E293B', class: 'bg-darkBg-900', desc: 'Dashboard widgets & container backgrounds' },
    { name: 'Success Green', hex: '#10B981', class: 'bg-success', desc: 'Positive stats, done states, SLA approvals' },
    { name: 'Warning Orange', hex: '#F59E0B', class: 'bg-warning', desc: 'Backlog alerts, pending requests' },
    { name: 'Danger Red', hex: '#EF4444', class: 'bg-danger', desc: 'Overdue indicators, destructive actions' },
  ];

  const typography = [
    { size: 'Display 2XL', style: 'text-2xl font-extrabold tracking-tight', label: '24px - Section Titles' },
    { size: 'Headline XL', style: 'text-xl font-bold tracking-tight', label: '20px - Sub Headers' },
    { size: 'Header LG', style: 'text-lg font-bold', label: '18px - Card Titles' },
    { size: 'Body Base', style: 'text-xs font-normal', label: '12px - Description Texts' },
    { size: 'Caption XS', style: 'text-[10px] font-semibold uppercase tracking-wider', label: '10px - Badges / Labels' },
  ];

  return (
    <div className="space-y-8 text-xs select-none">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-brand-500" />
          SaaS Design System Catalog
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review visual specs, Inter font typography scales, 16px compact cards, and loading skeleton states.
        </p>
      </div>

      {/* Grid Section: Colors & Typography */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Colors Swatches panel */}
        <Card className="p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3.5 mb-4">
            <Palette className="w-4 h-4 text-brand-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Color Architecture</h3>
              <span className="text-[10px] text-slate-450">SaaS colors optimized for high visual readability</span>
            </div>
          </div>

          <div className="space-y-3">
            {colors.map(col => (
              <div 
                key={col.name} 
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-darkBg-950/50 border border-slate-100/50 dark:border-darkBg-850/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg shadow-sm border border-slate-200/10 ${col.class}`} />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{col.name}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{col.desc}</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-500 dark:text-slate-400 text-[10px]">{col.hex}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Typography scales panel */}
        <Card className="p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3.5 mb-4">
            <Type className="w-4 h-4 text-indigo-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Inter Typography Scales</h3>
              <span className="text-[10px] text-slate-450">Exclusively using Inter font system weights</span>
            </div>
          </div>

          <div className="space-y-4">
            {typography.map(typo => (
              <div 
                key={typo.size}
                className="p-3 bg-slate-50 dark:bg-darkBg-950/30 rounded-xl border border-slate-100/50 dark:border-darkBg-850/50"
              >
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  {typo.size} ({typo.label})
                </span>
                <p className={`${typo.style} text-slate-850 dark:text-slate-100`}>
                  TaskFlow Workspace Automation
                </p>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* Grid Section: Cards, radius standards and Empty States */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Radius standards examples */}
        <Card className="p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3.5 mb-4">
            <Grid className="w-4 h-4 text-emerald-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">16px Border Radius Standard</h3>
              <span className="text-[10px] text-slate-450">Compact cards with standard spacing tokens</span>
            </div>
          </div>

          <div className="space-y-4">
            
            {/* Visual card item 1 */}
            <div className="p-3.5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 rounded-16 shadow-premium hover:shadow-premium-hover transition-all">
              <Badge variant="brand" className="text-[8.5px] uppercase font-bold mb-2">Compact Asset</Badge>
              <h4 className="font-bold text-slate-800 dark:text-slate-200">TaskFlow SaaS Container</h4>
              <p className="text-[10.5px] text-slate-550 dark:text-slate-400 mt-1 leading-normal">
                This container uses exactly 16px (`border-radius: 16px`) for clean premium proportions.
              </p>
            </div>

            {/* Visual card item 2 */}
            <div className="p-3.5 bg-slate-50 dark:bg-darkBg-950 border border-slate-100/50 dark:border-darkBg-850/50 rounded-16">
              <h4 className="font-bold text-slate-800 dark:text-slate-200">Secondary Compact Block</h4>
              <p className="text-[10.5px] text-slate-550 dark:text-slate-400 mt-1 leading-normal">
                Professional 12px padding and 16px corners are optimized for dense enterprise dashboards.
              </p>
            </div>

          </div>
        </Card>

        {/* Loading skeleton placeholders */}
        <Card className="p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-darkBg-850 pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Skeletal Pulsing Standards</h3>
                <span className="text-[10px] text-slate-450">Dynamic skeleton loaders for async modules</span>
              </div>
            </div>
            <button 
              onClick={() => {
                setLoadingDemo(true);
                setTimeout(() => setLoadingDemo(false), 2000);
              }}
              className="p-1.5 rounded-lg bg-slate-50 dark:bg-darkBg-850 hover:bg-slate-100 dark:hover:bg-darkBg-800 text-slate-450 transition-colors"
              title="Trigger skeleton simulation"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingDemo ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-4">
            
            {/* Skeleton mockup item 1 */}
            <div className="p-3.5 border border-slate-100 dark:border-darkBg-850 rounded-16 space-y-2.5">
              <div className="skeleton-box h-4 w-2/3" />
              <div className="skeleton-box h-3 w-full" />
              <div className="skeleton-box h-3 w-5/6" />
              <div className="flex gap-2 pt-1">
                <div className="skeleton-box h-5.5 w-14 rounded-full" />
                <div className="skeleton-box h-5.5 w-14 rounded-full" />
              </div>
            </div>

            {/* Skeleton mockup item 2 */}
            <div className="flex items-center gap-3 p-2 border border-slate-100/50 dark:border-darkBg-850/50 rounded-16">
              <div className="skeleton-box w-9 h-9 rounded-xl shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="skeleton-box h-3.5 w-1/2" />
                <div className="skeleton-box h-2.5 w-3/4" />
              </div>
            </div>

          </div>
        </Card>

        {/* Empty State Standards */}
        <Card className="p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3.5 mb-4">
            <Layout className="w-4 h-4 text-indigo-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Empty State Layout Standards</h3>
              <span className="text-[10px] text-slate-450">Clean placeholders for empty lists or searches</span>
            </div>
          </div>

          {/* Core Empty State Component Standard */}
          <div className="empty-state-container py-6">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 flex items-center justify-center border border-brand-100/10 mb-3">
              <Box className="w-5 h-5 animate-pulse-subtle" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100">No active assets found</h4>
            <p className="text-[10px] text-slate-450 text-center max-w-[200px] mt-1.5 leading-relaxed">
              Verify your dashboard filters or create a new project item to initialize this catalog space.
            </p>
            <div className="mt-4">
              <Button variant="primary" size="sm" className="py-1 px-3.5 text-[10.5px]">
                Create Asset
              </Button>
            </div>
          </div>

        </Card>

      </div>

    </div>
  );
};

export default DesignSystem;
