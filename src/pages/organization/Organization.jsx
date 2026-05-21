import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Building2, 
  UserPlus, 
  KeyRound, 
  Check, 
  Copy, 
  Users, 
  Search, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Lock,
  Zap,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { inviteMember, removeMember, updateOrganization } from '../../redux/slices/authSlice';
import { addNotification } from '../../redux/slices/notificationSlice';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

const Organization = () => {
  const dispatch = useDispatch();

  const organization = useSelector((state) => state.auth.organization);
  const user = useSelector((state) => state.auth.user);
  
  // Local members state to support dynamic department and pagination filters
  const [members, setMembers] = useState([
    { id: 'memb-1', name: 'Sarah Connor', email: 'admin@taskflow.so', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', role: 'Admin', department: 'Engineering', status: 'Active' },
    { id: 'memb-2', name: 'John Connor', email: 'john@cyberdyne.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', role: 'Member', department: 'Product', status: 'Active' },
    { id: 'memb-3', name: 'Marcus Wright', email: 'marcus@cyberdyne.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', role: 'Member', department: 'Design', status: 'Pending' },
    { id: 'memb-4', name: 'Kyle Reese', email: 'kyle@taskflow.so', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', role: 'Viewer', department: 'Marketing', status: 'Active' }
  ]);

  // Modals & controls
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEditMemb, setCurrentEditMemb] = useState(null);
  
  // Form states
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteDept, setInviteDept] = useState('Engineering');
  const [inviteRole, setInviteRole] = useState('Member');

  const [editName, setEditName] = useState('');
  const [editDept, setEditDept] = useState('Engineering');
  const [editRole, setEditRole] = useState('Member');
  const [editStatus, setEditStatus] = useState('Active');

  const [copied, setCopied] = useState(false);

  // Search & Filter state variables
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Copy Organization Invite Code
  const handleCopyCode = () => {
    if (!organization) return;
    navigator.clipboard.writeText(organization.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    dispatch(addNotification({
      title: 'Workspace Code Copied',
      description: 'The invitation link was copied to your clipboard.',
      type: 'system'
    }));
  };

  // Switch workspace code
  const handleRegenCode = () => {
    const newCode = `TF-${(organization?.name || 'CYB').substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    dispatch(updateOrganization({ ...organization, code: newCode }));
    dispatch(addNotification({
      title: 'Invite Code Regened',
      description: 'Generated a new workspace invite key for safety.',
      type: 'system'
    }));
  };

  // Trigger Invite Member
  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMemb = {
      id: `memb-${Date.now()}`,
      name: inviteName || 'Anonymous Invitee',
      email: inviteEmail,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      role: inviteRole,
      department: inviteDept,
      status: 'Pending'
    };

    setMembers(prev => [...prev, newMemb]);
    
    dispatch(addNotification({
      title: 'Tenant Invitation Sent',
      description: `Dispatched access link to ${inviteEmail}`,
      type: 'user'
    }));

    setInviteEmail('');
    setInviteName('');
    setInviteModalOpen(false);
  };

  // Open Edit Modal
  const handleOpenEdit = (memb) => {
    setCurrentEditMemb(memb);
    setEditName(memb.name);
    setEditDept(memb.department);
    setEditRole(memb.role);
    setEditStatus(memb.status);
    setEditModalOpen(true);
  };

  // Save member edits
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    setMembers(prev => prev.map(m => {
      if (m.id === currentEditMemb.id) {
        return {
          ...m,
          name: editName,
          department: editDept,
          role: editRole,
          status: editStatus
        };
      }
      return m;
    }));

    dispatch(addNotification({
      title: 'Member Profile Configured',
      description: `Roster settings updated for "${editName}".`,
      type: 'system'
    }));

    setEditModalOpen(false);
  };

  // Remove Member
  const handleRemoveMember = (membId, name) => {
    setMembers(prev => prev.filter(m => m.id !== membId));
    dispatch(addNotification({
      title: 'Member Roster Deleted',
      description: `${name} has been soft-removed from the roster lists.`,
      type: 'danger'
    }));
  };

  // Toggle member status pill instantly
  const handleToggleStatus = (membId) => {
    setMembers(prev => prev.map(m => {
      if (m.id === membId) {
        const nextStatus = m.status === 'Active' ? 'Pending' : 'Active';
        dispatch(addNotification({
          title: 'Account Status Toggled',
          description: `Account status for "${m.name}" is now "${nextStatus}".`,
          type: 'system'
        }));
        return { ...m, status: nextStatus };
      }
      return m;
    }));
  };

  // Filter & Search Logic
  const filteredMembers = members.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.department.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesDept = selectedDept === 'All' || m.department === selectedDept;
    const matchesRole = selectedRole === 'All' || m.role === selectedRole;
    const matchesStatus = selectedStatus === 'All' || m.status === selectedStatus;

    return matchesSearch && matchesDept && matchesRole && matchesStatus;
  });

  // Pagination Logic
  const totalItems = filteredMembers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembersList = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-6 text-xs select-none">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-500" />
            Workspace Organization Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure system single-tenant properties, copy invite keys, and govern department assignments.
          </p>
        </div>
        <Button 
          variant="primary" 
          size="sm"
          className="font-bold flex items-center gap-1.5 shrink-0"
          onClick={() => setInviteModalOpen(true)}
        >
          <UserPlus className="w-4 h-4" />
          Invite Team Member
        </Button>
      </div>

      {/* 1. COMPACT KPI CARDS (Four cards representing workspace info) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Org Name */}
        <Card className="p-4 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 border border-brand-100/10">
            <Building2 className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Organization Name</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5 block truncate">
              {organization?.name || 'Cyberdyne Systems'}
            </span>
          </div>
        </Card>

        {/* Card 2: Workspace Code */}
        <Card className="p-4 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100/10">
              <KeyRound className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Secure Invite Code</span>
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100 mt-0.5 block truncate tracking-wide">
                {organization?.code || 'TF-CYB-4088'}
              </span>
            </div>
          </div>

          <div className="flex gap-1 shrink-0">
            <button
              onClick={handleCopyCode}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-darkBg-850 dark:hover:bg-darkBg-800 text-slate-400 hover:text-brand-500 transition-all border border-slate-150/10"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleRegenCode}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-darkBg-850 dark:hover:bg-darkBg-800 text-slate-400 hover:text-amber-500 transition-all border border-slate-150/10"
              title="Rotate code"
            >
              <Zap className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>

        {/* Card 3: User limit counts */}
        <Card className="p-4 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-100/10">
            <Users className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Workspace Users</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5 block">
              {members.length} Enrolled Roster
            </span>
          </div>
        </Card>

        {/* Card 4: Subscription plan */}
        <Card className="p-4 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100/10">
            <Lock className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Workspace Billing</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5 block">
              Enterprise Suite
            </span>
          </div>
        </Card>

      </div>

      {/* 2. MEMBERS ROSTER GRID SECTION */}
      <Card className="p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
        
        {/* Controls, Filters & Search bar */}
        <div className="flex flex-col gap-4 border-b border-slate-100 dark:border-darkBg-850 pb-4 mb-4">
          
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Workspace Roster Settings</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Search Input bar */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, mail or department..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 dark:bg-darkBg-950 border border-slate-200 focus:border-brand-500 dark:border-darkBg-850 dark:focus:border-brand-500 text-xs rounded-lg py-2 pl-9 pr-3 outline-none text-slate-900 dark:text-slate-100 transition-all"
              />
            </div>

            {/* Department selector */}
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 dark:bg-darkBg-950 border border-slate-200 focus:border-brand-500 dark:border-darkBg-850 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-100 transition-all"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
            </select>

            {/* Role filter */}
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 dark:bg-darkBg-950 border border-slate-200 focus:border-brand-500 dark:border-darkBg-850 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-100 transition-all"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Member">Member</option>
              <option value="Viewer">Viewer</option>
            </select>

            {/* Status filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 dark:bg-darkBg-950 border border-slate-200 focus:border-brand-500 dark:border-darkBg-850 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-100 transition-all"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
            </select>

          </div>

        </div>

        {/* 3. ROSTER DATA TABLE */}
        <div className="overflow-x-auto">
          {currentMembersList.length === 0 ? (
            <div className="empty-state-container py-12">
              <AlertCircle className="w-8 h-8 text-slate-400 mb-2.5 animate-pulse-subtle" />
              <h4 className="font-bold text-slate-705 dark:text-slate-300">No members match parameters</h4>
              <p className="text-[10px] text-slate-450 mt-1 max-w-[200px] text-center">
                Adjust search queries or reset status filters to view the roster.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-darkBg-850 text-slate-400 uppercase tracking-wider font-extrabold text-[9px]">
                  <th className="py-2.5 px-3">Members</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Access Role</th>
                  <th className="py-2.5 px-3">Enrolled Status</th>
                  <th className="py-2.5 px-3 text-right">Actions Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-darkBg-850/50">
                {currentMembersList.map(memb => {
                  const statusVariant = memb.status === 'Active' ? 'success' : 'warning';
                  const roleVariant = memb.role === 'Admin' ? 'success' : memb.role === 'Viewer' ? 'gray' : 'brand';
                  const isSelf = memb.email === user?.email;

                  return (
                    <tr key={memb.id} className="hover:bg-slate-50/50 dark:hover:bg-darkBg-950/20 transition-all">
                      
                      {/* Avatar, Name, Email column */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={memb.avatar} 
                            alt={memb.name} 
                            className="w-8.5 h-8.5 rounded-lg object-cover ring-2 ring-slate-150 dark:ring-darkBg-800 shrink-0" 
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-800 dark:text-slate-200 truncate flex items-center gap-1.5">
                              {memb.name}
                              {isSelf && (
                                <Badge variant="brand" className="text-[8px] font-bold uppercase py-0.5 px-1">Self</Badge>
                              )}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate">{memb.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Department column */}
                      <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-350">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {memb.department}
                        </span>
                      </td>

                      {/* Role column */}
                      <td className="py-3.5 px-3">
                        <Badge variant={roleVariant} className="text-[9px] uppercase font-bold py-0.5">
                          {memb.role}
                        </Badge>
                      </td>

                      {/* Status column */}
                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => handleToggleStatus(memb.id)}
                          className="hover:opacity-80 transition-opacity"
                          title="Click to toggle status"
                        >
                          <Badge variant={statusVariant} className="text-[9.5px] uppercase font-bold py-0.5">
                            {memb.status}
                          </Badge>
                        </button>
                      </td>

                      {/* Actions Column */}
                      <td className="py-3.5 px-3 text-right space-x-1 shrink-0">
                        <button
                          onClick={() => handleOpenEdit(memb)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-650 dark:bg-darkBg-850 dark:hover:bg-darkBg-800 dark:text-slate-300 transition-colors font-bold text-[10px]"
                        >
                          <Edit2 className="w-3 h-3 text-slate-450 shrink-0" />
                          Edit
                        </button>
                        {!isSelf && (
                          <button
                            onClick={() => handleRemoveMember(memb.id, memb.name)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 dark:text-rose-450 transition-colors font-bold text-[10px]"
                          >
                            <Trash2 className="w-3 h-3 text-rose-450 shrink-0" />
                            Remove
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* 4. DENSE PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-darkBg-850 pt-4 mt-4 text-[10px] font-bold text-slate-450">
            <span>
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems} members
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-lg border border-slate-200 dark:border-darkBg-850 hover:bg-slate-50 dark:hover:bg-darkBg-850 disabled:opacity-50 disabled:hover:bg-transparent transition-all shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`
                    w-7 h-7 rounded-lg font-extrabold transition-all border
                    ${currentPage === idx + 1 
                      ? 'bg-brand-500 text-white border-brand-500' 
                      : 'border-slate-200 dark:border-darkBg-850 hover:bg-slate-50 dark:hover:bg-darkBg-850 text-slate-700 dark:text-slate-350'
                    }
                  `}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-lg border border-slate-200 dark:border-darkBg-850 hover:bg-slate-50 dark:hover:bg-darkBg-850 disabled:opacity-50 disabled:hover:bg-transparent transition-all shrink-0"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </Card>

      {/* Invite Member dialog modal */}
      <AnimatePresence>
        {inviteModalOpen && (
          <Modal
            isOpen={inviteModalOpen}
            onClose={() => setInviteModalOpen(false)}
            title="Invite New Roster Member"
          >
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <Input
                label="Full Account Name"
                id="inviteName"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Marcus Wright"
                required
              />
              <Input
                label="Secure Email Address"
                id="inviteEmail"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="marcus.w@company.com"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Assigned Department
                  </label>
                  <select
                    value={inviteDept}
                    onChange={(e) => setInviteDept(e.target.value)}
                    className="w-full bg-white dark:bg-darkBg-900 border border-slate-200 focus:border-brand-500 dark:border-darkBg-880 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-105 transition-all duration-200"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Workspace Access Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full bg-white dark:bg-darkBg-900 border border-slate-200 focus:border-brand-500 dark:border-darkBg-880 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-105 transition-all duration-200"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <Button 
                  type="button" 
                  variant="gray" 
                  size="sm" 
                  onClick={() => setInviteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="sm"
                  className="font-bold"
                >
                  Dispatch Access Link
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Edit Member properties Modal */}
      <AnimatePresence>
        {editModalOpen && (
          <Modal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            title="Edit Member Configuration"
          >
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <Input
                label="Full Account Name"
                id="editName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Assigned Department
                  </label>
                  <select
                    value={editDept}
                    onChange={(e) => setEditDept(e.target.value)}
                    className="w-full bg-white dark:bg-darkBg-900 border border-slate-200 focus:border-brand-500 dark:border-darkBg-880 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-105 transition-all duration-200"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Workspace Access Role
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full bg-white dark:bg-darkBg-900 border border-slate-200 focus:border-brand-500 dark:border-darkBg-880 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-105 transition-all duration-200"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Enrolled Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-white dark:bg-darkBg-900 border border-slate-200 focus:border-brand-500 dark:border-darkBg-880 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-105 transition-all duration-200"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

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
                  Apply Settings
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Organization;
