import { BookOpen, Trophy, Clock, Star, ArrowRight, Brain, Zap, CheckCircle2 } from 'lucide-react';

export function StudentView() {
  const subjects = [
    { name: 'Mathematics', topic: 'Algebraic Expressions', progress: 45, icon: '➗', color: 'blue' },
    { name: 'English', topic: 'Creative Writing', progress: 80, icon: '📖', color: 'green' },
    { name: 'Science', topic: 'The Digestive System', progress: 30, icon: '🔬', color: 'purple' },
    { name: 'Kiswahili', topic: 'Ushairi', progress: 95, icon: '🇰🇪', color: 'red' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Hujambo, Kamau! 👋</h1>
          <p className="text-indigo-100 text-lg mb-6 max-w-md">
            You're doing great! You've completed 4 lessons this week. Ready to reach your daily goal?
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Start AI Session
            </button>
            <button className="bg-indigo-500/30 border border-indigo-400/50 px-6 py-3 rounded-xl font-bold hover:bg-indigo-500/40 transition-colors">
              View History
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-1/4 -translate-y-1/4">
          <GraduationCap className="h-64 w-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Progress & Subjects */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Your Learning Path</h2>
              <button className="text-indigo-600 text-sm font-semibold hover:underline flex items-center gap-1">
                All Subjects <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map((subject) => (
                <div key={subject.name} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-2xl bg-${subject.color}-50`}>
                      {subject.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{subject.name}</h3>
                      <p className="text-xs text-gray-500">{subject.topic}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-indigo-600">{subject.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                        style={{ width: `${subject.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" />
              Recommended for You
            </h2>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="group flex items-center gap-4 p-4 rounded-xl border border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all cursor-pointer">
                  <div className="h-14 w-14 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white">
                    <BookOpen className="h-6 w-6 text-gray-400 group-hover:text-indigo-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 group-hover:text-indigo-600">Practice Quiz: Factors & Multiples</h4>
                    <p className="text-sm text-gray-500">Focus: Critical Thinking • 10 mins</p>
                  </div>
                  <Zap className="h-5 w-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - Stats & Achievements */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Achievements
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-yellow-50 flex items-center justify-center border-2 border-yellow-100">
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-800">Quick Learner</p>
                  <p className="text-xs text-gray-500">Completed 5 lessons in one day</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-100">
                  <CheckCircle2 className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-800">Perfect Score</p>
                  <p className="text-xs text-gray-500">100% in English Quiz</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-8 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
              View Leaderboard
            </button>
          </div>

          <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-indigo-800 rounded-lg">
                  <Brain className="h-5 w-5 text-indigo-300" />
               </div>
               <span className="font-bold">Weekly Insight</span>
            </div>
            <p className="text-sm text-indigo-200 leading-relaxed italic">
              "Your performance in Mathematics has improved by 15% this week. Focus on algebraic word problems next to master the unit!"
            </p>
            <div className="mt-6 pt-6 border-t border-indigo-800 flex justify-between items-center">
              <span className="text-xs text-indigo-300">Daily Streak</span>
              <span className="font-bold flex items-center gap-1">🔥 7 Days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { GraduationCap } from 'lucide-react';