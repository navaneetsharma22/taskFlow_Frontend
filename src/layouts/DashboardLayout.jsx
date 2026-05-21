import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  BarChart3,
  Building2,
  Bell,
  Settings,
  LogOut,
  Sun,
  Moon,
  Sparkles,
  Menu,
  ChevronLeft,
  ChevronRight,
  User,
  Search,
  Plus
} from 'lucide-react';
import { 
  toggleSidebar, 
  toggleDarkMode, 
  setCreateProjectModalOpen,
  setCreateTaskModalOpen,
  toggleAiAssistant 
} from '../redux/slices/uiSlice';
import { logout } from '../redux/slices/authSlice';
import { markAsRead, markAllAsRead } from '../redux/slices/notificationSlice';
import AiAssistant from '../components/ai/AiAssistant';
import Badge from '../components/common/Badge';

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const darkMode = useSelector((state) => state.ui.darkMode);
  const user = useSelector((state) => state.auth.user);
  const organization = useSelector((state) => state.auth.organization);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const notifications = useSelector((state) => state.notifications.list);
  const projects = useSelector((state) => state.projects.list);
  const currentProject = useSelector((state) => state.projects.currentProject);

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Sync dark class to root document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Tasks Board', path: '/tasks', icon: CheckSquare },
    { name: 'Analytics & Reports', path: '/analytics', icon: BarChart3 },
    { name: 'Organization', path: '/organization', icon: Building2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 dark:bg-darkBg-950 dark:text-slate-100 transition-colors duration-200">
      
      {/* Sidebar Navigation */}
      <aside 
        className={`
          fixed top-0 bottom-0 left-0 z-30 flex flex-col bg-white dark:bg-darkBg-900 border-r border-slate-100 dark:border-darkBg-850/80 transition-all duration-300
          ${sidebarOpen ? 'w-64' : 'w-20'}
        `}
      >
        {/* Brand Logo Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 dark:border-darkBg-850/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-brand-600 dark:bg-brand-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-brand-500/20">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            {sidebarOpen && (
              <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400 bg-clip-text text-transparent select-none">
                TaskFlow
              </span>
            )}
          </div>
          {sidebarOpen && (
            <button 
              onClick={() => dispatch(toggleSidebar())}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-darkBg-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Workspace Selection Info */}
        {sidebarOpen && organization && (
          <div className="p-4 mx-3 my-4 rounded-xl bg-slate-50 dark:bg-darkBg-950/40 border border-slate-100/50 dark:border-darkBg-850/40">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
              Active Tenant
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate">
              {organization.name}
            </span>
            <span className="text-[10px] text-brand-600 dark:text-brand-400 font-medium tracking-tight">
              Code: {organization.code}
            </span>
          </div>
        )}

        {/* Navigation Actions */}
        <nav className="flex-1 px-3 space-y-1 py-4 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`
                  flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all select-none
                  ${isActive 
                    ? 'bg-brand-500 text-white shadow-premium' 
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-darkBg-850/50 dark:hover:text-slate-200'
                  }
                `}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                {sidebarOpen && <span>{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Sidebar Widgets */}
        <div className="p-3 border-t border-slate-100 dark:border-darkBg-850/80 space-y-2">
          
          {/* Quick AI Trigger Widget */}
          {sidebarOpen ? (
            <button
              onClick={() => dispatch(toggleAiAssistant())}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600/10 to-indigo-600/10 hover:from-brand-600/15 hover:to-indigo-600/15 border border-brand-500/20 text-brand-700 dark:text-brand-400 text-xs font-bold transition-all glow-effect"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                TaskFlow AI
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => dispatch(toggleAiAssistant())}
              className="w-full flex items-center justify-center p-2.5 rounded-xl bg-brand-500/10 hover:bg-brand-500/15 border border-brand-500/20 text-brand-500 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            </button>
          )}

          {/* Dark Mode Switcher */}
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className={`
              w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-darkBg-850/50 transition-all
              ${!sidebarOpen ? 'justify-center' : ''}
            `}
          >
            {darkMode ? (
              <>
                <Sun className="w-4.5 h-4.5 text-amber-400" />
                {sidebarOpen && <span>Light Mode</span>}
              </>
            ) : (
              <>
                <Moon className="w-4.5 h-4.5 text-slate-400" />
                {sidebarOpen && <span>Dark Mode</span>}
              </>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20 transition-all
              ${!sidebarOpen ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-4.5 h-4.5" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main App Frame Content */}
      <div 
        className={`
          flex-1 flex flex-col min-h-screen transition-all duration-300
          ${sidebarOpen ? 'pl-64' : 'pl-20'}
        `}
      >
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/70 dark:bg-darkBg-900/60 border-b border-slate-100 dark:border-darkBg-850/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button 
                onClick={() => dispatch(toggleSidebar())}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-darkBg-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <Menu className="w-4.5 h-4.5" />
              </button>
            )}
            
            {/* Header Breadcrumbs/Status */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400 select-none">
              <span>Workspace</span>
              <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
              <span className="text-slate-700 dark:text-slate-300 font-bold capitalize">
                {location.pathname.substring(1) || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Search, Action Buttons & Dropdowns */}
          <div className="flex items-center gap-3">
            
            {/* Header Search Field */}
            <div className="relative hidden md:flex items-center w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full bg-slate-50 dark:bg-darkBg-950 border border-slate-100 dark:border-darkBg-850 text-xs rounded-lg py-1.5 pl-9 pr-3 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all"
              />
            </div>

            {/* AI Assistant Fast Trigger Button */}
            <button
              onClick={() => dispatch(toggleAiAssistant())}
              className="p-2 rounded-lg bg-brand-50 hover:bg-brand-100 border border-brand-100 text-brand-600 dark:bg-brand-950/30 dark:hover:bg-brand-950/50 dark:border-brand-900/30 dark:text-brand-400 transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Notification Center */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  setProfileDropdownOpen(false);
                }}
                className={`
                  p-2 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-darkBg-800 hover:text-slate-600 dark:hover:text-slate-300 transition-all relative
                  ${notifDropdownOpen ? 'bg-slate-50 dark:bg-darkBg-800 text-slate-600 dark:text-slate-200' : ''}
                `}
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse-subtle" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 shadow-2xl rounded-xl p-4 overflow-hidden z-50">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-darkBg-850 pb-2 mb-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Notifications</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={() => dispatch(markAllAsRead())}
                        className="text-[10px] font-bold text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-4 text-xs text-slate-400">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => dispatch(markAsRead(n.id))}
                          className={`p-2 rounded-lg cursor-pointer transition-all border ${
                            n.read 
                              ? 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-darkBg-850/30' 
                              : 'bg-brand-50/20 border-brand-100/10 dark:bg-brand-950/10 dark:border-brand-900/10 hover:bg-brand-50/30'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">{n.title}</span>
                            <span className="text-[9px] text-slate-400 shrink-0">{n.time}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{n.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Center */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotifDropdownOpen(false);
                }}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-50 dark:hover:bg-darkBg-800 transition-all"
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'}
                  alt={user?.name}
                  className="w-7.5 h-7.5 rounded-lg object-cover ring-2 ring-slate-100 dark:ring-darkBg-800"
                />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-52 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 shadow-2xl rounded-xl p-3 overflow-hidden z-50">
                  <div className="pb-2 border-b border-slate-100 dark:border-darkBg-850/80 mb-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">{user?.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{user?.email}</span>
                  </div>
                  
                  <Link 
                    to="/profile" 
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-darkBg-850/50 hover:text-slate-900 dark:hover:text-slate-200 transition-all"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    My Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-darkBg-850/50 hover:text-slate-900 dark:hover:text-slate-200 transition-all"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    Settings
                  </Link>

                  <div className="border-t border-slate-100 dark:border-darkBg-850/80 my-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Page Body outlet slot */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* AI Assistant Drawer Widget */}
      <AiAssistant />

    </div>
  );
};

export default DashboardLayout;
