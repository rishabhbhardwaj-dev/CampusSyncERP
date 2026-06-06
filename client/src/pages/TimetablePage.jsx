import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { academicService } from '../services/academicService';
import { timetableService } from '../services/timetableService';
import { HiOutlineCalendarDays, HiOutlineUser, HiOutlineMapPin } from 'react-icons/hi2';

const TimetablePage = () => {
  const { user, isStudent } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedDay, setSelectedDay] = useState('MONDAY');
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(false);

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  useEffect(() => {
    // Load courses initially
    if (!isStudent) {
      academicService.getCourses().then(res => setCourses(res.data.data)).catch(() => {});
    } else {
      academicService.getCourses().then(res => setCourses(res.data.data)).catch(() => {});
    }
  }, [isStudent]);

  const loadTimetable = async () => {
    if (!selectedCourse || !selectedSemester) {
      toast.error('Please select Course and Semester');
      return;
    }
    setLoading(true);
    try {
      const res = await timetableService.getTimetable(selectedCourse, selectedSemester);
      setSchedule(res.data.data);
    } catch (err) {
      toast.error('Failed to load timetable');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-white/10 bg-surface-container-low focus:bg-surface-container-high focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10 transition-all outline-none text-[14px] font-medium text-on-surface placeholder-on-surface-variant/50";

  return (
    <div className="animate-fadeIn max-w-[1000px] mx-auto space-y-[32px] pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-[32px] text-on-surface font-extrabold tracking-tight">Weekly Timetable</h1>
          <p className="font-body-md text-[16px] text-on-surface-variant mt-1">View class schedules and room allocations.</p>
        </div>
      </div>

      {/* Filters Card */}
      <div className="glass-card p-[24px] rounded-2xl border border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[24px] items-end">
          <div>
            <label className="block font-label-sm text-[12px] font-bold text-on-surface mb-2 uppercase tracking-wider">Course</label>
            <select className={inputClass} value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
              <option value="">Select Course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-label-sm text-[12px] font-bold text-on-surface mb-2 uppercase tracking-wider">Semester</label>
            <select className={inputClass} value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)}>
              <option value="">Select Semester</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
          <button 
            onClick={loadTimetable}
            className="w-full px-6 py-3 rounded-xl bg-secondary text-on-secondary font-label-md font-bold hover:scale-[1.02] shadow-lg shadow-secondary/20 transition-all flex items-center justify-center h-[46px]"
          >
            Load Timetable
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col">
        {/* Day Selector */}
        <div className="flex border-b border-white/5 overflow-x-auto custom-scrollbar bg-surface-container-lowest/50">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 min-w-[120px] py-4 font-label-sm text-[12px] font-bold uppercase tracking-widest transition-colors ${
                selectedDay === day 
                  ? 'text-secondary border-b-2 border-secondary bg-secondary/10' 
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5 border-b-2 border-transparent'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Schedule List */}
        <div className="p-[24px] bg-surface-container/30">
          {loading ? (
             <div className="text-center py-10 font-medium text-on-surface-variant">Loading schedule...</div>
          ) : schedule[selectedDay]?.length > 0 ? (
            <div className="space-y-[16px]">
              {schedule[selectedDay].map(slot => (
                <div key={slot.id} className="flex flex-col md:flex-row items-start md:items-center gap-6 p-[24px] rounded-xl border border-white/5 hover:border-secondary/30 transition-all bg-surface-container-low hover:bg-white/5 group">
                  <div className="flex-shrink-0 min-w-[160px] font-mono-sm text-[14px] font-bold text-secondary bg-secondary/10 px-4 py-2 rounded-lg text-center border border-secondary/20">
                    {slot.time}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-headline-md text-[20px] font-bold text-on-surface">{slot.subject}</h3>
                    <div className="flex items-center gap-4 mt-2 font-label-sm text-[12px] text-on-surface-variant">
                      <span className="flex items-center gap-1.5"><HiOutlineUser className="w-4 h-4" /> {slot.faculty}</span>
                      <span className="text-white/20">•</span>
                      <span className="flex items-center gap-1.5"><HiOutlineMapPin className="w-4 h-4" /> {slot.room}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/5">
                <HiOutlineCalendarDays className="w-8 h-8 text-on-surface-variant" />
              </div>
              <h3 className="font-headline-md text-[20px] font-bold text-on-surface mb-1">No Classes Scheduled</h3>
              <p className="font-body-md text-[14px] text-on-surface-variant max-w-sm">There are no classes scheduled for <span className="text-on-surface font-semibold">{selectedDay.toLowerCase()}</span> for this course and semester.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimetablePage;
