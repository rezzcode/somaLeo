import { Users, BookOpen, TrendingUp, Clock, Award, Brain } from 'lucide-react';
import { useState } from 'react';

export function Dashboard() {
  const [stats] = useState({
    totalStudents: 12,
    completedLessons: 45,
    averageProgress: 78,
    activeSessions: 3,
  });

  const recentLessons = [
    { id: 1, subject: 'Mathematics', topic: 'Algebra', student: 'John Doe', date: '2024-03-15', progress: 85 },
    { id: 2, subject: 'English', topic: 'Comprehension', student: 'Jane Smith', date: '2024-03-14', progress: 92 },
    { id: 3, subject: 'Science', topic: 'Photosynthesis', student: 'Michael Johnson', date: '2024-03-13', progress: 76 },
    { id: 4, subject: 'Social Studies', topic: 'Government', student: 'Sarah Williams', date: '2024-03-12', progress: 88 },
  ];

  const competencyAreas = [
    { name: 'Communication', value: 90, color: 'bg-blue-500' },
    { name: 'Critical Thinking', value: 75, color: 'bg-green-500' },
    { name: 'Creativity', value: 82, color: 'bg-purple-500' },
    { name: 'Collaboration', value: 68, color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, Teacher!</h1>
          <p className="text-gray-600">Here's what's happening with your Junior Secondary students today.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <span className="text-sm text-blue-700 font-medium">Kenya CBE System</span>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            New Lesson
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalStudents}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+2 this month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed Lessons</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedLessons}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+12% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Progress</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.averageProgress}%</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 rounded-full" style={{ width: `${stats.averageProgress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Sessions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeSessions}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-600">
            <Brain className="h-4 w-4 mr-1" />
            <span>AI Tutor active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Lessons */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Lessons</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800">View all</button>
          </div>
          <div className="space-y-4">
            {recentLessons.map((lesson) => (
              <div key={lesson.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div>
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${lesson.subject === 'Mathematics' ? 'bg-blue-50' :
                        lesson.subject === 'English' ? 'bg-green-50' :
                          lesson.subject === 'Science' ? 'bg-purple-50' : 'bg-yellow-50'
                      }`}>
                      <BookOpen className={`h-5 w-5 ${lesson.subject === 'Mathematics' ? 'text-blue-600' :
                          lesson.subject === 'English' ? 'text-green-600' :
                            lesson.subject === 'Science' ? 'text-purple-600' : 'text-yellow-600'
                        }`} />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">{lesson.topic}</h3>
                      <p className="text-sm text-gray-500">{lesson.subject} • {lesson.student}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{lesson.date}</p>
                  <div className="flex items-center mt-1">
                    <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${lesson.progress}%` }}></div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">{lesson.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competency Areas */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Competency Areas Progress</h2>
            <Award className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="space-y-6">
            {competencyAreas.map((area) => (
              <div key={area.name}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700">{area.name}</span>
                  <span className="font-bold text-gray-900">{area.value}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${area.color} rounded-full`} style={{ width: `${area.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="flex items-center">
              <Brain className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">AI Tutor Insight</h3>
                <p className="text-sm text-gray-600">Students show strong communication skills but need more collaborative activities.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
