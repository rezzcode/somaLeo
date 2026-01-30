import { User, Mail, Phone, Calendar, MoreVertical, Plus } from 'lucide-react';
import { useState } from 'react';

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  grade: string;
  joinDate: string;
  progress: number;
  avatarColor: string;
  subjects: string[];
}

export function StudentProfiles() {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'John Doe', email: 'john@school.co.ke', phone: '+254 712 345 678', grade: 'Grade 7', joinDate: '2024-01-15', progress: 85, avatarColor: 'bg-blue-500', subjects: ['Mathematics', 'English', 'Science'] },
    { id: 2, name: 'Jane Smith', email: 'jane@school.co.ke', phone: '+254 723 456 789', grade: 'Grade 8', joinDate: '2024-02-10', progress: 92, avatarColor: 'bg-green-500', subjects: ['English', 'Social Studies', 'Kiswahili'] },
    { id: 3, name: 'Michael Johnson', email: 'michael@school.co.ke', phone: '+254 734 567 890', grade: 'Grade 7', joinDate: '2024-01-20', progress: 76, avatarColor: 'bg-purple-500', subjects: ['Science', 'Mathematics', 'CRE'] },
    { id: 4, name: 'Sarah Williams', email: 'sarah@school.co.ke', phone: '+254 745 678 901', grade: 'Grade 9', joinDate: '2023-12-05', progress: 88, avatarColor: 'bg-yellow-500', subjects: ['Social Studies', 'English', 'Business'] },
    { id: 5, name: 'David Brown', email: 'david@school.co.ke', phone: '+254 756 789 012', grade: 'Grade 8', joinDate: '2024-02-28', progress: 65, avatarColor: 'bg-red-500', subjects: ['Mathematics', 'Science', 'Agriculture'] },
    { id: 6, name: 'Grace Wanjiku', email: 'grace@school.co.ke', phone: '+254 767 890 123', grade: 'Grade 7', joinDate: '2024-01-30', progress: 94, avatarColor: 'bg-indigo-500', subjects: ['Kiswahili', 'English', 'Music'] },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    const newStudent: Student = {
      id: students.length + 1,
      name: 'New Student',
      email: 'new@school.co.ke',
      phone: '+254 700 000 000',
      grade: 'Grade 7',
      joinDate: new Date().toISOString().split('T')[0],
      progress: 0,
      avatarColor: 'bg-gray-500',
      subjects: ['Mathematics']
    };
    setStudents([...students, newStudent]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Profiles</h1>
          <p className="text-gray-600">Manage and track Junior Secondary students progress</p>
        </div>
        <button
          onClick={handleAddStudent}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Student
        </button>
      </div>

      {/* Search and filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search students by name or grade..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex space-x-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>All Grades</option>
              <option>Grade 7</option>
              <option>Grade 8</option>
              <option>Grade 9</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Sort by: Progress</option>
              <option>Sort by: Name</option>
              <option>Sort by: Join Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className={`${student.avatarColor} h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                    {student.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-500">{student.grade}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-3 text-gray-400" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                  <span>Joined {student.joinDate}</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-bold text-gray-900">{student.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${student.progress}%` }}></div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Subjects</p>
                <div className="flex flex-wrap gap-2">
                  {student.subjects.map((subject, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                  View Profile
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                  Message
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}