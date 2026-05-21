import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

/**
 * ErrorBoundary - Global error boundary that catches unhandled React errors.
 * Prevents full app crash and shows a recovery UI.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // In production, send to error tracking service (Sentry, Datadog, etc.)
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-darkBg-950 p-6">
          <div className="w-full max-w-md bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 rounded-2xl shadow-2xl p-8 text-center select-none animate-fade-in">
            <div className="inline-flex p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100/10 mb-5">
              <AlertOctagon className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Application Error
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed max-w-xs mx-auto">
              An unexpected error occurred. This has been logged automatically.
              Please try refreshing or contact your system administrator.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-4 p-3 bg-slate-50 dark:bg-darkBg-950 border border-slate-100 dark:border-darkBg-850 rounded-xl text-left overflow-auto max-h-32">
                <code className="text-[10px] text-red-500 font-mono break-all">
                  {this.state.error.toString()}
                </code>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-colors shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-darkBg-850 dark:hover:bg-darkBg-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
