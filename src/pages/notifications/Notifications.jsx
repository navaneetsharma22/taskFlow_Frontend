import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Bell, 
  CheckCircle, 
  Trash2, 
  Sparkles, 
  Zap, 
  Clock, 
  CheckSquare, 
  Building,
  UserCheck,
  ChevronRight,
  SlidersHorizontal,
  MailOpen,
  ArrowRight
} from 'lucide-react';
import { 
  markAllAsRead, 
  markAsRead, 
  clearAllNotifications,
  clearNotification
} from '../../redux/slices/notificationSlice';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const Notifications = () => {
  const dispatch = useDispatch();
  
  // Select notification logs from Redux
  const reduxNotifications = useSelector((state) => state.notifications.list);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);

  // Active Category tabs filtering
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Unread' | 'Sprints' | 'AI' | 'Automations'

  // Pre-seed mock records to populate visual examples requested by user
  const [localNotifications, setLocalNotifications] = useState([
    {
      id: 'notif-mock-1',
      title: 'Task Assigned',
      description: "Sarah Connor assigned 'Setup JWT Refresh Token Rotation' to you.",
      time: '2 min ago',
      type: 'sprint',
      unread: true,
      category: 'Sprints'
    },
    {
      id: 'notif-mock-2',
      title: 'AI Summary Ready',
      description: 'TaskFlow AI successfully compiled the project executive brief.',
      time: '5 min ago',
      type: 'ai',
      unread: true,
      category: 'AI'
    },
    {
      id: 'notif-mock-3',
      title: 'SLA Warning Triggered',
      description: "Task 'Integrate MFA Authentication' expires in less than 24 hours.",
      time: '12 min ago',
      type: 'automation',
      unread: true,
      category: 'Automations'
    },
    {
      id: 'notif-mock-4',
      title: 'Slack Webhook Fired',
      description: 'Outbound payload successfully synchronized to Slack channel #qa-alerts.',
      time: '30 min ago',
      type: 'automation',
      unread: false,
      category: 'Automations'
    },
    {
      id: 'notif-mock-5',
      title: 'Sprint Board Updated',
      description: "Project 'Cyberdyne Core' was successfully transitioned to Sprint Cycle Phase 2.",
      time: '1 hour ago',
      type: 'sprint',
      unread: false,
      category: 'Sprints'
    }
  ]);

  // Aggregate Redux logs with high-fidelity pre-seeds
  const allNotifications = [
    ...localNotifications,
    ...reduxNotifications.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      time: 'Just now',
      type: r.type || 'sprint',
      unread: r.unread ?? true,
      category: r.type === 'ai' ? 'AI' : r.type === 'system' ? 'Automations' : 'Sprints'
    }))
  ];

  // Filtering criteria based on selected Tab
  const filteredNotifications = allNotifications.filter(n => {
    if (activeTab === 'Unread') return n.unread;
    if (activeTab === 'Sprints') return n.category === 'Sprints';
    if (activeTab === 'AI') return n.category === 'AI';
    if (activeTab === 'Automations') return n.category === 'Automations';
    return true; // 'All'
  });

  const getIcon = (type) => {
    switch (type) {
      case 'ai':
        return <Sparkles className="w-4 h-4 text-amber-500 animate-pulse-subtle" />;
      case 'automation':
        return <Zap className="w-4 h-4 text-purple-500 animate-bounce" />;
      default:
        return <UserCheck className="w-4 h-4 text-brand-500" />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'ai':
        return 'bg-amber-50 dark:bg-amber-950/30 border-amber-100/10';
      case 'automation':
        return 'bg-purple-50 dark:bg-purple-950/30 border-purple-100/10';
      default:
        return 'bg-brand-50 dark:bg-brand-950/30 border-brand-100/10';
    }
  };

  // Mark all unread as read
  const handleMarkAllRead = () => {
    // Sync Redux
    dispatch(markAllAsRead());
    
    // Sync Local Seeds
    setLocalNotifications(prev => prev.map(n => ({ ...n, unread: false })));

    dispatch(addNotification({
      title: 'Logs Updated',
      description: 'Marked all unread notifications as read.',
      type: 'system'
    }));
  };

  // Clear all lists
  const handleClearAll = () => {
    dispatch(clearAllNotifications());
    setLocalNotifications([]);

    dispatch(addNotification({
      title: 'Logs Cleared',
      description: 'Cleared notification center history logs.',
      type: 'danger'
    }));
  };

  // Mark specific item as read
  const handleMarkItemRead = (id) => {
    // Check if it is a local pre-seed
    if (id.startsWith('notif-mock-')) {
      setLocalNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    } else {
      dispatch(markAsRead(id));
    }

    dispatch(addNotification({
      title: 'Notification Read',
      description: 'Selected notification asset archived.',
      type: 'system'
    }));
  };

  // Delete specific item
  const handleDeleteItem = (id, e) => {
    e.stopPropagation();
    if (id.startsWith('notif-mock-')) {
      setLocalNotifications(prev => prev.filter(n => n.id !== id));
    } else {
      dispatch(clearNotification(id));
    }

    dispatch(addNotification({
      title: 'Notification Deleted',
      description: 'Selected notification permanently removed.',
      type: 'danger'
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs select-none">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-500 animate-pulse-subtle" />
            Workspace Notification Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Govern in-app assignments, AI roadmap triggers, and outbound Slack webhook deliveries.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={allNotifications.filter(n => n.unread).length === 0}
            icon={<MailOpen className="w-3.5 h-3.5" />}
            className="font-bold"
          >
            Mark All Read
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleClearAll}
            disabled={allNotifications.length === 0}
            icon={<Trash2 className="w-3.5 h-3.5" />}
            className="font-bold"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Tabs segment buttons filters */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 dark:border-darkBg-850 pb-2 w-full">
        {['All', 'Unread', 'Sprints', 'AI', 'Automations'].map((tab) => {
          const tabCount = allNotifications.filter(n => {
            if (tab === 'Unread') return n.unread;
            if (tab === 'Sprints') return n.category === 'Sprints';
            if (tab === 'AI') return n.category === 'AI';
            if (tab === 'Automations') return n.category === 'Automations';
            return true;
          }).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition-all border shrink-0 flex items-center gap-1.5
                ${activeTab === tab 
                  ? 'bg-brand-50 border-brand-100 text-brand-650 dark:bg-brand-950/20 dark:border-brand-950 text-brand-650 dark:text-brand-400' 
                  : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-darkBg-850/50 text-slate-500 dark:text-slate-455'
                }
              `}
            >
              <span>{tab} Logs</span>
              <Badge variant={activeTab === tab ? 'brand' : 'gray'} className="text-[8.5px] py-0 px-1.5 font-bold">
                {tabCount}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Main Notification stream flow list */}
      <div className="space-y-3">
        
        {filteredNotifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => notif.unread && handleMarkItemRead(notif.id)}
            className="cursor-pointer"
          >
            <Card
              hoverEffect
              className={`
                p-4 bg-white dark:bg-darkBg-900 border transition-all duration-200 rounded-16 flex items-start justify-between gap-4 shadow-sm
                ${notif.unread 
                  ? 'border-brand-500/25 dark:border-brand-500/15 ring-2 ring-brand-500/5' 
                  : 'border-slate-100 dark:border-darkBg-850 opacity-80 hover:opacity-100'
                }
              `}
            >
              
              <div className="flex gap-3.5 items-start">
                
                {/* Node icon bg */}
                <div className={`p-2.5 rounded-xl shrink-0 border ${getIconBg(notif.type)}`}>
                  {getIcon(notif.type)}
                </div>

                {/* Body details */}
                <div className="space-y-1">
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    
                    <h4 className="font-extrabold text-slate-900 dark:text-white leading-none">
                      {notif.title}
                    </h4>

                    {notif.unread && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse shrink-0" />
                    )}

                    <Badge variant="gray" className="text-[8px] py-0 px-1 font-semibold uppercase">{notif.category}</Badge>
                  </div>

                  <p className="text-[10.5px] text-slate-655 dark:text-slate-400 leading-relaxed max-w-xl">
                    {notif.description}
                  </p>

                  <span className="text-[9px] text-slate-400 font-semibold block pt-0.5">
                    ⏱️ {notif.time}
                  </span>

                </div>

              </div>

              {/* Action buttons on the right */}
              <div className="flex items-center gap-2 shrink-0">
                {notif.unread && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkItemRead(notif.id);
                    }}
                    className="p-1.5 rounded-lg border border-slate-100 hover:border-brand-500 bg-white hover:text-brand-500 dark:border-darkBg-850 dark:bg-darkBg-950 dark:hover:border-brand-500 text-slate-400 transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                
                <button
                  onClick={(e) => handleDeleteItem(notif.id, e)}
                  className="p-1.5 rounded-lg border border-slate-100 hover:border-red-500 bg-white hover:text-red-500 dark:border-darkBg-850 dark:bg-darkBg-950 dark:hover:border-red-550 text-slate-450 transition-colors"
                  title="Wipe notification log"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </Card>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="empty-state-container py-24 bg-white dark:bg-darkBg-900 border border-slate-100 dark:border-darkBg-850 rounded-16">
            <Bell className="w-12 h-12 text-slate-400 mb-3 animate-pulse-subtle" />
            <h4 className="font-bold text-slate-705 dark:text-slate-350">No Notifications logged</h4>
            <p className="text-[10px] text-slate-450 mt-1.5 max-w-[200px] text-center">
              All clear! You are fully caught up with team sprints, roadmap computations, and automations.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};

export default Notifications;
