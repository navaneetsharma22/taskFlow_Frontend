import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Building2, 
  Users, 
  Sparkles, 
  Database, 
  Edit3, 
  AlertTriangle, 
  Trash2, 
  CheckCircle,
  Plus,
  BarChart3,
  TrendingUp,
  Settings,
  HelpCircle,
  Info,
  X,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { addNotification } from '../../redux/slices/notificationSlice';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

const SuperAdmin = () => {
  const dispatch = useDispatch();

  // Primary organizations state data
  const [organizations, setOrganizations] = useState([
    { id: 'org-1', name: 'Bitmax Technology', code: 'AX-4232600', subscription: 'Premium', users: 154, status: 'Active' },
    { id: 'org-2', name: 'Cyberdyne Systems', code: 'CYB-DX9-2026', subscription: 'Enterprise', users: 84, status: 'Active' },
    { id: 'org-3', name: 'Tyrell Corporation', code: 'TYR-NX6-2026', subscription: 'Premium', users: 120, status: 'Active' },
    { id: 'org-4', name: 'Weyland-Yutani Corp', code: 'WEY-2049-SEC', subscription: 'Basic', users: 32, status: 'Suspended' },
    { id: 'org-5', name: 'Yoyodyne Propulsion', code: 'YOY-9988-ENG', subscription: 'Enterprise', users: 210, status: 'Active' }
  ]);

  // Modals controller states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEditOrg, setCurrentEditOrg] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form parameters
  const [editName, setEditName] = useState('');
  const [editSubscription, setEditSubscription] = useState('Premium');
  const [editUsers, setEditUsers] = useState(0);
  const [editStatus, setEditStatus] = useState('Active');

  const [newName, setNewName] = useState('');
  const [newSubscription, setNewSubscription] = useState('Premium');
  const [newUsers, setNewUsers] = useState(10);

  // Compute live KPIs based on active state rows
  const totalOrganizationsCount = organizations.length;
  const totalUsersSum = organizations.reduce((acc, curr) => acc + curr.users, 0);
  const aiUsageMockValue = '4.2M Tokens';
  const storageAllocatedMock = '84.2 GB / 250 GB';

  // Toggle Suspend Action
  const handleToggleSuspend = (orgId) => {
    setOrganizations(prev => prev.map(org => {
      if (org.id === orgId) {
        const nextStatus = org.status === 'Active' ? 'Suspended' : 'Active';
        dispatch(addNotification({
          title: 'Organization Status Toggled',
          description: `Organization "${org.name}" status changed to ${nextStatus}.`,
          type: 'system'
        }));
        return { ...org, status: nextStatus };
      }
      return org;
    }));
  };

  // Delete Action
  const handleDeleteOrg = (orgId, orgName) => {
    setOrganizations(prev => prev.filter(org => org.id !== orgId));
    dispatch(addNotification({
      title: 'Tenant Workspace Terminated',
      description: `Tenant workspace "${orgName}" has been successfully decommissioned.`,
      type: 'danger'
    }));
  };

  // Open Edit Modal
  const handleOpenEdit = (org) => {
    setCurrentEditOrg(org);
    setEditName(org.name);
    setEditSubscription(org.subscription);
    setEditUsers(org.users);
    setEditStatus(org.status);
    setEditModalOpen(true);
  };

  // Save Edit Changes
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    setOrganizations(prev => prev.map(org => {
      if (org.id === currentEditOrg.id) {
        return {
          ...org,
          name: editName,
          subscription: editSubscription,
          users: Number(editUsers),
          status: editStatus
        };
      }
      return org;
    }));

    dispatch(addNotification({
      title: 'Workspace Configuration Saved',
      description: `Settings updated for "${editName}".`,
      type: 'system'
    }));

    setEditModalOpen(false);
  };

  // Create New Org
  const handleCreateOrg = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const randomSuffix = Math.floor(1000000 + Math.random() * 9000000);
    const newCode = `AX-${randomSuffix}`;

    const newOrg = {
      id: `org-${Date.now()}`,
      name: newName,
      code: newCode,
      subscription: newSubscription,
      users: Number(newUsers),
      status: 'Active'
    };

    setOrganizations(prev => [...prev, newOrg]);

    dispatch(addNotification({
      title: 'New Tenant Spawned',
      description: `Registered "${newName}" successfully under code ${newCode}.`,
      type: 'user'
    }));

    setNewName('');
    setNewUsers(10);
    setCreateModalOpen(false);
  };

  // Recharts Growth Analytics Mock data
  const growthTrendHistory = [
    { week: 'Wk 1', Tenants: 2 },
    { week: 'Wk 2', Tenants: 3 },
    { week: 'Wk 3', Tenants: 3 },
    { week: 'Wk 4', Tenants: 4 },
    { week: 'Wk 5', Tenants: 5 },
    { week: 'Wk 6', Tenants: totalOrganizationsCount },
  ];

  // Recharts Subscription mix allocation data
  const basicCount = organizations.filter(o => o.subscription === 'Basic').length;
  const premiumCount = organizations.filter(o => o.subscription === 'Premium').length;
  const enterpriseCount = organizations.filter(o => o.subscription === 'Enterprise').length;

  const subscriptionPieData = [
    { name: 'Basic Tier', value: basicCount },
    { name: 'Premium Tier', value: premiumCount },
    { name: 'Enterprise Tier', value: enterpriseCount }
  ].filter(p => p.value > 0);

  const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981'];

  return (
    <div className="space-y-6 text-xs select-none">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-500 animate-spin-slow" />
            Super Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global management portal: monitor multi-tenant scales, subscriptions, database capacity, and security.
          </p>
        </div>
        <Button 
          variant="primary" 
          size="sm"
          className="font-bold flex items-center gap-1 shrink-0"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Provision Tenant
        </Button>
      </div>

      {/* KPI Cards Grid (Compact visual tokens as requested) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Organizations count Card */}
        <Card className="p-4 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 flex items-center gap-3.5">
          <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 border border-brand-100/10">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Tenants</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5 block">
              {totalOrganizationsCount} Workspaces
            </span>
            <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">▲ Live synchronization active</span>
          </div>
        </Card>

        {/* Users sum Card */}
        <Card className="p-4 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 flex items-center gap-3.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100/10">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Aggregated Accounts</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5 block">
              {totalUsersSum} Users
            </span>
            <span className="text-[9px] text-slate-450 mt-0.5 block">Across all active workspaces</span>
          </div>
        </Card>

        {/* AI tokens Card */}
        <Card className="p-4 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 flex items-center gap-3.5">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-100/10">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AI Token Usage</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5 block">
              {aiUsageMockValue}
            </span>
            <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">▲ 92% SLA request efficacy</span>
          </div>
        </Card>

        {/* Storage capacity Card */}
        <Card className="p-4 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 flex items-center gap-3.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100/10">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Storage Space</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5 block">
              {storageAllocatedMock}
            </span>
            <div className="h-1.5 w-24 bg-slate-150 dark:bg-darkBg-800 rounded-full overflow-hidden mt-1">
              <div className="h-full w-[33.6%] bg-amber-500 rounded-full" />
            </div>
          </div>
        </Card>

      </div>

      {/* Roster Administration Table (conforming to requested structure) */}
      <Card className="p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3.5 mb-4">
          <Building2 className="w-4 h-4 text-brand-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Registered Multi-Tenants Directory</h3>
            <span className="text-[10px] text-slate-400">Suspend, terminate, or edit subscription tiers in real time.</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-darkBg-850 text-slate-400 uppercase tracking-wider font-extrabold text-[9px]">
                <th className="py-2.5 px-3">Organization</th>
                <th className="py-2.5 px-3">Workspace Code</th>
                <th className="py-2.5 px-3">Subscription Tier</th>
                <th className="py-2.5 px-3">Enrolled Users</th>
                <th className="py-2.5 px-3">System Status</th>
                <th className="py-2.5 px-3 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-darkBg-850/50">
              {organizations.map(org => {
                const statusVariant = org.status === 'Active' ? 'success' : 'danger';
                const subVariant = org.subscription === 'Enterprise' ? 'brand' : org.subscription === 'Premium' ? 'primary' : 'gray';

                return (
                  <tr key={org.id} className="hover:bg-slate-50/50 dark:hover:bg-darkBg-950/20 transition-all">
                    
                    {/* Organization details */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5 font-bold text-slate-800 dark:text-slate-200">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-darkBg-950 flex items-center justify-center border border-slate-200/10 shrink-0">
                          <Building2 className="w-4.5 h-4.5 text-brand-500" />
                        </div>
                        <span className="truncate">{org.name}</span>
                      </div>
                    </td>

                    {/* Code */}
                    <td className="py-3 px-3 font-mono font-bold text-slate-500 dark:text-slate-400 text-[10px]">
                      {org.code}
                    </td>

                    {/* Subscription tier badge */}
                    <td className="py-3 px-3">
                      <Badge variant={subVariant} className="text-[9px] uppercase font-bold py-0.5">
                        {org.subscription}
                      </Badge>
                    </td>

                    {/* Users enrolled */}
                    <td className="py-3 px-3 font-extrabold text-slate-800 dark:text-slate-200">
                      {org.users} Members
                    </td>

                    {/* Status badge */}
                    <td className="py-3 px-3">
                      <Badge variant={statusVariant} className="text-[9.5px] uppercase font-bold py-0.5">
                        {org.status}
                      </Badge>
                    </td>

                    {/* Actions dispatcher */}
                    <td className="py-3 px-3 text-right space-x-1.5 shrink-0">
                      <button
                        onClick={() => handleOpenEdit(org)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-darkBg-850 dark:hover:bg-darkBg-800 dark:text-slate-350 transition-colors font-bold text-[10px]"
                        title="Edit details"
                      >
                        <Edit3 className="w-3 h-3 text-slate-400" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleSuspend(org.id)}
                        className={`
                          inline-flex items-center gap-1 px-2 py-1 rounded transition-colors font-bold text-[10px]
                          ${org.status === 'Active' 
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 dark:text-amber-400' 
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 dark:text-emerald-450'
                          }
                        `}
                      >
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        {org.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteOrg(org.id, org.name)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 dark:text-rose-450 transition-colors font-bold text-[10px]"
                        title="Delete tenant permanently"
                      >
                        <Trash2 className="w-3 h-3 text-rose-400 shrink-0" />
                        Delete
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: AreaChart tracking registrations growth */}
        <Card className="lg:col-span-2 p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3.5 mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Workspace Growth Velocity</h3>
              <span className="text-[10px] text-slate-450">Active workspaces registrations cumulative trend</span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthTrendHistory} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTenants" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" strokeOpacity={0.04} />
                <XAxis dataKey="week" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    borderColor: 'rgba(51, 65, 85, 0.5)', 
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff'
                  }} 
                />
                <Area type="monotone" dataKey="Tenants" name="Tenants Registered" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTenants)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Subscription allocation shares */}
        <Card className="lg:col-span-1 p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3.5 mb-4">
            <PieIcon className="w-4 h-4 text-brand-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Subscription Tier Allocations</h3>
              <span className="text-[10px] text-slate-450">Active workspaces billing allocation shares</span>
            </div>
          </div>

          <div className="h-40 w-full flex items-center justify-center">
            {subscriptionPieData.length === 0 ? (
              <div className="text-[11px] text-slate-400">No active subscription data.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                      borderColor: 'rgba(51, 65, 85, 0.5)', 
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#fff'
                    }} 
                  />
                  <Pie
                    data={subscriptionPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={58}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {subscriptionPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-1.5">
            {subscriptionPieData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1 text-[9.5px] font-bold text-slate-650 dark:text-slate-400">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                <span>{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* Edit Organization Modal */}
      <AnimatePresence>
        {editModalOpen && (
          <Modal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            title="Edit Tenant Configuration"
          >
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <Input
                label="Organization (Tenant) Name"
                id="editName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Subscription Tier
                  </label>
                  <select
                    value={editSubscription}
                    onChange={(e) => setEditSubscription(e.target.value)}
                    className="w-full bg-white dark:bg-darkBg-900 border border-slate-200 focus:border-brand-500 dark:border-darkBg-880 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-105 transition-all duration-200"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Premium">Premium</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-white dark:bg-darkBg-900 border border-slate-200 focus:border-brand-500 dark:border-darkBg-880 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-105 transition-all duration-200"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <Input
                label="Enrolled User Accounts Count"
                id="editUsers"
                type="number"
                value={editUsers}
                onChange={(e) => setEditUsers(e.target.value)}
                required
              />

              <div className="flex justify-end gap-2.5 pt-2">
                <Button 
                  type="button" 
                  variant="gray" 
                  size="sm" 
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="sm"
                  className="font-bold"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Provision new tenant Modal */}
      <AnimatePresence>
        {createModalOpen && (
          <Modal
            isOpen={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            title="Provision New Tenant Workspace"
          >
            <form onSubmit={handleCreateOrg} className="space-y-4">
              <Input
                label="Tenant Brand / Organization Name"
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Bitmax Technology"
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Subscription Tier
                </label>
                <select
                  value={newSubscription}
                  onChange={(e) => setNewSubscription(e.target.value)}
                  className="w-full bg-white dark:bg-darkBg-900 border border-slate-200 focus:border-brand-500 dark:border-darkBg-880 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-105 transition-all duration-200"
                >
                  <option value="Basic">Basic (Standard SLA)</option>
                  <option value="Premium">Premium (Enhanced SLA)</option>
                  <option value="Enterprise">Enterprise (Single-Tenant Dedicated)</option>
                </select>
              </div>

              <Input
                label="Initial User Accounts Allocation"
                id="newUsers"
                type="number"
                value={newUsers}
                onChange={(e) => setNewUsers(e.target.value)}
                required
              />

              <div className="flex justify-end gap-2.5 pt-2">
                <Button 
                  type="button" 
                  variant="gray" 
                  size="sm" 
                  onClick={() => setCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="sm"
                  className="font-bold flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Register Tenant
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SuperAdmin;
