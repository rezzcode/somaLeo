import { BookOpen, Clock, Users, Target, CheckCircle, PlayCircle, MoreVertical, Plus, Filter } from 'lucide-react';
import { useState } from 'react';

interface Lesson {
  id: number;
  title: string;
  subject: string;
  topic: string;
  grade: string;
  duration: string;
  students: number;
  completed: boolean;
  competency: string;
  date: string;
}

export function Lessons() {
  const [lessons, setLessons] = useState<Lesson[]>([
    { id: 1, title: 'Introduction to Algebra', subject: 'Mathematics', topic: 'Algebra', grade: 'Grade 7', duration: '45 min', students: 24, completed: true, competency: 'Critical Thinking', date: '2024-03-15' },
    { id: 2, title: 'Reading Comprehension', subject: 'English', topic: 'Comprehension', grade: 'Grade 8', duration: '60 min', students: 18, completed: true, competency: 'Communication', date: '2024-03-14' },
    { id: 3, title: 'Photosynthesis Process', subject: 'Science', topic: 'Biology', grade: 'Grade 7', duration: '50 min', students: 22, completed: false, competency: 'Scientific Inquiry', date: '2024-03-16' },
    { id: 4, title: 'Government Structures', subject: 'Social Studies', topic: 'Government', grade: 'Grade 9', duration: '55 min', students: 15, completed: true, competency: 'Citizenship', date: '2024-03-12' },
    { id: 5, title: 'Creative Writing', subject: 'English', topic: 'Writing', grade: 'Grade 8', duration: '40 min', students: 20, completed: false, competency: 'Creativity', date: '2024-03-17' },
    { id: 6, title: 'Basic Accounting', subject: 'Business', topic: 'Accounting', grade: 'Grade 9', duration: '65 min', students: 12, completed: true, competency: 'Financial Literacy', date: '2024-03-13' },
  ]);

  const [filter, setFilter] = useState('all');

  const filteredLessons = lessons.filter(lesson => {
    if (filter === 'all') return true;
    if (filter === 'completed') return lesson.completed;
    if (filter === 'pending') return !lesson.completed;
    return lesson.subject.toLowerCase() === filter.toLowerCase();
  });

  const handleAddLesson = () => {
    const newLesson: Lesson = {
      id: lessons.length + 1,
      title: 'New Lesson Plan',
      subject: 'Mathematics',
      topic: 'Geometry',
      grade: 'Grade 7',
      duration: '50 min',
      students: 0,
      completed: false,
      competency: 'Critical Thinking',
      date: new Date().toISOString().split('T')[0]
    };
    setLessons([...lessons, newLesson]);
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Mathematics': return 'bg-blue-100 text-blue-800';
      case 'English': return 'bg-green-100 text-green-800';
      case 'Science': return 'bg-purple-100 text-purple-800';
      case 'Social Studies': return 'bg-yellow-100 text-yellow-800';
      case 'Business': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lesson Plans</h1>
          <p className="text-gray-600">Manage competency-based curriculum lessons for Junior Secondary</p>
        </div>
        <button
          onClick={handleAddLesson}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Lesson
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <span className="font-medium text-gray-700">Filter by:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All Lessons
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg ${filter === 'completed' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('Mathematics')}
                className={`px-4 py-2 rounded-lg ${filter === 'Mathematics' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Mathematics
              </button>
              <button
                onClick={() => setFilter('English')}
                className={`px-4 py-2 rounded-lg ${filter === 'English' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                English
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{filteredLessons.length} lessons found</span>
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredLessons.map((lesson) => (
          <div key={lesson.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${getSubjectColor(lesson.subject)}`}>
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-gray-900">{lesson.title}</h3>
                    <div className="flex items-center mt-1 space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSubjectColor(lesson.subject)}`}>
                        {lesson.subject}
                      </span>
                      <span className="text-sm text-gray-500">{lesson.grade}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {lesson.completed ? (
                    <span className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completed
                    </span>
                  ) : (
                    <span className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      <Clock className="h-4 w-4 mr-1" />
                      Pending
                    </span>
                  )}
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium text-gray-900">{lesson.duration}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Students</p>
                    <p className="font-medium text-gray-900">{lesson.students}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Competency</p>
                    <p className="font-medium text-gray-900">{lesson.competency}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{lesson.date}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">Topic: {lesson.topic}</p>
                <div className="flex justify-between items-center">
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <PlayCircle className="h-5 w-5 mr-2" />
                    Start Lesson
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons found</h3>
          <p className="text-gray-500">Try adjusting your filters or create a new lesson</p>
        </div>
      )}
    </div>
  );
}

// Need to import Calendar icon
import { Calendar } from 'lucide-react';