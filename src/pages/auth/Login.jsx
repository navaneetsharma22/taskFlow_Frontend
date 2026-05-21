import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/authSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

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
    
    // Simulate API authorization response
    setTimeout(() => {
      if (email.includes('@')) {
        const mockResponse = {
          token: 'mock-jwt-token-taskflow-saas-2026',
          user: {
            id: 'usr-101',
            name: 'Sarah Connor',
            email: email,
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            role: 'Admin',
            organization: {
              id: 'org-909',
              name: 'Cyberdyne Systems',
              code: 'CYB-DX9-2026',
              membersCount: 12,
            }
          }
        };
        dispatch(loginSuccess(mockResponse));
        navigate('/dashboard');
      } else {
        dispatch(loginFailure('Invalid login credentials provided.'));
      }
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-xs font-bold text-red-400 bg-red-950/20 border border-red-900/35 rounded-lg flex items-center gap-2">
          <span>⚠️ {error}</span>
        </div>
      )}

      {validationError && (
        <div className="p-3 text-xs font-bold text-red-400 bg-red-950/20 border border-red-900/35 rounded-lg flex items-center gap-2">
          <span>⚠️ {validationError}</span>
        </div>
      )}

      <Input
        label="Email Address"
        id="email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setValidationError('');
        }}
        placeholder="you@example.com"
        icon={<Mail className="w-4 h-4" />}
      />

      <div className="relative">
        <Input
          label="Password"
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setValidationError('');
          }}
          placeholder="••••••••"
          icon={<Lock className="w-4 h-4" />}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 bottom-2.5 text-slate-400 hover:text-slate-200 transition-colors"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pt-1">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input 
            type="checkbox" 
            defaultChecked
            className="w-3.5 h-3.5 rounded bg-darkBg-950 border-darkBg-850 accent-brand-500" 
          />
          Remember me
        </label>
        <a href="#forgot" className="text-brand-400 hover:text-brand-300 hover:underline">
          Forgot Password?
        </a>
      </div>

      <Button
        type="submit"
        isLoading={loading}
        className="w-full mt-2"
        icon={<ShieldCheck className="w-4.5 h-4.5" />}
      >
        Sign in to Workspace
      </Button>

      <div className="text-center pt-2 text-[11px] font-semibold text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-brand-400 hover:text-brand-300 hover:underline">
          Create Workspace
        </Link>
      </div>
    </form>
  );
};

export default Login;
