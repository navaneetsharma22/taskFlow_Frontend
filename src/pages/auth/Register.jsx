import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { User, Building, Mail, Lock, Sparkles } from 'lucide-react';
import { loginSuccess } from '../../redux/slices/authSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !name.trim()) {
      setError('Name, email and password are required');
      return;
    }
    if (!isJoining && !orgName.trim()) {
      setError('Organization name is required to create workspace');
      return;
    }
    if (isJoining && !inviteCode.trim()) {
      setError('Invite code is required to join organization');
      return;
    }

    setLoading(true);
    
    // Simulate register
    setTimeout(() => {
      const mockResponse = {
        token: 'mock-jwt-token-taskflow-saas-2026',
        user: {
          id: `usr-${Date.now()}`,
          name: name,
          email: email,
          avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`,
          role: isJoining ? 'Member' : 'Admin',
          organization: {
            id: `org-${Date.now()}`,
            name: isJoining ? 'Cyberdyne Systems' : orgName,
            code: isJoining ? inviteCode : `TF-${orgName.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
            membersCount: isJoining ? 13 : 1,
          }
        }
      };
      
      dispatch(loginSuccess(mockResponse));
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {error && (
        <div className="p-3 text-xs font-bold text-red-400 bg-red-950/20 border border-red-900/35 rounded-lg flex items-center gap-2">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-darkBg-950 border border-darkBg-850/80 rounded-xl mb-2 text-xs font-bold text-slate-400 select-none">
        <button
          type="button"
          onClick={() => {
            setIsJoining(false);
            setError('');
          }}
          className={`py-1.5 rounded-lg transition-colors ${!isJoining ? 'bg-brand-600 text-white shadow-premium' : 'hover:bg-darkBg-850'}`}
        >
          Create New
        </button>
        <button
          type="button"
          onClick={() => {
            setIsJoining(true);
            setError('');
          }}
          className={`py-1.5 rounded-lg transition-colors ${isJoining ? 'bg-brand-600 text-white shadow-premium' : 'hover:bg-darkBg-850'}`}
        >
          Join Existing
        </button>
      </div>

      <Input
        label="Your Full Name"
        id="name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setError('');
        }}
        placeholder="Sarah Connor"
        icon={<User className="w-4 h-4" />}
      />

      <Input
        label="Email Address"
        id="email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError('');
        }}
        placeholder="sarah@workspace.com"
        icon={<Mail className="w-4 h-4" />}
      />

      <Input
        label="Password"
        id="password"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError('');
        }}
        placeholder="••••••••"
        icon={<Lock className="w-4 h-4" />}
      />

      {!isJoining ? (
        <Input
          label="Organization Name"
          id="orgName"
          value={orgName}
          onChange={(e) => {
            setOrgName(e.target.value);
            setError('');
          }}
          placeholder="Cyberdyne Systems"
          icon={<Building className="w-4 h-4" />}
        />
      ) : (
        <Input
          label="Invite/Workspace Code"
          id="inviteCode"
          value={inviteCode}
          onChange={(e) => {
            setInviteCode(e.target.value);
            setError('');
          }}
          placeholder="CYB-DX9-2026"
          icon={<Building className="w-4 h-4" />}
        />
      )}

      <Button
        type="submit"
        isLoading={loading}
        className="w-full mt-2"
        icon={<Sparkles className="w-4.5 h-4.5" />}
      >
        {isJoining ? 'Join Organization' : 'Create Organization'}
      </Button>

      <div className="text-center pt-2 text-[11px] font-semibold text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-400 hover:text-brand-300 hover:underline">
          Sign In
        </Link>
      </div>
    </form>
  );
};

export default Register;
