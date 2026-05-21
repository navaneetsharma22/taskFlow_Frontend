import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, Bot, Zap } from 'lucide-react';
import { setAiAssistantOpen } from '../../redux/slices/uiSlice';
import { addTask } from '../../redux/slices/taskSlice';
import { addNotification } from '../../redux/slices/notificationSlice';

const AiAssistant = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.aiAssistantOpen);
  const currentProject = useSelector((state) => state.projects.currentProject);
  const [messages, setMessages] = useState([
    {
      id: 'm-1',
      sender: 'ai',
      text: "Hello! I am TaskFlow AI. I can generate tasks, suggest priority adjustments, or write automation workflows. Try asking: **'Generate 3 backend authentication tasks'**",
      time: 'Just now'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputVal.trim()) return;
    
    const userMsg = inputVal.trim();
    setMessages(prev => [...prev, { id: `m-usr-${Date.now()}`, sender: 'user', text: userMsg, time: 'Just now' }]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      let replyText = "I processed your request, but could not detect a specific automation trigger. Try asking me to **'generate tasks'** or **'prioritize backlog'**.";
      
      // Dynamic response matching
      if (userMsg.toLowerCase().includes('generate') && (userMsg.toLowerCase().includes('task') || userMsg.toLowerCase().includes('auth'))) {
        replyText = "Sure! I detected a request to **Generate Tasks**. I've successfully generated **3 secure authentication tasks** directly into the **Todo** column of your board. Let me know if you'd like to adjust their descriptions!";
        
        // Auto-add tasks to Redux
        const generatedTasks = [
          { title: 'AI: Setup JWT Refresh Token Rotation', description: 'Configure token blacklists and secure cookie policies to avoid session hijacking.', priority: 'High', tags: ['AI', 'Security'] },
          { title: 'AI: Write Input Sanitization Helpers', description: 'Prevent SQL injections and cross-site scripting (XSS) at route schema level.', priority: 'High', tags: ['AI', 'Backend'] },
          { title: 'AI: Integrate MFA Authentication routes', description: 'Develop endpoints for TOTP token validation (Google Authenticator compatible).', priority: 'Medium', tags: ['AI', 'Feature'] },
        ];
        
        generatedTasks.forEach(t => {
          dispatch(addTask({
            projectId: currentProject?.id || 'proj-1',
            title: t.title,
            description: t.description,
            priority: t.priority,
            tags: t.tags,
            status: 'Todo'
          }));
        });

        // Add system notification
        dispatch(addNotification({
          title: 'AI Smart Generation Triggered',
          description: '3 backend tasks added to board by TaskFlow AI.',
          type: 'ai'
        }));

      } else if (userMsg.toLowerCase().includes('prioritize') || userMsg.toLowerCase().includes('backlog')) {
        replyText = "Analyzing your backlog... 📊 I've evaluated current task deadlines and team workloads. I suggest escalating **'Implement Interactive Kanban Board'** to **High** priority due to the upcoming June 15 release window.";
      } else if (userMsg.toLowerCase().includes('hello') || userMsg.toLowerCase().includes('hi')) {
        replyText = "Hello! Ready to automate some work today? Ask me to generate tasks or suggest changes.";
      }

      setMessages(prev => [...prev, { id: `m-ai-${Date.now()}`, sender: 'ai', text: replyText, time: 'Just now' }]);
    }, 1200);
  };

  const handleSuggestionClick = (prompt) => {
    setInputVal(prompt);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(setAiAssistantOpen(false))}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] dark:bg-black/60"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 z-40 w-96 bg-white dark:bg-darkBg-900 border-l border-slate-100 dark:border-darkBg-850 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-darkBg-850 flex items-center justify-between bg-brand-600 dark:bg-brand-950/20 text-white dark:text-brand-400">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/10 dark:bg-brand-500/20">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight flex items-center gap-1.5">
                    TaskFlow AI Assistant
                  </h3>
                  <span className="text-[10px] text-white/70 dark:text-brand-300 font-medium">Powering enterprise automation</span>
                </div>
              </div>
              <button 
                onClick={() => dispatch(setAiAssistantOpen(false))}
                className="p-1 rounded-md hover:bg-white/10 dark:hover:bg-darkBg-800/80 text-white/80 dark:text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div 
                  key={m.id} 
                  className={`flex gap-2.5 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  {m.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-950/80 border border-brand-200/50 dark:border-brand-900/30 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4.5 h-4.5 text-brand-600 dark:text-brand-400" />
                    </div>
                  )}
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user' 
                      ? 'bg-brand-600 text-white rounded-tr-none' 
                      : 'bg-slate-50 dark:bg-darkBg-950 text-slate-850 dark:text-slate-200 border border-slate-100 dark:border-darkBg-850 rounded-tl-none'
                  }`}>
                    {/* Render Markdown bold style for demonstration */}
                    {m.text.split('**').map((chunk, idx) => 
                      idx % 2 === 1 ? <strong key={idx} className="font-semibold text-brand-700 dark:text-brand-300">{chunk}</strong> : chunk
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2.5 max-w-[85%]">
                  <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-950/80 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4.5 h-4.5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div className="bg-slate-50 dark:bg-darkBg-950 p-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-darkBg-850 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Actions Suggestions */}
            <div className="px-4 py-2 bg-slate-50/50 dark:bg-darkBg-950/50 border-t border-slate-100 dark:border-darkBg-850/80">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Suggested Commands
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleSuggestionClick("Generate 3 backend authentication tasks")}
                  className="flex items-center gap-1 px-2 py-1 text-[10px] rounded-lg border border-slate-200 bg-white hover:border-brand-500/50 hover:text-brand-600 dark:border-darkBg-800 dark:bg-darkBg-900 dark:text-slate-300 dark:hover:border-brand-500 dark:hover:text-brand-400 transition-all font-medium"
                >
                  <Zap className="w-3 h-3 text-amber-500" />
                  Generate tasks
                </button>
                <button
                  onClick={() => handleSuggestionClick("Prioritize backlog and assess workloads")}
                  className="flex items-center gap-1 px-2 py-1 text-[10px] rounded-lg border border-slate-200 bg-white hover:border-brand-500/50 hover:text-brand-600 dark:border-darkBg-800 dark:bg-darkBg-900 dark:text-slate-300 dark:hover:border-brand-500 dark:hover:text-brand-400 transition-all font-medium"
                >
                  <Bot className="w-3 h-3 text-brand-500" />
                  Prioritize backlog
                </button>
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-100 dark:border-darkBg-850 flex items-center gap-2 bg-white dark:bg-darkBg-900">
              <input
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask AI or type automation trigger..."
                className="flex-1 bg-slate-50 dark:bg-darkBg-950 border border-slate-100 dark:border-darkBg-850 text-xs rounded-xl py-2 px-3 focus:border-brand-500 dark:focus:border-brand-500 outline-none text-slate-900 dark:text-slate-200 placeholder-slate-400"
              />
              <button
                onClick={handleSend}
                disabled={!inputVal.trim()}
                className="p-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AiAssistant;
