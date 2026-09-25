import React, { useState, useEffect, useRef } from 'react';
import { messageAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Send, Shield, User, Building2, RefreshCw } from 'lucide-react';

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
    <div className="flex flex-col h-[380px] sm:h-[480px] bg-white border border-cream-300 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-cream-300 bg-cream-100/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-peach-100 text-burgundy-800 border border-peach-300">
            <Shield className="w-4 h-4 text-burgundy-700" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-wine-900">Encrypted Anonymous Communication</h4>
            <p className="text-[11px] text-wine-600">
              {currentUserRole === 'admin'
                ? 'Talking to: Verified Anonymous Student (Identity decoupled)'
                : 'Talking to: Campus Administration Triage Desk'}
            </p>
          </div>
        </div>
        <button
          onClick={fetchMessages}
          disabled={loading}
          className="p-1.5 text-wine-600 hover:text-burgundy-800 hover:bg-cream-200 rounded-lg transition-colors"
          title="Refresh messages"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream-50/50">
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-wine-500 text-sm">
            Loading encrypted conversation...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="p-3 bg-peach-100 rounded-full text-peach-700 mb-2">
              <Shield className="w-6 h-6 text-burgundy-700" />
            </div>
            <p className="text-sm font-bold text-wine-900">No messages in this thread yet.</p>
            <p className="text-xs text-wine-600 mt-1 max-w-sm">
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
                <div className="flex items-center gap-1.5 text-[11px] text-wine-500 mb-1 px-1">
                  {msg.senderType === 'admin' ? (
                    <span className="flex items-center gap-1 text-burgundy-800 font-bold">
                      <Building2 className="w-3 h-3" /> Campus Administration
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-peach-800 font-bold">
                      <User className="w-3 h-3" /> Verified Anonymous Student
                    </span>
                  )}
                  <span>•</span>
                  <span>{formatDate(msg.createdAt)}</span>
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    isMe
                      ? 'bg-burgundy-800 text-cream-50 rounded-br-sm shadow-burgundy-900/10'
                      : 'bg-white text-wine-900 rounded-bl-sm border border-cream-300'
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
      <form onSubmit={handleSend} className="p-3 bg-cream-100/90 border-t border-cream-300 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={
            currentUserRole === 'admin'
              ? 'Send response/query to verified student...'
              : 'Reply anonymously to administration...'
          }
          className="flex-1 bg-white border border-cream-300 rounded-xl px-4 py-2.5 text-sm text-wine-900 placeholder-wine-400 focus:outline-none focus:border-burgundy-700 focus:ring-1 focus:ring-burgundy-700"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="px-4 py-2.5 bg-burgundy-800 hover:bg-burgundy-900 disabled:opacity-50 disabled:cursor-not-allowed text-cream-50 text-sm font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
        >
          {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
