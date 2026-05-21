import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Zap, 
  Cpu, 
  Play, 
  Trash2, 
  Plus, 
  CornerDownRight, 
  ToggleRight, 
  ToggleLeft,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { addNotification } from '../../redux/slices/notificationSlice';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Automation = () => {
  const dispatch = useDispatch();

  const [rules, setRules] = useState([
    { id: 'rule-1', trigger: 'Task Status Updated', action: 'Notify Assignee via Email', status: 'active', executions: 42 },
    { id: 'rule-2', trigger: 'Task Moved to "Review"', action: 'Inject Slack Channel Alert', status: 'active', executions: 18 },
    { id: 'rule-3', trigger: 'Project Due Date Approaching', action: 'Create High-Priority Warning Task', status: 'disabled', executions: 0 }
  ]);

  const [webhookUrl, setWebhookUrl] = useState('');
  const [triggerEvent, setTriggerEvent] = useState('task_created');

  const handleToggleRule = (ruleId) => {
    setRules(prev => prev.map(r => {
      if (r.id === ruleId) {
        const nextStatus = r.status === 'active' ? 'disabled' : 'active';
        dispatch(addNotification({
          title: 'Automation Rule Toggled',
          description: `Rule "${r.trigger}" is now ${nextStatus}.`,
          type: 'system'
        }));
        return { ...r, status: nextStatus };
      }
      return r;
    }));
  };

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!webhookUrl.trim()) return;

    dispatch(addNotification({
      title: 'Webhook Registered',
      description: `Dispatched webhook trigger payload sync to ${webhookUrl}`,
      type: 'user'
    }));

    setWebhookUrl('');
  };

  return (
    <div className="space-y-6 text-xs select-none">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-brand-500" />
          Workflow Automation Engine
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Construct event-driven triggers, outbound webhooks, and AI task routers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Automation Rules list */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-darkBg-850 pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Trigger Rules</h3>
              </div>
              <Badge variant="brand" className="text-[10px]">
                {rules.filter(r => r.status === 'active').length} Active
              </Badge>
            </div>

            <div className="space-y-4">
              {rules.map(rule => (
                <div 
                  key={rule.id} 
                  className="p-3.5 rounded-16 bg-slate-50 dark:bg-darkBg-950/40 border border-slate-100/50 dark:border-darkBg-850/50 flex items-start justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="gray" className="text-[9.5px] uppercase font-bold py-0.5">Trigger</Badge>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{rule.trigger}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-450 pl-2">
                      <CornerDownRight className="w-3.5 h-3.5" />
                      <Badge variant="brand" className="text-[9.5px] uppercase font-bold py-0.5">Action</Badge>
                      <span className="font-semibold text-slate-705 dark:text-slate-300">{rule.action}</span>
                    </div>

                    <div className="text-[9px] text-slate-400 pl-8 font-semibold">
                      📊 Executed {rule.executions} times since deployment
                    </div>
                  </div>

                  {/* Toggle Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => handleToggleRule(rule.id)}
                      className="text-slate-400 hover:text-brand-500 transition-colors"
                      title={rule.status === 'active' ? 'Disable Rule' : 'Enable Rule'}
                    >
                      {rule.status === 'active' ? (
                        <ToggleRight className="w-8 h-8 text-brand-500" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-400" />
                      )}
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Webhook Registry */}
        <div className="lg:col-span-1">
          <Card className="p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3.5 mb-4">
              <RefreshCw className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Webhook Endpoint Sync</h3>
            </div>

            <form onSubmit={handleAddRule} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
                  Trigger Event
                </label>
                <select
                  value={triggerEvent}
                  onChange={(e) => setTriggerEvent(e.target.value)}
                  className="w-full bg-white dark:bg-darkBg-900 border border-slate-200 focus:border-brand-500 dark:border-darkBg-880 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-100 transition-all duration-200"
                >
                  <option value="task_created">When Task Asset is Created</option>
                  <option value="task_completed">When Task is Marked Done</option>
                  <option value="member_joined">When Member Joins Tenant</option>
                </select>
              </div>

              <Input
                label="Destination Endpoint URL"
                id="webhookUrl"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hooks.slack.com/services/..."
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="w-full font-bold"
              >
                Register Event Stream
              </Button>
            </form>
          </Card>
        </div>

      </div>

    </div>
  );
};

export default Automation;
