import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { attendanceService, academicService } from '../services/academicService';
import studentService from '../services/studentService';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineClock, HiOutlineCalendarDays, HiOutlineBookOpen } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';

const AttendancePage = () => {
  const { user, isStudent, isAdmin, isFaculty } = useAuth();
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [studentStats, setStudentStats] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (isStudent) {
      setLoading(true);
      attendanceService.getStudentStats(selectedSemester)
        .then(res => setStudentStats(res.data.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      academicService.getCourses().then(res => setCourses(res.data.data)).catch(() => {});
    }
  }, [isStudent, selectedSemester]);

  useEffect(() => {
    if (selectedCourse && selectedSemester) {
      academicService.getSubjects(selectedCourse, selectedSemester)
        .then(res => setSubjects(res.data.data))
        .catch(() => {});
    } else {
      setSubjects([]);
      setSelectedSubject('');
    }
  }, [selectedCourse, selectedSemester]);

  const loadAttendance = async () => {
    if (!selectedCourse || !selectedSemester || !selectedSubject || !selectedDate) {
      toast.error('Please select all filters first');
      return;
    }
    
    setLoading(true);
    try {
      const studentRes = await studentService.getAll({ courseId: selectedCourse, semester: selectedSemester, limit: 100 });
      const currentStudents = studentRes.data.data;
      setStudents(currentStudents);

      if (currentStudents.length === 0) {
        toast.error('No students found for this Course and Semester');
      } else {
        toast.success(`Loaded ${currentStudents.length} students`);
      }

      const attRes = await attendanceService.getByDate(selectedDate, selectedSubject);
      const records = attRes.data.data;
      setAttendanceRecords(records);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const markStatus = async (studentId, currentRecord, newStatus) => {
    try {
      if (currentRecord) {
        await attendanceService.update(currentRecord.id, newStatus);
        setAttendanceRecords(prev => prev.map(r => r.id === currentRecord.id ? { ...r, status: newStatus } : r));
        toast.success(`Updated to ${newStatus}`);
      } else {
        const res = await attendanceService.create({
          studentId,
          subjectId: selectedSubject,
          date: selectedDate,
          status: newStatus
        });
        setAttendanceRecords(prev => [...prev, res.data.data]);
        toast.success(`Marked as ${newStatus}`);
      }
    } catch (err) {
      toast.error('Failed to update attendance');
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-white/10 bg-surface-container-low focus:bg-surface-container-high focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-[14px] text-on-surface placeholder-on-surface-variant/50 font-medium";

  return (
    <div className="animate-fadeIn max-w-[1280px] mx-auto space-y-[32px] pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-[32px] text-on-surface font-extrabold tracking-tight">
            {isStudent ? 'My Attendance' : 'Attendance Tracking'}
          </h1>
          <p className="font-body-md text-[16px] text-on-surface-variant mt-1">
            {isStudent ? 'View your attendance records and statistics.' : 'Mark and manage daily attendance records.'}
          </p>
        </div>
      </div>

      {isStudent ? (
        <>
          <div className="glass-card p-[24px] rounded-2xl flex flex-col md:flex-row md:items-center gap-4 border border-white/10">
            <label className="font-label-sm text-[12px] font-bold text-on-surface uppercase tracking-wider">Filter by Semester:</label>
            <select 
              className="w-full md:w-64 px-4 py-3 border border-white/10 rounded-xl bg-surface-container-low text-on-surface outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all font-medium text-[14px]"
              value={selectedSemester} 
              onChange={e => setSelectedSemester(e.target.value)}
            >
              <option value="">All Semesters</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
          
          <div className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col max-h-[500px]">
            <div className="overflow-y-auto relative custom-scrollbar flex-1">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-surface-container-highest/30 border-b border-white/5 sticky top-0 z-10 backdrop-blur-md">
                  <tr>
                    <th className="px-6 py-4 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Subject</th>
                    <th className="px-6 py-4 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Classes Attended</th>
                    <th className="px-6 py-4 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Total Classes</th>
                    <th className="px-6 py-4 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr><td colSpan="4" className="p-10 text-center text-on-surface-variant font-medium">Loading...</td></tr>
                  ) : studentStats.length === 0 ? (
                    <tr><td colSpan="4" className="p-16 text-center text-on-surface-variant font-medium text-[16px]">No attendance data found.</td></tr>
                  ) : studentStats.map((stat, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors duration-200">
                      <td className="px-6 py-4 font-label-md text-[14px] font-bold text-on-surface">{stat.subjectName} <span className="text-on-surface-variant opacity-60 font-normal ml-1">({stat.subjectCode})</span></td>
                      <td className="px-6 py-4 font-label-md text-[14px] text-primary font-bold">{stat.attended}</td>
                      <td className="px-6 py-4 font-label-md text-[14px] text-on-surface-variant">{stat.total}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[12px] font-bold tracking-wider ${stat.percentage >= 75 ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-error/10 text-error border border-error/20'}`}>
                          {stat.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="glass-card p-[24px] rounded-2xl border border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[24px] items-end">
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
              <div>
                <label className="block font-label-sm text-[12px] font-bold text-on-surface mb-2 uppercase tracking-wider">Subject</label>
                <select className={inputClass} value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                </select>
              </div>
              <div>
                <label className="block font-label-sm text-[12px] font-bold text-on-surface mb-2 uppercase tracking-wider">Date</label>
                <input type="date" className={inputClass} value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
              </div>
              <button 
                onClick={loadAttendance}
                className="w-full px-6 py-3 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:scale-[1.02] shadow-lg shadow-primary/20 transition-all flex items-center justify-center h-[46px]"
              >
                Load Students
              </button>
            </div>
          </div>

          {students.length > 0 && (
            <div className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col max-h-[600px]">
              <div className="overflow-y-auto relative custom-scrollbar flex-1">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead className="bg-surface-container-highest/30 border-b border-white/5 sticky top-0 z-10 backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-4 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Student</th>
                      <th className="px-6 py-4 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Enrollment No</th>
                      <th className="px-6 py-4 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Current Status</th>
                      <th className="px-6 py-4 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap text-center">Quick Mark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr><td colSpan="4" className="p-10 text-center text-on-surface-variant font-medium">Loading...</td></tr>
                    ) : students.map((student) => {
                      const record = attendanceRecords.find(r => r.studentId === student.id);
                      const status = record?.status || 'UNMARKED';

                      return (
                        <tr key={student.id} className="hover:bg-white/5 transition-colors duration-200 group">
                          <td className="px-6 py-4 font-label-md text-[14px] font-bold text-on-surface">{student.name}</td>
                          <td className="px-6 py-4 font-mono-sm text-[12px] text-on-surface-variant font-bold">{student.enrollmentNo}</td>
                          <td className="px-6 py-4">
                            {status === 'PRESENT' && <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20">Present</span>}
                            {status === 'ABSENT' && <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-error/10 text-error border border-error/20">Absent</span>}
                            {status === 'LATE' && <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-secondary/10 text-secondary border border-secondary/20">Late</span>}
                            {status === 'UNMARKED' && <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-surface-container-high text-on-surface-variant border border-white/10">Unmarked</span>}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <button onClick={() => markStatus(student.id, record, 'PRESENT')} title="Mark Present" className={`p-2 rounded-lg border transition-all hover:scale-110 ${status === 'PRESENT' ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-high text-primary border-white/10 hover:border-primary/50 hover:bg-primary/10'}`}>
                                <HiOutlineCheckCircle className="w-5 h-5" />
                              </button>
                              <button onClick={() => markStatus(student.id, record, 'ABSENT')} title="Mark Absent" className={`p-2 rounded-lg border transition-all hover:scale-110 ${status === 'ABSENT' ? 'bg-error text-on-error border-error' : 'bg-surface-container-high text-error border-white/10 hover:border-error/50 hover:bg-error/10'}`}>
                                <HiOutlineXCircle className="w-5 h-5" />
                              </button>
                              <button onClick={() => markStatus(student.id, record, 'LATE')} title="Mark Late" className={`p-2 rounded-lg border transition-all hover:scale-110 ${status === 'LATE' ? 'bg-secondary text-on-secondary border-secondary' : 'bg-surface-container-high text-secondary border-white/10 hover:border-secondary/50 hover:bg-secondary/10'}`}>
                                <HiOutlineClock className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AttendancePage;
