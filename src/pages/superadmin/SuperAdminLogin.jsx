import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Terminal, 
  Cpu, 
  KeyRound, 
  ArrowRight,
  Fingerprint
} from 'lucide-react';
import superAdminService from '../../services/superAdminService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // If already logged in, redirect directly to dashboard
    if (superAdminService.isAuthenticated()) {
      navigate('/superadmin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('All security credentials are required');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await superAdminService.login(email, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/superadmin/dashboard');
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Invalid SuperAdmin administrative credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#090D1A] relative overflow-hidden font-sans">
      {/* Premium background styling - Glowing mesh & circuit aesthetic */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none" />
      
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

      {/* Main card panel container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-[460px] p-8 md:p-10 border border-violet-500/10 bg-slate-950/60 backdrop-blur-2xl rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.15)] space-y-8 relative z-10 m-4"
      >
        {/* Top Accent line */}
        <div className="absolute top-0 inset-x-0 h-1 rounded-t-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500" />

        {/* Portal Header */}
        <div className="space-y-3.5 text-center">
          <div className="flex justify-center">
            <motion.div 
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 5 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30"
            >
              <Fingerprint className="w-8 h-8 text-white animate-pulse" />
            </motion.div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-center">
              <Badge variant="brand" className="bg-violet-950/40 border border-violet-500/20 text-violet-300 font-extrabold uppercase px-3 py-1 tracking-widest text-[9px] rounded-full">
                ADMINISTRATIVE SECURE GATEWAY
              </Badge>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              TaskFlow <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">SuperAdmin</span>
            </h1>
            <p className="text-[11.5px] text-slate-400 font-semibold max-w-sm mx-auto leading-relaxed">
              Verify security tokens and identity signature to log in to the TaskFlow master administration console.
            </p>
          </div>
        </div>

        {/* Core Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-3.5 text-xs font-bold text-red-400 bg-red-950/30 border border-red-500/20 rounded-xl flex items-start gap-2.5"
            >
              <ShieldAlert className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-3.5 text-xs font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 rounded-xl flex items-start gap-2.5"
            >
              <Cpu className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5 animate-spin" />
              <span>Identity Verified. Launching master terminal...</span>
            </motion.div>
          )}

          <div className="space-y-4">
            <Input
              label="Master Authority Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="admin@taskflow.security"
              icon={<Mail className="w-4 h-4 text-violet-400" />}
              className="dark:bg-slate-900/50 dark:border-slate-800 focus:border-violet-500 text-white"
              required
            />

            <div className="relative">
              <Input
                label="Identity Cryptographic Signature (Password)"
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••••••"
                icon={<Lock className="w-4 h-4 text-violet-400" />}
                className="dark:bg-slate-900/50 dark:border-slate-800 focus:border-violet-500 text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 bottom-2 text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            disabled={success}
            className="w-full mt-4 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-extrabold shadow-[0_4px_20px_rgba(139,92,246,0.3)] rounded-xl"
            icon={<KeyRound className="w-4.5 h-4.5" />}
          >
            Verify Credentials & Unlock
          </Button>

          {/* Safe back navigation */}
          <div className="text-center pt-3">
            <a 
              href="/login" 
              className="text-[10.5px] font-bold text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1.5 group"
            >
              Return to Public Platform <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </form>

        {/* Security Warning notice */}
        <div className="pt-4 border-t border-slate-900 flex gap-2.5 items-start text-[9.5px] text-slate-500 font-semibold leading-normal">
          <Terminal className="w-4 h-4 text-violet-500/70 shrink-0 mt-0.5" />
          <span>
            Unauthorized entry attempts are logged, and offending IP signatures are reported to threat intelligence repositories.
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default SuperAdminLogin;
