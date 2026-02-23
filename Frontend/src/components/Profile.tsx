import { User, Mail, Phone, MapPin, GraduationCap, Calendar, Award, BookOpen, Edit2, Camera } from 'lucide-react';
import { useState, useEffect } from 'react';
import { studentApi } from '@/services/api';
import { DEFAULT_STUDENT_PROFILE } from '@/utils/mockData';
import { StudentProfile } from '@/types/auth';

export function Profile() {
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_STUDENT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await studentApi.getProfile();
        if (data) {
          setProfile(data);
        } else {
          setProfile(DEFAULT_STUDENT_PROFILE);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
        setProfile(DEFAULT_STUDENT_PROFILE);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="h-12 w-12 rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {error && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm">
          {error} - Using default profile
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-emerald-500 via-teal-500 to-lime-400 relative">
          <button className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 hover:bg-white/30 transition-colors">
            <Camera className="h-4 w-4" />
            Change Cover
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            {/* Avatar */}
            <div className="relative">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 border-4 border-white shadow-lg flex items-center justify-center">
                <User className="h-12 w-12 text-emerald-600" />
              </div>
              <button className="absolute -bottom-1 -right-1 h-8 w-8 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-emerald-700 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* Name & Role */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">{profile.name}</h1>
              <p className="text-emerald-600 font-medium">{profile.role}</p>
            </div>

            {/* Edit Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-200 font-medium">
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </button>
          </div>

          {/* Bio */}
          <p className="mt-6 text-slate-600 leading-relaxed">{profile.bio}</p>

          {/* Contact Info Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-slate-600">
              <Mail className="h-5 w-5 text-emerald-500" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Phone className="h-5 w-5 text-emerald-500" />
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <MapPin className="h-5 w-5 text-emerald-500" />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Calendar className="h-5 w-5 text-emerald-500" />
              <span>Joined {profile.enrollmentDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<BookOpen className="h-6 w-6 text-emerald-600" />}
          label="Completed Lessons"
          value={profile.stats.completedLessons.toString()}
          bgColor="bg-emerald-50"
          accentColor="from-emerald-500 to-teal-500"
        />
        <StatCard
          icon={<Award className="h-6 w-6 text-amber-600" />}
          label="Average Score"
          value={`${profile.stats.averageScore}%`}
          bgColor="bg-amber-50"
          accentColor="from-amber-500 to-orange-500"
        />
        <StatCard
          icon={<Calendar className="h-6 w-6 text-lime-600" />}
          label="Day Streak"
          value={`${profile.stats.streak} days`}
          bgColor="bg-lime-50"
          accentColor="from-lime-500 to-green-500"
        />
      </div>

      {/* Subjects/Interests */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-slate-900">Favorite Subjects</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.favoriteSubjects.map((subject, index) => {
            const colors = [
              'bg-emerald-100 text-emerald-700',
              'bg-teal-100 text-teal-700', 
              'bg-lime-100 text-lime-700'
            ];
            return (
              <span
                key={subject}
                className={`px-4 py-2 ${colors[index % colors.length]} rounded-xl font-medium text-sm`}
              >
                {subject}
              </span>
            );
          })}
        </div>
      </div>

      {/* Additional Info Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Class Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
            <p className="text-sm text-slate-500 mb-1">Class</p>
            <p className="font-semibold text-slate-900">{profile.class}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-lime-50 to-emerald-50 rounded-xl border border-lime-100">
            <p className="text-sm text-slate-500 mb-1">Academic Year</p>
            <p className="font-semibold text-slate-900">2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  bgColor, 
  accentColor 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  bgColor: string;
  accentColor: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${accentColor}`}></div>
      <div className="flex items-center gap-4">
        <div className={`h-12 w-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          <p className="text-sm text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}