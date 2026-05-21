import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Search, 
  Sparkles, 
  Terminal, 
  ArrowRight, 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  BarChart3, 
  Cpu, 
  Settings as SettingsIcon, 
  User, 
  Bell,
  Palette,
  Play
} from 'lucide-react';
import { toggleDarkMode } from '../../redux/slices/uiSlice';
import { addNotification } from '../../redux/slices/notificationSlice';
import Badge from './Badge';

const CommandPalette = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const darkMode = useSelector((state) => state.ui.darkMode);

  // Command backlogs list
  const commands = [
    { id: 'goto-dashboard', title: 'Go to Dashboard', subtitle: 'View sprint performance and organizations', category: 'Navigation', icon: LayoutDashboard, action: () => navigate('/dashboard') },
    { id: 'goto-projects', title: 'Go to Projects', subtitle: 'Provision core project cards', category: 'Navigation', icon: FolderKanban, action: () => navigate('/projects') },
    { id: 'goto-tasks', title: 'Go to Tasks', subtitle: 'Inspect active Kanban sprint boards', category: 'Navigation', icon: CheckSquare, action: () => navigate('/tasks') },
    { id: 'goto-analytics', title: 'Go to Analytics', subtitle: 'Verify Recharts performance charts', category: 'Navigation', icon: BarChart3, action: () => navigate('/analytics') },
    { id: 'goto-ai', title: 'Go to AI Assistant', subtitle: 'Converse with Claude & scaffold roadmaps', category: 'Navigation', icon: Sparkles, action: () => navigate('/ai') },
    { id: 'goto-automation', title: 'Go to Automation', subtitle: 'Design visual IF-AND-THEN rule pipelines', category: 'Navigation', icon: Cpu, action: () => navigate('/automation') },
    { id: 'goto-notifications', title: 'Go to Notifications', subtitle: 'Archive in-app and webhook notification backlogs', category: 'Navigation', icon: Bell, action: () => navigate('/notifications') },
    { id: 'goto-settings', title: 'Go to Settings', subtitle: 'Manage HSL borders, LLM models, and branding presets', category: 'Navigation', icon: SettingsIcon, action: () => navigate('/settings') },
    { id: 'goto-profile', title: 'Go to Profile', subtitle: 'Audit active browser login sessions', category: 'Navigation', icon: User, action: () => navigate('/profile') },
    
    { id: 'cmd-theme', title: 'Toggle Light/Dark Theme', subtitle: 'Instantly swap HSL layout context variables', category: 'System Action', icon: Palette, action: () => dispatch(toggleDarkMode()) },
    { 
      id: 'cmd-mock-task', 
      title: 'Inject SLA Warnings Alert', 
      subtitle: 'Trigger a simulated high-priority deadline warning notification', 
      category: 'System Action', 
      icon: Play, 
      action: () => dispatch(addNotification({
        title: 'Task Assigned',
        description: "System mock triggered: 'Refactor Postgress Security Audits' is due in less than 24 Hours.",
        type: 'ai'
      })) 
    }
  ];

  // Filter commands by search term
  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(search.toLowerCase()) || 
    cmd.category.toLowerCase().includes(search.toLowerCase()) ||
    cmd.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Autofocus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  // Listeners for navigating the palette with keys
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh] px-4">
      
      {/* Click outside to close */}
      <div className="absolute inset-0 z-0" onClick={onClose} />

      {/* Palette Container */}
      <div className="w-full max-w-xl bg-white dark:bg-darkBg-900 border border-slate-150/15 dark:border-darkBg-850/50 rounded-2xl shadow-2xl z-10 overflow-hidden select-none animate-scale-in text-xs">
        
        {/* Search header bar */}
        <div className="relative border-b border-slate-100 dark:border-darkBg-850 flex items-center px-4 py-3.5">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search everywhere or type a shortcut command... (e.g. /theme)"
            className="w-full bg-transparent border-0 outline-none text-xs ml-3 text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
          <Badge variant="gray" className="text-[9px] shrink-0 font-bold px-1.5 uppercase font-mono">
            ESC to close
          </Badge>
        </div>

        {/* Command list */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filteredCommands.map((cmd, index) => {
            const isSelected = index === selectedIndex;
            return (
              <div
                key={cmd.id}
                onClick={() => {
                  cmd.action();
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`
                  p-2.5 rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-colors
                  ${isSelected 
                    ? 'bg-slate-50 dark:bg-darkBg-950/60 text-slate-900 dark:text-slate-100 border border-slate-150/10' 
                    : 'bg-transparent text-slate-655 dark:text-slate-400 border border-transparent'
                  }
                `}
              >
                <div className="flex gap-3 items-center min-w-0">
                  <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-brand-500/10 text-brand-500' : 'bg-slate-50 dark:bg-darkBg-950 border border-slate-150/10 text-slate-400'}`}>
                    <cmd.icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className={`font-bold block truncate ${isSelected ? 'text-brand-500 dark:text-brand-400' : 'text-slate-800 dark:text-slate-205'}`}>
                      {cmd.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate mt-0.5">{cmd.subtitle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="gray" className="text-[8.5px] uppercase font-bold tracking-wider py-0.5">
                    {cmd.category}
                  </Badge>
                  {isSelected && (
                    <ArrowRight className="w-3.5 h-3.5 text-brand-500 animate-pulse" />
                  )}
                </div>

              </div>
            );
          })}

          {filteredCommands.length === 0 && (
            <div className="text-center py-8 text-slate-400 font-semibold">
              No matching commands or pages found.
            </div>
          )}
        </div>

        {/* Shortcuts footer guide */}
        <div className="bg-slate-50 dark:bg-darkBg-950/80 border-t border-slate-100 dark:border-darkBg-850/60 px-4 py-3 flex items-center justify-between text-[10px] text-slate-400 flex-wrap gap-2">
          <div className="flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span>Search Everywhere Active Console</span>
          </div>
          
          <div className="flex items-center gap-3 font-medium flex-wrap">
            <span><kbd className="px-1 bg-white dark:bg-darkBg-900 border border-slate-200 dark:border-darkBg-800 rounded font-mono shadow-sm">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1 bg-white dark:bg-darkBg-900 border border-slate-200 dark:border-darkBg-800 rounded font-mono shadow-sm">Enter</kbd> Select</span>
            <span><kbd className="px-1 bg-white dark:bg-darkBg-900 border border-slate-200 dark:border-darkBg-800 rounded font-mono shadow-sm">Ctrl+D</kbd> Dashboard</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CommandPalette;
