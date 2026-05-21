import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Users, 
  Clock, 
  TrendingUp, 
  ChevronRight,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { setCreateProjectModalOpen, toggleAiAssistant } from '../../redux/slices/uiSlice';

const chartData = [
  { name: 'Mon', completed: 4, generated: 6 },
  { name: 'Tue', completed: 7, generated: 5 },
  { name: 'Wed', completed: 5, generated: 8 },
  { name: 'Thu', completed: 9, generated: 4 },
  { name: 'Fri', completed: 12, generated: 10 },
  { name: 'Sat', completed: 6, generated: 3 },
  { name: 'Sun', completed: 8, generated: 5 },
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const projects = useSelector((state) => state.projects.list);
  const tasks = useSelector((state) => state.tasks.list);
  const members = useSelector((state) => state.auth.members);
  const user = useSelector((state) => state.auth.user);

  // Compute metrics
  const activeProjectsCount = projects.length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'Done').length;
  const completedTasksCount = tasks.filter(t => t.status === 'Done').length;
  const totalTasksCount = tasks.length;
  const completionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
  
  const activeMembersCount = members.filter(m => m.status === 'active').length;

  // Get active activities
  const recentActivities = [
    { id: 'act-1', text: 'Sarah Connor moved "Configure Redux Store & Auth Flow" to In Progress', time: '10 mins ago', type: 'task' },
    { id: 'act-2', text: 'TaskFlow AI auto-suggested 3 backlog security items', time: '20 mins ago', type: 'ai' },
    { id: 'act-3', text: 'New webhook trigger registered from GitHub main branch', time: '2 hours ago', type: 'webhook' },
    { id: 'act-4', text: 'John Connor completed subtask "Setup Tailwind CSS & PostCSS"', time: '4 hours ago', type: 'task' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Title Grid */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Hello, {user?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Here is a status summary of your enterprise tenant space.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => dispatch(toggleAiAssistant())}
            icon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
          >
            AI Optimizer
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/tasks')}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* Grid of 4 Compact Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <Card hoverEffect className="flex items-center gap-4 p-4.5 bg-white dark:bg-darkBg-900">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 border border-brand-100/10 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Projects
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-slate-900 dark:text-white">{activeProjectsCount}</span>
              <span className="text-[10px] text-emerald-500 font-bold flex items-center">
                +1 new
              </span>
            </div>
          </div>
        </Card>

        {/* Metric 2 */}
        <Card hoverEffect className="flex items-center gap-4 p-4.5 bg-white dark:bg-darkBg-900">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100/10 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Pending Backlog
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-slate-900 dark:text-white">{pendingTasksCount}</span>
              <span className="text-[10px] text-slate-400 font-semibold">
                tasks to go
              </span>
            </div>
          </div>
        </Card>

        {/* Metric 3 */}
        <Card hoverEffect className="flex items-center gap-4 p-4.5 bg-white dark:bg-darkBg-900">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100/10 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Completion Rate
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-slate-900 dark:text-white">{completionRate}%</span>
              <div className="w-16 h-1.5 bg-slate-100 dark:bg-darkBg-950 rounded-full overflow-hidden self-center">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${completionRate}%` }} 
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Metric 4 */}
        <Card hoverEffect className="flex items-center gap-4 p-4.5 bg-white dark:bg-darkBg-900">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100/10 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Teammates
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-slate-900 dark:text-white">{activeMembersCount}</span>
              <span className="text-[10px] text-emerald-500 font-bold flex items-center">
                ● Live now
              </span>
            </div>
          </div>
        </Card>

      </div>

      {/* Main Charts & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Productivity Trends Chart Panel */}
        <Card className="lg:col-span-2 flex flex-col p-5 bg-white dark:bg-darkBg-900">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-darkBg-850 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                Delivery Velocity Rate
              </h3>
              <span className="text-[10px] text-slate-400">Comparing tasks completed vs generated</span>
            </div>
            <Badge variant="brand" className="text-[10px]">
              <TrendingUp className="w-3 h-3 mr-1" />
              Live Workspace Sync
            </Badge>
          </div>
          
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.01}/>
                  </linearGradient>
                  <linearGradient id="colorGenerated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1f2c" strokeOpacity={0.05} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 19, 26, 0.9)', 
                    borderColor: 'rgba(37, 43, 61, 0.5)', 
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff'
                  }} 
                />
                <Area type="monotone" dataKey="completed" name="Completed Tasks" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" />
                <Area type="monotone" dataKey="generated" name="Created Tasks" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorGenerated)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Recommendations Panel */}
        <Card className="flex flex-col p-5 bg-white dark:bg-darkBg-900">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3 mb-4">
            <div className="p-1 rounded-lg bg-brand-500/10 dark:bg-brand-500/20 text-brand-500">
              <Sparkles className="w-4 h-4 animate-pulse text-amber-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Automation Hub</h3>
              <span className="text-[10px] text-slate-400">Optimization triggers ready</span>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-darkBg-950/60 border border-slate-100/50 dark:border-darkBg-850/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Workload Alert</span>
                <span className="text-[9px] text-slate-400">Priority</span>
              </div>
              <p className="text-[10.5px] text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                Sarah Connor has 5 active high-priority tasks. Consider routing backlog items to Marcus Wright.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-darkBg-950/60 border border-slate-100/50 dark:border-darkBg-850/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400">Idle Backlog Clean-up</span>
                <span className="text-[9px] text-slate-400">Review</span>
              </div>
              <p className="text-[10.5px] text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                3 development tasks are in 'Todo' for over 14 days. Launch AI Auto-Prioritizer?
              </p>
              <button 
                onClick={() => dispatch(toggleAiAssistant())}
                className="mt-2 text-[10px] font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1 hover:underline"
              >
                Launch Optimizer <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </Card>

      </div>

      {/* Bottom Grid: Recent Projects & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Compact Projects Progress List */}
        <Card className="lg:col-span-2 flex flex-col p-5 bg-white dark:bg-darkBg-900">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-darkBg-850 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Projects Tracker</h3>
              <span className="text-[10px] text-slate-400">Overview of active workspace initiatives</span>
            </div>
            <button 
              onClick={() => navigate('/projects')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-0.5"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {projects.slice(0, 3).map(p => (
              <div key={p.id} className="flex items-center justify-between gap-4 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-darkBg-850/30 transition-all border border-transparent">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{p.name}</h4>
                    <span className="text-[10px] text-slate-400 block truncate">{p.description}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{p.progress}%</span>
                    <span className="text-[9px] text-slate-400 block">{p.completedTasksCount}/{p.tasksCount} tasks</span>
                  </div>
                  <div className="w-16 h-1 bg-slate-100 dark:bg-darkBg-950 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${p.progress}%`, backgroundColor: p.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Real-time Collaboration Feed */}
        <Card className="flex flex-col p-5 bg-white dark:bg-darkBg-900">
          <div className="border-b border-slate-100 dark:border-darkBg-850 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Workspace Operations Log</h3>
            <span className="text-[10px] text-slate-400">Live system activity</span>
          </div>

          <div className="flex-1 space-y-3.5 overflow-y-auto max-h-56 pr-1">
            {recentActivities.map(act => (
              <div key={act.id} className="flex gap-2.5 text-[10.5px]">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                    {act.text}
                  </p>
                  <span className="text-[9px] text-slate-400 block mt-0.5">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  );
};

export default Dashboard;
