import React, { useState, useEffect, useRef } from 'react';
import { messageAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Send, Shield, User, Building2, Clock, RefreshCw } from 'lucide-react';

export const MessageThread = ({ complaintId, currentUserRole }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { showError, showSuccess } = useToast();
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await messageAPI.getMessages(complaintId);
      if (res.data?.success) {
        setMessages(res.data.messages || []);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (complaintId) {
      fetchMessages();
    }
  }, [complaintId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      const res = await messageAPI.sendMessage(complaintId, { message: newMessage.trim() });
      if (res.data?.success) {
        setMessages((prev) => [...prev, res.data.data]);
        setNewMessage('');
        showSuccess('Message sent anonymously.');
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-[480px] bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Encrypted Anonymous Communication</h4>
            <p className="text-[11px] text-slate-400">
              {currentUserRole === 'admin'
                ? 'Talking to: Verified Anonymous Student (Identity decoupled)'
                : 'Talking to: Campus Administration Triage Desk'}
            </p>
          </div>
        </div>
        <button
          onClick={fetchMessages}
          disabled={loading}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          title="Refresh messages"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm">
            Loading encrypted conversation...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="p-3 bg-slate-800/60 rounded-full text-slate-400 mb-2">
              <Shield className="w-6 h-6 text-indigo-400" />
            </div>
            <p className="text-sm font-medium text-slate-300">No messages in this thread yet.</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Use this channel to exchange clarifications without ever revealing student identity.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe =
              (currentUserRole === 'student' && msg.senderType === 'student') ||
              (currentUserRole === 'admin' && msg.senderType === 'admin');

            return (
              <div
                key={msg._id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 px-1">
                  {msg.senderType === 'admin' ? (
                    <span className="flex items-center gap-1 text-indigo-300 font-semibold">
                      <Building2 className="w-3 h-3" /> Campus Administration
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-300 font-semibold">
                      <User className="w-3 h-3" /> Verified Anonymous Student
                    </span>
                  )}
                  <span>•</span>
                  <span>{formatDate(msg.createdAt)}</span>
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-br-sm shadow-md shadow-indigo-600/20'
                      : 'bg-slate-800 text-slate-100 rounded-bl-sm border border-slate-700/60'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="p-3 bg-slate-950/80 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={
            currentUserRole === 'admin'
              ? 'Send response/query to verified student...'
              : 'Reply anonymously to administration...'
          }
          className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30"
        >
          {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
