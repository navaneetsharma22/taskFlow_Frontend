import React from 'react';
import { useSelector } from 'react-redux';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Users,
  Compass
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

const Analytics = () => {
  const tasks = useSelector((state) => state.tasks.list);
  const projects = useSelector((state) => state.projects.list);
  const members = useSelector((state) => state.auth.members);

  // 1. Task Completion Timeline Mock
  const taskCompletionHistory = [
    { week: 'Wk 1', completed: 18, backlog: 45 },
    { week: 'Wk 2', completed: 26, backlog: 38 },
    { week: 'Wk 3', completed: 35, backlog: 30 },
    { week: 'Wk 4', completed: 48, backlog: 25 },
    { week: 'Wk 5', completed: 58, backlog: 18 },
    { week: 'Wk 6', completed: 72, backlog: 12 },
  ];

  // 2. Department Performance Distribution
  const departmentPerformanceData = [
    { name: 'Engineering', Completed: 85, active: 40 },
    { name: 'Product', Completed: 62, active: 18 },
    { name: 'Design', Completed: 48, active: 22 },
    { name: 'Marketing', Completed: 35, active: 12 },
  ];

  // 3. AI Co-Pilot Token Usage Data
  const aiUsageHistory = [
    { day: 'Mon', tokens: 180, latency: 240 },
    { day: 'Tue', tokens: 320, latency: 180 },
    { day: 'Wed', tokens: 420, latency: 190 },
    { day: 'Thu', tokens: 280, latency: 210 },
    { day: 'Fri', tokens: 490, latency: 150 },
    { day: 'Sat', tokens: 150, latency: 290 },
    { day: 'Sun', tokens: 120, latency: 310 },
  ];

  // 4. Organization Activity Levels
  const orgActivityHistory = [
    { day: '14 May', events: 140 },
    { day: '15 May', events: 210 },
    { day: '16 May', events: 180 },
    { day: '17 May', events: 320 },
    { day: '18 May', events: 290 },
    { day: '19 May', events: 450 },
    { day: '20 May', events: 510 },
  ];

  return (
    <div className="space-y-6 select-none text-xs">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-500" />
            SaaS BI Analytics & Intelligence
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Leverage enterprise charts, audit latency trails, and govern workspace activities.
          </p>
        </div>
      </div>

      {/* Top compact indicator cards (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Completed sprints */}
        <Card className="flex items-center gap-3.5 p-4 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100/10">
            <CheckCircle2 className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Task Sprints Resolved</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 block">
              184 Sprints Done
            </span>
            <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">▲ +14% compared to last cycle</span>
          </div>
        </Card>

        {/* Card 2: SLA rate */}
        <Card className="flex items-center gap-3.5 p-4 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
          <div className="p-2 rounded-xl bg-brand-50 text-brand-650 dark:bg-brand-950/40 dark:text-brand-400 border border-brand-100/10">
            <TrendingUp className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SLA Delivery Velocity</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 block">
              94.2% SLA Match
            </span>
            <span className="text-[9px] text-brand-500 font-bold block mt-0.5">▲ Optimal sprint response rate</span>
          </div>
        </Card>

        {/* Card 3: AI Saved hours */}
        <Card className="flex items-center gap-3.5 p-4 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100/10">
            <Sparkles className="w-4.5 h-4.5 text-amber-500" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AI Agent Efficiency</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 block">
              3.4 hrs saved/wk
            </span>
            <span className="text-[9px] text-amber-650 dark:text-amber-400 block mt-0.5">Prompt automation optimized</span>
          </div>
        </Card>

        {/* Card 4: Resource load */}
        <Card className="flex items-center gap-3.5 p-4 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-100/10">
            <Users className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Workspace Capacity</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 block">
              87% Allocated
            </span>
            <span className="text-[9px] text-slate-400 block mt-0.5">4 active team developers</span>
          </div>
        </Card>

      </div>

      {/* Charts Display grid layout (2 Columns Matrix) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Task Completion Timeline (AreaChart) */}
        <Card className="flex flex-col p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-darkBg-850 pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Task Completion Burndown</h3>
                <span className="text-[10px] text-slate-400">Chronological view of solved tasks versus active backlog</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={taskCompletionHistory} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.01}/>
                  </linearGradient>
                  <linearGradient id="colorBacklog" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1f2c" strokeOpacity={0.05} />
                <XAxis dataKey="week" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 19, 26, 0.95)', 
                    borderColor: 'rgba(37, 43, 61, 0.5)', 
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff'
                  }} 
                />
                <Legend iconSize={8} fontSize={10} />
                <Area type="monotone" dataKey="completed" name="Completed" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" />
                <Area type="monotone" dataKey="backlog" name="Backlog" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorBacklog)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Department Performance (BarChart) */}
        <Card className="flex flex-col p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-darkBg-850 pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Department Output Velocity</h3>
                <span className="text-[10px] text-slate-400">Total sprints completed and active backlog loads per workspace team</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentPerformanceData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1f2c" strokeOpacity={0.05} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 19, 26, 0.95)', 
                    borderColor: 'rgba(37, 43, 61, 0.5)', 
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff'
                  }} 
                />
                <Legend iconSize={8} fontSize={10} />
                <Bar dataKey="Completed" name="Sprints Finished" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="active" name="Active Loads" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 3: AI Co-Pilot Token Usage (AreaChart) */}
        <Card className="flex flex-col p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-darkBg-850 pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Agent Prompt Allocation</h3>
                <span className="text-[10px] text-slate-400">Tokens consumed vs response speed latency ratios</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aiUsageHistory} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1f2c" strokeOpacity={0.05} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 19, 26, 0.95)', 
                    borderColor: 'rgba(37, 43, 61, 0.5)', 
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff'
                  }} 
                />
                <Legend iconSize={8} fontSize={10} />
                <Area type="monotone" dataKey="tokens" name="AI Tokens (K)" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorTokens)" />
                <Area type="monotone" dataKey="latency" name="Latency (ms)" stroke="#8b5cf6" strokeWidth={1.5} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 4: Organization Activity Matrix (LineChart) */}
        <Card className="flex flex-col p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-darkBg-850 pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-500 animate-pulse" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Workspace Roster Activity</h3>
                <span className="text-[10px] text-slate-400">Total day-to-day workspace updates, card slides, and logs recorded</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={orgActivityHistory} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1f2c" strokeOpacity={0.05} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 19, 26, 0.95)', 
                    borderColor: 'rgba(37, 43, 61, 0.5)', 
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff'
                  }} 
                />
                <Legend iconSize={8} fontSize={10} />
                <Line type="monotone" dataKey="events" name="Total Actions Logged" stroke="#a78bfa" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

    </div>
  );
};

export default Analytics;
