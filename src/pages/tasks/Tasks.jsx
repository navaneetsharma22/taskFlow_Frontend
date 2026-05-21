import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  MessageSquare, 
  CheckSquare, 
  Calendar, 
  ArrowRight, 
  Trash2, 
  ChevronRight,
  Sparkles,
  Bot,
  User,
  PlusCircle
} from 'lucide-react';
import { 
  addTask, 
  updateTask, 
  deleteTask, 
  moveTask, 
  toggleSubtask, 
  addComment, 
  selectTask, 
  clearSelectTask,
  setFilters
} from '../../redux/slices/taskSlice';
import { addNotification } from '../../redux/slices/notificationSlice';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { toggleAiAssistant } from '../../redux/slices/uiSlice';
import { AnimatePresence } from 'framer-motion';

const Tasks = () => {
  const dispatch = useDispatch();
  
  const currentProject = useSelector((state) => state.projects.currentProject);
  const tasks = useSelector((state) => state.tasks.list);
  const selectedTask = useSelector((state) => state.tasks.selectedTask);
  const filters = useSelector((state) => state.tasks.filters);
  const members = useSelector((state) => state.auth.members);
  const user = useSelector((state) => state.auth.user);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('usr-101');
  const [taskTags, setTaskTags] = useState('');
  
  const [newComment, setNewComment] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  const columns = ['Todo', 'In Progress', 'Review', 'Done'];

  // Filter tasks based on current project and active filters
  const filteredTasks = tasks.filter(task => {
    if (task.projectId !== currentProject?.id) return false;
    
    const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                          task.description.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesPriority = filters.priority === 'All' || task.priority === filters.priority;
    
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (prio) => {
    switch (prio) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'gray';
    }
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !currentProject) return;

    const tagsArr = taskTags.split(',').map(t => t.trim()).filter(Boolean);

    dispatch(addTask({
      projectId: currentProject.id,
      title: taskTitle,
      description: taskDesc,
      priority: taskPriority,
      dueDate: taskDueDate,
      assignee: taskAssignee,
      tags: tagsArr,
    }));

    dispatch(addNotification({
      title: 'Task Created Successfully',
      description: `Task "${taskTitle}" has been added to project "${currentProject.name}" board.`,
      type: 'user'
    }));

    // Reset Form
    setTaskTitle('');
    setTaskDesc('');
    setTaskPriority('Medium');
    setTaskDueDate('');
    setTaskAssignee('usr-101');
    setTaskTags('');
    setCreateModalOpen(false);
  };

  const handleDeleteTask = (taskId, e) => {
    e.stopPropagation();
    if (confirm('Permanently wipe this task?')) {
      dispatch(deleteTask(taskId));
      dispatch(addNotification({
        title: 'Task Wiped',
        description: 'An existing task has been deleted from your project space.',
        type: 'system'
      }));
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTask) return;

    dispatch(addComment({
      taskId: selectedTask.id,
      commentText: newComment,
      user: {
        name: user.name,
        avatar: user.avatar
      }
    }));
    setNewComment('');
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtask.trim() || !selectedTask) return;

    const currentSubtasks = selectedTask.subtasks || [];
    const updatedSubtasks = [
      ...currentSubtasks,
      { id: `sub-${Date.now()}`, title: newSubtask, completed: false }
    ];

    dispatch(updateTask({
      id: selectedTask.id,
      subtasks: updatedSubtasks
    }));
    
    setNewSubtask('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Project Task Board
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Active project: <span className="font-bold text-brand-600 dark:text-brand-400">{currentProject?.name || 'None Selected'}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => dispatch(toggleAiAssistant())}
            icon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
          >
            AI Generator
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
            disabled={!currentProject}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Filter and Query Controllers Bar */}
      <Card className="p-3 bg-white dark:bg-darkBg-900 flex flex-col md:flex-row gap-3 items-center justify-between border border-slate-100 dark:border-darkBg-850">
        
        {/* Search Field */}
        <div className="relative w-full md:w-80">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
            placeholder="Search tasks by name or description..."
            className="w-full bg-slate-50 dark:bg-darkBg-950 border border-slate-100 dark:border-darkBg-850 text-xs rounded-xl py-2 pl-9 pr-3 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all"
          />
        </div>

        {/* Priority Filter tab list */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0 hidden sm:inline" />
          <div className="flex bg-slate-50 dark:bg-darkBg-950 p-1 border border-slate-100 dark:border-darkBg-850/80 rounded-xl text-[10.5px] font-bold text-slate-500 select-none">
            {['All', 'High', 'Medium', 'Low'].map(prio => (
              <button
                key={prio}
                onClick={() => dispatch(setFilters({ priority: prio }))}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  filters.priority === prio 
                    ? 'bg-white dark:bg-darkBg-900 text-slate-800 dark:text-slate-200 shadow-sm' 
                    : 'hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                {prio}
              </button>
            ))}
          </div>
        </div>

      </Card>

      {/* Kanban Board Columns Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4.5 items-start">
        {columns.map((colName) => {
          const colTasks = filteredTasks.filter(t => t.status === colName);
          
          return (
            <div 
              key={colName} 
              className="bg-slate-100/50 dark:bg-darkBg-950/30 border border-slate-200/20 dark:border-darkBg-850/30 rounded-xl p-3.5 flex flex-col max-h-[80vh] min-h-[500px]"
            >
              {/* Column Title and count */}
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-200/30 dark:border-darkBg-850/30">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-850 dark:text-slate-200 tracking-wide select-none">
                    {colName}
                  </span>
                  <Badge variant="gray" size="sm" className="text-[10px] py-0 px-1.5 font-bold">
                    {colTasks.length}
                  </Badge>
                </div>
              </div>

              {/* Tasks List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colTasks.map((task) => {
                  const taskAssigneeObj = members.find(m => m.id === task.assignee);
                  const subCount = task.subtasks?.length || 0;
                  const compCount = task.subtasks?.filter(s => s.completed).length || 0;

                  return (
                    <Card
                      key={task.id}
                      hoverEffect
                      onClick={() => dispatch(selectTask(task.id))}
                      className="p-4 bg-white dark:bg-darkBg-900 border border-slate-100 hover:border-brand-500/50 dark:border-darkBg-850 dark:hover:border-brand-500/30 cursor-pointer relative"
                    >
                      {/* Priority Tag & Actions */}
                      <div className="flex items-center justify-between mb-3.5">
                        <Badge variant={getPriorityColor(task.priority)} size="sm" className="text-[9.5px] font-extrabold uppercase tracking-wide">
                          {task.priority}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {/* Visual move button (highly accessible in place of drag-and-drop) */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentIdx = columns.indexOf(task.status);
                              const nextIdx = (currentIdx + 1) % columns.length;
                              dispatch(moveTask({ taskId: task.id, newStatus: columns[nextIdx] }));
                            }}
                            className="p-1 rounded hover:bg-slate-50 dark:hover:bg-darkBg-850 text-slate-400 hover:text-brand-500 transition-colors"
                            title="Move to next status"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Task Info */}
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 select-none">
                        {task.title}
                      </h4>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {task.description}
                      </p>

                      {/* Subtasks Progress */}
                      {subCount > 0 && (
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-semibold mt-3 select-none">
                          <CheckSquare className="w-3 h-3 text-slate-400" />
                          <span>Checklist: {compCount}/{subCount}</span>
                        </div>
                      )}

                      {/* Info Row: Due Date & Member */}
                      <div className="border-t border-slate-50 dark:border-darkBg-850/80 pt-3 mt-3 flex items-center justify-between">
                        
                        <div className="flex items-center gap-1 text-[9.5px] text-slate-400 font-bold select-none">
                          <Calendar className="w-3 h-3" />
                          <span>{task.dueDate}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {task.comments?.length > 0 && (
                            <div className="flex items-center gap-0.5 text-[9px] text-slate-400 font-semibold mr-1.5">
                              <MessageSquare className="w-3 h-3" />
                              <span>{task.comments.length}</span>
                            </div>
                          )}
                          <img
                            src={taskAssigneeObj?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'}
                            alt={taskAssigneeObj?.name}
                            className="w-5.5 h-5.5 rounded-full object-cover ring-1 ring-slate-100 dark:ring-darkBg-800"
                            title={taskAssigneeObj?.name}
                          />
                        </div>

                      </div>

                    </Card>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

      {/* Task Creation Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Add New Task Asset"
        size="md"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Title"
            id="taskTitle"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="e.g. Write input sanitization helpers"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wide select-none">
              Task Description
            </label>
            <textarea
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              placeholder="Describe the technical requirements or actions to take..."
              rows={3}
              className="w-full bg-white dark:bg-darkBg-900 border border-slate-200 focus:border-brand-500 dark:border-darkBg-800 dark:focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 text-xs rounded-lg p-3 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wide select-none">
                Priority
              </label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                className="w-full bg-white dark:bg-darkBg-900 border border-slate-200 focus:border-brand-500 dark:border-darkBg-800 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-100 transition-all duration-200"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <Input
              label="Due Date"
              id="taskDueDate"
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wide select-none">
                Assignee
              </label>
              <select
                value={taskAssignee}
                onChange={(e) => setTaskAssignee(e.target.value)}
                className="w-full bg-white dark:bg-darkBg-900 border border-slate-200 focus:border-brand-500 dark:border-darkBg-800 dark:focus:border-brand-500 text-xs rounded-lg py-2 px-3 outline-none text-slate-900 dark:text-slate-100 transition-all duration-200"
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <Input
              label="Tags (comma-separated)"
              id="taskTags"
              value={taskTags}
              onChange={(e) => setTaskTags(e.target.value)}
              placeholder="UI, Setup, Core"
            />
          </div>

          <div className="border-t border-slate-50 dark:border-darkBg-850/80 pt-4 flex items-center justify-end gap-2.5">
            <Button variant="ghost" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Task Detail Inspector Drawer */}
      <Modal
        isOpen={!!selectedTask}
        onClose={() => dispatch(clearSelectTask())}
        title={selectedTask ? selectedTask.title : 'Task Details'}
        size="lg"
      >
        {selectedTask && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs select-none">
            
            {/* Left Main details */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-darkBg-950/60 border border-slate-100/50 dark:border-darkBg-850/50 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">
                  Description
                </span>
                <p className="text-[11px] text-slate-700 dark:text-slate-350 leading-relaxed">
                  {selectedTask.description || 'No description provided for this task asset.'}
                </p>
              </div>

              {/* Subtasks checklist */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                  Checklist / Action items
                </span>
                
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {selectedTask.subtasks?.map(sub => (
                    <label 
                      key={sub.id} 
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-darkBg-950/40 border border-slate-100/30 dark:border-darkBg-850/20 cursor-pointer"
                    >
                      <input 
                        type="checkbox" 
                        checked={sub.completed}
                        onChange={() => dispatch(toggleSubtask({ taskId: selectedTask.id, subtaskId: sub.id }))}
                        className="w-3.5 h-3.5 rounded bg-darkBg-950 border-darkBg-850 accent-brand-500" 
                      />
                      <span className={`text-[10.5px] font-medium leading-none ${sub.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {sub.title}
                      </span>
                    </label>
                  ))}
                  {selectedTask.subtasks?.length === 0 && (
                    <p className="text-[10px] text-slate-400">No subtasks defined. Add an action item below.</p>
                  )}
                </div>

                {/* Subtask addition form */}
                <form onSubmit={handleAddSubtask} className="flex gap-2 mt-2">
                  <input
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="Add action item..."
                    className="flex-1 bg-slate-50 dark:bg-darkBg-950 border border-slate-100 dark:border-darkBg-850 text-[10px] rounded-lg py-1.5 px-3 focus:border-brand-500 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  />
                  <Button type="submit" variant="secondary" size="sm" className="py-1">
                    Add
                  </Button>
                </form>
              </div>

              {/* Comments chain */}
              <div className="space-y-2 border-t border-slate-100 dark:border-darkBg-850/80 pt-4">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                  Discussion Thread
                </span>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {selectedTask.comments?.map(com => (
                    <div key={com.id} className="flex gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-darkBg-950/20 border border-slate-100/30 dark:border-darkBg-850/20">
                      <img src={com.userAvatar} alt={com.userName} className="w-5.5 h-5.5 rounded-full object-cover shrink-0" />
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-bold text-[10px] text-slate-700 dark:text-slate-300">{com.userName}</span>
                          <span className="text-[8px] text-slate-400">{new Date(com.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-[10px] text-slate-650 dark:text-slate-400 leading-normal">{com.text}</p>
                      </div>
                    </div>
                  ))}
                  {selectedTask.comments?.length === 0 && (
                    <p className="text-[10px] text-slate-400">No discussion comments. Start the thread below.</p>
                  )}
                </div>

                <form onSubmit={handleAddComment} className="flex gap-2 mt-2.5">
                  <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Type comments..."
                    className="flex-1 bg-slate-50 dark:bg-darkBg-950 border border-slate-100 dark:border-darkBg-850 text-[10px] rounded-lg py-1.5 px-3 focus:border-brand-500 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  />
                  <Button type="submit" variant="primary" size="sm" className="py-1">
                    Comment
                  </Button>
                </form>
              </div>

            </div>

            {/* Right Meta Column Panel */}
            <div className="space-y-4 lg:border-l lg:border-slate-100 lg:dark:border-darkBg-850/80 lg:pl-5">
              
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Status</span>
                <select
                  value={selectedTask.status}
                  onChange={(e) => dispatch(moveTask({ taskId: selectedTask.id, newStatus: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-darkBg-950 border border-slate-100 dark:border-darkBg-850 text-[11px] font-bold rounded-lg py-1.5 px-2.5 outline-none text-slate-800 dark:text-slate-200 transition-all"
                >
                  {columns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Assignee</span>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-darkBg-950/60 border border-slate-100/30 dark:border-darkBg-850/20">
                  <img
                    src={members.find(m => m.id === selectedTask.assignee)?.avatar}
                    className="w-6.5 h-6.5 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <span className="font-bold text-[10px] text-slate-700 dark:text-slate-200 block">
                      {members.find(m => m.id === selectedTask.assignee)?.name}
                    </span>
                    <span className="text-[8px] text-slate-400 block font-semibold uppercase">
                      {members.find(m => m.id === selectedTask.assignee)?.role}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Due Date</span>
                <span className="text-[10.5px] font-bold text-slate-700 dark:text-slate-350 block pl-1">
                  📅 {selectedTask.dueDate}
                </span>
              </div>

              {selectedTask.tags?.length > 0 && (
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Tags</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedTask.tags.map(t => (
                      <Badge key={t} variant="brand" className="text-[9px] py-0 px-2 font-bold">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* History trail */}
              <div className="pt-2 border-t border-slate-50 dark:border-darkBg-850/60">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Live Audit Trail</span>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                  {selectedTask.history?.map(hist => (
                    <div key={hist.id} className="text-[9px] text-slate-400 flex items-start gap-1">
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-darkBg-700 mt-1 shrink-0" />
                      <p className="leading-snug">
                        <strong className="text-slate-650 dark:text-slate-300 font-bold">{hist.user}</strong> {hist.action}{' '}
                        <span className="text-[8px] opacity-75">({new Date(hist.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={(e) => {
                    handleDeleteTask(selectedTask.id, e);
                    dispatch(clearSelectTask());
                  }}
                  variant="danger"
                  size="sm"
                  className="w-full text-xs font-bold"
                  icon={<Trash2 className="w-4 h-4" />}
                >
                  Delete Task Asset
                </Button>
              </div>

            </div>

          </div>
        )}
      </Modal>

    </div>
  );
};

export default Tasks;
