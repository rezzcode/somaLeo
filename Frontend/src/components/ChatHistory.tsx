import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Bot, User, Send, Loader } from 'lucide-react';
import { tutorApi } from '@/services/api';
import { DEFAULT_CHAT_HISTORY } from '@/utils/mockData';
import type { TutorMessage } from '@/types/auth';

interface ChatHistoryProps {
  chatId: string;
  chatTitle: string;
  onBack: () => void;
}

const subjectColors: Record<string, string> = {
  'Mathematics': 'bg-blue-100 text-blue-800 border-blue-200',
  'English': 'bg-green-100 text-green-800 border-green-200',
  'Science': 'bg-purple-100 text-purple-800 border-purple-200',
  'Social Studies': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Kiswahili': 'bg-red-100 text-red-800 border-red-200',
};

const competencyColors: Record<string, string> = {
  'Critical Thinking': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Communication': 'bg-teal-100 text-teal-800 border-teal-200',
  'Creativity': 'bg-pink-100 text-pink-800 border-pink-200',
  'Collaboration': 'bg-orange-100 text-orange-800 border-orange-200',
};

export function ChatHistory({ chatId, chatTitle, onBack }: ChatHistoryProps) {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadChatHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await tutorApi.getChatHistory(chatId);
        if (data && Array.isArray(data) && data.length > 0) {
          setMessages(data.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })));
        } else {
          // Use mock data as fallback
          setMessages(DEFAULT_CHAT_HISTORY);
        }
      } catch (err) {
        setError('Failed to load chat history');
        setMessages(DEFAULT_CHAT_HISTORY);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const userMessage: TutorMessage = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      // In a real app, you'd send the message to the backend
      // For now, just add a mock AI response
      setTimeout(() => {
        const aiMessage: TutorMessage = {
          id: (Date.now() + 1).toString(),
          content: 'I understand your question. Let me help you with that...',
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsSending(false);
      }, 1000);
    } catch (error) {
      setError('Failed to send message');
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin">
          <div className="h-12 w-12 rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">{chatTitle}</h2>
            <p className="text-sm text-gray-500">{messages.length} messages</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm">
          {error} - Showing mock conversation
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-1`}>
                  <div className="flex items-center">
                    {message.sender === 'ai' ? (
                      <Bot className="h-4 w-4 text-gray-500 mr-2" />
                    ) : (
                      <User className="h-4 w-4 text-gray-500 mr-2" />
                    )}
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div className={`rounded-2xl p-4 ${message.sender === 'user'
                    ? 'bg-[#00BFFF] text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                  }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {(message.subject || message.competency) && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.subject && (
                        <span className={`px-2 py-1 rounded-full text-xs ${subjectColors[message.subject] || 'bg-gray-200 text-gray-800'}`}>
                          {message.subject}
                        </span>
                      )}
                      {message.competency && (
                        <span className={`px-2 py-1 rounded-full text-xs ${competencyColors[message.competency] || 'bg-gray-200 text-gray-800'}`}>
                          {message.competency}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex justify-start">
              <div className="max-w-[80%]">
                <div className="flex items-center mb-1">
                  <Bot className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-xs text-gray-500">AI is typing...</span>
                </div>
                <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-none p-4">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 border-t border-gray-200">
          <div className="flex space-x-2 sm:space-x-4">
            <textarea
              className="flex-1 border border-gray-300 rounded-xl p-3 sm:p-4 focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent resize-none text-sm sm:text-base"
              placeholder="Continue the conversation..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={2}
              disabled={isSending}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isSending}
              className="self-end px-4 sm:px-6 py-3 sm:py-4 bg-[#00BFFF] text-white rounded-xl hover:bg-[#00A5E0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSending ? (
                <Loader className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              ) : (
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}