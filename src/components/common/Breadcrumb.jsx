import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map slugs to clean user-friendly labels
  const getLabel = (slug) => {
    if (slug === 'ai') return 'AI Assistant';
    if (slug === 'super-admin') return 'Super Admin';
    return slug.charAt(0).toUpperCase() + slug.slice(1);
  };

  return (
    <nav className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 select-none pb-2">
      <Link 
        to="/dashboard" 
        className="flex items-center gap-1 text-slate-400 hover:text-brand-500 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Workspace</span>
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3 h-3 text-slate-300 dark:text-darkBg-800" />
            {isLast ? (
              <span className="text-slate-805 dark:text-slate-205 font-extrabold truncate max-w-[150px]">
                {getLabel(value)}
              </span>
            ) : (
              <Link 
                to={to} 
                className="text-slate-400 hover:text-brand-500 transition-colors truncate max-w-[120px]"
              >
                {getLabel(value)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
