import { Send, Bot, User, Brain, Clock, BookOpen, Zap, Trash2, Loader } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { CBE_SUBJECTS, CBE_COMPETENCIES, simulateLangChainResponse } from '../utils/mockData';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  subject?: string;
  competency?: string;
}

const initialMessages: Message[] = [
  { id: '1', content: 'Hello! I\'m your CBE AI Tutor. I can help you with Junior Secondary subjects based on the Competency Based Curriculum in Kenya. How can I assist you today?', sender: 'ai', timestamp: new Date(Date.now() - 3600000), subject: 'General', competency: 'Communication' },
  { id: '2', content: 'I need help with algebra equations.', sender: 'user', timestamp: new Date(Date.now() - 1800000), subject: 'Mathematics', competency: 'Critical Thinking' },
  { id: '3', content: 'Great! Let\'s start with linear equations. Remember, the key competency here is critical thinking. Can you solve: 2x + 5 = 15?', sender: 'ai', timestamp: new Date(Date.now() - 900000), subject: 'Mathematics', competency: 'Critical Thinking' },
];

const subjectColors: Record<string, string> = {
  'Mathematics': 'bg-blue-100 text-blue-800 border-blue-200',
  'English': 'bg-green-100 text-green-800 border-green-200',
  'Science': 'bg-purple-100 text-purple-800 border-purple-200',
  'Social Studies': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Kiswahili': 'bg-red-100 text-red-800 border-red-200',
  'General': 'bg-gray-100 text-gray-800 border-gray-200',
};

const competencyColors: Record<string, string> = {
  'Critical Thinking': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Communication': 'bg-teal-100 text-teal-800 border-teal-200',
  'Creativity': 'bg-pink-100 text-pink-800 border-pink-200',
  'Collaboration': 'bg-orange-100 text-orange-800 border-orange-200',
  'Citizenship': 'bg-cyan-100 text-cyan-800 border-cyan-200',
};

export function AITutor() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('aiTutorMessages');
    return saved ? JSON.parse(saved).map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    })) : initialMessages;
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  const [selectedCompetency, setSelectedCompetency] = useState<string>('Critical Thinking');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('aiTutorMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    const context = {
      subject: selectedSubject,
      competency: selectedCompetency,
      history: messages.slice(-5).map(m => ({ sender: m.sender, content: m.content }))
    };
    return await simulateLangChainResponse(userMessage, context);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      subject: selectedSubject,
      competency: selectedCompetency,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponse = await simulateAIResponse(input);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: aiResponse,
      sender: 'ai',
      timestamp: new Date(),
      subject: selectedSubject,
      competency: selectedCompetency,
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleClearHistory = () => {
    setMessages(initialMessages);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const subjects = CBC_SUBJECTS.map(s => s.name);
  const competencies = CBC_COMPETENCIES.map(c => c.name);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div className="ml-4">
            <h1 className="text-3xl font-bold text-gray-900">AI Tutor Assistant</h1>
            <p className="text-gray-600">Personalized Junior Secondary tutoring based on Kenya CBC</p>
          </div>
        </div>
        <button
          onClick={handleClearHistory}
          className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Trash2 className="h-5 w-5 mr-2" />
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel - Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              Lesson Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <div className="flex flex-wrap gap-2">
                  {subjects.map(subject => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border ${selectedSubject === subject
                          ? subjectColors[subject]
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Competency Focus</label>
                <div className="flex flex-wrap gap-2">
                  {competencies.map(competency => (
                    <button
                      key={competency}
                      onClick={() => setSelectedCompetency(competency)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border ${selectedCompetency === competency
                          ? competencyColors[competency]
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                    >
                      {competency}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Current Session</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 mr-3 text-gray-400" />
                    <span>Subject: <span className="font-medium">{selectedSubject}</span></span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Brain className="h-4 w-4 mr-3 text-gray-400" />
                    <span>Competency: <span className="font-medium">{selectedCompetency}</span></span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-3 text-gray-400" />
                    <span>Messages: <span className="font-medium">{messages.length}</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-blue-600" />
              AI Tutor Tips
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-1.5 mr-3"></div>
                <span>Ask specific questions about CBC topics</span>
              </li>
              <li className="flex items-start">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-1.5 mr-3"></div>
                <span>Select the subject and competency focus above</span>
              </li>
              <li className="flex items-start">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-1.5 mr-3"></div>
                <span>The AI remembers your conversation history</span>
              </li>
              <li className="flex items-start">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-1.5 mr-3"></div>
                <span>Practice problems are tailored to your grade level</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Chat panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[600px]">
            {/* Chat header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Bot className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-gray-900">CBC AI Tutor</h3>
                    <p className="text-sm text-gray-500">Junior Secondary • Competency Based Curriculum</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${subjectColors[selectedSubject]}`}>
                    {selectedSubject}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${competencyColors[selectedCompetency]}`}>
                    {selectedCompetency}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages container */}
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
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                      }`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {(message.subject || message.competency) && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {message.subject && (
                            <span className={`px-2 py-1 rounded-full text-xs ${subjectColors[message.subject]}`}>
                              {message.subject}
                            </span>
                          )}
                          {message.competency && (
                            <span className={`px-2 py-1 rounded-full text-xs ${competencyColors[message.competency]}`}>
                              {message.competency}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
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

            {/* Input area */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-4">
                <textarea
                  className="flex-1 border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Ask your question about Junior Secondary subjects..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  rows={3}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="self-end px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="flex justify-between items-center mt-3">
                <p className="text-xs text-gray-500">
                  The AI tutor simulates responses based on CBC curriculum. Real implementation would use LangChain with memory.
                </p>
                <span className="text-xs text-gray-500">{input.length}/500</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
