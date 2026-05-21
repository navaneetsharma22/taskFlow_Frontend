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
  ToggleRight,
  Palette,
  Cpu,
  Lock,
  Globe,
  Upload,
  Key,
  Database,
  Check
} from 'lucide-react';
import { updateProfile } from '../../redux/slices/authSlice';
import { toggleDarkMode } from '../../redux/slices/uiSlice';
import { addNotification } from '../../redux/slices/notificationSlice';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Settings = () => {
  const dispatch = useDispatch();
  
  // Select user states from Redux
  const user = useSelector((state) => state.auth.user);
  const darkMode = useSelector((state) => state.ui.darkMode);

  // Active sub-setting Tab controller
  const [activeTab, setActiveTab] = useState('General'); // 'General' | 'Security' | 'Branding' | 'AI' | 'Automation'

  // General Tab form states
  const [name, setName] = useState(user?.name || 'Sarah Connor');
  const [email, setEmail] = useState(user?.email || 'sarah.c@cyberdyne.so');
  const [systemLang, setSystemLang] = useState('English (US)');

  // Security Tab form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [mfaActive, setMfaActive] = useState(true);
  const [apiKeyActive, setApiKeyActive] = useState(false);

  // Branding Tab form states
  const [workspaceName, setWorkspaceName] = useState('Cyberdyne Systems');
  const [primaryColor, setPrimaryColor] = useState('#2563EB');
  const [borderRadiusVal, setBorderRadiusVal] = useState('16px');

  // AI Tab form states
  const [activeModel, setActiveModel] = useState('Claude 3.5 Sonnet');
  const [tokenLimit, setTokenLimit] = useState(250000);
  const [autoTaskProvision, setAutoTaskProvision] = useState(true);

  // Automation Tab form states
  const [retryLimit, setRetryLimit] = useState(3);
  const [webhookLogsActive, setWebhookLogsActive] = useState(true);
  const [smtpAlerts, setSmtpAlerts] = useState(false);

  // Save profile changes
  const handleSaveProfile = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ name, email }));
    dispatch(addNotification({
      title: 'Profile Updated',
      description: 'Your user profile details have been saved successfully.',
      type: 'system'
    }));
  };

  // Save security changes
  const handleSaveSecurity = (e) => {
    e.preventDefault();
    setCurrentPassword('');
    setNewPassword('');
    dispatch(addNotification({
      title: 'Security Settings Saved',
      description: 'Your security configurations and rotative keys are updated.',
      type: 'system'
    }));
  };

  // Save branding changes
  const handleSaveBranding = (e) => {
    e.preventDefault();
    dispatch(addNotification({
      title: 'Branding Synced',
      description: `Workspace styled accent updated to HSL ${primaryColor} and ${borderRadiusVal} borders.`,
      type: 'system'
    }));
  };

  // Save AI changes
  const handleSaveAi = (e) => {
    e.preventDefault();
    dispatch(addNotification({
      title: 'AI Policies Updated',
      description: `Co-Pilot engine synced to LLM ${activeModel}.`,
      type: 'ai'
    }));
  };

  // Save Automation changes
  const handleSaveAutomation = (e) => {
    e.preventDefault();
    dispatch(addNotification({
      title: 'Automations Synced',
      description: 'Outbound trigger filters and smtp rules verified.',
      type: 'system'
    }));
  };

  return (
    <div className="space-y-6 text-xs select-none">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-brand-500 animate-spin-slow" />
          Workspace Configurations & Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Administer profile metadata, security vaults, LLM thresholds, and visual templates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: SETTINGS TABS NAVIGATION */}
        <div className="lg:col-span-1">
          <Card className="p-4 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 pl-1">
              Configuration Menu
            </span>
            
            <div className="space-y-1">
              {[
                { key: 'General', label: 'General Preferences', icon: User },
                { key: 'Security', label: 'Security & Access', icon: ShieldCheck },
                { key: 'Branding', label: 'Branding & Theme', icon: Palette },
                { key: 'AI', label: 'AI Co-Pilot Controls', icon: Sparkles },
                { key: 'Automation', label: 'Workflow Automation', icon: Cpu }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all text-left border
                    ${activeTab === tab.key
                      ? 'bg-brand-50 border-brand-100 text-brand-650 dark:bg-brand-950/20 dark:border-brand-950 text-brand-650 dark:text-brand-400' 
                      : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-805 dark:text-slate-400 dark:hover:bg-darkBg-850/40 dark:hover:text-slate-200'
                    }
                  `}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.key ? 'text-brand-500' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

          </Card>
        </div>

        {/* RIGHT COLUMN: ACTIVE TAB PARAMETERS PANEL */}
        <div className="lg:col-span-2">
          
          {/* 1. GENERAL PREFERENCES TAB */}
          {activeTab === 'General' && (
            <Card className="p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3">
                <User className="w-4 h-4 text-brand-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">General Preferences</h3>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                
                {/* Profile Image Uploader Layout */}
                <div className="flex items-center gap-4 p-1">
                  <div className="relative group">
                    <img 
                      src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'} 
                      alt={name} 
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-darkBg-800 shadow-md"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <Upload className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-850 dark:text-slate-200 text-sm">{name}</h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Enrolled Roster: {user?.role || 'Administrator'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Display Username"
                    id="genName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="Email Router Routing"
                    id="genEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-50 dark:border-darkBg-850/50 pt-4">
                  
                  {/* Language Selector */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Localization Language
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <select
                        value={systemLang}
                        onChange={(e) => setSystemLang(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-darkBg-950 border border-slate-200 focus:border-brand-500 dark:border-darkBg-850 dark:focus:border-brand-500 text-xs rounded-lg py-2 pl-9 pr-3 outline-none text-slate-900 dark:text-slate-105 transition-all duration-200"
                      >
                        <option value="English (US)">English (US)</option>
                        <option value="German (DE)">German (DE)</option>
                        <option value="French (FR)">French (FR)</option>
                      </select>
                    </div>
                  </div>

                  {/* Dark Mode Theme */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-darkBg-950 border border-slate-150/10">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-250 block">Dark UI Theme</span>
                      <span className="text-[9.5px] text-slate-400 block mt-0.5">Toggle HSL variables</span>
                    </div>
                    <button 
                      type="button"
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

                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" size="sm" className="font-bold">
                    Save General Prefs
                  </Button>
                </div>

              </form>
            </Card>
          )}

          {/* 2. SECURITY & ACCESS TAB */}
          {activeTab === 'Security' && (
            <Card className="p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Security & Access Management</h3>
              </div>

              <form onSubmit={handleSaveSecurity} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Current Password"
                    id="currPass"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                  />
                  <Input
                    label="New Password Rotation"
                    id="newPass"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                  />
                </div>

                <div className="space-y-3.5 border-t border-slate-50 dark:border-darkBg-850/50 pt-4">
                  
                  {/* Two-Factor Authentication Toggle */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-darkBg-950 border border-slate-150/10">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">Two-Factor Authentication (2FA)</span>
                      <span className="text-[10px] text-slate-405 block">Secure user access via Google Authenticator TOTP validations</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setMfaActive(!mfaActive)}
                      className="text-slate-450 hover:text-brand-500 transition-colors shrink-0"
                    >
                      {mfaActive ? (
                        <ToggleRight className="w-8.5 h-8.5 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="w-8.5 h-8.5 text-slate-400" />
                      )}
                    </button>
                  </div>

                  {/* API Key Provision */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-darkBg-950 border border-slate-150/10">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">Active API Tokens</span>
                      <span className="text-[10px] text-slate-405 block">Enable secret API access headers for custom client integrations</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setApiKeyActive(!apiKeyActive)}
                      className="text-slate-450 hover:text-brand-500 transition-colors shrink-0"
                    >
                      {apiKeyActive ? (
                        <ToggleRight className="w-8.5 h-8.5 text-brand-500" />
                      ) : (
                        <ToggleLeft className="w-8.5 h-8.5 text-slate-400" />
                      )}
                    </button>
                  </div>

                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" size="sm" className="font-bold">
                    Update Security
                  </Button>
                </div>

              </form>
            </Card>
          )}

          {/* 3. BRANDING & THEME TAB */}
          {activeTab === 'Branding' && (
            <Card className="p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3">
                <Palette className="w-4 h-4 text-purple-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Workspace Branding & Customization</h3>
              </div>

              <form onSubmit={handleSaveBranding} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Workspace Directory Title"
                    id="wsName"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    required
                  />

                  {/* Border Radius select standard */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Standard Border Radius
                    </label>
                    <select
                      value={borderRadiusVal}
                      onChange={(e) => setBorderRadiusVal(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-darkBg-950 border border-slate-200 focus:border-brand-500 dark:border-darkBg-850 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-105 transition-all duration-200 font-bold"
                    >
                      <option value="12px">12px (Compact Classic)</option>
                      <option value="16px">16px (TaskFlow Standard)</option>
                      <option value="20px">20px (Modern Pill)</option>
                    </select>
                  </div>
                </div>

                {/* Primary theme accent picker */}
                <div className="flex flex-col gap-2 border-t border-slate-50 dark:border-darkBg-850/50 pt-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Primary Accent Brand Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-9 rounded-lg bg-transparent border-0 cursor-pointer outline-none"
                    />
                    <div className="space-y-0.5">
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{primaryColor}</span>
                      <span className="text-[9px] text-slate-400 block">SaaS layout components will render using this accent context</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" size="sm" className="font-bold">
                    Save Branding Configurations
                  </Button>
                </div>

              </form>
            </Card>
          )}

          {/* 4. AI CO-PILOT CONTROLS TAB */}
          {activeTab === 'AI' && (
            <Card className="p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse-subtle" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Assistant Co-Pilot Controls</h3>
              </div>

              <form onSubmit={handleSaveAi} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Model Selection */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Active LLM Core Model
                    </label>
                    <select
                      value={activeModel}
                      onChange={(e) => setActiveModel(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-darkBg-950 border border-slate-200 focus:border-brand-500 dark:border-darkBg-850 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-105 transition-all duration-200 font-bold"
                    >
                      <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Recommended)</option>
                      <option value="GPT-4o API Core">GPT-4o API Core</option>
                      <option value="Gemini 1.5 Flash">Gemini 1.5 Flash</option>
                    </select>
                  </div>

                  {/* Token Threshold limit selection */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Monthly Token Allocation Limit
                    </label>
                    <select
                      value={tokenLimit}
                      onChange={(e) => setTokenLimit(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-darkBg-950 border border-slate-200 focus:border-brand-500 dark:border-darkBg-850 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-105 transition-all duration-200 font-bold"
                    >
                      <option value={100000}>100,000 Tokens (Basic)</option>
                      <option value={250000}>250,000 Tokens (Pro)</option>
                      <option value={1000000}>1,000,000 Tokens (Unlimited)</option>
                    </select>
                  </div>

                </div>

                {/* Auto task generation policy */}
                <div className="space-y-4 border-t border-slate-50 dark:border-darkBg-850/50 pt-4">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-darkBg-950 border border-slate-150/10">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">Auto-Provision Tasks</span>
                      <span className="text-[10px] text-slate-405 block">Enable direct backend injections into Redux boards when generated by AI assistant prompts</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setAutoTaskProvision(!autoTaskProvision)}
                      className="text-slate-450 hover:text-brand-500 transition-colors shrink-0"
                    >
                      {autoTaskProvision ? (
                        <ToggleRight className="w-8.5 h-8.5 text-brand-500" />
                      ) : (
                        <ToggleLeft className="w-8.5 h-8.5 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" size="sm" className="font-bold">
                    Save AI Settings
                  </Button>
                </div>

              </form>
            </Card>
          )}

          {/* 5. WORKFLOW AUTOMATION TAB */}
          {activeTab === 'Automation' && (
            <Card className="p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3">
                <Cpu className="w-4 h-4 text-brand-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Workflow Automation Engine Settings</h3>
              </div>

              <form onSubmit={handleSaveAutomation} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Max retry limits */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Webhook Retry Thresholds
                    </label>
                    <select
                      value={retryLimit}
                      onChange={(e) => setRetryLimit(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-darkBg-950 border border-slate-200 focus:border-brand-500 dark:border-darkBg-850 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-105 transition-all duration-200 font-bold"
                    >
                      <option value={1}>1 Retry attempts</option>
                      <option value={3}>3 Retry attempts (Standard)</option>
                      <option value={5}>5 Retry attempts (High latency)</option>
                    </select>
                  </div>

                </div>

                <div className="space-y-3.5 border-t border-slate-50 dark:border-darkBg-850/50 pt-4">
                  
                  {/* Webhook logs audit */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-darkBg-950 border border-slate-150/10">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">Record Outbound Webhook Logs</span>
                      <span className="text-[10px] text-slate-405 block">Enable logging histories in the execution simulator sandbox</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setWebhookLogsActive(!webhookLogsActive)}
                      className="text-slate-450 hover:text-brand-500 transition-colors shrink-0"
                    >
                      {webhookLogsActive ? (
                        <ToggleRight className="w-8.5 h-8.5 text-brand-500" />
                      ) : (
                        <ToggleLeft className="w-8.5 h-8.5 text-slate-400" />
                      )}
                    </button>
                  </div>

                  {/* Mail digests alerts */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-darkBg-950 border border-slate-150/10">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">Email digests alerts alerts</span>
                      <span className="text-[10px] text-slate-405 block">Receive system weekly reports detailing total rule runs</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setSmtpAlerts(!smtpAlerts)}
                      className="text-slate-450 hover:text-brand-500 transition-colors shrink-0"
                    >
                      {smtpAlerts ? (
                        <ToggleRight className="w-8.5 h-8.5 text-brand-500" />
                      ) : (
                        <ToggleLeft className="w-8.5 h-8.5 text-slate-400" />
                      )}
                    </button>
                  </div>

                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" size="sm" className="font-bold">
                    Save Automation Configurations
                  </Button>
                </div>

              </form>
            </Card>
          )}

        </div>

      </div>

    </div>
  );
};

export default Settings;
