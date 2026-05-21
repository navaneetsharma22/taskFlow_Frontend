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
  Clock,
  AlertCircle,
  Bell,
  CheckCircle,
  HelpCircle,
  Sliders,
  ChevronRight,
  Database,
  Terminal,
  Share2
} from 'lucide-react';
import { addNotification } from '../../redux/slices/notificationSlice';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Automation = () => {
  const dispatch = useDispatch();

  // Active Flow Nodes configuration
  const [selectedNode, setSelectedNode] = useState('trigger'); // 'trigger' | 'condition' | 'action'
  
  // Custom Flow variables
  const [triggerDeadline, setTriggerDeadline] = useState(24); // Hours
  const [conditionStatus, setConditionStatus] = useState('Pending');
  const [actionDestination, setActionDestination] = useState('In-App Notification');
  const [recipientRole, setRecipientRole] = useState('Assignee Developer');

  // Rules lists
  const [rules, setRules] = useState([
    { id: 'rule-1', name: 'SLA Escalation Alert', trigger: 'Deadline < 24 hrs', condition: 'Status Pending', action: 'Notify Assignee', status: 'active', executions: 142 },
    { id: 'rule-2', name: 'Slack QA Pipeline', trigger: 'Status Review', condition: 'Priority High', action: 'Slack Message', status: 'active', executions: 58 },
    { id: 'rule-3', name: 'Wipe Cache Trigger', trigger: 'Status Done', condition: 'None', action: 'Trigger Endpoint Webhook', status: 'disabled', executions: 0 }
  ]);

  // Simulator state variables
  const [simulationLogs, setSimulationLogs] = useState([
    'System ready. Press "Test Flow Pipeline" to trigger a dry run audit.'
  ]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Toggle rule status
  const handleToggleRule = (ruleId, name) => {
    setRules(prev => prev.map(r => {
      if (r.id === ruleId) {
        const nextStatus = r.status === 'active' ? 'disabled' : 'active';
        dispatch(addNotification({
          title: 'Automation Swapped',
          description: `Rule "${name}" is now ${nextStatus}.`,
          type: 'system'
        }));
        return { ...r, status: nextStatus };
      }
      return r;
    }));
  };

  // Run virtual flow simulation
  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationLogs(['Initializing local SLA workflow trigger validation...']);

    setTimeout(() => {
      setSimulationLogs(prev => [
        ...prev,
        `[09:12:01] ⏱️ Evaluating task database deadlines...`,
        `[09:12:02] 🔔 Hit Trigger node: 1 task detected with Deadline < ${triggerDeadline} Hours.`
      ]);
    }, 600);

    setTimeout(() => {
      setSimulationLogs(prev => [
        ...prev,
        `[09:12:03] 🔍 Hit Operator node: Checking status for 'Setup JWT Rotation'...`,
        `[09:12:04] ✅ Operator matched: Task status is '${conditionStatus}'.`
      ]);
    }, 1200);

    setTimeout(() => {
      setSimulationLogs(prev => [
        ...prev,
        `[09:12:05] 🚀 Executing Action node: Dispatching '${actionDestination}'...`,
        `[09:12:06] 📧 Target delivery verified: Sent to ${recipientRole}.`,
        `[09:12:07] 🎉 Automation run completed successfully. (SLA compliance active)`
      ]);
      setIsSimulating(false);

      dispatch(addNotification({
        title: 'Simulation Verified',
        description: 'Dry run parsed 3 automation nodes with zero warnings.',
        type: 'success'
      }));
    }, 2000);
  };

  return (
    <div className="space-y-6 text-xs select-none">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-500" />
            Workspace Automation Builder
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Construct logic flows with native IF-AND-THEN pipelines and trace live executions.
          </p>
        </div>
      </div>

      {/* Top statistics summary bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-950/30 border border-amber-100/10">
            <Zap className="w-4.5 h-4.5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Trigger Rules Run</span>
            <span className="text-base font-extrabold text-slate-905 dark:text-white block mt-0.5">200 Executions</span>
            <span className="text-[9px] text-emerald-500 font-bold block">100% Success Velocity</span>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-500 dark:bg-emerald-950/30 border border-emerald-100/10">
            <CheckCircle className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Engine Response Rate</span>
            <span className="text-base font-extrabold text-slate-905 dark:text-white block mt-0.5">48ms Avg Latency</span>
            <span className="text-[9px] text-slate-400 block">Fast event-driven listener</span>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-500 dark:bg-purple-950/30 border border-purple-100/10">
            <Share2 className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Outbound Webhooks</span>
            <span className="text-base font-extrabold text-slate-905 dark:text-white block mt-0.5">3 Active Streams</span>
            <span className="text-[9px] text-purple-500 font-bold block">Slack & Discord connected</span>
          </div>
        </Card>
      </div>

      {/* Main Flow Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visual Canvas Block (IF-AND-THEN connector) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 relative min-h-[480px] flex flex-col justify-between">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-darkBg-850 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Rule Node Canvas</h3>
                <span className="text-[10px] text-slate-400">Click individual boxes to configure node parameters</span>
              </div>
              <Button
                variant="brand"
                size="sm"
                onClick={runSimulation}
                disabled={isSimulating}
                icon={<Play className="w-3.5 h-3.5" />}
                className="font-bold"
              >
                {isSimulating ? 'Processing...' : 'Test Flow Pipeline'}
              </Button>
            </div>

            {/* FLOW CANVAS DISPLAY */}
            <div className="flex-1 py-10 flex flex-col items-center justify-center space-y-8 relative">
              
              {/* Animated connector vertical pipeline line */}
              <div className="absolute top-16 bottom-16 w-0.5 bg-gradient-to-b from-amber-500 via-brand-500 to-emerald-500 z-0 opacity-40 dark:opacity-60" />

              {/* Node 1: TRIGGER (IF) */}
              <div 
                onClick={() => setSelectedNode('trigger')}
                className={`
                  w-72 p-4 rounded-16 border z-10 cursor-pointer transition-all shadow-sm
                  ${selectedNode === 'trigger'
                    ? 'bg-amber-50/40 border-amber-300 dark:bg-amber-950/20 dark:border-amber-900 ring-2 ring-amber-500/20 scale-105' 
                    : 'bg-white dark:bg-darkBg-950 border-slate-150 dark:border-darkBg-850 hover:border-amber-400'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[10px] text-amber-600 dark:text-amber-400 uppercase tracking-widest">IF</span>
                    <Badge variant="warning" className="text-[8px] font-bold uppercase py-0.5">Trigger Node</Badge>
                  </div>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">SLA Due Deadline Approaching</h4>
                  <p className="text-[10px] text-slate-400">Target expiration: <span className="font-bold text-amber-500">&lt; {triggerDeadline} Hours</span></p>
                </div>
              </div>

              {/* Node 2: OPERATOR (AND) */}
              <div 
                onClick={() => setSelectedNode('condition')}
                className={`
                  w-72 p-4 rounded-16 border z-10 cursor-pointer transition-all shadow-sm
                  ${selectedNode === 'condition'
                    ? 'bg-brand-50/40 border-brand-305 dark:bg-brand-950/20 dark:border-brand-900 ring-2 ring-brand-500/20 scale-105' 
                    : 'bg-white dark:bg-darkBg-950 border-slate-150 dark:border-darkBg-850 hover:border-brand-405'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[10px] text-brand-500 dark:text-brand-400 uppercase tracking-widest">AND</span>
                    <Badge variant="brand" className="text-[8px] font-bold uppercase py-0.5">Condition Node</Badge>
                  </div>
                  <Sliders className="w-4 h-4 text-brand-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">Status Verification</h4>
                  <p className="text-[10px] text-slate-400">Current task status: <span className="font-bold text-brand-500">{conditionStatus}</span></p>
                </div>
              </div>

              {/* Node 3: ACTION (THEN) */}
              <div 
                onClick={() => setSelectedNode('action')}
                className={`
                  w-72 p-4 rounded-16 border z-10 cursor-pointer transition-all shadow-sm
                  ${selectedNode === 'action'
                    ? 'bg-emerald-50/40 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-900 ring-2 ring-emerald-500/20 scale-105' 
                    : 'bg-white dark:bg-darkBg-950 border-slate-150 dark:border-darkBg-850 hover:border-emerald-400'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">THEN</span>
                    <Badge variant="success" className="text-[8px] font-bold uppercase py-0.5">Action Node</Badge>
                  </div>
                  <Bell className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">Outbound Alerts</h4>
                  <p className="text-[10px] text-slate-400">Action: <span className="font-bold text-emerald-500">{actionDestination}</span></p>
                  <p className="text-[9.5px] text-slate-400 font-medium">To: {recipientRole}</p>
                </div>
              </div>

            </div>

            {/* Live Terminal logs output */}
            <div className="border-t border-slate-100 dark:border-darkBg-850 pt-4 mt-4">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold mb-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                <span>Simulation Sandbox Logs</span>
              </div>
              
              <div className="bg-slate-50 dark:bg-darkBg-950 border border-slate-150/10 rounded-xl p-3.5 h-28 overflow-y-auto space-y-1 font-mono text-[10px] text-slate-600 dark:text-slate-400">
                {simulationLogs.map((log, lIdx) => (
                  <div key={lIdx} className="leading-relaxed">{log}</div>
                ))}
              </div>
            </div>

          </Card>
        </div>

        {/* Right side: Parameters configuration panel */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Node parameter configuration card */}
          <Card className="p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
            <div className="border-b border-slate-100 dark:border-darkBg-850 pb-3.5 mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sliders className="w-4.5 h-4.5 text-brand-500" />
                Node Properties Editor
              </h3>
              <span className="text-[10px] text-slate-400">Editing properties for active node</span>
            </div>

            {selectedNode === 'trigger' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-100/50 dark:bg-amber-950/20 dark:border-amber-900/30 text-slate-800 dark:text-slate-200">
                  <span className="font-bold block mb-1">IF (Trigger) Node</span>
                  Configure deadline intervals to trigger downstream actions.
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    SLA Deadline Cap (Hours)
                  </label>
                  <select
                    value={triggerDeadline}
                    onChange={(e) => setTriggerDeadline(Number(e.target.value))}
                    className="w-full bg-white dark:bg-darkBg-900 border border-slate-200 focus:border-brand-500 dark:border-darkBg-880 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-100 transition-all duration-200"
                  >
                    <option value={12}>12 Hours</option>
                    <option value={24}>24 Hours</option>
                    <option value={48}>48 Hours</option>
                    <option value={72}>72 Hours</option>
                  </select>
                </div>
              </div>
            )}

            {selectedNode === 'condition' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-3.5 rounded-xl bg-brand-50/40 border border-brand-100/50 dark:bg-brand-950/20 dark:border-brand-900/30 text-slate-800 dark:text-slate-200">
                  <span className="font-bold block mb-1">AND (Operator) Node</span>
                  Narrow the rule scope to matching sprint stage parameters.
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Sprint Stage Match
                  </label>
                  <select
                    value={conditionStatus}
                    onChange={(e) => setConditionStatus(e.target.value)}
                    className="w-full bg-white dark:bg-darkBg-900 border border-slate-200 focus:border-brand-500 dark:border-darkBg-880 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-100 transition-all duration-200"
                  >
                    <option value="Pending">Pending / Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>
            )}

            {selectedNode === 'action' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100/50 dark:bg-emerald-950/20 dark:border-emerald-900/30 text-slate-800 dark:text-slate-200">
                  <span className="font-bold block mb-1">THEN (Action) Node</span>
                  Configure alert delivery targets and channel destinations.
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Outbound Alerts Type
                  </label>
                  <select
                    value={actionDestination}
                    onChange={(e) => setActionDestination(e.target.value)}
                    className="w-full bg-white dark:bg-darkBg-900 border border-slate-200 focus:border-brand-500 dark:border-darkBg-880 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-100 transition-all duration-200"
                  >
                    <option value="In-App Notification">In-App Drawer Notification</option>
                    <option value="Slack Direct Alert">Post slack channel alert webhook</option>
                    <option value="SMTP Server Email">SMTP Server Alert Notification</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Target Recipient Role
                  </label>
                  <select
                    value={recipientRole}
                    onChange={(e) => setRecipientRole(e.target.value)}
                    className="w-full bg-white dark:bg-darkBg-900 border border-slate-200 focus:border-brand-500 dark:border-darkBg-880 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-100 transition-all duration-200"
                  >
                    <option value="Assignee Developer">Assignee Developer</option>
                    <option value="Project Lead Administrator">Project Lead Administrator</option>
                    <option value="All Workspace Members">All Workspace Members</option>
                  </select>
                </div>
              </div>
            )}

          </Card>

          {/* Workflow triggers rules index overview list */}
          <Card className="p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-darkBg-850 pb-3 mb-3">
              <span className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-[10px]">Saved Rule Backlogs</span>
              <Badge variant="brand" className="text-[8.5px] py-0 px-2 font-bold shrink-0">
                {rules.length} total
              </Badge>
            </div>

            <div className="space-y-3">
              {rules.map(r => (
                <div key={r.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-darkBg-950/40 border border-slate-150/10 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">{r.name}</span>
                    <span className="text-[9px] text-slate-400 block truncate">Executed {r.executions} runs</span>
                  </div>
                  <button 
                    onClick={() => handleToggleRule(r.id, r.name)}
                    className="shrink-0"
                  >
                    {r.status === 'active' ? (
                      <ToggleRight className="w-7 h-7 text-brand-500" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};

export default Automation;
