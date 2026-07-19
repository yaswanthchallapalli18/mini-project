import React, { useState, useEffect, useRef, useContext } from 'react';
import { io } from 'socket.io-client';
import { X, Send, Check, CheckCheck, Paperclip, Loader, FileText } from 'lucide-react';
import api, { API_URL } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';

export default function ChatDrawer({ booking, onClose }) {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(NotificationContext);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const SOCKET_URL = (API_URL || 'http://localhost:5000/api').replace('/api', '');

  const myId = String(user?._id || user?.id || '');
  const isCustomer = !!(user?.role === 'customer' || (user && !user.category));
  const myModel = isCustomer ? 'User' : 'Provider';

  const partnerId = isCustomer
    ? String(booking?.provider?._id || booking?.provider || '')
    : String(booking?.customer?._id || booking?.customer || '');
  const partnerModel = isCustomer ? 'Provider' : 'User';

  const roomId = String(booking?._id || '');

  const sameId = (a, b) => String(a || '').trim() === String(b || '').trim();

  useEffect(() => {
    const name = isCustomer
      ? (booking?.provider?.name || 'Service Partner')
      : (booking?.customer?.name || 'Customer');
    setPartnerName(name);
  }, [booking, isCustomer]);

  useEffect(() => {
    if (!roomId) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/messages/${roomId}`);
        setMessages(res.data.data || []);
      } catch (err) {
        console.error('Chat fetch error:', err.message);
        showToast('Error', 'Failed to load past messages', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_room', { roomId });
      socket.emit('mark_read', { roomId, userId: myId });
    });

    socket.on('receive_message', (msg) => {
      setMessages((prev) => {
        if (msg._id && prev.some((m) => String(m._id) === String(msg._id))) {
          return prev;
        }
        const withoutOptimistic = prev.filter((m) => !m._tempId);
        return [...withoutOptimistic, msg];
      });
      const senderId = String(msg.sender?._id || msg.sender || '');
      if (!sameId(senderId, myId)) {
        socket.emit('mark_read', { roomId, userId: myId });
      }
    });

    socket.on('typing_status', ({ userId, isTyping }) => {
      if (!sameId(userId, myId)) setPartnerTyping(isTyping);
    });

    socket.on('messages_read', ({ userId }) => {
      if (!sameId(userId, myId)) {
        setMessages((prev) =>
          prev.map((m) => {
            const senderId = String(m.sender?._id || m.sender || '');
            return sameId(senderId, myId) ? { ...m, read: true } : m;
          })
        );
      }
    });

    return () => {
      socket.disconnect();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, partnerTyping]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !socketRef.current?.connected) return;

    const tempId = `temp_${Date.now()}`;
    const optimistic = {
      _tempId: tempId,
      _id: null,
      roomId,
      sender: { _id: myId, name: user?.name },
      senderModel: myModel,
      recipient: partnerId,
      recipientModel: partnerModel,
      text: trimmed,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    socketRef.current.emit('send_message', {
      roomId,
      sender: myId,
      senderModel: myModel,
      recipient: partnerId,
      recipientModel: partnerModel,
      text: trimmed,
    });

    setText('');
    handleTypingStop();
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketRef.current?.emit('typing', { roomId, userId: myId, isTyping: true, userName: user?.name });
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(handleTypingStop, 1500);
  };

  const handleTypingStop = () => {
    if (isTypingRef.current) {
      isTypingRef.current = false;
      socketRef.current?.emit('typing', { roomId, userId: myId, isTyping: false });
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !socketRef.current?.connected) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/chat/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const { fileUrl, fileName, fileType } = res.data.data;
      socketRef.current.emit('send_message', {
        roomId, sender: myId, senderModel: myModel,
        recipient: partnerId, recipientModel: partnerModel,
        text: '', fileUrl, fileName, fileType,
      });
    } catch (err) {
      showToast('Upload Failed', 'Failed to upload attachment.', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      <div onClick={onClose} className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-[2px]" />
      <div className="relative w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-gray-150 dark:border-slate-800 shadow-2xl flex flex-col">

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-800/40 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold shadow-sm">
                {partnerName.charAt(0).toUpperCase()}
              </span>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white dark:border-slate-900" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{partnerName}</h3>
              <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase mt-0.5">
                Booking: {booking?.bookingId || roomId.slice(-8)}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-grow overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-slate-50/40 dark:bg-slate-950/10">
          {loading ? (
            <div className="flex-grow flex items-center justify-center">
              <div className="animate-spin rounded-full h-7 w-7 border-2 border-blue-600 border-t-transparent" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center gap-2 text-center py-10">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-blue-500 flex items-center justify-center mb-1">
                <FileText size={20} />
              </div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">No messages yet</p>
              <p className="text-[11px] text-gray-400 max-w-[200px]">Send a greeting to start the conversation.</p>
            </div>
          ) : (
            messages.map((msg, i) => {
              const senderId = String(msg.sender?._id || msg.sender || '');
              const isMe = sameId(senderId, myId);
              const isOptimistic = !!msg._tempId;

              return (
                <div key={msg._id || msg._tempId || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl shadow-sm text-xs ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-slate-700 rounded-bl-none'
                  } ${isOptimistic ? 'opacity-70' : ''}`}>
                    {msg.fileUrl && (
                      <div className="mb-2 rounded-lg overflow-hidden border border-black/5 dark:border-white/5">
                        {msg.fileType === 'image' ? (
                          <a href={msg.fileUrl} target="_blank" rel="noreferrer">
                            <img src={msg.fileUrl} alt="Attachment" className="max-h-48 object-cover hover:opacity-90 transition-opacity" />
                          </a>
                        ) : (
                          <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 text-[11px] font-bold hover:underline">
                            <Paperclip size={13} />
                            <span className="truncate max-w-[150px]">{msg.fileName || 'Download File'}</span>
                          </a>
                        )}
                      </div>
                    )}
                    {msg.text && <p className="leading-relaxed break-words">{msg.text}</p>}
                    <div className="flex items-center justify-end gap-1 mt-1 text-[9px] opacity-75">
                      <span>{formatTime(msg.createdAt)}</span>
                      {isMe && (
                        isOptimistic ? <Check size={11} className="text-blue-200" />
                        : msg.read ? <CheckCheck size={11} className="text-blue-200" />
                        : <Check size={11} className="text-blue-200 opacity-60" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {partnerTyping && (
            <div className="flex items-center gap-2.5 text-xs text-gray-400 pl-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 dark:bg-slate-800 text-[10px] font-bold text-gray-500">
                {partnerName.charAt(0).toUpperCase()}
              </span>
              <div className="flex gap-1 items-center bg-gray-100 dark:bg-slate-800 px-3 py-2 rounded-xl rounded-bl-none">
                <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <button type="button" disabled={uploading} onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors flex-shrink-0">
              {uploading ? <Loader size={16} className="animate-spin" /> : <Paperclip size={16} />}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,.pdf" />
            <input type="text" value={text} onChange={handleInputChange}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSendMessage(e); }}
              placeholder="Type a message..."
              className="flex-grow px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" />
            <button type="submit" disabled={!text.trim()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0">
              <Send size={16} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
