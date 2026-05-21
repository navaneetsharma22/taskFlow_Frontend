import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Plus, 
  LogOut, 
  ShieldCheck, 
  Trash2, 
  Ban, 
  CheckCircle, 
  Search, 
  RefreshCw, 
  Fingerprint,
  Calendar,
  Lock,
  Globe,
  Settings,
  Sparkles,
  Award,
  Sliders,
  Database,
  Terminal,
  KeyRound,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import superAdminService from '../../services/superAdminService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('manage'); // 'manage' | 'create'

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Create Organization Form state
  const [newOrgName, setNewOrgName] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createdOrgDetails, setCreatedOrgDetails] = useState(null);

  useEffect(() => {
    // Authenticate SuperAdmin context
    if (!superAdminService.isAuthenticated()) {
      navigate('/superadmin/login');
      return;
    }

    setAdmin(superAdminService.getCurrentAdmin());
    fetchOrganizations();
  }, [navigate]);

  const fetchOrganizations = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await superAdminService.getOrganizations();
      setOrganizations(response.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch platform organizations.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrganization = async (e) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    setCreateLoading(true);
    setError('');
    setCreatedOrgDetails(null);

    try {
      const response = await superAdminService.createOrganization(newOrgName);
      setCreatedOrgDetails(response);
      setNewOrgName('');
      // Refresh the organization list
      fetchOrganizations();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to create organization');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await superAdminService.updateOrganizationStatus(id, nextStatus);
      // Update local state directly for responsive feedback
      setOrganizations(prev => prev.map(o => o._id === id ? { ...o, status: nextStatus, subscription: { ...o.subscription, status: nextStatus } } : o));
    } catch (err) {
      console.error(err);
      alert('Failed to update organization status.');
    }
  };

  const handleDeleteOrganization = async (id, name) => {
    if (!window.confirm(`Are you absolutely sure you want to delete "${name}"? This action is permanent and deletes all associated workspace tenants, teams, and data!`)) {
      return;
    }

    try {
      await superAdminService.deleteOrganization(id);
      setOrganizations(prev => prev.filter(o => o._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete organization.');
    }
  };

  const handleLogout = async () => {
    await superAdminService.logout();
    navigate('/superadmin/login');
  };

  // Compute platform metrics
  const totalOrgs = organizations.length;
  const activeOrgs = organizations.filter(o => o.status === 'active').length;
  const suspendedOrgs = organizations.filter(o => o.status === 'suspended').length;
  const freeTierOrgs = organizations.filter(o => o.subscription?.plan === 'free').length;
  const premiumTierOrgs = totalOrgs - freeTierOrgs;

  // Filter organizations by search query
  const filteredOrganizations = organizations.filter(o => 
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.slug && o.slug.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Compute dynamic slug preview for creation form
  const getSlugPreview = (name) => {
    if (!name) return 'workspace-url-slug';
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <div className="min-h-screen bg-[#070B19] text-slate-100 font-sans select-none flex">
      {/* 1. LEFT SUPERADMIN SIDEBAR */}
      <aside className="w-66 border-r border-slate-900 bg-slate-950 flex flex-col shrink-0">
        
        {/* Sidebar Header Brand Identity */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-900">
          <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Fingerprint className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[12px] font-black tracking-tight text-white uppercase block">TaskFlow Admin</span>
            <span className="text-[8.5px] text-violet-400 font-extrabold tracking-widest block uppercase -mt-0.5">Control Center</span>
          </div>
        </div>

        {/* Logged in Admin Brief Info */}
        {admin && (
          <div className="mx-4 mt-5 p-3.5 bg-slate-900/40 border border-slate-850 rounded-xl">
            <span className="text-[8.5px] font-extrabold text-slate-500 uppercase tracking-widest block mb-0.5">ACTIVE AUTHORITY</span>
            <span className="font-bold text-slate-200 block truncate text-[11px]">{admin.name}</span>
            <span className="text-[9.5px] text-violet-400 font-semibold mt-0.5 block truncate">🛡️ {admin.email}</span>
          </div>
        )}

        {/* Sidebar Links */}
        <nav className="flex-1 px-3 space-y-1.5 py-6">
          <button
            onClick={() => setActiveTab('manage')}
            className={`
              w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold tracking-wide transition-all text-xs text-left select-none
              ${activeTab === 'manage' 
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_4px_12px_rgba(139,92,246,0.2)]' 
                : 'text-slate-450 hover:bg-slate-900/50 hover:text-slate-200'
              }
            `}
          >
            <Sliders className="w-4 h-4 shrink-0" />
            <span>Manage Organizations</span>
            {organizations.length > 0 && activeTab !== 'manage' && (
              <Badge variant="brand" className="ml-auto text-[8.5px] font-extrabold py-0.5 bg-violet-950/50 border border-violet-500/20 text-violet-400 rounded">
                {organizations.length}
              </Badge>
            )}
          </button>

          <button
            onClick={() => {
              setCreatedOrgDetails(null);
              setActiveTab('create');
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold tracking-wide transition-all text-xs text-left select-none
              ${activeTab === 'create' 
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_4px_12px_rgba(139,92,246,0.2)]' 
                : 'text-slate-450 hover:bg-slate-900/50 hover:text-slate-200'
              }
            `}
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Create Organization</span>
          </button>
        </nav>

        {/* Sidebar Footer parameters */}
        <div className="p-4 border-t border-slate-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-rose-500 bg-rose-950/10 hover:bg-rose-950/20 border border-rose-900/20 transition-all text-xs"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* 2. RIGHT CONTENT FRAME CONTAINER */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Header toolbar */}
        <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md h-16 px-6 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-extrabold tracking-tight text-white uppercase">
              {activeTab === 'manage' ? 'Workspace Control Terminal' : 'Workspace Provisioning Interface'}
            </h2>
            <Badge variant="brand" className="bg-violet-950/40 border border-violet-500/20 text-violet-300 font-extrabold uppercase px-2 py-0.5 text-[7.5px] rounded-full tracking-wider">
              ONLINE
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={fetchOrganizations} 
              variant="ghost" 
              size="sm" 
              className="text-slate-400 hover:text-white"
              icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            >
              Sync DB
            </Button>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8 animate-fade-in">
          
          {/* TAB 1: MANAGE ORGANIZATIONS */}
          {activeTab === 'manage' && (
            <div className="space-y-8">
              
              {/* Statistics Deck */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <Card className="bg-slate-950/40 border border-slate-900 hover:border-slate-800 transition-all flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Total Workspaces</span>
                    <span className="text-2xl font-black text-white">{loading ? '...' : totalOrgs}</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-violet-600/10 border border-violet-500/10 flex items-center justify-center text-violet-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                </Card>

                <Card className="bg-slate-950/40 border border-slate-900 hover:border-slate-800 transition-all flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Active Tenants</span>
                    <span className="text-2xl font-black text-emerald-400">{loading ? '...' : activeOrgs}</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-600/10 border border-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </Card>

                <Card className="bg-slate-950/40 border border-slate-900 hover:border-slate-800 transition-all flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Suspended Tenants</span>
                    <span className="text-2xl font-black text-amber-500">{loading ? '...' : suspendedOrgs}</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-amber-600/10 border border-amber-500/10 flex items-center justify-center text-amber-400">
                    <Ban className="w-5 h-5" />
                  </div>
                </Card>

                <Card className="bg-slate-950/40 border border-slate-900 hover:border-slate-800 transition-all flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Premium & Enterprise</span>
                    <span className="text-2xl font-black text-fuchsia-400">{loading ? '...' : premiumTierOrgs}</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-fuchsia-600/10 border border-fuchsia-500/10 flex items-center justify-center text-fuchsia-400">
                    <Award className="w-5 h-5" />
                  </div>
                </Card>
              </div>

              {/* Data Table and Filters */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Input
                      placeholder="Search organizations by name, secure code or slug..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      icon={<Search className="w-4 h-4 text-slate-500" />}
                      className="dark:bg-slate-950/50 dark:border-slate-900/80 text-white placeholder-slate-550 text-xs"
                    />
                  </div>
                </div>

                <Card className="bg-slate-950/20 border border-slate-900/85 p-0 overflow-hidden">
                  {loading ? (
                    <div className="p-12 text-center text-slate-500 space-y-3 font-semibold text-xs">
                      <RefreshCw className="w-8 h-8 text-violet-500 animate-spin mx-auto" />
                      <p>Retrieving secure organization profiles...</p>
                    </div>
                  ) : filteredOrganizations.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 space-y-2 font-semibold text-xs">
                      <Building2 className="w-12 h-12 text-slate-700 mx-auto" />
                      <p>No platform organizations found</p>
                      {searchQuery && <p className="text-[10px] text-slate-650">Try adjusting your cryptographic search filter.</p>}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-900 bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                            <th className="py-3.5 px-5">Organization Name / Slug</th>
                            <th className="py-3.5 px-5">Secure Tenant Code</th>
                            <th className="py-3.5 px-5">Subscription Plan</th>
                            <th className="py-3.5 px-5">Platform Status</th>
                            <th className="py-3.5 px-5">Provisioned Date</th>
                            <th className="py-3.5 px-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrganizations.map((org, idx) => (
                            <tr 
                              key={org._id} 
                              className={`border-b border-slate-900/50 hover:bg-slate-900/10 transition-colors ${idx % 2 === 0 ? 'bg-slate-950/10' : ''}`}
                            >
                              <td className="py-4 px-5">
                                <div className="font-extrabold text-white text-[13px]">{org.name}</div>
                                <div className="text-[10px] text-slate-500 font-semibold">{org.slug || 'no-slug'}</div>
                              </td>
                              <td className="py-4 px-5 font-mono text-violet-400 font-bold text-[11.5px]">
                                {org.code}
                              </td>
                              <td className="py-4 px-5">
                                <Badge 
                                  variant={org.subscription?.plan === 'enterprise' ? 'danger' : org.subscription?.plan === 'pro' ? 'brand' : 'secondary'}
                                  className="uppercase font-bold text-[8.5px] px-2 py-0.5 rounded"
                                >
                                  {org.subscription?.plan || 'free'}
                                </Badge>
                              </td>
                              <td className="py-4 px-5">
                                <span className={`inline-flex items-center gap-1.5 font-bold ${org.status === 'active' ? 'text-emerald-400' : 'text-amber-500'}`}>
                                  <span className={`w-2 h-2 rounded-full ${org.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'}`} />
                                  {org.status === 'active' ? 'Active' : 'Suspended'}
                                </span>
                              </td>
                              <td className="py-4 px-5 text-slate-400 font-semibold">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                  {new Date(org.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                </div>
                              </td>
                              <td className="py-4 px-5 text-right space-x-1.5 whitespace-nowrap">
                                <Button
                                  onClick={() => handleToggleStatus(org._id, org.status)}
                                  variant="secondary"
                                  size="sm"
                                  className={`py-1 text-[10px] font-bold border border-slate-800 ${org.status === 'active' ? 'hover:bg-amber-950/20 hover:text-amber-400 hover:border-amber-900/30' : 'hover:bg-emerald-950/20 hover:text-emerald-400 hover:border-emerald-900/30'}`}
                                  icon={org.status === 'active' ? <Ban className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                                >
                                  {org.status === 'active' ? 'Suspend' : 'Activate'}
                                </Button>
                                <Button
                                  onClick={() => handleDeleteOrganization(org._id, org.name)}
                                  variant="danger"
                                  size="sm"
                                  className="bg-red-950/20 hover:bg-red-900/30 text-red-400 border border-red-900/30 py-1 text-[10px] font-bold"
                                  icon={<Trash2 className="w-3 h-3" />}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </div>

            </div>
          )}

          {/* TAB 2: CREATE ORGANIZATION */}
          {activeTab === 'create' && (
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* Provisioning status panel */}
              <AnimatePresence mode="wait">
                {!createdOrgDetails ? (
                  <motion.div
                    key="create-form"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                  >
                    <Card className="bg-slate-950/50 border border-slate-900 p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
                      {/* Top glowing line */}
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-600 to-fuchsia-600" />
                      
                      <div className="space-y-2">
                        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                          <Database className="w-5 h-5 text-violet-500 animate-pulse" />
                          Provision Workspace Environment
                        </h3>
                        <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                          Provisioning a new organization automatically allocates secure database collections, generates specialized tenant routing codes, and registers an invite token for administrative onboarding.
                        </p>
                      </div>

                      {error && (
                        <div className="p-3.5 text-xs font-bold text-red-400 bg-red-950/30 border border-red-500/20 rounded-xl flex items-start gap-2.5">
                          <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                          <span>{error}</span>
                        </div>
                      )}

                      <form onSubmit={handleCreateOrganization} className="space-y-5">
                        <Input
                          label="Organization/Company Display Name"
                          placeholder="e.g. Stark Industries"
                          value={newOrgName}
                          onChange={(e) => {
                            setNewOrgName(e.target.value);
                            setError('');
                          }}
                          className="text-white text-xs dark:bg-slate-900/50 focus:border-violet-500"
                          required
                        />

                        {/* Live metadata visualizer */}
                        <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-xl space-y-3">
                          <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest block">ENVIRONMENT SPECIFICATIONS</span>
                          
                          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                            <div>
                              <span className="text-[10px] text-slate-500 block">Workspace Url Slug</span>
                              <span className="font-mono text-white text-[11px] block mt-0.5 truncate">{getSlugPreview(newOrgName)}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block">Database Tenant Type</span>
                              <span className="text-violet-400 block mt-0.5">Isolated Single-Tenant Space</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block">Default Subscription tier</span>
                              <span className="text-fuchsia-400 block mt-0.5 uppercase tracking-wide text-[10.5px]">Free Tier Trial</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block">Host Region</span>
                              <span className="text-slate-350 block mt-0.5 inline-flex items-center gap-1">
                                <Globe className="w-3.5 h-3.5 text-slate-550" />
                                AWS ap-south-1 (Mumbai)
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-3.5 pt-2">
                          <Button
                            type="button"
                            onClick={() => {
                              setNewOrgName('');
                              setActiveTab('manage');
                            }}
                            variant="ghost"
                            className="text-slate-450 font-bold hover:text-slate-200"
                          >
                            Cancel & Return
                          </Button>
                          
                          <Button
                            type="submit"
                            variant="primary"
                            isLoading={createLoading}
                            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 font-extrabold shadow-lg shadow-violet-500/25 px-6 py-2.5 rounded-xl"
                            icon={<FileCheck2 className="w-4.5 h-4.5" />}
                          >
                            Initialize Environment
                          </Button>
                        </div>
                      </form>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="create-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className="bg-slate-950/50 border border-slate-900 p-8 space-y-6 text-center relative overflow-hidden shadow-2xl">
                      {/* Success border effect */}
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                      
                      <div className="w-16 h-16 bg-emerald-600/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
                        <CheckCircle className="w-10 h-10" />
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-xl font-black text-white">Tenant Workspace Active!</h4>
                        <p className="text-slate-400 text-xs font-semibold max-w-md mx-auto leading-relaxed">
                          The new organization workspace environment has been successfully provisioned. Copy and provide the invite token key below to authorize onboarding.
                        </p>
                      </div>

                      {/* Display of credentials */}
                      <div className="p-5 bg-slate-900/50 border border-slate-900 rounded-xl space-y-4 max-w-sm mx-auto text-left">
                        <div>
                          <span className="text-[9.5px] text-slate-500 font-extrabold uppercase block tracking-widest">ORGANIZATION NAME</span>
                          <span className="text-sm font-extrabold text-white block mt-0.5">{createdOrgDetails.name}</span>
                        </div>
                        
                        <div>
                          <span className="text-[9.5px] text-slate-500 font-extrabold uppercase block tracking-widest">TENANT INVITE CODE</span>
                          <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-900 mt-1">
                            <span className="font-mono text-sm text-violet-400 font-black tracking-wider">{createdOrgDetails.organizationCode}</span>
                            <Button
                              onClick={() => {
                                navigator.clipboard.writeText(createdOrgDetails.organizationCode);
                                alert('Tenant invitation token copied!');
                              }}
                              variant="ghost"
                              size="sm"
                              className="py-1 text-[10.5px] text-violet-400 hover:text-violet-300 font-bold"
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                        <Button
                          onClick={() => {
                            setCreatedOrgDetails(null);
                          }}
                          variant="secondary"
                          className="flex-1 font-bold py-2 border border-slate-800 hover:bg-slate-900 text-xs"
                          icon={<Plus className="w-3.5 h-3.5" />}
                        >
                          Provision Another
                        </Button>
                        
                        <Button
                          onClick={() => {
                            setCreatedOrgDetails(null);
                            setActiveTab('manage');
                          }}
                          variant="primary"
                          className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 font-extrabold py-2 shadow-md shadow-violet-500/20 text-xs"
                          icon={<Sliders className="w-3.5 h-3.5" />}
                        >
                          Return to Terminal
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )}

        </main>
      </div>

    </div>
  );
};

export default SuperAdminDashboard;
