import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full relative flex bg-[#0F172A] text-slate-100 overflow-hidden font-sans select-none">
      
      {/* Decorative Premium HSL Glow Background Shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-brand-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none animate-pulse-subtle" />

      {/* Decorative Grid Mesh Overlay */}
      <div 
        className="absolute inset-0 bg-transparent opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Full-width Outlet viewport slot */}
      <div className="relative z-10 w-full min-h-screen flex">
        <Outlet />
      </div>

    </div>
  );
};

export default AuthLayout;
