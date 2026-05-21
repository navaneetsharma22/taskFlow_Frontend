import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#07090e] text-slate-100 overflow-hidden font-sans select-none">
      
      {/* Decorative Premium Glow Background Shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-brand-800/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-700/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none animate-pulse-subtle" />

      {/* Decorative Grid Mesh Overlay */}
      <div 
        className="absolute inset-0 bg-transparent opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative z-10 w-full max-w-md p-4 animate-slide-up">
        {/* Branding header in Login Panel */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-600/90 border border-brand-500/30 shadow-2xl mb-4">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-brand-300 to-indigo-200 bg-clip-text text-transparent">
            Welcome to TaskFlow
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1.5">
            Enterprise grade SaaS productivity & automation
          </p>
        </div>

        {/* Central Auth Outlet Panel */}
        <div className="bg-darkBg-900/60 backdrop-blur-xl border border-darkBg-800/50 shadow-2xl rounded-2xl p-7">
          <Outlet />
        </div>

        {/* Bottom Small Footer */}
        <div className="text-center mt-6 text-[10px] text-slate-500 font-medium tracking-wide">
          &copy; 2026 TaskFlow SaaS Inc. All rights reserved. Secure HTTPS isolation active.
        </div>
      </div>

    </div>
  );
};

export default AuthLayout;
