import React from 'react';
import { useSelector } from 'react-redux';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieIcon, 
  Activity, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

const Analytics = () => {
  const tasks = useSelector((state) => state.tasks.list);
  const projects = useSelector((state) => state.projects.list);
  const members = useSelector((state) => state.auth.members);

  // Compute workload distribution data (Tasks per member)
  const workloadData = members.map(m => {
    const activeTasks = tasks.filter(t => t.assignee === m.id && t.status !== 'Done');
    const compTasks = tasks.filter(t => t.assignee === m.id && t.status === 'Done');
    
    return {
      name: m.name.split(' ')[0],
      Active: activeTasks.length,
      Completed: compTasks.length,
    };
  });

  // Compute priority breakdown data
  const highPriorityCount = tasks.filter(t => t.priority === 'High').length;
  const mediumPriorityCount = tasks.filter(t => t.priority === 'Medium').length;
  const lowPriorityCount = tasks.filter(t => t.priority === 'Low').length;

  const priorityData = [
    { name: 'High Priority', value: highPriorityCount },
    { name: 'Medium Priority', value: mediumPriorityCount },
    { name: 'Low Priority', value: lowPriorityCount },
  ].filter(p => p.value > 0);

  // Productivity burn-up velocity mock history
  const productivityHistory = [
    { week: 'Wk 1', rate: 12 },
    { week: 'Wk 2', rate: 18 },
    { week: 'Wk 3', rate: 15 },
    { week: 'Wk 4', rate: 24 },
    { week: 'Wk 5', rate: 28 },
    { week: 'Wk 6', rate: 32 },
  ];

  return (
    <div className="space-y-6 select-none text-xs">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Workspace Intelligence & Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Perform live audits on resource workloads, task velocities, and delivery burndowns.
        </p>
      </div>

      {/* Stats Summary Panel grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <Card className="flex items-center gap-3.5 p-4.5 bg-white dark:bg-darkBg-900">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100/10">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Velocity</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 block">24.5 tasks/wk</span>
            <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">▲ +12% from last month</span>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5 p-4.5 bg-white dark:bg-darkBg-900">
          <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 border border-brand-100/10">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Utilization</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 block">87.2% capacity</span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Optimized workload active</span>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5 p-4.5 bg-white dark:bg-darkBg-900">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100/10">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">High Priority Load</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 block">{highPriorityCount} issues</span>
            <span className="text-[9px] text-amber-600 dark:text-amber-400 block mt-0.5">Requires immediate attention</span>
          </div>
        </Card>

      </div>

      {/* Main Charts Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Workload Allocation */}
        <Card className="flex flex-col p-5 bg-white dark:bg-darkBg-900">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3.5 mb-4">
            <BarChart3 className="w-4 h-4 text-brand-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Team Workload Distribution</h3>
              <span className="text-[10px] text-slate-400">Comparing active tasks versus successfully completed tasks</span>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
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
                <Legend iconSize={10} fontSize={10} />
                <Bar dataKey="Active" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Task Burndown Velocity */}
        <Card className="flex flex-col p-5 bg-white dark:bg-darkBg-900">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3.5 mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Workspace Delivery Velocity</h3>
              <span className="text-[10px] text-slate-400">Cumulative burnup rate across weekly intervals</span>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productivityHistory} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1f2c" strokeOpacity={0.05} />
                <XAxis dataKey="week" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
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
                <Line type="monotone" dataKey="rate" name="Task Output" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

      {/* Bottom Priority Analysis Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pie chart representing Priority Shares */}
        <Card className="flex flex-col p-5 bg-white dark:bg-darkBg-900">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3.5 mb-4">
            <PieIcon className="w-4 h-4 text-indigo-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Backlog Priority Allocation</h3>
              <span className="text-[10px] text-slate-400">Ratio of priority levels</span>
            </div>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            {priorityData.length === 0 ? (
              <div className="text-[11px] text-slate-400">No active priority data.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 19, 26, 0.9)', 
                      borderColor: 'rgba(37, 43, 61, 0.5)', 
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#fff'
                    }} 
                  />
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          
          <div className="flex justify-center gap-4 mt-2">
            {priorityData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1.5 text-[9.5px] font-bold text-slate-600 dark:text-slate-400">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span>{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Dynamic Project Performance Ratings Card */}
        <Card className="lg:col-span-2 flex flex-col p-5 bg-white dark:bg-darkBg-900">
          <div className="border-b border-slate-100 dark:border-darkBg-850 pb-3.5 mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Project Performance Benchmarking</h3>
            <span className="text-[10px] text-slate-400">SLA compliance rate and productivity scores</span>
          </div>

          <div className="space-y-4">
            {projects.map(p => {
              const complianceRate = p.progress >= 90 ? 'High Compliance' : p.progress >= 60 ? 'Optimal Velocity' : 'Low Velocity';
              const badgeType = p.progress >= 90 ? 'success' : p.progress >= 60 ? 'brand' : 'warning';
              
              return (
                <div key={p.id} className="flex items-center justify-between gap-4 p-1.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={badgeType} className="text-[9px] py-0 px-2 font-bold uppercase">{complianceRate}</Badge>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{p.progress}% SLA</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

      </div>

    </div>
  );
};

export default Analytics;
