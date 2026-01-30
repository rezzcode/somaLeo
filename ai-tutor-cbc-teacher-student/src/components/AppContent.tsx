import { useState } from 'react';
import { BookOpen, User, Brain, LayoutDashboard, Settings, HelpCircle, GraduationCap } from 'lucide-react';
import { Dashboard } from './Dashboard';
import { StudentProfiles } from './StudentProfiles';
import { Lessons } from './Lessons';
import { AITutor } from './AITutor';
import { StudentView } from './StudentView';

type ViewMode = 'teacher' | 'student';

export default function AppContent() {
  const [viewMode, setViewMode] = useState<ViewMode>('teacher');
  const [activeTab, setActiveTab] = useState('dashboard');

  const teacherNav = [
    { id: 'dashboard', name: 'Teacher Dashboard', icon: LayoutDashboard },
    { id: 'profiles', name: 'Student Profiles', icon: User },
    { id: 'lessons', name: 'Lesson Content', icon: BookOpen },
    { id: 'tutor-admin', name: 'AI Tutor Monitor', icon: Brain },
  ];

  const studentNav = [
    { id: 'student-dashboard', name: 'My Learning', icon: LayoutDashboard },
    { id: 'tutor', name: 'Ask AI Tutor', icon: Brain },
    { id: 'resources', name: 'Study Materials', icon: BookOpen },
  ];

  const currentNav = viewMode === 'teacher' ? teacherNav : studentNav;

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-indigo-900" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">CBE Tutor AI</h1>
          </div>
          <div className="mt-4 flex bg-indigo-800 rounded-lg p-1">
            <button 
              onClick={() => { setViewMode('teacher'); setActiveTab('dashboard'); }}
              className={`flex-1 text-xs py-1.5 rounded transition-all ${viewMode === 'teacher' ? 'bg-white text-indigo-900 shadow' : 'text-indigo-300'}`}
            >
              Teacher
            </button>
            <button 
              onClick={() => { setViewMode('student'); setActiveTab('student-dashboard'); }}
              className={`flex-1 text-xs py-1.5 rounded transition-all ${viewMode === 'student' ? 'bg-white text-indigo-900 shadow' : 'text-indigo-300'}`}
            >
              Student
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {currentNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-indigo-200 hover:bg-indigo-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-indigo-800 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-indigo-200 hover:bg-indigo-800 rounded-xl transition-all">
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-indigo-200 hover:bg-indigo-800 rounded-xl transition-all">
            <HelpCircle className="h-5 w-5" />
            <span className="font-medium">Support</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 capitalize">
            {activeTab.replace('-', ' ')}
          </h2>
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end mr-2">
                <span className="text-sm font-bold text-gray-700">{viewMode === 'teacher' ? 'Mwalimu Maina' : 'Kamau J.'}</span>
                <span className="text-xs text-gray-500">{viewMode === 'teacher' ? 'Lead Instructor' : 'Grade 7 Student'}</span>
             </div>
             <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-200">
                <User className="h-6 w-6 text-indigo-600" />
             </div>
          </div>
        </header>

        <div className="p-8">
          {viewMode === 'teacher' ? (
            <>
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'profiles' && <StudentProfiles />}
              {activeTab === 'lessons' && <Lessons />}
              {activeTab === 'tutor-admin' && <AITutor />}
            </>
          ) : (
            <>
              {activeTab === 'student-dashboard' && <StudentView />}
              {activeTab === 'tutor' && <AITutor />}
              {activeTab === 'resources' && <Lessons />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
