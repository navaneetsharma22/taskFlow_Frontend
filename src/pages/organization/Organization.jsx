import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Building2, 
  UserPlus, 
  ShieldAlert, 
  Trash2, 
  Sparkles, 
  KeyRound, 
  Check, 
  Copy,
  Users
} from 'lucide-react';
import { inviteMember, removeMember, updateOrganization } from '../../redux/slices/authSlice';
import { addNotification } from '../../redux/slices/notificationSlice';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Organization = () => {
  const dispatch = useDispatch();
  
  const organization = useSelector((state) => state.auth.organization);
  const members = useSelector((state) => state.auth.members);
  const user = useSelector((state) => state.auth.user);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');
  const [orgName, setOrgName] = useState(organization?.name || '');
  const [copied, setCopied] = useState(false);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    dispatch(inviteMember({
      email: inviteEmail,
      name: inviteName,
      role: inviteRole,
    }));

    dispatch(addNotification({
      title: 'Invitation Dispatched',
      description: `Tenant invitation link dispatched to ${inviteEmail}.`,
      type: 'user'
    }));

    setInviteEmail('');
    setInviteName('');
    setInviteRole('Member');
  };

  const handleUpdateOrg = (e) => {
    e.preventDefault();
    if (!orgName.trim()) return;

    dispatch(updateOrganization({
      name: orgName
    }));

    dispatch(addNotification({
      title: 'Organization Updated',
      description: `Tenant space successfully renamed to "${orgName}".`,
      type: 'system'
    }));
  };

  const handleCopyCode = () => {
    if (!organization) return;
    navigator.clipboard.writeText(organization.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenCode = () => {
    const newCode = `TF-${orgName.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    dispatch(updateOrganization({
      code: newCode
    }));
    dispatch(addNotification({
      title: 'Workspace Code Rotated',
      description: 'The organization invitation code has been regenerated for security.',
      type: 'system'
    }));
  };

  const handleRemove = (membId) => {
    if (confirm('Are you sure you want to remove this member from the organization? They will immediately lose access to all task assets.')) {
      dispatch(removeMember(membId));
      dispatch(addNotification({
        title: 'Team Member Removed',
        description: 'A team member has been removed from the tenant workspace.',
        type: 'system'
      }));
    }
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Organization Settings & Team Space
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Administer isolated organization settings, security profiles, and member invite controls.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Organization Config & Invite generation */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Org Detail Config */}
          <Card className="p-5 bg-white dark:bg-darkBg-900">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3 mb-4">
              <Building2 className="w-4 h-4 text-brand-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Workspace Details</h3>
            </div>

            <form onSubmit={handleUpdateOrg} className="space-y-4">
              <Input
                label="Organization Name"
                id="orgName"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g. Cyberdyne Systems"
              />

              {/* Secure Workspace Invite Code */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Workspace Invitation Code
                </span>
                <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-darkBg-950/60 border border-slate-100/50 dark:border-darkBg-850/50 rounded-xl">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-slate-100 truncate flex-1 pl-1 select-all font-mono tracking-wide">
                    {organization?.code || 'TF-ORG-000'}
                  </span>
                  
                  {/* Copy button */}
                  <button 
                    type="button"
                    onClick={handleCopyCode}
                    className="p-1 rounded text-slate-400 hover:text-brand-500 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="sm"
                  className="flex-1 text-[11px]"
                >
                  Save Settings
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="sm"
                  onClick={handleRegenCode}
                  icon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                >
                  Rotate Code
                </Button>
              </div>
            </form>
          </Card>

          {/* Member Invite Dispatch */}
          <Card className="p-5 bg-white dark:bg-darkBg-900">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-darkBg-850 pb-3 mb-4">
              <UserPlus className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Invite Team Member</h3>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <Input
                label="Full Name (Optional)"
                id="inviteName"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Marcus Wright"
              />

              <Input
                label="Email Address"
                id="inviteEmail"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="marcus.w@cyberdyne.com"
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
                  Tenant Access Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-white dark:bg-darkBg-900 border border-slate-200 focus:border-brand-500 dark:border-darkBg-880 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-100 transition-all duration-200"
                >
                  <option value="Member">Standard Member (Read/Write)</option>
                  <option value="Viewer">Viewer Only (Read Only)</option>
                  <option value="Admin">Administrator (Full Control)</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="w-full text-[11px]"
              >
                Send Invite Link
              </Button>
            </form>
          </Card>

        </div>

        {/* Right Column: Active Members List */}
        <div className="lg:col-span-2">
          <Card className="p-5 bg-white dark:bg-darkBg-900 h-full">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-darkBg-850 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Workspace Roster</h3>
              </div>
              <Badge variant="brand" className="text-[10px]">
                {members.length} members total
              </Badge>
            </div>

            <div className="space-y-4">
              {members.map(memb => {
                const isAdmin = memb.role === 'Admin';
                const isSelf = memb.id === user?.id;
                
                return (
                  <div 
                    key={memb.id} 
                    className="flex items-center justify-between gap-4 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-darkBg-850/30 transition-all border border-transparent"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={memb.avatar} 
                        alt={memb.name} 
                        className="w-8.5 h-8.5 rounded-lg object-cover ring-2 ring-slate-100 dark:ring-darkBg-800" 
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                            {memb.name}
                          </span>
                          {isSelf && (
                            <Badge variant="brand" size="sm" className="text-[8px] py-0 px-1 font-bold">You</Badge>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate">{memb.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      
                      <Badge 
                        variant={isAdmin ? 'success' : memb.role === 'Viewer' ? 'gray' : 'brand'} 
                        className="text-[9.5px] uppercase font-bold"
                      >
                        {memb.role}
                      </Badge>
                      
                      <Badge 
                        variant={memb.status === 'active' ? 'success' : 'warning'} 
                        className="text-[9.5px] uppercase font-semibold"
                      >
                        {memb.status === 'active' ? 'Active' : 'Pending'}
                      </Badge>

                      {/* Delete actions (not allowed to remove self) */}
                      {!isSelf && (
                        <button
                          onClick={() => handleRemove(memb.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-darkBg-850/50 transition-colors"
                          title="Remove member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};

export default Organization;
