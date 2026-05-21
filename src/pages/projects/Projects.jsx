import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FolderPlus, 
  Layers, 
  Calendar, 
  Users, 
  Sparkles, 
  Clock, 
  Trash2, 
  ChevronRight,
  TrendingUp,
  LayoutGrid,
  Table as TableIcon,
  Filter,
  CheckCircle2,
  Briefcase,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { createProject, deleteProject, setCurrentProject } from '../../redux/slices/projectSlice';
import { addNotification } from '../../redux/slices/notificationSlice';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

const Projects = () => {
  const dispatch = useDispatch();
  
  // Redux hooks
  const projects = useSelector((state) => state.projects.list);
  const activeProject = useSelector((state) => state.projects.currentProject);
  const members = useSelector((state) => state.auth.members);

  // States
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [modalOpen, setModalOpen] = useState(false);
  
  // Filter variables
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDept, setFilterDept] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  // Creation form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Development');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [selectedMembers, setSelectedMembers] = useState(['usr-101']);

  // Handle Project Creation
  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    dispatch(createProject({
      name,
      description,
      category,
      priority,
      dueDate,
      members: selectedMembers,
    }));

    dispatch(addNotification({
      title: 'Initiative Scaffolded',
      description: `Project "${name}" successfully registered under target "${category}".`,
      type: 'system'
    }));

    // Reset Forms
    setName('');
    setDescription('');
    setCategory('Development');
    setPriority('Medium');
    setDueDate('');
    setSelectedMembers(['usr-101']);
    setModalOpen(false);
  };

  // Handle Project Deletion
  const handleDelete = (projId, name, e) => {
    e.stopPropagation();
    if (confirm(`Decommission project context "${name}" permanently? All tasks will be purged.`)) {
      dispatch(deleteProject(projId));
      dispatch(addNotification({
        title: 'Project Decommissioned',
        description: 'Initiative assets successfully wiped from current workspace context.',
        type: 'danger'
      }));
    }
  };

  // Toggle assigned team members
  const handleMemberToggle = (membId) => {
    setSelectedMembers(prev => 
      prev.includes(membId) ? prev.filter(id => id !== membId) : [...prev, membId]
    );
  };

  // Filtering Logic
  const filteredProjects = projects.filter(p => {
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    const matchesDept = filterDept === 'All' || p.category === filterDept;
    
    // Fallback support if project priority is missing in static Redux mock state
    const projPriority = p.priority || 'Medium';
    const matchesPriority = filterPriority === 'All' || projPriority === filterPriority;

    return matchesStatus && matchesDept && matchesPriority;
  });

  return (
    <div className="space-y-6 text-xs select-none">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-500" />
            Workspace Sprints & Projects
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build context, assign developer workloads, and monitor SLA compliance.
          </p>
        </div>
        
        <div className="flex items-center gap-2.5">
          {/* Toggle Views button controls */}
          <div className="flex items-center bg-slate-50 dark:bg-darkBg-950 border border-slate-150/10 rounded-xl p-1 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-darkBg-850 text-brand-500 shadow-sm' : 'text-slate-450 hover:text-slate-650'}`}
              title="Grid Layout"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white dark:bg-darkBg-850 text-brand-500 shadow-sm' : 'text-slate-450 hover:text-slate-650'}`}
              title="Table Layout"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setModalOpen(true)}
            icon={<FolderPlus className="w-4.5 h-4.5" />}
            className="font-bold"
          >
            Create Project
          </Button>
        </div>
      </div>

      {/* Active Selection Display Banner */}
      {activeProject && (
        <Card className="bg-gradient-to-r from-brand-600/10 to-indigo-600/10 border-brand-500/20 p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: activeProject.color }} />
            <div>
              <span className="text-[10px] font-bold text-brand-650 dark:text-brand-400 uppercase tracking-widest block">
                Currently Selected Context
              </span>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                {activeProject.name}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="brand" className="text-[10px] py-0.5 px-2 font-bold uppercase">
              {activeProject.category}
            </Badge>
            <Badge variant="success" className="text-[10px] py-0.5 px-2 font-bold uppercase">
              {activeProject.status}
            </Badge>
          </div>
        </Card>
      )}

      {/* Robust SaaS Filter Panel */}
      <Card className="p-4 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Scope Filters</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 dark:bg-darkBg-950 border border-slate-200 focus:border-brand-500 dark:border-darkBg-850 dark:focus:border-brand-500 text-xs rounded-lg py-1.5 px-3 outline-none text-slate-905 dark:text-slate-100 transition-all"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>

            {/* Department/Category Filter */}
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="bg-slate-50 dark:bg-darkBg-950 border border-slate-200 focus:border-brand-500 dark:border-darkBg-850 dark:focus:border-brand-500 text-xs rounded-lg py-1.5 px-3 outline-none text-slate-905 dark:text-slate-100 transition-all"
            >
              <option value="All">All Categories</option>
              <option value="Development">Development</option>
              <option value="Security">Security</option>
              <option value="Backend">Backend</option>
              <option value="Marketing">Marketing</option>
              <option value="Design">Design</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-slate-50 dark:bg-darkBg-950 border border-slate-200 focus:border-brand-500 dark:border-darkBg-850 dark:focus:border-brand-500 text-xs rounded-lg py-1.5 px-3 outline-none text-slate-905 dark:text-slate-100 transition-all"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Grid or Table layout selector wrapper */}
      {filteredProjects.length === 0 ? (
        <div className="empty-state-container py-16 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850">
          <Layers className="w-10 h-10 text-slate-400 mb-3 animate-pulse-subtle" />
          <h4 className="font-bold text-slate-705 dark:text-slate-350">No initiatives found</h4>
          <p className="text-[10px] text-slate-450 mt-1.5 max-w-[220px] text-center">
            Modify active filter status properties or add a new project to initialize.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* 1. GRID VIEW (Compact cards detailing Name, Progress, Members, Tasks) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
          {filteredProjects.map((proj) => {
            const isSelected = activeProject?.id === proj.id;
            const projPriority = proj.priority || 'Medium';
            const priorityVariant = projPriority === 'High' ? 'danger' : projPriority === 'Medium' ? 'warning' : 'gray';

            return (
              <Card
                key={proj.id}
                hoverEffect
                onClick={() => dispatch(setCurrentProject(proj.id))}
                className={`
                  relative flex flex-col justify-between p-5 bg-white dark:bg-darkBg-900 border transition-all cursor-pointer h-full min-h-[195px]
                  ${isSelected 
                    ? 'border-brand-500/80 dark:border-brand-500/80 shadow-premium' 
                    : 'border-slate-100 hover:border-slate-200 dark:border-darkBg-850 dark:hover:border-darkBg-800'
                  }
                `}
              >
                {/* Header indicators */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="gray" className="text-[9px] uppercase font-bold py-0.5 px-1.5">
                      {proj.category}
                    </Badge>
                    <Badge variant={priorityVariant} className="text-[9px] uppercase font-bold py-0.5 px-1.5">
                      {projPriority}
                    </Badge>
                  </div>
                  <button
                    onClick={(e) => handleDelete(proj.id, proj.name, e)}
                    className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-darkBg-850/80 transition-colors shrink-0"
                    title="Terminate Context"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 mb-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1 leading-snug">
                    {proj.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {proj.description || 'No description provided.'}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between items-center text-[10.5px]">
                    <span className="text-slate-450 font-semibold">Progress</span>
                    <span className="font-extrabold text-slate-750 dark:text-slate-200">{proj.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-darkBg-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ width: `${proj.progress}%`, backgroundColor: proj.color || '#2563EB' }}
                    />
                  </div>
                </div>

                {/* Bottom Avatars & Task Counts Footer */}
                <div className="border-t border-slate-50 dark:border-darkBg-850/80 pt-3.5 flex items-center justify-between gap-2.5">
                  
                  {/* Task counts */}
                  <div className="flex items-center gap-1 text-[10.5px] text-slate-450 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {proj.completedTasksCount}/{proj.tasksCount || 0} Sprints
                    </span>
                  </div>

                  {/* Overlapping Members Cluster */}
                  <div className="flex -space-x-2.5 overflow-hidden">
                    {members.slice(0, 3).map(m => (
                      <img 
                        key={m.id}
                        src={m.avatar} 
                        alt={m.name} 
                        className="w-5.5 h-5.5 rounded-full object-cover ring-2 ring-white dark:ring-darkBg-900"
                        title={m.name}
                      />
                    ))}
                    {members.length > 3 && (
                      <div className="w-5.5 h-5.5 rounded-full bg-slate-100 dark:bg-darkBg-950 text-slate-500 flex items-center justify-center text-[8.5px] font-bold ring-2 ring-white dark:ring-darkBg-900 shrink-0">
                        +{members.length - 3}
                      </div>
                    )}
                  </div>

                </div>

              </Card>
            );
          })}
        </div>
      ) : (
        
        /* 2. TABLE VIEW (List view showing identical indicators as requested) */
        <Card className="p-5 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-darkBg-850 text-slate-400 uppercase tracking-wider font-extrabold text-[9px]">
                  <th className="py-2.5 px-3">Project Initiative</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Sprint Progress</th>
                  <th className="py-2.5 px-3">Members Assigned</th>
                  <th className="py-2.5 px-3">Task Load</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Overrides</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-darkBg-850/50">
                {filteredProjects.map((proj) => {
                  const isSelected = activeProject?.id === proj.id;
                  const projPriority = proj.priority || 'Medium';
                  const priorityVariant = projPriority === 'High' ? 'danger' : projPriority === 'Medium' ? 'warning' : 'gray';
                  const statusVariant = proj.status === 'Completed' ? 'success' : proj.status === 'On Hold' ? 'warning' : 'brand';

                  return (
                    <tr 
                      key={proj.id}
                      onClick={() => dispatch(setCurrentProject(proj.id))}
                      className={`
                        cursor-pointer transition-all hover:bg-slate-50/50 dark:hover:bg-darkBg-950/20
                        ${isSelected ? 'bg-brand-50/20 dark:bg-brand-950/10' : ''}
                      `}
                    >
                      {/* Name & icon details */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5 min-w-0 font-bold text-slate-800 dark:text-slate-200">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse-subtle" style={{ backgroundColor: proj.color || '#2563EB' }} />
                          <span className="truncate">{proj.name}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <Badge variant="gray" className="text-[9px] uppercase font-bold py-0.5">
                          {proj.category}
                        </Badge>
                      </td>

                      {/* Progress bar column */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-slate-100 dark:bg-darkBg-950 rounded-full overflow-hidden self-center">
                            <div 
                              className="h-full rounded-full" 
                              style={{ width: `${proj.progress}%`, backgroundColor: proj.color || '#2563EB' }}
                            />
                          </div>
                          <span className="font-extrabold text-slate-850 dark:text-slate-200 shrink-0">{proj.progress}%</span>
                        </div>
                      </td>

                      {/* Assigned members overlapping cluster */}
                      <td className="py-3 px-3">
                        <div className="flex -space-x-2.5 overflow-hidden">
                          {members.slice(0, 3).map(m => (
                            <img 
                              key={m.id}
                              src={m.avatar} 
                              alt={m.name} 
                              className="w-5.5 h-5.5 rounded-full object-cover ring-2 ring-white dark:ring-darkBg-900"
                              title={m.name}
                            />
                          ))}
                          {members.length > 3 && (
                            <div className="w-5.5 h-5.5 rounded-full bg-slate-100 dark:bg-darkBg-950 text-slate-500 flex items-center justify-center text-[8px] font-bold ring-2 ring-white dark:ring-darkBg-900 shrink-0">
                              +{members.length - 3}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Task loads */}
                      <td className="py-3 px-3 font-extrabold text-slate-750 dark:text-slate-200">
                        {proj.completedTasksCount}/{proj.tasksCount || 0} Tasks
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-3">
                        <Badge variant={priorityVariant} className="text-[9.5px] uppercase font-bold py-0.5">
                          {projPriority}
                        </Badge>
                      </td>

                      {/* Status badge */}
                      <td className="py-3 px-3">
                        <Badge variant={statusVariant} className="text-[9.5px] uppercase font-bold py-0.5">
                          {proj.status}
                        </Badge>
                      </td>

                      {/* Actions delete */}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => handleDelete(proj.id, proj.name, e)}
                          className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-darkBg-850/80 transition-colors"
                          title="Terminate Context"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Creation Modal Dialog */}
      <AnimatePresence>
        {modalOpen && (
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Scaffold Initiative Context"
            size="md"
          >
            <form onSubmit={handleCreateProject} className="space-y-4">
              <Input
                label="Initiative (Project) Name"
                id="projName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. System Security Overhaul"
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
                  Project Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize target priorities and constraints..."
                  rows={3}
                  className="w-full bg-white dark:bg-darkBg-900 border border-slate-200 focus:border-brand-500 dark:border-darkBg-880 dark:focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 text-xs rounded-lg p-3 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
                    Category Department
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white dark:bg-darkBg-900 border border-slate-200 focus:border-brand-500 dark:border-darkBg-880 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-105 transition-all duration-200"
                  >
                    <option value="Development">Development</option>
                    <option value="Security">Security</option>
                    <option value="Backend">Backend</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Design">Design</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
                    Priority Tier
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-white dark:bg-darkBg-900 border border-slate-200 focus:border-brand-500 dark:border-darkBg-880 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-105 transition-all duration-200"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <Input
                label="Target Launch Deadline"
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />

              {/* Members Assignment Cluster Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
                  Assign Team Roster Members
                </label>
                <div className="flex flex-wrap gap-2 pt-1.5">
                  {members.map(memb => {
                    const isSelected = selectedMembers.includes(memb.id);
                    return (
                      <button
                        key={memb.id}
                        type="button"
                        onClick={() => handleMemberToggle(memb.id)}
                        className={`
                          flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all select-none
                          ${isSelected 
                            ? 'bg-brand-50 border-brand-200 text-brand-700 dark:bg-brand-950/30 dark:border-brand-900/40 dark:text-brand-300' 
                            : 'bg-white border-slate-150 text-slate-500 hover:border-slate-250 dark:bg-darkBg-900 dark:border-darkBg-850 dark:text-slate-400 dark:hover:border-darkBg-800'
                          }
                        `}
                      >
                        <img src={memb.avatar} alt={memb.name} className="w-4.5 h-4.5 rounded-full object-cover" />
                        <span>{memb.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-darkBg-850/80 pt-4 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="gray"
                  size="sm"
                  onClick={() => setModalOpen(false)}
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
                  Scaffold Project
                </Button>
              </div>

            </form>
          </Modal>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Projects;
