import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  PlusCircle, 
  Search, 
  Compass, 
  Minimize2, 
  HelpCircle 
} from 'lucide-react';
import { CampusGuide } from './CampusGuide';

export const CampusChatbot = ({ onOpenPrivacyModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'guide',
      text: "Hi there! I'm Aria, your Virtual Campus Guide. I'm here to help you navigate Campus Voice, submit anonymous complaints, or track your issues safely.",
      quickReplies: [
        { label: '🛡️ How does anonymity work?', query: 'How does anonymity work?' },
        { label: '📝 How do I submit a complaint?', query: 'How do I submit a complaint?' },
        { label: '🔍 How do I track my report?', query: 'How do I track my report?' },
        { label: '⚡ How does AI Triage work?', query: 'How does AI Triage work?' },
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Hide tooltip after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = (textToSend = null) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // AI/Guide intelligent response simulation
    setTimeout(() => {
      let responseText = "";
      let actionBtn = null;
      let nextReplies = [
        { label: '📝 Submit a Report', query: 'How do I submit a complaint?' },
        { label: '🔍 Track an ID', query: 'How do I track my report?' },
        { label: '🛡️ Privacy Model', query: 'How does anonymity work?' }
      ];

      const lower = query.toLowerCase();

      if (lower.includes('anonym') || lower.includes('privacy') || lower.includes('secret') || lower.includes('safe') || lower.includes('name')) {
        responseText = "Campus Voice uses Verified Anonymous Architecture. When you sign in, we verify your registered student status, but our backend completely decouples your name, roll number, and email. Administrators only see the complaint content and public ID (e.g., CV-A82F91), guaranteeing zero fear of retaliation!";
        actionBtn = {
          label: 'View Privacy Architecture',
          action: () => {
            if (onOpenPrivacyModal) onOpenPrivacyModal();
          }
        };
      } else if (lower.includes('submit') || lower.includes('report') || lower.includes('complain') || lower.includes('file') || lower.includes('grievance')) {
        responseText = "To submit a complaint, click on 'Submit Report' in the navigation bar or use the Complaint Wizard. You can choose a category (Wi-Fi, Hostel, Lab, Canteen, etc.), describe the problem, and our AI will automatically classify and summarize it for fast admin resolution.";
        actionBtn = {
          label: 'Go to Submit Report',
          action: () => navigate('/submit')
        };
      } else if (lower.includes('track') || lower.includes('status') || lower.includes('id') || lower.includes('cv-')) {
        responseText = "Every submitted complaint receives a unique Public Tracking ID like 'CV-A82F91'. You can paste this ID into the 'Track ID' search in the navbar or on the landing page to see real-time updates without logging in!";
        actionBtn = {
          label: 'Explore Active Issues',
          action: () => navigate('/issues')
        };
      } else if (lower.includes('ai') || lower.includes('triage') || lower.includes('smart') || lower.includes('group') || lower.includes('cluster')) {
        responseText = "Our AI Triage system analyzes the text of each grievance, assigns priority severity, matches relevant campus departments, and automatically links duplicate complaints together into unified Issue Clusters so campus authorities take action faster.";
        actionBtn = {
          label: 'Explore Issue Clusters',
          action: () => navigate('/issues')
        };
      } else if (lower.includes('who') || lower.includes('admin') || lower.includes('staff') || lower.includes('see')) {
        responseText = "Designated campus department heads and college administrators review grievances on their verified Admin Hub. However, because student identities are cryptographically stripped before storage, administrators never have access to your identity.";
      } else {
        responseText = `Thanks for asking! I'm here to help you navigate any campus concerns. You can submit grievances anonymously, track resolution progress with your Public ID, or browse active community issues.`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'guide',
          text: responseText,
          actionBtn: actionBtn,
          quickReplies: nextReplies
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 select-none">
      {/* Floating Chatbot Bubble / Launcher */}
      {!isOpen && (
        <div className="relative group">
          {/* Tooltip speech bubble */}
          {showTooltip && (
            <div className="absolute bottom-full right-0 mb-3 w-56 sm:w-64 p-3 rounded-2xl bg-white/95 dark:bg-wine-900/95 backdrop-blur-md border border-peach-300 dark:border-peach-400/30 shadow-xl text-xs text-wine-900 dark:text-cream-50 animate-guide-pop">
              <div className="flex items-start justify-between gap-1 mb-1">
                <span className="font-bold flex items-center gap-1 text-burgundy-800 dark:text-peach-400">
                  <Sparkles className="w-3.5 h-3.5 text-peach-600 dark:text-peach-400" />
                  Campus Guide Aria
                </span>
                <button 
                  onClick={() => setShowTooltip(false)}
                  className="text-wine-400 hover:text-wine-700 dark:text-cream-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className="leading-snug text-[11px] sm:text-xs text-wine-700 dark:text-cream-200">
                Need help reporting an issue or tracking a complaint? I'm here for you!
              </p>
              {/* Pointer triangle */}
              <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-white dark:bg-wine-900 border-r border-b border-peach-300 dark:border-peach-400/30 transform rotate-45"></div>
            </div>
          )}

          {/* Main Launcher Button */}
          <button
            onClick={() => {
              setIsOpen(true);
              setShowTooltip(false);
            }}
            className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-burgundy-800 via-burgundy-700 to-peach-600 text-white shadow-warm-lg hover:shadow-glow hover:scale-105 transition-all duration-300 border-2 border-peach-300/60 dark:border-peach-400/40 cursor-pointer"
            aria-label="Open Campus Guide Assistant"
          >
            {/* Guide Avatar inside Launcher */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex items-center justify-center">
              <CampusGuide pose="avatar" size="xs" className="w-full h-full" />
            </div>

            {/* Online Status Dot */}
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-wine-950 shadow-xs"></span>
          </button>
        </div>
      )}

      {/* Expanded Chat Drawer / Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[380px] md:w-[400px] h-[520px] max-h-[85vh] bg-white/95 dark:bg-wine-950/95 backdrop-blur-xl border border-peach-300/60 dark:border-peach-400/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-guide-pop">
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-burgundy-900 via-burgundy-800 to-wine-900 text-cream-50 flex items-center justify-between border-b border-peach-400/20">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full border border-peach-300/40 bg-wine-900 overflow-hidden shrink-0">
                <CampusGuide pose="avatar" size="xs" className="w-full h-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-cream-50 leading-none">Aria</h3>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-peach-500/30 text-peach-200 border border-peach-400/30 font-semibold">
                    Campus Guide
                  </span>
                </div>
                <p className="text-[11px] text-peach-300/90 leading-none mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Verified Assistant Online
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-cream-100 flex items-center justify-center transition-colors"
              aria-label="Close Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-cream-50/50 dark:bg-wine-950/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-burgundy-800 text-cream-50 rounded-br-xs shadow-xs'
                      : 'bg-white dark:bg-wine-900 text-wine-900 dark:text-cream-100 border border-peach-300/50 dark:border-peach-400/20 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Optional Action Button */}
                  {msg.actionBtn && (
                    <button
                      type="button"
                      onClick={msg.actionBtn.action}
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-peach-100 dark:bg-wine-800 text-burgundy-900 dark:text-peach-200 font-bold text-xs border border-peach-300 dark:border-peach-400/30 hover:bg-peach-200 dark:hover:bg-wine-700 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-peach-600 dark:text-peach-400" />
                      <span>{msg.actionBtn.label}</span>
                    </button>
                  )}
                </div>

                {/* Quick Reply Suggestions */}
                {msg.quickReplies && msg.quickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {msg.quickReplies.map((qr, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(qr.query)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-wine-900 border border-peach-300/60 dark:border-peach-400/20 text-burgundy-900 dark:text-peach-300 hover:bg-peach-100 dark:hover:bg-wine-800 transition-all font-medium"
                      >
                        {qr.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-wine-900 border border-peach-300/40 dark:border-peach-400/20 w-16">
                <span className="w-2 h-2 rounded-full bg-peach-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-burgundy-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-peach-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white dark:bg-wine-900 border-t border-peach-300/40 dark:border-peach-400/20 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Aria about complaints, privacy, tracking..."
              className="flex-1 h-10 px-3.5 text-xs sm:text-sm bg-cream-50 dark:bg-wine-950 border border-peach-300 dark:border-peach-400/30 rounded-xl text-wine-900 dark:text-cream-100 placeholder-wine-400 focus:outline-none focus:border-burgundy-700 dark:focus:border-peach-400"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="h-10 px-3.5 rounded-xl btn-glass btn-glass-primary flex items-center justify-center text-xs font-bold disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-peach-300" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CampusChatbot;
