import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { updateProfile, updateOrganization } from '../../redux/slices/authSlice';
import { toggleDarkMode } from '../../redux/slices/uiSlice';
import { addNotification } from '../../redux/slices/notificationSlice';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Settings = () => {
  const dispatch = useDispatch();
  
  const user = useSelector((state) => state.auth.user);
  const darkMode = useSelector((state) => state.ui.darkMode);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.role || 'Member');
  
  const [webhooksAlert, setWebhooksAlert] = useState(true);
  const [aiAlerts, setAiAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    dispatch(updateProfile({
      name,
      email,
      role
    }));
    
    dispatch(addNotification({
      title: 'Profile Updated',
      description: 'Your user profile details have been saved successfully.',
      type: 'system'
    }));
  };

  return (
    <div className="space-y-6 text-xs select-none">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Workspace Settings & Configurations
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize workspace parameters, user preferences, security details, and API alerts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column Settings Tabs/Navigation */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4 bg-white dark:bg-darkBg-900">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2.5">
              Settings Menu
            </span>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold text-brand-650 bg-brand-50/50 dark:text-brand-400 dark:bg-brand-950/20 text-left">
                <User className="w-4 h-4 text-brand-500" />
                Personal Profile
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-darkBg-850/50 hover:text-slate-800 dark:hover:text-slate-200 text-left">
                <Bell className="w-4 h-4 text-slate-400" />
                Notification Alerts
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-darkBg-850/50 hover:text-slate-800 dark:hover:text-slate-200 text-left">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                Security & Audits
              </button>
            </div>
          </Card>
        </div>

        {/* Right Columns Settings Body */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Card Settings */}
          <Card className="p-5 bg-white dark:bg-darkBg-900">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3 mb-4">
              <User className="w-4 h-4 text-brand-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Personal Profile</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-center gap-4 p-1.5 mb-2">
                <img 
                  src={user?.avatar} 
                  alt={name} 
                  className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-darkBg-800 shadow-md"
                />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{name}</h4>
                  <span className="text-[10px] text-slate-400 block">{user?.role} Role</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Display Name"
                  id="profileName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Connor"
                  required
                />
                <Input
                  label="Email Address"
                  id="profileEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah.c@cyberdyne.so"
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" size="sm">
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Preferences Settings */}
          <Card className="p-5 bg-white dark:bg-darkBg-900">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3 mb-4">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Workspace Preferences</h3>
            </div>

            <div className="space-y-4">
              
              {/* Theme Settings Toggle */}
              <div className="flex items-center justify-between p-1.5">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Dark Mode Aesthetic</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Toggle default dark UI theme</span>
                </div>
                <button 
                  onClick={() => dispatch(toggleDarkMode())}
                  className="text-slate-400 hover:text-brand-500 transition-colors"
                >
                  {darkMode ? (
                    <ToggleRight className="w-9 h-9 text-brand-500" />
                  ) : (
                    <ToggleLeft className="w-9 h-9 text-slate-400" />
                  )}
                </button>
              </div>

              {/* Alert System 1 */}
              <div className="flex items-center justify-between p-1.5 border-t border-slate-50 dark:border-darkBg-850/50 pt-4">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">AI Suggestion Alerts</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Receive prompt-generation suggestion events</span>
                </div>
                <button 
                  onClick={() => setAiAlerts(!aiAlerts)}
                  className="text-slate-400 hover:text-brand-500 transition-colors"
                >
                  {aiAlerts ? (
                    <ToggleRight className="w-9 h-9 text-brand-500" />
                  ) : (
                    <ToggleLeft className="w-9 h-9 text-slate-400" />
                  )}
                </button>
              </div>

              {/* Alert System 2 */}
              <div className="flex items-center justify-between p-1.5 border-t border-slate-50 dark:border-darkBg-850/50 pt-4">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Webhook Triggers Sync</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Receive production webhook audits notifications</span>
                </div>
                <button 
                  onClick={() => setWebhooksAlert(!webhooksAlert)}
                  className="text-slate-400 hover:text-brand-500 transition-colors"
                >
                  {webhooksAlert ? (
                    <ToggleRight className="w-9 h-9 text-brand-500" />
                  ) : (
                    <ToggleLeft className="w-9 h-9 text-slate-400" />
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

export default Settings;
