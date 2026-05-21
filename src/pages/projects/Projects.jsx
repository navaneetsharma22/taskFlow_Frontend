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
  TrendingUp
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
  
  const projects = useSelector((state) => state.projects.list);
  const activeProject = useSelector((state) => state.projects.currentProject);
  const members = useSelector((state) => state.auth.members);

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Development');
  const [dueDate, setDueDate] = useState('');
  const [selectedMembers, setSelectedMembers] = useState(['usr-101']);

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    dispatch(createProject({
      name,
      description,
      category,
      dueDate,
      members: selectedMembers,
    }));

    dispatch(addNotification({
      title: 'New Project Scaffolded',
      description: `Project "${name}" was created successfully under your organization context.`,
      type: 'system'
    }));

    // Reset Form
    setName('');
    setDescription('');
    setCategory('Development');
    setDueDate('');
    setSelectedMembers(['usr-101']);
    setModalOpen(false);
  };

  const handleDelete = (projId, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project? This will permanently wipe all associated task assets.')) {
      dispatch(deleteProject(projId));
      dispatch(addNotification({
        title: 'Project Deleted',
        description: 'An existing project has been deleted from your workspace.',
        type: 'system'
      }));
    }
  };

  const handleMemberToggle = (membId) => {
    setSelectedMembers(prev => 
      prev.includes(membId) ? prev.filter(id => id !== membId) : [...prev, membId]
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Workspace Projects
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build and manage enterprise isolated SaaS initiatives.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setModalOpen(true)}
          icon={<FolderPlus className="w-4 h-4" />}
        >
          Create Project
        </Button>
      </div>

      {/* Active Selection Display Banner */}
      {activeProject && (
        <Card className="bg-gradient-to-r from-brand-600/10 to-indigo-600/10 border-brand-500/20 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: activeProject.color }} />
            <div>
              <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest block">
                Currently Selected Context
              </span>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                {activeProject.name}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="brand" className="text-[10.5px]">
              {activeProject.category}
            </Badge>
            <Badge variant="success" className="text-[10.5px]">
              {activeProject.status}
            </Badge>
          </div>
        </Card>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => {
          const isSelected = activeProject?.id === proj.id;
          
          return (
            <Card
              key={proj.id}
              hoverEffect
              onClick={() => dispatch(setCurrentProject(proj.id))}
              className={`
                relative flex flex-col justify-between p-5 bg-white dark:bg-darkBg-900 border transition-all cursor-pointer h-full min-h-[185px]
                ${isSelected 
                  ? 'border-brand-500/80 dark:border-brand-500/80 shadow-premium glow-effect' 
                  : 'border-slate-100 hover:border-slate-200 dark:border-darkBg-850 dark:hover:border-darkBg-800'
                }
              `}
            >
              {/* Top Banner Category & Action */}
              <div className="flex items-center justify-between mb-3.5">
                <Badge variant="gray" className="text-[9.5px] uppercase font-extrabold tracking-wider">
                  {proj.category}
                </Badge>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleDelete(proj.id, e)}
                    className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-darkBg-850/80 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div className="flex-1 mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1 leading-snug">
                  {proj.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              {/* Bottom Metrics Bar */}
              <div className="border-t border-slate-50 dark:border-darkBg-850/80 pt-3.5 flex items-center justify-between">
                
                {/* Due Date Indicator */}
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{proj.dueDate}</span>
                </div>

                {/* Progress Circle & Text */}
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
                      {proj.progress}%
                    </span>
                    <span className="text-[9px] text-slate-400 block tracking-tight font-medium">
                      {proj.completedTasksCount}/{proj.tasksCount} Done
                    </span>
                  </div>
                  <div className="w-10 h-1.5 bg-slate-100 dark:bg-darkBg-950 rounded-full overflow-hidden self-center">
                    <div 
                      className="h-full rounded-full" 
                      style={{ width: `${proj.progress}%`, backgroundColor: proj.color }}
                    />
                  </div>
                </div>

              </div>

            </Card>
          );
        })}
      </div>

      {/* Creation Modal Dialog */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Scaffold New Project Context"
        size="md"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <Input
            label="Project Name"
            id="projName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Platform Overhaul"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wide select-none">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed, secure description of this initiative..."
              rows={3}
              className="w-full bg-white dark:bg-darkBg-900 border border-slate-200 focus:border-brand-500 dark:border-darkBg-800 dark:focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 text-xs rounded-lg p-3 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wide select-none">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white dark:bg-darkBg-900 border border-slate-200 focus:border-brand-500 dark:border-darkBg-800 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-100 transition-all duration-200"
              >
                <option value="Development">Development</option>
                <option value="Security">Security</option>
                <option value="Backend">Backend</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
              </select>
            </div>

            <Input
              label="Target Due Date"
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          {/* Members Assignment Cluster Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wide select-none">
              Assign Team Members
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
                      flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition-all select-none
                      ${isSelected 
                        ? 'bg-brand-50 border-brand-200 text-brand-700 dark:bg-brand-950/30 dark:border-brand-900/40 dark:text-brand-300' 
                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200 dark:bg-darkBg-900 dark:border-darkBg-850 dark:text-slate-400 dark:hover:border-darkBg-800'
                      }
                    `}
                  >
                    <img src={memb.avatar} alt={memb.name} className="w-4 h-4 rounded-full object-cover" />
                    <span>{memb.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-50 dark:border-darkBg-850/80 pt-4 flex items-center justify-end gap-2.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Scaffold Project
            </Button>
          </div>

        </form>
      </Modal>

    </div>
  );
};

export default Projects;
