import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  CheckSquare,
  BarChart3,
  Sparkles,
  Zap,
  Bell,
  Settings,
  Sun,
  Moon,
  Search,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Check,
  Plus,
  Compass,
  Cpu
} from 'lucide-react';
import { 
  toggleSidebar, 
  toggleDarkMode, 
  toggleAiAssistant,
  setCreateProjectModalOpen
} from '../redux/slices/uiSlice';
import { logout, updateOrganization } from '../redux/slices/authSlice';
import { markAsRead, markAllAsRead, addNotification } from '../redux/slices/notificationSlice';
import AiAssistant from '../components/ai/AiAssistant';
import Badge from '../components/common/Badge';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const darkMode = useSelector((state) => state.ui.darkMode);
  const user = useSelector((state) => state.auth.user);
  const organization = useSelector((state) => state.auth.organization);
  
  const notifications = useSelector((state) => state.notifications.list);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);

  // States
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const orgDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Mock organizations to switch between
  const mockOrganizations = [
    { name: 'Cyberdyne Systems', code: 'TF-CYB-4088' },
    { name: 'Tyrell Corporation', code: 'TF-TYR-9901' },
    { name: 'Weyland-Yutani', code: 'TF-WEY-2049' }
  ];

  // Sync dark class on document/body elements
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Click outside handlers
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (orgDropdownRef.current && !orgDropdownRef.current.contains(e.target)) {
        setOrgDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSwitchOrg = (org) => {
    dispatch(updateOrganization(org));
    dispatch(addNotification({
      title: 'Tenant Workspace Switched',
      description: `Active workspace switched to "${org.name}".`,
      type: 'system'
    }));
    setOrgDropdownOpen(false);
  };

  // Nav items listing (conforming to requested structure)
  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Organizations', path: '/organization', icon: Building2 },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'AI Assistant', path: '#ai', icon: Sparkles, action: () => dispatch(toggleAiAssistant()) },
    { name: 'Automation', path: '/automation', icon: Cpu },
    { name: 'Notifications', path: '#notifications', icon: Bell, action: () => setNotifDrawerOpen(true), count: unreadCount },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 dark:bg-darkBg-950 dark:text-slate-100 transition-colors duration-200 select-none text-xs">
      
      {/* 1. LEFT SIDEBAR (Exactly 280px Expanded Width) */}
      <motion.aside
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ type: 'spring', damping: 24, stiffness: 220 }}
        className="fixed top-0 bottom-0 left-0 z-30 flex flex-col bg-white dark:bg-darkBg-900 border-r border-slate-150/10 dark:border-darkBg-850/80 shadow-premium shrink-0"
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 dark:border-darkBg-850/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8.5 h-8.5 rounded-xl bg-brand-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-brand-500/20">
              <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
            </div>
            {sidebarOpen && (
              <span className="text-sm font-extrabold tracking-tight bg-gradient-to-r from-brand-500 to-blue-600 dark:from-brand-400 dark:to-blue-500 bg-clip-text text-transparent">
                TaskFlow SaaS
              </span>
            )}
          </div>
          {sidebarOpen && (
            <button 
              onClick={() => dispatch(toggleSidebar())}
              className="p-1.5 rounded-lg text-slate-450 hover:bg-slate-50 dark:hover:bg-darkBg-800 hover:text-slate-650 dark:hover:text-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sidebar Organization Banner in Sidebar if expanded */}
        {sidebarOpen && organization && (
          <div className="mx-4 mt-4 p-3 bg-slate-50 dark:bg-darkBg-950/40 border border-slate-100/50 dark:border-darkBg-850/50 rounded-16">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
              Active Workspace
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
              {organization.name}
            </span>
            <span className="text-[9.5px] text-brand-500 dark:text-brand-400 font-semibold mt-0.5 block">
              🏢 {organization.code}
            </span>
          </div>
        )}

        {/* Navigation Links list */}
        <nav className="flex-1 px-3 space-y-1 py-4 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            
            const isButtonLink = link.path.startsWith('#');
            
            const linkContent = (
              <>
                <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                {sidebarOpen && (
                  <span className="flex-1 text-left truncate">{link.name}</span>
                )}
                {sidebarOpen && link.count !== undefined && link.count > 0 && (
                  <Badge variant="danger" size="sm" className="text-[9px] font-bold py-0.5 px-1.5 shrink-0">
                    {link.count}
                  </Badge>
                )}
              </>
            );

            if (isButtonLink) {
              return (
                <button
                  key={link.name}
                  onClick={link.action}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold tracking-wide transition-all select-none text-left
                    text-slate-650 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-darkBg-850/50 dark:hover:text-slate-200
                  `}
                  title={!sidebarOpen ? link.name : ''}
                >
                  {linkContent}
                </button>
              );
            }

            return (
              <Link
                key={link.name}
                to={link.path}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold tracking-wide transition-all select-none
                  ${isActive 
                    ? 'bg-brand-500 text-white shadow-premium' 
                    : 'text-slate-650 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-darkBg-850/50 dark:hover:text-slate-200'
                  }
                `}
                title={!sidebarOpen ? link.name : ''}
              >
                {linkContent}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer parameters */}
        <div className="p-3 border-t border-slate-100 dark:border-darkBg-850/80 space-y-1.5">
          {/* Quick toggle to expand if collapsed */}
          {!sidebarOpen && (
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-darkBg-850"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          )}

          {/* Sign out indicator */}
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-rose-600 hover:bg-rose-50 dark:text-rose-450 dark:hover:bg-rose-950/20 transition-all
              ${!sidebarOpen ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Container Frame */}
      <div 
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ paddingLeft: sidebarOpen ? 280 : 80 }}
      >
        
        {/* 2. TOP NAVBAR */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/70 dark:bg-darkBg-900/60 border-b border-slate-150/10 dark:border-darkBg-850/80 backdrop-blur-md sticky top-0 z-20">
          
          {/* Left Top navbar search trigger & org switcher */}
          <div className="flex items-center gap-4">
            
            {/* Organization Switcher Dropdown */}
            <div className="relative" ref={orgDropdownRef}>
              <button
                onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 dark:bg-darkBg-950/60 dark:hover:bg-darkBg-850 dark:border-darkBg-850 transition-all text-[11px] font-bold text-slate-750 dark:text-slate-200 shadow-sm"
              >
                <span>🏢 {organization?.name || 'Switch Organization'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {orgDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute left-0 mt-2 w-56 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 shadow-2xl rounded-xl p-2 z-50 space-y-0.5"
                  >
                    <span className="text-[9px] font-bold text-slate-400 block px-2.5 py-1 uppercase tracking-wider">
                      Select Tenant Space
                    </span>
                    {mockOrganizations.map(org => {
                      const isSelected = org.name === organization?.name;
                      return (
                        <button
                          key={org.name}
                          onClick={() => handleSwitchOrg(org)}
                          className={`
                            w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all
                            ${isSelected 
                              ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/30 dark:text-brand-400 font-bold' 
                              : 'hover:bg-slate-50 dark:hover:bg-darkBg-850/50 text-slate-700 dark:text-slate-300'
                            }
                          `}
                        >
                          <div>
                            <span className="block font-bold">{org.name}</span>
                            <span className="text-[9px] opacity-70 block">{org.code}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-brand-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Right Top Navbar Tools */}
          <div className="flex items-center gap-3">
            
            {/* Global Search Field & Shortcut indicator */}
            <div 
              onClick={() => setSearchOpen(true)}
              className="relative hidden md:flex items-center w-56 bg-slate-50 hover:bg-slate-100 dark:bg-darkBg-950 dark:hover:bg-darkBg-850 border border-slate-100 dark:border-darkBg-850 text-slate-400 rounded-xl py-1.5 px-3 cursor-pointer transition-all"
            >
              <Search className="w-3.5 h-3.5 mr-2 shrink-0" />
              <span className="text-[10px] flex-1">Search assets...</span>
              <kbd className="bg-white dark:bg-darkBg-900 border border-slate-200 dark:border-darkBg-800 text-[8.5px] px-1.5 rounded font-mono shadow-sm">
                Ctrl K
              </kbd>
            </div>

            {/* AI Assistant fast action bubble */}
            <button
              onClick={() => dispatch(toggleAiAssistant())}
              className="p-2 rounded-xl bg-brand-50 hover:bg-brand-100 border border-brand-100 text-brand-600 dark:bg-brand-950/30 dark:hover:bg-brand-950/50 dark:border-brand-900/30 dark:text-brand-400 transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm"
              title="Open AI Workspace Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Notification Center Trigger */}
            <button
              onClick={() => setNotifDrawerOpen(true)}
              className={`
                p-2 rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-darkBg-800 hover:text-slate-650 dark:hover:text-slate-200 transition-all relative
                ${notifDrawerOpen ? 'bg-slate-50 dark:bg-darkBg-800 text-slate-650' : ''}
              `}
              title="Open notifications list"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              )}
            </button>

            {/* Theme switcher button */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-xl text-slate-450 hover:bg-slate-50 dark:hover:bg-darkBg-800 hover:text-amber-500 transition-colors"
              title="Toggle application theme"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* User Profile dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-50 dark:hover:bg-darkBg-800 transition-all"
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'}
                  alt={user?.name}
                  className="w-7.5 h-7.5 rounded-lg object-cover ring-2 ring-slate-100 dark:ring-darkBg-800 shadow-sm"
                />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-52 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 shadow-2xl rounded-xl p-3 z-50 space-y-1"
                  >
                    <div className="pb-2 border-b border-slate-100 dark:border-darkBg-850/80 mb-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">{user?.name}</span>
                      <span className="text-[9.5px] text-slate-400 block truncate">{user?.email}</span>
                      <Badge variant="brand" className="text-[8.5px] mt-1 font-bold inline-block uppercase">
                        {user?.role} Role
                      </Badge>
                    </div>
                    
                    <Link 
                      to="/profile" 
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-darkBg-850/50 hover:text-slate-900 dark:hover:text-slate-200 transition-all"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      My Profile
                    </Link>
                    <Link 
                      to="/settings" 
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-darkBg-850/50 hover:text-slate-900 dark:hover:text-slate-200 transition-all"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      Settings
                    </Link>

                    <div className="border-t border-slate-100 dark:border-darkBg-850/80 my-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all text-left"
                      >
                        <LogOut className="w-3.5 h-3.5 shrink-0" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </header>

        {/* 3. MAIN CONTENT */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>

      </div>

      {/* 4. NOTIFICATION DRAWER (Right-Anchored Slide Panel) */}
      <AnimatePresence>
        {notifDrawerOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNotifDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[1px] dark:bg-black/60"
            />

            {/* Notification Drawer body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 z-40 w-96 bg-white dark:bg-darkBg-900 border-l border-slate-100 dark:border-darkBg-850 shadow-2xl flex flex-col text-xs select-none"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-100 dark:border-darkBg-850 flex items-center justify-between bg-slate-50 dark:bg-darkBg-950/60 text-slate-800 dark:text-slate-100">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-brand-500 animate-bounce" />
                  <span className="font-bold text-sm">Notifications & Events</span>
                  {unreadCount > 0 && (
                    <Badge variant="danger" className="text-[9px] font-bold">
                      {unreadCount} New
                    </Badge>
                  )}
                </div>
                <button 
                  onClick={() => setNotifDrawerOpen(false)}
                  className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-darkBg-800 text-slate-450 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Actions Panel */}
              {notifications.length > 0 && (
                <div className="px-4 py-2 border-b border-slate-50 dark:border-darkBg-850/50 bg-white dark:bg-darkBg-900 flex justify-end">
                  <button 
                    onClick={() => {
                      dispatch(markAllAsRead());
                      dispatch(addNotification({
                        title: 'All Cleared',
                        description: 'System event logs marked as read.',
                        type: 'system'
                      }));
                    }}
                    className="text-[10px] font-extrabold text-brand-650 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                  >
                    ✓ Mark all as read
                  </button>
                </div>
              )}

              {/* Feed items lists */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    onClick={() => dispatch(markAsRead(n.id))}
                    className={`
                      p-3.5 rounded-16 border transition-all cursor-pointer relative
                      ${n.read 
                        ? 'bg-white dark:bg-darkBg-900 border-slate-100 dark:border-darkBg-850 hover:border-slate-250 dark:hover:border-darkBg-800' 
                        : 'bg-brand-50/25 border-brand-100/10 dark:bg-brand-950/10 dark:border-brand-900/10 hover:bg-brand-50/40'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-slate-800 dark:text-slate-100 truncate">{n.title}</span>
                      <span className="text-[8.5px] text-slate-400 font-semibold">{n.time}</span>
                    </div>
                    <p className="text-[10.5px] text-slate-550 dark:text-slate-400 leading-relaxed leading-normal">{n.description}</p>
                    {!n.read && (
                      <span className="absolute top-3.5 right-3 w-1.5 h-1.5 bg-brand-500 rounded-full" />
                    )}
                  </div>
                ))}

                {notifications.length === 0 && (
                  <div className="empty-state-container py-12">
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-darkBg-950/40 flex items-center justify-center border border-slate-100/10 mb-3 text-slate-400">
                      <Bell className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-700 dark:text-slate-350">No events logged</h4>
                    <p className="text-[10px] text-slate-450 mt-1.5 text-center max-w-[200px] leading-relaxed">
                      You are all caught up! New alerts will trigger real-time logs here.
                    </p>
                  </div>
                )}
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 5. GUEST SHORTCUT GLOBAL SEARCH MODAL */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -10 }}
              className="bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 rounded-16 shadow-2xl w-full max-w-lg overflow-hidden text-xs"
            >
              {/* Form Input */}
              <div className="p-4 border-b border-slate-100 dark:border-darkBg-850 flex items-center gap-3">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Query tasks, members or projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 outline-none text-xs"
                />
                <button 
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-darkBg-800 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Dynamic Mock results */}
              <div className="p-3 max-h-60 overflow-y-auto space-y-1 bg-slate-50/50 dark:bg-darkBg-950/20">
                <span className="text-[9px] font-bold text-slate-400 block px-2 py-1 uppercase tracking-widest">
                  Quick Links / Suggested
                </span>
                
                <button
                  onClick={() => {
                    navigate('/tasks');
                    setSearchOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-darkBg-850/50 text-slate-700 dark:text-slate-300"
                >
                  <CheckSquare className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="block font-bold">Workspace Tasks Board</span>
                    <span className="text-[9px] opacity-75 block">Manage Kanban stages and checklists</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    navigate('/analytics');
                    setSearchOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-darkBg-850/50 text-slate-700 dark:text-slate-300"
                >
                  <BarChart3 className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="block font-bold">Team Workload Velocity Reports</span>
                    <span className="text-[9px] opacity-75 block">Check SLA compliance rates</span>
                  </div>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Assistant drawer overlay */}
      <AiAssistant />

    </div>
  );
};

export default DashboardLayout;
