import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { academicService } from '../services/academicService';
import { marksService } from '../services/marksService';
import studentService from '../services/studentService';
import { HiOutlineDocumentText, HiOutlinePencilSquare } from 'react-icons/hi2';

import { useAuth } from '../context/AuthContext';

const MarksPage = () => {
  const { user, isStudent } = useAuth();
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({}); // { studentId: marksObtained }
  const [studentMarks, setStudentMarks] = useState([]); // for student view
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [examType, setExamType] = useState('');
  const [maxMarks, setMaxMarks] = useState(100);

  useEffect(() => {
    if (isStudent) {
      setLoading(true);
      marksService.getMyMarks(selectedSemester)
        .then(res => setStudentMarks(res.data.data))
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

  const loadStudentsAndMarks = async () => {
    if (!selectedCourse || !selectedSemester || !selectedSubject || !examType) {
      toast.error('Please select all filters to load students');
      return;
    }
    setLoading(true);
    setHasFetched(false);
    try {
      const studentRes = await studentService.getAll({ courseId: selectedCourse, semester: selectedSemester, limit: 100 });
      const currentStudents = studentRes.data.data;
      setStudents(currentStudents);
      setHasFetched(true);

      if (currentStudents.length === 0) {
        toast.error('No students found for this Course and Semester');
      } else {
        toast.success(`Loaded ${currentStudents.length} students`);
      }

      const marksRes = await marksService.getMarks(selectedCourse, selectedSemester, selectedSubject, examType);
      
      const marksMap = {};
      marksRes.data.data.forEach(m => {
        marksMap[m.studentId] = m.marksObtained;
      });
      setMarks(marksMap);
      
      if (marksRes.data.data.length > 0) {
        setMaxMarks(marksRes.data.data[0].maxMarks);
      }
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (studentId, value) => {
    setMarks(prev => ({ ...prev, [studentId]: value }));
  };

  const handleSaveMarks = async () => {
    const marksData = Object.entries(marks)
      .filter(([_, val]) => val !== '' && val !== undefined)
      .map(([studentId, val]) => ({
        studentId: parseInt(studentId),
        marksObtained: parseFloat(val)
      }));

    if (marksData.length === 0) {
      toast.error('No marks entered to save.');
      return;
    }

    setSaving(true);
    try {
      await marksService.saveMarks(selectedSubject, examType, marksData, maxMarks);
      toast.success('Marks saved successfully!');
    } catch (err) {
      toast.error('Failed to save marks');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-3 border border-white/10 rounded-xl bg-surface-container-low text-[14px] font-medium text-on-surface outline-none focus:border-tertiary/50 focus:ring-4 focus:ring-tertiary/10 transition-all placeholder-on-surface-variant/50";

  return (
    <div className="animate-fadeIn max-w-[1280px] mx-auto space-y-[32px] pb-8 print:max-w-full print:m-0 print:p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-[32px] text-on-surface font-extrabold tracking-tight">
            {isStudent ? 'My Marks & Grades' : 'Marks & Grades'}
          </h1>
          <p className="font-body-md text-[16px] text-on-surface-variant mt-1 print:hidden">
            {isStudent ? 'View your academic performance.' : 'Upload and manage examination marks.'}
          </p>
        </div>
        {isStudent && (
          <button 
            onClick={() => window.print()}
            className="print:hidden flex items-center justify-center gap-2 px-6 py-3 bg-surface-container-high border border-white/10 rounded-xl font-label-md text-on-surface hover:bg-white/5 transition-all shadow-sm"
          >
            Export PDF
          </button>
        )}
      </div>

      {isStudent ? (
        <>
          <div className="print:hidden glass-card p-[24px] rounded-2xl flex flex-col md:flex-row md:items-center gap-4 border border-white/10">
            <label className="font-label-sm text-[12px] font-bold text-on-surface uppercase tracking-wider">Filter by Semester:</label>
            <select className={inputClass + " md:w-64"} value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)}>
              <option value="">All Semesters</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
          
          <div className="glass-card rounded-2xl border border-white/10 overflow-hidden relative max-h-[500px]">
            <div className="overflow-y-auto relative custom-scrollbar flex-1">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-surface-container-highest/30 border-b border-white/5 sticky top-0 z-10 backdrop-blur-md">
                  <tr>
                    <th className="px-6 py-4 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Semester</th>
                    <th className="px-6 py-4 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Subject</th>
                    <th className="px-6 py-4 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Exam Type</th>
                    <th className="px-6 py-4 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Marks Obtained</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr><td colSpan={4} className="p-10 text-center text-on-surface-variant font-medium">Loading...</td></tr>
                  ) : studentMarks.length === 0 ? (
                    <tr><td colSpan={4} className="p-16 text-center text-on-surface-variant font-medium text-[16px]">No marks found. Please select a semester with data.</td></tr>
                  ) : studentMarks.map((mark, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors duration-200">
                      <td className="px-6 py-4 font-label-md text-[14px] text-on-surface-variant">Sem {mark.subject.semester}</td>
                      <td className="px-6 py-4 font-label-md text-[14px] font-bold text-on-surface">{mark.subject.name} <span className="opacity-60 font-normal">({mark.subject.code})</span></td>
                      <td className="px-6 py-4 font-label-md text-[14px] text-on-surface-variant">{mark.examType.replace('_', ' ')}</td>
                      <td className="px-6 py-4">
                        <span className="font-display text-[20px] font-bold text-tertiary tabular-nums tracking-tight">{mark.marksObtained}</span> 
                        <span className="text-on-surface-variant text-[14px]"> / {mark.maxMarks}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="hidden print:block mt-12 text-center font-label-sm text-[12px] text-on-surface-variant">
            <p className="font-bold text-on-surface mb-1 uppercase tracking-wider">Official Academic Scorecard Generated by CampusSync ERP</p>
            <p>Date: {new Date().toLocaleDateString()}</p>
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
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-label-sm text-[12px] font-bold text-on-surface mb-2 uppercase tracking-wider">Exam Type</label>
                <select className={inputClass} value={examType} onChange={e => setExamType(e.target.value)}>
                  <option value="">Select Exam</option>
                  <option value="INTERNAL_1">Internal 1</option>
                  <option value="INTERNAL_2">Internal 2</option>
                  <option value="SEMESTER">Semester</option>
                </select>
              </div>
              <button 
                onClick={loadStudentsAndMarks}
                className="w-full px-6 py-3 rounded-xl bg-tertiary text-on-tertiary font-label-md font-bold hover:scale-[1.02] shadow-lg shadow-tertiary/20 transition-all h-[46px] flex items-center justify-center"
              >
                Load Students
              </button>
            </div>
          </div>

          {hasFetched && students.length === 0 && (
            <div className="glass-card p-[48px] rounded-2xl border border-white/10 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                 <HiOutlineDocumentText className="w-8 h-8 text-on-surface-variant" />
              </div>
              <h3 className="font-headline-md text-[20px] font-bold text-on-surface">No Students Found</h3>
              <p className="font-body-md text-[14px] text-on-surface-variant mt-2">There are no students enrolled matching your criteria.</p>
            </div>
          )}

          {students.length > 0 && (
            <div className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col">
              <div className="p-[24px] bg-surface-container-lowest/50 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="font-headline-md text-[18px] font-bold text-on-surface flex items-center gap-2">
                  <HiOutlinePencilSquare className="w-5 h-5 text-tertiary" />
                  Enter Marks
                </h2>
                <div className="flex items-center gap-3">
                  <label className="font-label-sm text-[12px] font-bold text-on-surface uppercase tracking-wider">Max Marks:</label>
                  <input type="number" value={maxMarks} onChange={e => setMaxMarks(e.target.value)} className="w-24 px-4 py-2 border border-white/10 rounded-lg bg-surface-container-low text-on-surface font-mono-sm outline-none text-center focus:border-tertiary/50 transition-all" />
                </div>
              </div>
              
              <div className="overflow-x-auto relative custom-scrollbar flex-1 max-h-[600px]">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead className="bg-surface-container-highest/30 border-b border-white/5 sticky top-0 z-10 backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-4 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap w-[200px]">Enrollment No</th>
                      <th className="px-6 py-4 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Student Name</th>
                      <th className="px-6 py-4 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap text-right w-[200px]">Marks Obtained</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr><td colSpan={3} className="p-10 text-center text-on-surface-variant font-medium">Loading...</td></tr>
                    ) : students.map((student) => (
                      <tr key={student.id} className="hover:bg-white/5 transition-colors duration-200 group">
                        <td className="px-6 py-4 font-mono-sm text-[14px] text-on-surface-variant">{student.enrollmentNo}</td>
                        <td className="px-6 py-4 font-label-md text-[14px] font-bold text-on-surface">{student.name}</td>
                        <td className="px-6 py-4 text-right">
                          <input 
                            type="number" 
                            min="0" 
                            max={maxMarks}
                            value={marks[student.id] !== undefined ? marks[student.id] : ''}
                            onChange={(e) => handleMarkChange(student.id, e.target.value)}
                            className="w-28 px-4 py-2 border border-white/10 rounded-lg bg-surface-container-low text-on-surface outline-none text-right focus:border-tertiary/50 focus:ring-2 focus:ring-tertiary/10 font-mono-sm transition-all placeholder-on-surface-variant/30"
                            placeholder="--"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-[24px] bg-surface-container-lowest/50 flex justify-end border-t border-white/5">
                <button 
                  onClick={handleSaveMarks}
                  disabled={saving}
                  className={`px-8 py-3 rounded-xl bg-tertiary text-on-tertiary font-label-md font-bold transition-all shadow-lg shadow-tertiary/20 flex items-center justify-center min-w-[160px] ${saving ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                >
                  {saving ? 'Saving Data...' : 'Save All Marks'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MarksPage;
