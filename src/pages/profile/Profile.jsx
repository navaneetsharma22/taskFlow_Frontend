import React from 'react';
import { useSelector } from 'react-redux';
import { User, Mail, ShieldAlert, Award, Calendar, CheckSquare } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const tasks = useSelector((state) => state.tasks.list);
  const organization = useSelector((state) => state.auth.organization);

  const myTasks = tasks.filter(t => t.assignee === user?.id);
  const compCount = myTasks.filter(t => t.status === 'Done').length;
  const pendCount = myTasks.filter(t => t.status !== 'Done').length;

  return (
    <div className="space-y-6 text-xs select-none">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          My Account Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review personal metrics, system role configurations, and assigned task items.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card Inspector */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5 bg-white dark:bg-darkBg-900 flex flex-col items-center text-center">
            <img 
              src={user?.avatar} 
              alt={user?.name} 
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-lg mb-4"
            />
            
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">{user?.name}</h3>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{user?.email}</span>
            
            <div className="flex items-center gap-1.5 mt-3">
              <Badge variant="brand" className="text-[10px] uppercase font-bold py-0.5 px-2.5">
                {user?.role} Role
              </Badge>
              <Badge variant="success" className="text-[10px] uppercase font-bold py-0.5 px-2.5">
                MFA Active
              </Badge>
            </div>

            <div className="w-full border-t border-slate-50 dark:border-darkBg-850/80 mt-5 pt-5 text-left space-y-3">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Award className="w-4 h-4 text-slate-400" />
                <span>Tenant: {organization?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Registered: May 2026</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Task Allocations inspector */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-white dark:bg-darkBg-900 flex flex-col justify-between h-24">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Tasks Completed</span>
              <span className="text-2xl font-black text-emerald-500 block mt-1">{compCount} Done</span>
              <span className="text-[9px] text-slate-400 mt-1 block">Excellent productivity output!</span>
            </Card>

            <Card className="p-4 bg-white dark:bg-darkBg-900 flex flex-col justify-between h-24">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Backlog Items</span>
              <span className="text-2xl font-black text-brand-500 block mt-1">{pendCount} Tasks</span>
              <span className="text-[9px] text-slate-400 mt-1 block">Requires delivery focus</span>
            </Card>
          </div>

          <Card className="p-5 bg-white dark:bg-darkBg-900">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3 mb-4">
              <CheckSquare className="w-4 h-4 text-brand-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Assignments</h3>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {myTasks.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                  No active tasks assigned to your account roster.
                </div>
              ) : (
                myTasks.map(t => {
                  const isDone = t.status === 'Done';
                  return (
                    <div key={t.id} className="flex items-center justify-between gap-4 p-2 rounded-xl bg-slate-50 dark:bg-darkBg-950/40 border border-slate-150/10 hover:border-slate-200 transition-all">
                      <div className="min-w-0">
                        <span className={`font-bold block truncate ${isDone ? 'line-through text-slate-450' : 'text-slate-800 dark:text-slate-200'}`}>
                          {t.title}
                        </span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">Due: {t.dueDate}</span>
                      </div>
                      <Badge variant={isDone ? 'success' : 'brand'} className="text-[9.5px] uppercase font-bold shrink-0">
                        {t.status}
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};

export default Profile;
