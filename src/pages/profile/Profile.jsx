import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  User, 
  Mail, 
  ShieldAlert, 
  Award, 
  Calendar, 
  CheckSquare,
  Lock,
  Smartphone,
  Laptop,
  Globe,
  Settings,
  Trash2,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Zap,
  MapPin
} from 'lucide-react';
import { updateProfile } from '../../redux/slices/authSlice';
import { toggleDarkMode } from '../../redux/slices/uiSlice';
import { addNotification } from '../../redux/slices/notificationSlice';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Profile = () => {
  const dispatch = useDispatch();
  
  // Select workspace credentials from Redux
  const user = useSelector((state) => state.auth.user);
  const tasks = useSelector((state) => state.tasks.list);
  const organization = useSelector((state) => state.auth.organization);
  const darkMode = useSelector((state) => state.ui.darkMode);

  // Computations
  const myTasks = tasks.filter(t => t.assignee === user?.id);
  const compCount = myTasks.filter(t => t.status === 'Done').length;
  const pendCount = myTasks.filter(t => t.status !== 'Done').length;

  // Personal Info Form States
  const [profileName, setProfileName] = useState(user?.name || 'Sarah Connor');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'sarah.c@cyberdyne.so');
  const [profileRole, setProfileRole] = useState(user?.role || 'Administrator');
  const [profileDept, setProfileDept] = useState('Engineering');

  // Security Password Rotation states
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // Sessions list records state
  const [sessions, setSessions] = useState([
    { id: 'sess-1', device: 'Chrome on Windows 11', location: 'California, US', ip: '192.168.1.101', active: true, time: 'Current Session' },
    { id: 'sess-2', device: 'Safari on macOS Sequoia', location: 'Berlin, DE', ip: '185.42.12.8', active: false, time: '2 hours ago' },
    { id: 'sess-3', device: 'Firefox on Ubuntu Linux', location: 'Tokyo, JP', ip: '95.12.42.100', active: false, time: 'Yesterday' }
  ]);

  // Preferences toggles state
  const [syncAlerts, setSyncAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Save profile updates
  const handleSaveProfile = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ name: profileName, email: profileEmail }));
    dispatch(addNotification({
      title: 'Profile Updated',
      description: 'Saved display profile credentials successfully.',
      type: 'system'
    }));
  };

  // Revoke security session
  const handleRevokeSession = (sessionId, device) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    dispatch(addNotification({
      title: 'Session Revoked',
      description: `Terminated security token for ${device}.`,
      type: 'danger'
    }));
  };

  // Save security rotative passwords
  const handleSaveSecurity = (e) => {
    e.preventDefault();
    setNewPass('');
    setConfirmPass('');
    dispatch(addNotification({
      title: 'Vault Updated',
      description: 'Account security rotation verified.',
      type: 'system'
    }));
  };

  return (
    <div className="space-y-6 text-xs select-none">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-brand-500" />
          My Profile & Session Vault
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Administer developer parameters, audit active browser tokens, and manage notification digests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: VISUAL PROFILE OVERVIEW CARD */}
        <div className="lg:col-span-1 space-y-6">
          
          <Card className="p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 flex flex-col items-center text-center shadow-sm">
            <img 
              src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'} 
              alt={profileName} 
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-brand-500/10 shadow-md mb-4"
            />
            
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">{profileName}</h3>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{profileEmail}</span>
            
            <div className="flex items-center gap-1.5 mt-3.5">
              <Badge variant="brand" className="text-[10px] uppercase font-bold py-0.5 px-2.5">
                {profileRole}
              </Badge>
              <Badge variant="success" className="text-[10px] uppercase font-bold py-0.5 px-2.5">
                2FA Active
              </Badge>
            </div>

            <div className="w-full border-t border-slate-100 dark:border-darkBg-850/80 mt-5 pt-5 text-left space-y-3.5">
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-350">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{profileEmail}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-350">
                <Award className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Tenant: {organization?.name || 'Cyberdyne Systems'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-350">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Registered: May 2026</span>
              </div>
            </div>
          </Card>

          {/* Core Sprints Statistics summary metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 flex flex-col justify-between h-24">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tasks Completed</span>
              <span className="text-2xl font-black text-emerald-500 block mt-1">{compCount} Done</span>
              <span className="text-[9px] text-slate-400 block">SLA delivered successfully</span>
            </Card>

            <Card className="p-4 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 flex flex-col justify-between h-24">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Backlog</span>
              <span className="text-2xl font-black text-brand-500 block mt-1">{pendCount} Sprints</span>
              <span className="text-[9px] text-slate-400 block">Requires sprint attention</span>
            </Card>
          </div>

        </div>

        {/* RIGHT COLUMN: CORE FORMS & ACTIVE SESSIONS SECTIONS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SECTION 1: PERSONAL INFO FORM */}
          <Card className="p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3.5 mb-4">
              <User className="w-4 h-4 text-brand-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Personal Information</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Display Full Name"
                  id="profileNameInput"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
                <Input
                  label="Primary Contact Email"
                  id="profileEmailInput"
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Job Title / Role Assignment"
                  id="profileRoleInput"
                  value={profileRole}
                  onChange={(e) => setProfileRole(e.target.value)}
                  required
                />
                
                {/* Department Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Assigned Department
                  </label>
                  <select
                    value={profileDept}
                    onChange={(e) => setProfileDept(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-darkBg-950 border border-slate-200 focus:border-brand-500 dark:border-darkBg-850 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-105 transition-all duration-200 font-bold"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button type="submit" variant="primary" size="sm" className="font-bold">
                  Save Personal Info
                </Button>
              </div>
            </form>
          </Card>

          {/* SECTION 2: SECURITY & MFA VAULT */}
          <Card className="p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3.5 mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Security & Multi-Factor Access</h3>
            </div>

            <form onSubmit={handleSaveSecurity} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="New Vault Password"
                  id="profileNewPass"
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="••••••••••••"
                />
                <Input
                  label="Confirm Password"
                  id="profileConfirmPass"
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="••••••••••••"
                />
              </div>

              <div className="flex justify-end pt-1">
                <Button type="submit" variant="primary" size="sm" className="font-bold">
                  Rotate Password
                </Button>
              </div>
            </form>
          </Card>

          {/* SECTION 3: BROWSER & API ACTIVE SESSIONS */}
          <Card className="p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3.5 mb-4">
              <Laptop className="w-4 h-4 text-purple-500 animate-pulse-subtle" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Browser & API Sessions</h3>
                <span className="text-[10px] text-slate-400">Review active login credentials and terminate tokens</span>
              </div>
            </div>

            <div className="space-y-3.5">
              {sessions.map((sess) => (
                <div 
                  key={sess.id} 
                  className="p-3 rounded-xl bg-slate-50 dark:bg-darkBg-950/40 border border-slate-150/10 flex items-center justify-between gap-4"
                >
                  <div className="flex gap-2.5 items-start min-w-0">
                    <div className="p-2 rounded-lg bg-white dark:bg-darkBg-900 border border-slate-150/10 shrink-0">
                      {sess.device.includes('Windows') ? <Laptop className="w-4 h-4 text-slate-450" /> : <Smartphone className="w-4 h-4 text-slate-450" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-805 dark:text-slate-150">{sess.device}</span>
                        {sess.active ? (
                          <Badge variant="success" className="text-[8px] font-bold py-0">Current</Badge>
                        ) : (
                          <Badge variant="gray" className="text-[8px] font-bold py-0">{sess.time}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-400 text-[9.5px] font-medium mt-1">
                        <span className="flex items-center gap-1">📍 {sess.location}</span>
                        <span>•</span>
                        <span>IP: {sess.ip}</span>
                      </div>
                    </div>
                  </div>

                  {!sess.active && (
                    <button
                      onClick={() => handleRevokeSession(sess.id, sess.device)}
                      className="p-2 rounded-lg border border-slate-100 hover:border-red-500 hover:text-red-500 bg-white dark:border-darkBg-850 dark:bg-darkBg-950 dark:hover:border-red-550 text-slate-400 transition-colors shrink-0"
                      title="Revoke session token"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* SECTION 4: LOCAL PREFERENCES */}
          <Card className="p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3.5 mb-4">
              <Zap className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Workspace Preferences</h3>
            </div>

            <div className="space-y-4">
              
              {/* Dark Theme toggle */}
              <div className="flex items-center justify-between p-1.5">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-850 dark:text-slate-200 block">Dark Mode Aesthetic</span>
                  <span className="text-[10px] text-slate-405 block">Toggle dark background values</span>
                </div>
                <button 
                  onClick={() => dispatch(toggleDarkMode())}
                  className="text-slate-450 hover:text-brand-500 transition-colors shrink-0"
                >
                  {darkMode ? (
                    <ToggleRight className="w-8.5 h-8.5 text-brand-500" />
                  ) : (
                    <ToggleLeft className="w-8.5 h-8.5 text-slate-400" />
                  )}
                </button>
              </div>

              {/* Real-time Alerts toggle */}
              <div className="flex items-center justify-between p-1.5 border-t border-slate-50 dark:border-darkBg-850/50 pt-4">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-850 dark:text-slate-200 block">Real-time Prompt Alerts</span>
                  <span className="text-[10px] text-slate-405 block">Receive notifications when AI assistant creates tasks</span>
                </div>
                <button 
                  onClick={() => setSyncAlerts(!syncAlerts)}
                  className="text-slate-450 hover:text-brand-500 transition-colors shrink-0"
                >
                  {syncAlerts ? (
                    <ToggleRight className="w-8.5 h-8.5 text-brand-500" />
                  ) : (
                    <ToggleLeft className="w-8.5 h-8.5 text-slate-400" />
                  )}
                </button>
              </div>

              {/* SMTP digests */}
              <div className="flex items-center justify-between p-1.5 border-t border-slate-50 dark:border-darkBg-850/50 pt-4">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-850 dark:text-slate-200 block">Weekly SMTP Digests</span>
                  <span className="text-[10px] text-slate-405 block">Receive weekly email briefings detailing active tasks progress</span>
                </div>
                <button 
                  onClick={() => setWeeklyDigest(!weeklyDigest)}
                  className="text-slate-450 hover:text-brand-500 transition-colors shrink-0"
                >
                  {weeklyDigest ? (
                    <ToggleRight className="w-8.5 h-8.5 text-brand-500" />
                  ) : (
                    <ToggleLeft className="w-8.5 h-8.5 text-slate-400" />
                  )}
                </button>
              </div>

            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};

export default Profile;
