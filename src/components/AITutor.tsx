import { Send, Bot, User, Brain, BookOpen, Zap, Trash2, Loader, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { tutorApi } from '@/services/api';
import { DEFAULT_SUBJECTS, DEFAULT_COMPETENCIES, DEFAULT_INITIAL_MESSAGE } from '@/utils/mockData';
import { TutorMessage, Subject, Competency } from '@/types/auth';

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

type LevelFilter = 'All' | 'Upper Primary' | 'Junior School' | 'Senior School';
type SubjectTypeFilter = 'All' | 'Languages' | 'Sciences' | 'Humanities' | 'Arts' | 'Technical' | 'Health' | 'Sports';

const CORE_SUBJECTS = [
  'English',
  'Kiswahili',
  'Kenya Sign Language',
  'Mathematics',
  'Physical Education (PE)',
  'Religious Education (CRE/IRE/HRE)',
];

const SUBJECT_CATALOG: Array<{
  name: string;
  levels: LevelFilter[];
  types: SubjectTypeFilter[];
}> = [
  // Core across all levels
  { name: 'English', levels: ['All'], types: ['Languages'] },
  { name: 'Kiswahili', levels: ['All'], types: ['Languages'] },
  { name: 'Kenya Sign Language', levels: ['All'], types: ['Languages'] },
  { name: 'Mathematics', levels: ['All'], types: ['Sciences'] },
  { name: 'Physical Education (PE)', levels: ['All'], types: ['Sports'] },
  { name: 'Religious Education (CRE/IRE/HRE)', levels: ['All'], types: ['Humanities'] },

  // Upper Primary (Grades 4–6)
  { name: 'Science & Technology', levels: ['Upper Primary'], types: ['Sciences'] },
  { name: 'Agriculture and Nutrition', levels: ['Upper Primary', 'Junior School'], types: ['Sciences'] },
  { name: 'Social Studies', levels: ['Upper Primary', 'Junior School'], types: ['Humanities'] },
  { name: 'Creative Arts', levels: ['Upper Primary'], types: ['Arts'] },
  { name: 'Foreign Languages (French, German, Arabic, Mandarin)', levels: ['Upper Primary', 'Senior School'], types: ['Languages'] },

  // Junior School (Grades 7–9)
  { name: 'Integrated Science', levels: ['Junior School'], types: ['Sciences'] },
  { name: 'Pre-Technical Studies', levels: ['Junior School'], types: ['Technical'] },
  { name: 'Creative Arts and Sports', levels: ['Junior School'], types: ['Arts', 'Sports'] },
  { name: 'Health Education', levels: ['Junior School'], types: ['Health'] },

  // Senior School (Grades 10–12) Core & Pathways
  { name: 'Community Service Learning (CSL)', levels: ['Senior School'], types: ['Humanities'] },

  // STEM Pathway
  { name: 'Biology', levels: ['Senior School'], types: ['Sciences'] },
  { name: 'Chemistry', levels: ['Senior School'], types: ['Sciences'] },
  { name: 'Physics', levels: ['Senior School'], types: ['Sciences'] },
  { name: 'General Science', levels: ['Senior School'], types: ['Sciences'] },
  { name: 'Agriculture', levels: ['Senior School'], types: ['Sciences'] },
  { name: 'Computer Studies', levels: ['Senior School'], types: ['Technical'] },
  { name: 'Home Science', levels: ['Senior School'], types: ['Sciences'] },
  { name: 'Aviation', levels: ['Senior School'], types: ['Technical'] },
  { name: 'Building Construction', levels: ['Senior School'], types: ['Technical'] },
  { name: 'Electricity', levels: ['Senior School'], types: ['Technical'] },
  { name: 'Metalwork', levels: ['Senior School'], types: ['Technical'] },
  { name: 'Power Mechanics', levels: ['Senior School'], types: ['Technical'] },
  { name: 'Woodwork', levels: ['Senior School'], types: ['Technical'] },

  // Social Sciences Pathway
  { name: 'History', levels: ['Senior School'], types: ['Humanities'] },
  { name: 'Geography', levels: ['Senior School'], types: ['Humanities'] },
  { name: 'Business Studies', levels: ['Senior School'], types: ['Humanities'] },
  { name: 'Religious Education', levels: ['Senior School'], types: ['Humanities'] },
  { name: 'Literature in English', levels: ['Senior School'], types: ['Languages'] },
  { name: 'Fasihi ya Kiswahili', levels: ['Senior School'], types: ['Languages'] },

  // Arts & Sports Science Pathway
  { name: 'Performing Arts (Music/Dance, Theatre/Film)', levels: ['Senior School'], types: ['Arts'] },
  { name: 'Visual Arts (Fine Art)', levels: ['Senior School'], types: ['Arts'] },
  { name: 'Sports and Recreation', levels: ['Senior School'], types: ['Sports'] },
];

export function AITutor() {
  const [messages, setMessages] = useState<TutorMessage[]>([DEFAULT_INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>(DEFAULT_SUBJECTS);
  const [competencies, setCompetencies] = useState<Competency[]>(DEFAULT_COMPETENCIES);
  const [selectedSubject, setSelectedSubject] = useState<string>(DEFAULT_SUBJECTS[0].name);
  const [selectedCompetency, setSelectedCompetency] = useState<string>(DEFAULT_COMPETENCIES[0].name);
  const [apiError, setApiError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showMoreSubjects, setShowMoreSubjects] = useState(false);
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('All');
  const [typeFilter, setTypeFilter] = useState<SubjectTypeFilter>('All');

  // Load subjects and competencies from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const subjectsData = await tutorApi.getSubjects();
        if (subjectsData) {
          setSubjects(subjectsData);
          setSelectedSubject(subjectsData[0]?.name || DEFAULT_SUBJECTS[0].name);
        }

        const competenciesData = await tutorApi.getCompetencies();
        if (competenciesData) {
          setCompetencies(competenciesData);
          setSelectedCompetency(competenciesData[0]?.name || DEFAULT_COMPETENCIES[0].name);
        }
      } catch (error) {
        console.error('Failed to load tutor data:', error);
        setApiError('Using default subjects and competencies');
      }
    };

    loadData();
  }, []);

  // Load message history from API
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messagesData = await tutorApi.getMessages();
        if (messagesData && messagesData.length > 0) {
          setMessages(messagesData.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })));
        }
      } catch (error) {
        console.warn('Failed to load message history:', error);
      }
    };

    loadMessages();
  }, []);

  // Save messages to local storage
  useEffect(() => {
    localStorage.setItem('aiTutorMessages', JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: TutorMessage = {
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

    try {
      const aiResponse = await tutorApi.sendMessage(input, selectedSubject, selectedCompetency);
      
      const aiMessage: TutorMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse?.content || 'I apologize, I could not generate a response. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        subject: selectedSubject,
        competency: selectedCompetency,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: TutorMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again later.',
        sender: 'ai',
        timestamp: new Date(),
        subject: selectedSubject,
        competency: selectedCompetency,
      };
      setMessages(prev => [...prev, errorMessage]);
      setApiError('Failed to send message to AI tutor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([DEFAULT_INITIAL_MESSAGE]);
    localStorage.removeItem('aiTutorMessages');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const apiSubjectNames = subjects.map(s => s.name);
  const subjectNames = Array.from(new Set([
    ...CORE_SUBJECTS,
    ...apiSubjectNames,
    selectedSubject,
  ]));

  const filteredMoreSubjects = SUBJECT_CATALOG.filter(item => {
    const levelMatch = levelFilter === 'All' || item.levels.includes(levelFilter) || item.levels.includes('All');
    const typeMatch = typeFilter === 'All' || item.types.includes(typeFilter);
    return levelMatch && typeMatch;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
            <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <div className="ml-3 sm:ml-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">AI Tutor Assistant</h1>
            <p className="text-sm sm:text-base text-gray-600">Personalized Junior Secondary tutoring</p>
          </div>
        </div>
        <button
          onClick={handleClearHistory}
          className="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base w-full sm:w-auto"
        >
          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Clear History
        </button>
      </div>

      {apiError && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm">
          {apiError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left panel - Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              Lesson Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <button
                    type="button"
                    onClick={() => setShowMoreSubjects(prev => !prev)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    More
                    <ChevronDown className={`h-4 w-4 transition-transform ${showMoreSubjects ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {subjectNames.map(subject => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border ${selectedSubject === subject
                          ? subjectColors[subject] || 'bg-gray-100 text-gray-800'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>

              {showMoreSubjects && (
                <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Learning Level</label>
                      <select
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value as LevelFilter)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option>All</option>
                        <option>Upper Primary</option>
                        <option>Junior School</option>
                        <option>Senior School</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Subject Type</label>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as SubjectTypeFilter)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option>All</option>
                        <option>Languages</option>
                        <option>Sciences</option>
                        <option>Humanities</option>
                        <option>Arts</option>
                        <option>Technical</option>
                        <option>Health</option>
                        <option>Sports</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {filteredMoreSubjects.map(subject => (
                      <button
                        key={subject.name}
                        onClick={() => setSelectedSubject(subject.name)}
                        className="px-3 py-2 rounded-lg text-sm font-medium border bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                      >
                        {subject.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
                <span>Ask specific questions about CBE topics</span>
              </li>
              <li className="flex items-start">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-1.5 mr-3"></div>
                <span>Select the subject and competency focus</span>
              </li>
              <li className="flex items-start">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-1.5 mr-3"></div>
                <span>Your conversation is saved locally</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Chat panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[450px] sm:h-[500px] lg:h-[600px]">
            {/* Chat header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Bot className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-gray-900">CBE AI Tutor</h3>
                    <p className="text-sm text-gray-500">Junior Secondary • Competency Based Education</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center space-x-2">
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${subjectColors[selectedSubject] || 'bg-gray-100 text-gray-800'}`}>
                    {selectedSubject}
                  </span>
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${competencyColors[selectedCompetency] || 'bg-gray-100 text-gray-800'}`}>
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
            <div className="p-3 sm:p-4 border-t border-gray-200">
              <div className="flex space-x-2 sm:space-x-4">
                <textarea
                  className="flex-1 border border-gray-300 rounded-xl p-3 sm:p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                  placeholder="Ask your question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  rows={2}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="self-end px-4 sm:px-6 py-3 sm:py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <Loader className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
              <div className="flex justify-between items-center mt-3">
                <p className="text-xs text-gray-500">
                  The AI tutor simulates responses based on CBE curriculum. Real implementation would use LangChain with memory.
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