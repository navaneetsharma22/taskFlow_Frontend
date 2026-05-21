import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  LockKeyhole
} from 'lucide-react';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/authSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [email, setEmail] = useState('admin@taskflow.so');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setValidationError('All fields are required');
      return;
    }

    dispatch(loginStart());
    
    // Simulate high-fidelity secure token generation response
    setTimeout(() => {
      if (email.includes('@')) {
        const mockResponse = {
          token: 'mock-jwt-token-taskflow-saas-2026',
          user: {
            id: 'usr-101',
            name: 'Sarah Connor',
            email: email,
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            role: 'Administrator',
            organization: {
              id: 'org-101',
              name: 'Cyberdyne Systems',
              code: 'TF-CYB-4088',
              membersCount: 15,
            }
          }
        };
        dispatch(loginSuccess(mockResponse));
        navigate('/dashboard');
      } else {
        dispatch(loginFailure('Invalid credential parameters provided.'));
      }
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen flex text-xs select-none">
      
      {/* 1. LEFT PANEL (SaaS Showroom & Product Preview) - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-[55%] bg-darkBg-950/20 border-r border-slate-200/10 p-12 flex-col justify-between relative overflow-hidden">
        
        {/* Background Visual circles for visual depth */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none" />
        
        {/* Brand identity header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-md shadow-brand-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-extrabold tracking-tight text-white uppercase">
            TaskFlow Workspace
          </span>
        </div>

        {/* Dynamic product preview & value proposition */}
        <div className="space-y-8 relative z-10 my-auto">
          <div className="space-y-3.5 max-w-lg">
            <Badge variant="brand" className="text-[9px] font-extrabold uppercase px-2.5 py-1">
              Version 4.2 Production
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              Enterprise Task Orchestration & Automation
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Synchronize sprints, evaluate team workloads, trigger outbound Webhooks, and automate pipelines under a secure, single-tenant isolated SaaS architecture.
            </p>
          </div>

          {/* Interactive floating product preview elements */}
          <div className="relative h-64 w-full max-w-lg">
            
            {/* Widget 1: Live SLA Progress metrics (Floating) */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-4 left-0 w-64 p-4 border border-slate-200/10 bg-darkBg-900/60 backdrop-blur-md rounded-16 shadow-2xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">SLA Deliveries</span>
                <span className="font-bold text-emerald-400">98.4%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-[98.4%] bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full" />
              </div>
              <span className="text-[9.5px] text-slate-500 font-semibold block">
                ✓ 14 active sprint milestones on target
              </span>
            </motion.div>

            {/* Widget 2: Compact Kanban Card node */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute top-16 right-4 w-60 p-4 border border-slate-200/10 bg-darkBg-900/60 backdrop-blur-md rounded-16 shadow-2xl space-y-2.5"
            >
              <div className="flex justify-between items-center">
                <Badge variant="danger" className="text-[8.5px] font-bold">CRITICAL</Badge>
                <span className="text-[9px] text-slate-500 font-semibold">Sprint 4</span>
              </div>
              <h4 className="font-bold text-slate-200 leading-snug">
                Setup OAuth2 Security Overhaul
              </h4>
              <div className="flex items-center justify-between border-t border-slate-800/40 pt-2 mt-1">
                <span className="text-[9.5px] text-slate-400 font-medium">Assignee: Sarah Connor</span>
                <div className="w-5.5 h-5.5 rounded-md bg-brand-500 flex items-center justify-center text-[9px] font-extrabold text-white">
                  SC
                </div>
              </div>
            </motion.div>

          </div>

        </div>

        {/* Small Left Footer */}
        <div className="text-[10px] text-slate-500 font-medium relative z-10">
          &copy; 2026 TaskFlow SaaS Inc. All data transactions are securely encrypted.
        </div>

      </div>

      {/* 2. RIGHT PANEL (Compact Login Form Container) */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 bg-[#0F172A] relative">
        
        {/* Mobile branding header (visible only on small screens) */}
        <div className="absolute top-6 left-6 flex lg:hidden items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-white tracking-tight uppercase">TaskFlow</span>
        </div>

        {/* Compact Login Card (Max width 420px as requested) */}
        <div className="w-full max-w-[420px] p-8 border border-slate-250/10 bg-darkBg-900/40 backdrop-blur-2xl rounded-16 shadow-2xl space-y-6 animate-slide-up relative">
          
          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <LockKeyhole className="w-4.5 h-4.5 text-brand-500" />
              Sign in to Workspace
            </h2>
            <p className="text-slate-400 text-[11px] font-medium leading-relaxed">
              Exposed single-tenant credential gate.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Error Indicators */}
            {error && (
              <div className="p-3 text-[10.5px] font-bold text-red-400 bg-red-950/20 border border-red-900/30 rounded-xl flex items-center gap-2">
                <span>⚠️ {error}</span>
              </div>
            )}

            {validationError && (
              <div className="p-3 text-[10.5px] font-bold text-red-400 bg-red-950/20 border border-red-900/30 rounded-xl flex items-center gap-2">
                <span>⚠️ {validationError}</span>
              </div>
            )}

            {/* Email Field */}
            <Input
              label="Secure Email Address"
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setValidationError('');
              }}
              placeholder="you@company.com"
              icon={<Mail className="w-4 h-4 text-slate-400" />}
              required
            />

            {/* Password Field */}
            <div className="relative">
              <Input
                label="System Password"
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setValidationError('');
                }}
                placeholder="••••••••••••"
                icon={<Lock className="w-4 h-4 text-slate-400" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 bottom-2.5 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Remember Me & Forgot Password wrapper */}
            <div className="flex items-center justify-between font-semibold text-[10.5px] text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  defaultChecked
                  className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-800 accent-brand-500 cursor-pointer" 
                />
                Remember my machine
              </label>
              <a href="#forgot" className="text-brand-400 hover:text-brand-300 hover:underline transition-all">
                Forgot password?
              </a>
            </div>

            {/* Sign in Submission CTA */}
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              className="w-full mt-3 font-bold"
              icon={<ShieldCheck className="w-4.5 h-4.5" />}
            >
              Authorize Sign In
            </Button>

            {/* Form Footer */}
            <div className="text-center pt-2 text-[10.5px] font-semibold text-slate-400">
              New team tenant workspace?{' '}
              <Link to="/register" className="text-brand-400 hover:text-brand-300 hover:underline transition-all inline-flex items-center gap-0.5">
                Register Workspace <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Login;
