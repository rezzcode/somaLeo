import { useEffect, useState } from 'react';
import { Brain, HelpCircle, GraduationCap, UserCircle, LogOut, Menu, X, MessageSquare, History } from 'lucide-react';
import { AITutor } from './AITutor';
import { Profile } from './Profile';
import { ChatHistory } from './ChatHistory';
import { tutorApi } from '@/services/api';
import { DEFAULT_RECENT_CHATS } from '@/utils/mockData';
import type { RecentChat } from '@/types/auth';

export default function AppContent() {
  const [activeTab, setActiveTab] = useState('tutor');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [recentChats, setRecentChats] = useState<RecentChat[]>(DEFAULT_RECENT_CHATS);
  const [selectedChat, setSelectedChat] = useState<RecentChat | null>(null);

  useEffect(() => {
    const loadRecentChats = async () => {
      const data = await tutorApi.getRecentChats(4);
      if (data && Array.isArray(data) && data.length > 0) {
        setRecentChats(data.slice(0, 4));
      } else {
        setRecentChats(DEFAULT_RECENT_CHATS);
      }
    };

    loadRecentChats();
  }, []);

  const navigation = [
    { id: 'tutor', name: 'AI Tutor', icon: Brain },
    { id: 'profile', name: 'My Profile', icon: UserCircle },
  ];

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('aiTutorMessages');
    window.location.href = '/login';
  };

  const handleChatClick = (chat: RecentChat) => {
    setSelectedChat(chat);
    setActiveTab('chat-history');
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const handleBackFromChat = () => {
    setSelectedChat(null);
    setActiveTab('tutor');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-emerald-50 via-teal-50 via-cyan-50 to-green-50 font-sans text-slate-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:relative z-50 h-full
          ${sidebarOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full lg:translate-x-0'} 
          transform transition-all duration-300 ease-in-out 
          bg-gradient-to-b from-emerald-700 via-emerald-800 to-teal-900 text-white flex flex-col shadow-2xl
        `}
      >
        <div className="p-4 border-b border-emerald-600/30 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="bg-white/15 backdrop-blur-sm p-2.5 rounded-xl border border-white/20">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">SomaLeo <br /> CBE Tutor AI</h1>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${!sidebarOpen ? 'mx-auto' : ''}`}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-shrink-0 p-3 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSelectedChat(null);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`w-full flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  activeTab === item.id 
                  ? 'bg-[#00BFFF] text-white shadow-lg shadow-cyan-500/30 font-semibold' 
                  : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                }`}
                title={!sidebarOpen ? item.name : undefined}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${activeTab === item.id ? 'text-white' : ''}`} />
                {sidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Recent Chats Section */}
        <div className="px-3 pb-3">
          {sidebarOpen ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-100 px-3 mb-2">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-semibold">Recent Chats</span>
              </div>
              <div className="space-y-2">
                {recentChats.map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => handleChatClick(chat)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors border border-white/10 ${
                      selectedChat?.id === chat.id
                        ? 'bg-[#00BFFF]/30 hover:bg-[#00BFFF]/40 border-[#00BFFF]/50'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-sm text-white font-medium truncate">{chat.title}</div>
                    <div className="text-xs text-emerald-100/80">{chat.subject} • {chat.timestamp}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              className="w-full flex items-center justify-center p-3 text-emerald-100 hover:bg-white/10 rounded-xl transition-all duration-200"
              title="Recent Chats"
              onClick={() => setSidebarOpen(true)}
            >
              <History className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="p-3 border-t border-emerald-600/30 space-y-1">
          <button 
            className={`w-full flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} gap-3 px-3 py-2.5 text-emerald-100 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-200`}
            title={!sidebarOpen ? 'Support' : undefined}
          >
            <HelpCircle className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium text-sm">Support</span>}
          </button>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} gap-3 px-3 py-2.5 text-red-300 hover:bg-red-500/20 hover:text-red-200 rounded-xl transition-all duration-200`}
            title={!sidebarOpen ? 'Logout' : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>

        <div className="h-1 bg-gradient-to-r from-lime-400 via-[#20B2AA] via-[#00BFFF] to-emerald-400"></div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto lg:ml-0">
        <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100 px-4 sm:px-8 py-4 sticky top-0 z-10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-emerald-100 transition-colors lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 text-slate-700" />
            </button>
            <h2 className="text-lg font-semibold text-slate-800 capitalize">
              {activeTab === 'tutor' ? 'AI Tutor' : activeTab === 'profile' ? 'My Profile' : 'Chat History'}
            </h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-slate-700">Welcome back!</span>
              <span className="text-xs text-slate-500">Ready to learn?</span>
            </div>
            <button
              onClick={() => {
                setActiveTab('profile');
                setSelectedChat(null);
              }}
              className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00BFFF] to-[#20B2AA] flex items-center justify-center border-2 border-white shadow-lg hover:shadow-xl transition-shadow"
              aria-label="Go to profile"
            >
              <UserCircle className="h-6 w-6 text-white" />
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 h-[calc(100%-5rem)]">
          {activeTab === 'tutor' && <AITutor />}
          {activeTab === 'profile' && <Profile />}
          {activeTab === 'chat-history' && selectedChat && (
            <ChatHistory
              chatId={selectedChat.id}
              chatTitle={selectedChat.title}
              onBack={handleBackFromChat}
            />
          )}
        </div>
      </main>
    </div>
  );
}