import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Sparkles, 
  Send, 
  Bot, 
  Zap, 
  History, 
  Plus, 
  Trash2, 
  Layers, 
  Milestone,
  CheckCircle,
  FileText,
  Clock,
  ArrowRight,
  ClipboardCheck,
  Check,
  Building
} from 'lucide-react';
import { addTask } from '../../redux/slices/taskSlice';
import { addNotification } from '../../redux/slices/notificationSlice';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const AiAssistantPage = () => {
  const dispatch = useDispatch();
  
  // Redux selectors
  const currentProject = useSelector((state) => state.projects.currentProject);
  const user = useSelector((state) => state.auth.user);
  
  // State variables
  const [messages, setMessages] = useState([
    {
      id: 'm-1',
      sender: 'ai',
      text: "Hello! I am your TaskFlow AI Co-Pilot. I can generate roadmaps, auto-provision developer tasks, or write project summaries based on active project scopes.",
      time: '11:42 AM',
      type: 'text'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  
  // Chat History Sidebar list
  const [chatHistory, setChatHistory] = useState([
    { id: 'h-1', title: 'Authentication Roadmap', category: 'Today', active: true },
    { id: 'h-2', title: 'Backlog Load Analysis', category: 'Today', active: false },
    { id: 'h-3', title: 'SLA Webhook Triggers', category: 'Yesterday', active: false },
    { id: 'h-4', title: 'Database Security Audit', category: 'Older', active: false }
  ]);

  const chatEndRef = useRef(null);

  // Auto-scroll chat area
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Copy Message to clipboard helper
  const handleCopyMessage = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    dispatch(addNotification({
      title: 'Copied to Clipboard',
      description: 'AI response text copied successfully.',
      type: 'system'
    }));
  };

  // Dispatch prompt submission
  const handleSend = (overrideText = null) => {
    const userMsg = (overrideText || inputVal).trim();
    if (!userMsg) return;

    setMessages(prev => [...prev, {
      id: `m-usr-${Date.now()}`,
      sender: 'user',
      text: userMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    }]);

    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let replyText = "I processed your request, but could not detect a specific AI prompt action. Try using our quick commands: **'Generate roadmap'**, **'Generate tasks'** or **'Summarize project'**.";
      let replyType = 'text';
      let payload = null;

      const lowerMsg = userMsg.toLowerCase();

      // Action 1: Generate Roadmap
      if (lowerMsg.includes('roadmap') || lowerMsg.includes('milestone')) {
        replyType = 'roadmap';
        replyText = `### Project Roadmap: ${currentProject?.name || 'Cyberdyne Core'}\nI've generated a 3-stage visual roadmap based on active initiatives:`;
        payload = [
          { step: 'Phase 1: Architecture & Auth Setup', desc: 'Bootstrap server containers, setup JWT sessions, and write sanitization filters.', status: 'Complete' },
          { step: 'Phase 2: Sprint Board & Websockets', desc: 'Deploy Kanban board layouts and wire up real-time collaboration listeners.', status: 'Active' },
          { step: 'Phase 3: Automated SLA Reporting', desc: 'Connect cron jobs, calculate developer metrics, and deploy BI dashboards.', status: 'Scheduled' }
        ];

        dispatch(addNotification({
          title: 'Roadmap Generated',
          description: 'SaaS Initiative roadmap computed successfully.',
          type: 'ai'
        }));
      }

      // Action 2: Generate Tasks
      else if (lowerMsg.includes('generate task') || lowerMsg.includes('create task') || lowerMsg.includes('tasks')) {
        replyType = 'tasks';
        replyText = "Sure! I detected a request to **Generate Tasks**. I've successfully provisioned **3 developer sprint tasks** directly into your **Todo** column in Redux. Let me know if you would like to edit their details:";
        payload = [
          { title: 'AI: Setup JWT Refresh Token Rotation', desc: 'Configure blacklists and secure cookie storage values.', priority: 'High', dept: 'Engineering' },
          { title: 'AI: Write Input Sanitization Helpers', desc: 'Block SQL injections and cross-site scripting (XSS) at gateway route layers.', priority: 'High', dept: 'Security' },
          { title: 'AI: Integrate MFA Authentication endpoints', desc: 'Establish endpoint validations supporting standard TOTP applications.', priority: 'Medium', dept: 'Engineering' }
        ];

        // Auto-add tasks to Redux list
        payload.forEach(t => {
          dispatch(addTask({
            projectId: currentProject?.id || 'proj-1',
            title: t.title,
            description: t.desc,
            priority: t.priority,
            department: t.dept,
            assignedBy: 'TaskFlow AI',
            tags: ['AI', t.dept],
            status: 'Todo'
          }));
        });

        dispatch(addNotification({
          title: 'AI Tasks Provisioned',
          description: '3 developer backlog items auto-added by TaskFlow AI.',
          type: 'ai'
        }));
      }

      // Action 3: Summarize Project
      else if (lowerMsg.includes('summarize') || lowerMsg.includes('summary') || lowerMsg.includes('brief')) {
        replyType = 'summary';
        replyText = `### Executive Summary: ${currentProject?.name || 'Cyberdyne Systems'}\nPlatform overview calculated as of today:`;
        payload = {
          name: currentProject?.name || 'Cyberdyne Core',
          progress: currentProject?.progress || 74,
          blockers: 'None active (latency optimized)',
          workload: 'Engineering is operating at optimal capacity.',
          recommendation: 'Escalate remaining checklist items to complete Phase 2 sprints early.'
        };

        dispatch(addNotification({
          title: 'Summary Calculated',
          description: 'Project executive briefing compiled.',
          type: 'ai'
        }));
      }

      setMessages(prev => [...prev, {
        id: `m-ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: replyType,
        payload
      }]);

    }, 1300);
  };

  // Add brand-new history session
  const handleNewSession = () => {
    const newId = `h-${Date.now()}`;
    const newTitle = `AI Chat Session #${chatHistory.length + 1}`;
    
    setChatHistory(prev => [
      { id: newId, title: newTitle, category: 'Today', active: true },
      ...prev.map(c => ({ ...c, active: false }))
    ]);

    setMessages([
      {
        id: `m-${Date.now()}`,
        sender: 'ai',
        text: `Welcome to ${newTitle}! Ask me to generate roadmaps, provision developer tasks, or write project summaries.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      }
    ]);

    dispatch(addNotification({
      title: 'New Chat Session',
      description: 'Reset AI Assistant workspace logs.',
      type: 'system'
    }));
  };

  // Delete chat session
  const handleDeleteSession = (id, e) => {
    e.stopPropagation();
    setChatHistory(prev => prev.filter(c => c.id !== id));
    dispatch(addNotification({
      title: 'Session Purged',
      description: 'Historical conversation session wiped.',
      type: 'danger'
    }));
  };

  // Swap active chat logs
  const handleSelectSession = (id) => {
    setChatHistory(prev => prev.map(c => ({ ...c, active: c.id === id })));
    dispatch(addNotification({
      title: 'Workspace Loaded',
      description: 'AI session history state synced.',
      type: 'system'
    }));
  };

  return (
    <div className="flex bg-slate-50 text-slate-900 dark:bg-darkBg-950 dark:text-slate-100 min-h-[calc(100vh-140px)] rounded-16 border border-slate-150/10 overflow-hidden text-xs select-none">
      
      {/* 1. LEFT PANEL: HISTORY SIDEBAR */}
      <div className="w-64 border-r border-slate-100 dark:border-darkBg-850 bg-white dark:bg-darkBg-900 flex flex-col shrink-0 hidden md:flex">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-darkBg-850 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <History className="w-4 h-4 text-brand-500" />
            <span>AI Chat Logs</span>
          </div>
          <button
            onClick={handleNewSession}
            className="p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-darkBg-850 text-slate-450 hover:text-brand-500 transition-colors border border-slate-150/10"
            title="Start new conversation"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* List of chat items by categories */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3.5">
          {['Today', 'Yesterday', 'Older'].map(category => {
            const catItems = chatHistory.filter(c => c.category === category);
            if (catItems.length === 0) return null;

            return (
              <div key={category} className="space-y-1">
                <span className="px-2 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  {category}
                </span>
                
                <div className="space-y-0.5">
                  {catItems.map(chat => (
                    <div
                      key={chat.id}
                      onClick={() => handleSelectSession(chat.id)}
                      className={`
                        group flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer transition-all border
                        ${chat.active 
                          ? 'bg-brand-50/40 border-brand-100 dark:bg-brand-950/20 dark:border-brand-950 text-brand-650 dark:text-brand-400 font-bold' 
                          : 'border-transparent hover:bg-slate-50 dark:hover:bg-darkBg-850/40 text-slate-500 dark:text-slate-400'
                        }
                      `}
                    >
                      <span className="truncate flex-1 pl-0.5">{chat.title}</span>
                      
                      <button
                        onClick={(e) => handleDeleteSession(chat.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-red-500 transition-opacity"
                        title="Delete thread logs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* 2. RIGHT PANEL: MAIN CHAT WORKSPACE */}
      <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-darkBg-950/20">
        
        {/* Workspace Active Header */}
        <div className="p-4 border-b border-slate-100 dark:border-darkBg-850 bg-white dark:bg-darkBg-900 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-50 text-brand-650 dark:bg-brand-950/40 dark:text-brand-400 border border-brand-100/10 animate-pulse-subtle">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                TaskFlow AI Intelligence Suite
              </h2>
              <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">
                Active Initiative Context: <strong className="text-brand-600 dark:text-brand-400 font-bold">{currentProject?.name || 'Cyberdyne Systems'}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Chat Stream Bubble Flow */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            
            return (
              <div 
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* AI Icon Avatar */}
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-950/80 border border-brand-200/50 dark:border-brand-900/30 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-brand-650 dark:text-brand-400" />
                  </div>
                )}

                <div className="space-y-1">
                  {/* Bubble Container */}
                  <div className={`p-4 rounded-2xl text-[11.5px] leading-relaxed relative group ${
                    isUser 
                      ? 'bg-brand-600 text-white rounded-tr-none shadow-md' 
                      : 'bg-white dark:bg-darkBg-900 text-slate-850 dark:text-slate-200 border border-slate-100 dark:border-darkBg-850 rounded-tl-none shadow-sm'
                  }`}>
                    
                    {/* Render standard markup values */}
                    <div className="prose dark:prose-invert max-w-none text-xs font-normal">
                      {m.text.split('\n').map((para, pIdx) => (
                        <p key={pIdx} className="mb-2 last:mb-0">
                          {para.split('**').map((chunk, cIdx) => 
                            cIdx % 2 === 1 ? <strong key={cIdx} className="font-extrabold text-brand-650 dark:text-brand-300">{chunk}</strong> : chunk
                          )}
                        </p>
                      ))}
                    </div>

                    {/* DYNAMIC RENDERS: Action 1 - Roadmap steps visual */}
                    {m.type === 'roadmap' && m.payload && (
                      <div className="mt-3.5 space-y-3 border-t border-slate-100 dark:border-darkBg-850/85 pt-3.5 animate-fade-in">
                        {m.payload.map((r, stepIdx) => (
                          <div key={stepIdx} className="flex gap-2.5 items-start">
                            <div className="p-1 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 mt-0.5">
                              <Milestone className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800 dark:text-slate-100">{r.step}</span>
                                <Badge variant={r.status === 'Complete' ? 'success' : r.status === 'Active' ? 'brand' : 'gray'} className="text-[8px] font-bold py-0">
                                  {r.status}
                                </Badge>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{r.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* DYNAMIC RENDERS: Action 2 - Generated tasks table list */}
                    {m.type === 'tasks' && m.payload && (
                      <div className="mt-3.5 space-y-2 border-t border-slate-100 dark:border-darkBg-850/85 pt-3.5 animate-fade-in">
                        {m.payload.map((t, tIdx) => (
                          <div key={tIdx} className="flex items-center justify-between gap-3 p-2 bg-slate-50 dark:bg-darkBg-950/60 border border-slate-100/50 dark:border-darkBg-850/50 rounded-xl">
                            <div className="min-w-0">
                              <span className="font-bold text-slate-800 dark:text-slate-150 block truncate">{t.title}</span>
                              <span className="text-[9.5px] text-slate-400 block truncate">{t.desc}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Badge variant={t.priority === 'High' ? 'danger' : 'warning'} className="text-[8px] font-bold py-0.5">{t.priority}</Badge>
                              <Badge variant="gray" className="text-[8px] font-bold py-0.5">{t.dept}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* DYNAMIC RENDERS: Action 3 - Executive brief summary */}
                    {m.type === 'summary' && m.payload && (
                      <div className="mt-3.5 space-y-3.5 border-t border-slate-100 dark:border-darkBg-850/85 pt-3.5 animate-fade-in text-[10.5px]">
                        
                        <div className="grid grid-cols-2 gap-3.5">
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-darkBg-950/50 border border-slate-150/10">
                            <span className="text-[8.5px] text-slate-400 font-extrabold uppercase tracking-wider block">Initiative Name</span>
                            <span className="font-bold text-slate-850 dark:text-slate-100 mt-0.5 block truncate">{m.payload.name}</span>
                          </div>
                          
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-darkBg-950/50 border border-slate-150/10">
                            <span className="text-[8.5px] text-slate-400 font-extrabold uppercase tracking-wider block">Target Progress</span>
                            <span className="font-extrabold text-emerald-500 mt-0.5 block">{m.payload.progress}% SLA</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-darkBg-950/50 border border-slate-150/10 space-y-2">
                          <div>
                            <span className="text-[8.5px] text-slate-400 font-extrabold uppercase tracking-wider block">Critical Blockers</span>
                            <span className="text-slate-700 dark:text-slate-200 mt-0.5 block font-medium">{m.payload.blockers}</span>
                          </div>
                          <div>
                            <span className="text-[8.5px] text-slate-400 font-extrabold uppercase tracking-wider block">AI Strategic Recommendation</span>
                            <span className="text-brand-650 dark:text-brand-400 mt-0.5 block font-bold leading-relaxed">{m.payload.recommendation}</span>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* Copy Response overlay button */}
                    {!isUser && (
                      <button
                        onClick={() => handleCopyMessage(m.text, m.id)}
                        className="opacity-0 group-hover:opacity-100 absolute right-3 bottom-3 p-1 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-darkBg-850 dark:hover:bg-darkBg-800 text-slate-400 hover:text-brand-500 transition-all border border-slate-150/10"
                        title="Copy text"
                      >
                        {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <ClipboardCheck className="w-3.5 h-3.5" />}
                      </button>
                    )}

                  </div>

                  {/* Stamp Time */}
                  <span className={`text-[8.5px] text-slate-400 font-semibold block ${isUser ? 'text-right mr-1' : 'ml-1'}`}>
                    {m.time}
                  </span>
                </div>

              </div>
            );
          })}

          {/* Typing animation bubble */}
          {isTyping && (
            <div className="flex gap-3 max-w-[85%] mr-auto items-start">
              <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-950/80 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-brand-650 dark:text-brand-400" />
              </div>
              <div className="bg-white dark:bg-darkBg-900 p-4.5 rounded-2xl rounded-tl-none border border-slate-100 dark:border-darkBg-850 flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-450 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-450 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-450 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* BOTTOM SECTION: ACTIONS & INPUT text box */}
        <div className="p-4 border-t border-slate-100 dark:border-darkBg-850 bg-white dark:bg-darkBg-900 space-y-3 shrink-0">
          
          {/* Quick Actions Row */}
          <div className="flex flex-wrap gap-2.5 items-center justify-center sm:justify-start">
            
            {/* Action 1: Roadmap */}
            <button
              onClick={() => handleSend("Generate roadmap for current active sprint")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-brand-500/50 hover:text-brand-600 dark:border-darkBg-850 dark:bg-darkBg-950/60 dark:text-slate-350 dark:hover:border-brand-500 dark:hover:text-brand-400 transition-all font-bold text-[10px]"
            >
              <Milestone className="w-3.5 h-3.5 text-indigo-500" />
              Generate roadmap
            </button>

            {/* Action 2: Generate Tasks */}
            <button
              onClick={() => handleSend("Generate task assets and assign to members")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-brand-500/50 hover:text-brand-600 dark:border-darkBg-850 dark:bg-darkBg-950/60 dark:text-slate-350 dark:hover:border-brand-500 dark:hover:text-brand-400 transition-all font-bold text-[10px]"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Generate tasks
            </button>

            {/* Action 3: Summarize Project */}
            <button
              onClick={() => handleSend("Summarize project status, milestones and blockers")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-brand-500/50 hover:text-brand-600 dark:border-darkBg-850 dark:bg-darkBg-950/60 dark:text-slate-350 dark:hover:border-brand-500 dark:hover:text-brand-400 transition-all font-bold text-[10px]"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              Summarize project
            </button>

          </div>

          {/* Centered input textbox bar */}
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask AI co-pilot or write automation commands..."
              className="w-full bg-slate-50 dark:bg-darkBg-950 border border-slate-200 focus:border-brand-500 dark:border-darkBg-850 dark:focus:border-brand-500 text-xs rounded-xl py-3 pl-4 pr-12 outline-none text-slate-905 dark:text-slate-100 placeholder-slate-450 transition-all focus:ring-2 focus:ring-brand-500/10 shadow-sm"
              autoFocus
            />
            
            <button
              onClick={() => handleSend()}
              disabled={!inputVal.trim()}
              className="absolute right-2 top-2 p-2 rounded-lg bg-brand-500 hover:bg-brand-650 text-white disabled:opacity-40 disabled:pointer-events-none transition-all shadow"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AiAssistantPage;
