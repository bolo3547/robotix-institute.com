'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import { Avatar } from '@/components/ui/Avatar';
import {
  MessageCircle,
  Users,
  Hash,
  Megaphone,
  Send,
  Plus,
  Search,
  ArrowLeft,
  X,
  Paperclip,
  UserPlus,
  Settings,
  Loader2,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ChatUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
}

interface ChatMember {
  id: string;
  role: string;
  user: ChatUser;
  joinedAt: string;
}

interface ChatMessage {
  id: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  fileUrl?: string | null;
  sender: ChatUser | null;
  senderId: string | null;
  createdAt: string;
  edited: boolean;
  deleted: boolean;
}

interface ChatChannel {
  id: string;
  name: string;
  description: string | null;
  type: 'direct' | 'group' | 'team' | 'announcement';
  avatar: string | null;
  isPrivate: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  members: ChatMember[];
  _count?: { members: number };
  lastMessage?: ChatMessage | null;
  displayName?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString();
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateHeader(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

function channelIcon(type: string, size = 16) {
  switch (type) {
    case 'direct':
      return <MessageCircle size={size} />;
    case 'group':
      return <Users size={size} />;
    case 'team':
      return <Hash size={size} />;
    case 'announcement':
      return <Megaphone size={size} />;
    default:
      return <MessageCircle size={size} />;
  }
}

function roleColor(role: string): string {
  switch (role) {
    case 'admin':
      return 'text-red-500';
    case 'instructor':
      return 'text-purple-500';
    case 'parent':
      return 'text-blue-500';
    case 'student':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
}

function getInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/* ------------------------------------------------------------------ */
/*  New Chat Modal                                                     */
/* ------------------------------------------------------------------ */

function NewChatModal({
  onClose,
  onCreated,
  isDark,
}: {
  onClose: () => void;
  onCreated: (channel: ChatChannel) => void;
  isDark: boolean;
}) {
  const [tab, setTab] = useState<'dm' | 'group'>('dm');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<ChatUser[]>([]);
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [channelType, setChannelType] = useState<'group' | 'team' | 'announcement'>('group');
  const searchTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch(`/api/chat/users?q=${encodeURIComponent(search)}`);
      if (res.ok) setUsers(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function startDM(user: ChatUser) {
    setCreating(true);
    try {
      const res = await fetch('/api/chat/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'direct', memberIds: [user.id] }),
      });
      if (res.ok) {
        const channel = await res.json();
        onCreated(channel);
      }
    } catch { /* ignore */ }
    setCreating(false);
  }

  async function createGroup() {
    if (selectedUsers.length < 1 || !groupName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/chat/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: channelType,
          name: groupName.trim(),
          description: groupDesc.trim() || undefined,
          memberIds: selectedUsers.map((u) => u.id),
        }),
      });
      if (res.ok) {
        const channel = await res.json();
        onCreated(channel);
      }
    } catch { /* ignore */ }
    setCreating(false);
  }

  function toggleUser(user: ChatUser) {
    setSelectedUsers((prev) =>
      prev.find((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  }

  const bg = isDark ? 'bg-slate-800' : 'bg-white';
  const border = isDark ? 'border-slate-700' : 'border-gray-200';
  const text = isDark ? 'text-slate-100' : 'text-gray-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-gray-500';
  const hoverBg = isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-50';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`${bg} ${border} border rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${border}`}>
          <h2 className={`text-lg font-bold ${text}`}>New Conversation</h2>
          <button onClick={onClose} aria-label="Close" className={`p-1 rounded-lg ${hoverBg} ${textMuted}`}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${border}`}>
          <button
            onClick={() => { setTab('dm'); setSelectedUsers([]); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === 'dm'
                ? 'text-brand-600 border-b-2 border-brand-600'
                : `${textMuted} ${hoverBg}`
            }`}
          >
            <MessageCircle size={16} className="inline mr-1.5 -mt-0.5" />
            Direct Message
          </button>
          <button
            onClick={() => setTab('group')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === 'group'
                ? 'text-brand-600 border-b-2 border-brand-600'
                : `${textMuted} ${hoverBg}`
            }`}
          >
            <Users size={16} className="inline mr-1.5 -mt-0.5" />
            Group / Channel
          </button>
        </div>

        {/* Group settings */}
        {tab === 'group' && (
          <div className={`px-5 pt-4 space-y-3 border-b ${border} pb-4`}>
            <input
              type="text"
              placeholder="Channel name *"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-sm ${border} ${bg} ${text} focus:outline-none focus:ring-2 focus:ring-brand-500`}
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={groupDesc}
              onChange={(e) => setGroupDesc(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-sm ${border} ${bg} ${text} focus:outline-none focus:ring-2 focus:ring-brand-500`}
            />
            <div className="flex gap-2">
              {(['group', 'team', 'announcement'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setChannelType(t)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    channelType === t
                      ? 'bg-brand-600 text-white border-brand-600'
                      : `${border} ${textMuted} ${hoverBg}`
                  }`}
                >
                  {channelIcon(t, 14)}
                  <span className="ml-1 capitalize">{t}</span>
                </button>
              ))}
            </div>
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedUsers.map((u) => (
                  <span
                    key={u.id}
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                      isDark ? 'bg-slate-700 text-slate-200' : 'bg-brand-50 text-brand-700'
                    }`}
                  >
                    {u.name || u.email}
                    <button onClick={() => toggleUser(u)} aria-label={`Remove ${u.name || u.email}`}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search */}
        <div className={`px-5 py-3 border-b ${border}`}>
          <div className="relative">
            <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
            <input
              type="text"
              placeholder="Search people..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm ${border} ${bg} ${text} focus:outline-none focus:ring-2 focus:ring-brand-500`}
              autoFocus
            />
          </div>
        </div>

        {/* User list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-brand-500" />
            </div>
          ) : users.length === 0 ? (
            <div className={`text-center py-12 ${textMuted}`}>
              <Users size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">{search ? 'No users found' : 'Search for people to chat with'}</p>
            </div>
          ) : (
            <div className="py-2">
              {users.map((user) => {
                const isSelected = selectedUsers.some((u) => u.id === user.id);
                return (
                  <button
                    key={user.id}
                    disabled={creating}
                    onClick={() => (tab === 'dm' ? startDM(user) : toggleUser(user))}
                    className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${hoverBg} ${
                      isSelected ? (isDark ? 'bg-slate-700/50' : 'bg-brand-50') : ''
                    }`}
                  >
                    <Avatar src={user.image} alt={user.name || ''} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${text}`}>
                        {user.name || user.email}
                      </p>
                      <p className={`text-xs truncate ${textMuted}`}>
                        <span className={`capitalize ${roleColor(user.role)}`}>{user.role}</span>
                        {user.name && <span className="ml-1.5">· {user.email}</span>}
                      </p>
                    </div>
                    {tab === 'group' && (
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-brand-600 border-brand-600 text-white'
                            : `${border}`
                        }`}
                      >
                        {isSelected && (
                          <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M2 6l3 3 5-5" />
                          </svg>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Create group button */}
        {tab === 'group' && (
          <div className={`px-5 py-4 border-t ${border}`}>
            <button
              onClick={createGroup}
              disabled={creating || selectedUsers.length < 1 || !groupName.trim()}
              className="w-full py-2.5 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {creating ? (
                <Loader2 size={16} className="inline animate-spin mr-1.5" />
              ) : null}
              Create {channelType === 'announcement' ? 'Announcement' : channelType === 'team' ? 'Team Channel' : 'Group Chat'}
              {selectedUsers.length > 0 && ` (${selectedUsers.length} members)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Add Members Modal                                                  */
/* ------------------------------------------------------------------ */

function AddMembersModal({
  channelId,
  existingIds,
  onClose,
  onAdded,
  isDark,
}: {
  channelId: string;
  existingIds: string[];
  onClose: () => void;
  onAdded: () => void;
  isDark: boolean;
}) {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => fetchUsers(), 300);
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch(`/api/chat/users?q=${encodeURIComponent(search)}`);
      if (res.ok) {
        const all: ChatUser[] = await res.json();
        setUsers(all.filter((u) => !existingIds.includes(u.id)));
      }
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function addMembers() {
    if (selected.length === 0) return;
    setAdding(true);
    try {
      await fetch(`/api/chat/channels/${channelId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addMembers: selected }),
      });
      onAdded();
    } catch { /* ignore */ }
    setAdding(false);
  }

  const bg = isDark ? 'bg-slate-800' : 'bg-white';
  const border = isDark ? 'border-slate-700' : 'border-gray-200';
  const text = isDark ? 'text-slate-100' : 'text-gray-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-gray-500';
  const hoverBg = isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-50';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`${bg} ${border} border rounded-2xl shadow-2xl w-full max-w-md max-h-[70vh] flex flex-col`}>
        <div className={`flex items-center justify-between px-5 py-4 border-b ${border}`}>
          <h2 className={`text-lg font-bold ${text}`}>Add Members</h2>
          <button onClick={onClose} aria-label="Close" className={`p-1 rounded-lg ${hoverBg} ${textMuted}`}>
            <X size={20} />
          </button>
        </div>
        <div className={`px-5 py-3 border-b ${border}`}>
          <div className="relative">
            <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
            <input
              type="text"
              placeholder="Search people..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm ${border} ${bg} ${text} focus:outline-none focus:ring-2 focus:ring-brand-500`}
              autoFocus
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={20} className="animate-spin text-brand-500" />
            </div>
          ) : users.length === 0 ? (
            <p className={`text-center py-8 text-sm ${textMuted}`}>No users available</p>
          ) : (
            users.map((user) => {
              const isSel = selected.includes(user.id);
              return (
                <button
                  key={user.id}
                  onClick={() =>
                    setSelected((prev) =>
                      isSel ? prev.filter((id) => id !== user.id) : [...prev, user.id]
                    )
                  }
                  className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${hoverBg} ${
                    isSel ? (isDark ? 'bg-slate-700/50' : 'bg-brand-50') : ''
                  }`}
                >
                  <Avatar src={user.image} alt={user.name || ''} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${text}`}>{user.name || user.email}</p>
                    <p className={`text-xs ${roleColor(user.role)} capitalize`}>{user.role}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSel ? 'bg-brand-600 border-brand-600 text-white' : border
                    }`}
                  >
                    {isSel && (
                      <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
        <div className={`px-5 py-4 border-t ${border}`}>
          <button
            onClick={addMembers}
            disabled={adding || selected.length === 0}
            className="w-full py-2.5 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-lg transition-colors"
          >
            {adding && <Loader2 size={16} className="inline animate-spin mr-1.5" />}
            Add {selected.length > 0 ? `${selected.length} Member${selected.length > 1 ? 's' : ''}` : 'Members'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Chat Page                                                     */
/* ------------------------------------------------------------------ */

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isDark } = useTheme();

  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [activeChannel, setActiveChannel] = useState<ChatChannel | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchChannels, setSearchChannels] = useState('');
  const [showChannelInfo, setShowChannelInfo] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const pollRef = useRef<NodeJS.Timeout>();

  const userId = (session?.user as any)?.id;

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/chat');
    }
  }, [status, router]);

  // Fetch channels
  const fetchChannels = useCallback(async () => {
    try {
      const res = await fetch('/api/chat/channels');
      if (res.ok) {
        const data = await res.json();
        setChannels(data);
      }
    } catch { /* ignore */ }
    setLoadingChannels(false);
  }, []);

  useEffect(() => {
    if (status === 'authenticated') fetchChannels();
  }, [status, fetchChannels]);

  // Fetch messages for active channel
  const fetchMessages = useCallback(async (channelId: string) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/chat/channels/${channelId}/messages?limit=100`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch { /* ignore */ }
    setLoadingMessages(false);
  }, []);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    if (!activeChannel) return;

    const pollMessages = async () => {
      try {
        const res = await fetch(`/api/chat/channels/${activeChannel.id}/messages?limit=100`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch { /* ignore */ }
    };

    pollRef.current = setInterval(pollMessages, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [activeChannel]);

  // Also poll channel list for new message previews
  useEffect(() => {
    if (status !== 'authenticated') return;
    const interval = setInterval(fetchChannels, 15000);
    return () => clearInterval(interval);
  }, [status, fetchChannels]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Select a channel
  function selectChannel(channel: ChatChannel) {
    setActiveChannel(channel);
    fetchMessages(channel.id);
    setShowChannelInfo(false);
    // On mobile, hide sidebar
    if (window.innerWidth < 768) setShowSidebar(false);
  }

  // Send a message
  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!messageText.trim() || !activeChannel || sending) return;

    const text = messageText.trim();
    setMessageText('');
    setSending(true);

    // Optimistic update
    const optimistic: ChatMessage = {
      id: `temp-${Date.now()}`,
      content: text,
      type: 'text',
      fileUrl: null,
      sender: {
        id: userId,
        name: session?.user?.name || null,
        email: session?.user?.email || '',
        image: session?.user?.image || null,
        role: (session?.user as any)?.role || 'student',
      },
      senderId: userId,
      createdAt: new Date().toISOString(),
      edited: false,
      deleted: false,
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await fetch(`/api/chat/channels/${activeChannel.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text }),
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? msg : m)));
        // Refresh channels for updated lastMessage
        fetchChannels();
      }
    } catch {
      // Remove optimistic on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    }
    setSending(false);
    messageInputRef.current?.focus();
  }

  // Handle textarea enter key
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  }

  // Filter channels
  const filteredChannels = channels.filter((ch) => {
    if (filterType !== 'all' && ch.type !== filterType) return false;
    if (searchChannels) {
      const target = (ch.displayName || ch.name || '').toLowerCase();
      return target.includes(searchChannels.toLowerCase());
    }
    return true;
  });

  // Loading/auth states
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand-500" />
      </div>
    );
  }

  if (status === 'unauthenticated') return null;

  /* ---------------------------------------------------------------- */
  /*  Theme classes                                                    */
  /* ---------------------------------------------------------------- */
  const bg = isDark ? 'bg-slate-900' : 'bg-gray-50';
  const sidebarBg = isDark ? 'bg-slate-800' : 'bg-white';
  const chatBg = isDark ? 'bg-slate-900' : 'bg-gray-50';
  const border = isDark ? 'border-slate-700' : 'border-gray-200';
  const text = isDark ? 'text-slate-100' : 'text-gray-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-gray-500';
  const hoverBg = isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100';
  const activeBg = isDark ? 'bg-slate-700' : 'bg-brand-50';
  const inputBg = isDark ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300';
  const msgBgSelf = isDark ? 'bg-brand-600' : 'bg-brand-500';
  const msgBgOther = isDark ? 'bg-slate-700' : 'bg-white';

  /* ---------------------------------------------------------------- */
  /*  Group messages by date                                           */
  /* ---------------------------------------------------------------- */
  const groupedMessages: { date: string; msgs: ChatMessage[] }[] = [];
  let lastDate = '';
  for (const msg of messages) {
    const dateStr = new Date(msg.createdAt).toDateString();
    if (dateStr !== lastDate) {
      groupedMessages.push({ date: msg.createdAt, msgs: [msg] });
      lastDate = dateStr;
    } else {
      groupedMessages[groupedMessages.length - 1].msgs.push(msg);
    }
  }

  return (
    <div className={`${bg} min-h-screen`}>
      <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)] flex">
        {/* ============================================================ */}
        {/*  SIDEBAR                                                      */}
        {/* ============================================================ */}
        <aside
          className={`${sidebarBg} border-r ${border} flex-shrink-0 flex flex-col transition-all duration-200 ${
            showSidebar ? 'w-80' : 'w-0 overflow-hidden'
          } ${
            /* Mobile: overlay */ showSidebar ? 'max-md:absolute max-md:inset-y-0 max-md:left-0 max-md:z-40 max-md:w-80 max-md:shadow-2xl' : ''
          }`}
    
        >
          {/* Sidebar header */}
          <div className={`px-4 py-4 border-b ${border}`}>
            <div className="flex items-center justify-between mb-3">
              <h1 className={`text-xl font-bold ${text}`}>Messages</h1>
              <button
                onClick={() => setShowNewChat(true)}
                className="p-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors"
                title="New conversation"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="relative">
              <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchChannels}
                onChange={(e) => setSearchChannels(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm ${inputBg} ${text} focus:outline-none focus:ring-2 focus:ring-brand-500`}
              />
            </div>
          </div>

          {/* Type filter */}
          <div className={`px-4 py-2 flex gap-1.5 border-b ${border} overflow-x-auto`}>
            {[
              { key: 'all', label: 'All' },
              { key: 'direct', label: 'DMs', icon: MessageCircle },
              { key: 'group', label: 'Groups', icon: Users },
              { key: 'team', label: 'Teams', icon: Hash },
              { key: 'announcement', label: 'News', icon: Megaphone },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilterType(key)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                  filterType === key
                    ? 'bg-brand-600 text-white'
                    : `${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'} ${hoverBg}`
                }`}
              >
                {Icon && <Icon size={12} className="inline mr-1 -mt-0.5" />}
                {label}
              </button>
            ))}
          </div>

          {/* Channel list */}
          <div className="flex-1 overflow-y-auto">
            {loadingChannels ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="animate-spin text-brand-500" />
              </div>
            ) : filteredChannels.length === 0 ? (
              <div className={`text-center py-12 px-4 ${textMuted}`}>
                <MessageCircle size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium mb-1">No conversations yet</p>
                <p className="text-xs">Start a new chat to begin messaging</p>
              </div>
            ) : (
              filteredChannels.map((channel) => {
                const isActive = activeChannel?.id === channel.id;
                const name = channel.displayName || channel.name;
                const preview = channel.lastMessage;
                return (
                  <button
                    key={channel.id}
                    onClick={() => selectChannel(channel)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      isActive ? activeBg : hoverBg
                    }`}
                  >
                    {/* Avatar / Icon */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        channel.type === 'direct'
                          ? 'bg-gradient-to-br from-brand-400 to-accent-400 text-white'
                          : channel.type === 'team'
                          ? isDark
                            ? 'bg-purple-900/50 text-purple-400'
                            : 'bg-purple-100 text-purple-600'
                          : channel.type === 'announcement'
                          ? isDark
                            ? 'bg-amber-900/50 text-amber-400'
                            : 'bg-amber-100 text-amber-600'
                          : isDark
                          ? 'bg-slate-700 text-slate-300'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {channel.type === 'direct' ? (
                        <span className="text-sm font-bold">{getInitials(name)}</span>
                      ) : (
                        channelIcon(channel.type, 18)
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-semibold truncate ${text}`}>{name}</p>
                        {preview && (
                          <span className={`text-[10px] flex-shrink-0 ml-2 ${textMuted}`}>
                            {timeAgo(preview.createdAt)}
                          </span>
                        )}
                      </div>
                      {preview && (
                        <p className={`text-xs truncate mt-0.5 ${textMuted}`}>
                          {preview.type === 'system' ? (
                            <em>{preview.content}</em>
                          ) : (
                            <>
                              {preview.sender?.name?.split(' ')[0] || 'Someone'}:{' '}
                              {preview.content}
                            </>
                          )}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* ============================================================ */}
        {/*  MAIN CHAT AREA                                               */}
        {/* ============================================================ */}
        <main className="flex-1 flex flex-col min-w-0">
          {!activeChannel ? (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 ${
                isDark ? 'bg-slate-800' : 'bg-brand-50'
              }`}>
                <MessageCircle size={36} className="text-brand-500" />
              </div>
              <h2 className={`text-xl font-bold mb-2 ${text}`}>Welcome to Messages</h2>
              <p className={`text-sm text-center max-w-md mb-6 ${textMuted}`}>
                Chat with instructors, parents, team members, and other platform users.
                Start a conversation or select one from the sidebar.
              </p>
              <button
                onClick={() => setShowNewChat(true)}
                className="px-6 py-2.5 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
              >
                <Plus size={16} className="inline mr-1.5 -mt-0.5" />
                New Conversation
              </button>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className={`flex items-center gap-3 px-4 py-3 border-b ${border} ${sidebarBg}`}>
                {/* Mobile back button */}
                <button
                  className={`md:hidden p-1.5 rounded-lg ${hoverBg} ${textMuted}`}
                  aria-label="Back to conversations"
                  onClick={() => {
                    setShowSidebar(true);
                    setActiveChannel(null);
                  }}
                >
                  <ArrowLeft size={20} />
                </button>

                {/* Channel icon */}
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                    activeChannel.type === 'direct'
                      ? 'bg-gradient-to-br from-brand-400 to-accent-400 text-white'
                      : isDark
                      ? 'bg-slate-700 text-slate-300'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {activeChannel.type === 'direct' ? (
                    <span className="text-xs font-bold">
                      {getInitials(activeChannel.displayName || activeChannel.name)}
                    </span>
                  ) : (
                    channelIcon(activeChannel.type, 16)
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className={`text-sm font-bold truncate ${text}`}>
                    {activeChannel.displayName || activeChannel.name}
                  </h2>
                  <p className={`text-xs ${textMuted}`}>
                    {activeChannel.type === 'direct'
                      ? 'Direct message'
                      : `${activeChannel._count?.members || activeChannel.members?.length || 0} members`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {activeChannel.type !== 'direct' && (
                    <button
                      onClick={() => setShowAddMembers(true)}
                      className={`p-2 rounded-lg transition-colors ${hoverBg} ${textMuted}`}
                      title="Add members"
                    >
                      <UserPlus size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => setShowChannelInfo(!showChannelInfo)}
                    className={`p-2 rounded-lg transition-colors ${hoverBg} ${textMuted}`}
                    title="Channel info"
                  >
                    <Settings size={18} />
                  </button>
                </div>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Messages area */}
                <div className={`flex-1 flex flex-col ${chatBg}`}>
                  <div className="flex-1 overflow-y-auto px-4 py-4">
                    {loadingMessages ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 size={24} className="animate-spin text-brand-500" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className={`text-center py-12 ${textMuted}`}>
                        <MessageCircle size={32} className="mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No messages yet. Say hello!</p>
                      </div>
                    ) : (
                      groupedMessages.map((group, gi) => (
                        <div key={gi}>
                          {/* Date separator */}
                          <div className="flex items-center gap-3 my-4">
                            <div className={`flex-1 h-px ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                            <span className={`text-xs font-medium px-2 ${textMuted}`}>
                              {formatDateHeader(group.date)}
                            </span>
                            <div className={`flex-1 h-px ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                          </div>

                          {group.msgs.map((msg, mi) => {
                            const isSelf = msg.senderId === userId;
                            const isSystem = msg.type === 'system';
                            const prevMsg = mi > 0 ? group.msgs[mi - 1] : null;
                            const sameAuthor = prevMsg?.senderId === msg.senderId && !isSystem;

                            if (isSystem) {
                              return (
                                <div key={msg.id} className="flex justify-center my-2">
                                  <span
                                    className={`text-xs italic px-3 py-1 rounded-full ${
                                      isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-500'
                                    }`}
                                  >
                                    {msg.content}
                                  </span>
                                </div>
                              );
                            }

                            return (
                              <div
                                key={msg.id}
                                className={`flex gap-2.5 ${sameAuthor ? 'mt-0.5' : 'mt-3'} ${
                                  isSelf ? 'flex-row-reverse' : ''
                                }`}
                              >
                                {/* Avatar */}
                                {!sameAuthor ? (
                                  <div className="flex-shrink-0 mt-1">
                                    <Avatar
                                      src={msg.sender?.image}
                                      alt={msg.sender?.name || ''}
                                      size="sm"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-8 flex-shrink-0" />
                                )}

                                {/* Bubble */}
                                <div className={`max-w-[70%] ${isSelf ? 'items-end' : 'items-start'}`}>
                                  {!sameAuthor && (
                                    <div
                                      className={`flex items-baseline gap-2 mb-0.5 ${
                                        isSelf ? 'flex-row-reverse' : ''
                                      }`}
                                    >
                                      <span className={`text-xs font-semibold ${text}`}>
                                        {msg.sender?.name || 'Unknown'}
                                      </span>
                                      <span className={`text-[10px] ${textMuted}`}>
                                        {msg.sender?.role && (
                                          <span className={`${roleColor(msg.sender.role)} capitalize`}>
                                            {msg.sender.role}
                                          </span>
                                        )}
                                      </span>
                                    </div>
                                  )}
                                  <div
                                    className={`inline-block px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                                      isSelf
                                        ? `${msgBgSelf} text-white rounded-tr-sm`
                                        : `${msgBgOther} ${text} ${isDark ? '' : 'shadow-sm'} border ${border} rounded-tl-sm`
                                    }`}
                                  >
                                    {msg.deleted ? (
                                      <span className="italic opacity-60">Message deleted</span>
                                    ) : (
                                      <>
                                        {msg.content}
                                        {msg.fileUrl && msg.type === 'image' && (
                                          <img
                                            src={msg.fileUrl}
                                            alt="Shared image"
                                            className="mt-2 rounded-lg max-w-full max-h-60 object-cover"
                                          />
                                        )}
                                        {msg.fileUrl && msg.type === 'file' && (
                                          <a
                                            href={msg.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-1 flex items-center gap-1.5 text-xs underline"
                                          >
                                            <Paperclip size={12} />
                                            Attachment
                                          </a>
                                        )}
                                      </>
                                    )}
                                  </div>
                                  <div className={`mt-0.5 ${isSelf ? 'text-right' : ''}`}>
                                    <span className={`text-[10px] ${textMuted}`}>
                                      {formatTime(msg.createdAt)}
                                      {msg.edited && ' · edited'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message composer */}
                  <div className={`px-4 py-3 border-t ${border} ${sidebarBg}`}>
                    <form onSubmit={sendMessage} className="flex items-end gap-2">
                      <div className="flex-1 relative">
                        <textarea
                          ref={messageInputRef}
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Type a message..."
                          rows={1}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm resize-none ${inputBg} ${text} focus:outline-none focus:ring-2 focus:ring-brand-500 max-h-32 min-h-[42px]`}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!messageText.trim() || sending}
                        className="p-2.5 rounded-xl bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                        title="Send message"
                        aria-label="Send message"
                      >
                        <Send size={18} />
                      </button>
                    </form>
                    <p className={`text-[10px] mt-1 ${textMuted}`}>
                      Press Enter to send, Shift+Enter for new line
                    </p>
                  </div>
                </div>

                {/* Channel info panel */}
                {showChannelInfo && activeChannel && (
                  <div className={`w-72 border-l ${border} ${sidebarBg} overflow-y-auto flex-shrink-0 hidden md:block`}>
                    <div className={`px-4 py-4 border-b ${border}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className={`text-sm font-bold ${text}`}>Channel Info</h3>
                        <button
                          onClick={() => setShowChannelInfo(false)}
                          aria-label="Close channel info"
                          className={`p-1 rounded ${hoverBg} ${textMuted}`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="text-center">
                        <div
                          className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                            activeChannel.type === 'direct'
                              ? 'bg-gradient-to-br from-brand-400 to-accent-400 text-white'
                              : isDark
                              ? 'bg-slate-700 text-slate-300'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {activeChannel.type === 'direct' ? (
                            <span className="text-xl font-bold">
                              {getInitials(activeChannel.displayName || activeChannel.name)}
                            </span>
                          ) : (
                            channelIcon(activeChannel.type, 28)
                          )}
                        </div>
                        <h4 className={`font-bold ${text}`}>
                          {activeChannel.displayName || activeChannel.name}
                        </h4>
                        {activeChannel.description && (
                          <p className={`text-xs mt-1 ${textMuted}`}>{activeChannel.description}</p>
                        )}
                        <span
                          className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-medium rounded-full capitalize ${
                            isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {activeChannel.type}
                        </span>
                      </div>
                    </div>

                    {/* Members */}
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className={`text-xs font-semibold uppercase tracking-wider ${textMuted}`}>
                          Members ({activeChannel.members?.length || 0})
                        </p>
                        {activeChannel.type !== 'direct' && (
                          <button
                            onClick={() => setShowAddMembers(true)}
                            className={`p-1 rounded ${hoverBg} text-brand-500`}
                            title="Add members"
                          >
                            <UserPlus size={14} />
                          </button>
                        )}
                      </div>
                      <div className="space-y-1">
                        {(activeChannel.members || []).map((member) => (
                          <div key={member.id} className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg ${hoverBg}`}>
                            <Avatar src={member.user.image} alt={member.user.name || ''} size="xs" />
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-medium truncate ${text}`}>
                                {member.user.name || member.user.email}
                                {member.user.id === userId && (
                                  <span className={`ml-1 ${textMuted}`}>(you)</span>
                                )}
                              </p>
                              <p className={`text-[10px] capitalize ${roleColor(member.user.role)}`}>
                                {member.user.role}
                                {member.role !== 'member' && ` · ${member.role}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      {showNewChat && (
        <NewChatModal
          isDark={isDark}
          onClose={() => setShowNewChat(false)}
          onCreated={(channel) => {
            setShowNewChat(false);
            fetchChannels();
            selectChannel(channel);
          }}
        />
      )}

      {showAddMembers && activeChannel && (
        <AddMembersModal
          channelId={activeChannel.id}
          existingIds={(activeChannel.members || []).map((m) => m.user.id)}
          isDark={isDark}
          onClose={() => setShowAddMembers(false)}
          onAdded={() => {
            setShowAddMembers(false);
            // Refresh channel details
            fetch(`/api/chat/channels/${activeChannel.id}`)
              .then((r) => r.json())
              .then((ch) => setActiveChannel(ch))
              .catch(() => {});
          }}
        />
      )}
    </div>
  );
}
