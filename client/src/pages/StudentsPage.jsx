import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import studentService from '../services/studentService';
import { academicService } from '../services/academicService';
import {
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineXMark,
  HiOutlineAcademicCap,
  HiOutlineUserGroup,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineFunnel,
  HiOutlineArrowDownTray,
  HiOutlineCheckCircle
} from 'react-icons/hi2';

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-white/5">
    <td className="py-4 px-6"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-white/5 rounded-full"></div><div><div className="h-4 w-24 bg-white/5 rounded mb-2"></div><div className="h-3 w-32 bg-white/5 rounded"></div></div></div></td>
    <td className="py-4 px-6"><div className="h-6 w-24 bg-white/5 rounded-md"></div></td>
    <td className="py-4 px-6"><div className="h-4 w-20 bg-white/5 rounded"></div></td>
    <td className="py-4 px-6"><div className="h-4 w-20 bg-white/5 rounded"></div></td>
    <td className="py-4 px-6"><div className="h-6 w-12 bg-white/5 rounded-md"></div></td>
    <td className="py-4 px-6"><div className="h-4 w-8 bg-white/5 rounded"></div></td>
    <td className="py-4 px-6"><div className="h-6 w-16 bg-white/5 rounded-full"></div></td>
    <td className="py-4 px-6"><div className="flex gap-2"><div className="h-8 w-8 bg-white/5 rounded-lg"></div><div className="h-8 w-8 bg-white/5 rounded-lg"></div></div></td>
  </tr>
);

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [semFilter, setSemFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [createdPassword, setCreatedPassword] = useState(null);

  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', enrollmentNo: '', courseId: '', semester: 1, section: '', admissionYear: new Date().getFullYear(), guardianName: '', guardianPhone: '', departmentId: '' });

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (semFilter) params.semester = semFilter;
      if (deptFilter) params.department = deptFilter;
      const res = await studentService.getAll(params);
      setStudents(res.data.data);
      setPagination(res.data.pagination);
    } catch { toast.error('Failed to load students'); }
    finally { setLoading(false); }
  }, [page, search, semFilter, deptFilter]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [dRes, cRes] = await Promise.all([
          studentService.getStats(),
          academicService.getCourses()
        ]);
        if (dRes.data.success) {
          setDepartments(dRes.data.data.byDepartment || []);
        }
        if (cRes.data.success) {
          setCourses(cRes.data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch meta', err);
      }
    };
    fetchMeta();
  }, []);

  const openAdd = () => {
    setEditingStudent(null);
    setForm({ name: '', email: '', phone: '', enrollmentNo: '', courseId: '', semester: 1, section: '', admissionYear: new Date().getFullYear(), guardianName: '', guardianPhone: '', departmentId: '' });
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditingStudent(s);
    setForm({ name: s.name, email: s.email, phone: s.phone || '', enrollmentNo: s.enrollmentNo, courseId: s.courseId || '', semester: s.semester, section: s.section || '', admissionYear: s.admissionYear, guardianName: s.guardianName || '', guardianPhone: s.guardianPhone || '', departmentId: s.departmentId || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentService.update(editingStudent.id, form);
        toast.success('Student updated!');
        setCreatedPassword(null);
      } else {
        const res = await studentService.create(form);
        const msg = res.data?.message || '';
        const passwordMatch = msg.match(/Temporary password:\s*(\S+)/);
        if (passwordMatch) {
          setCreatedPassword({
            name: form.name,
            email: form.email,
            password: passwordMatch[1],
          });
        } else {
          toast.success('Student added!');
        }
      }
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };
  const handleDelete = async () => {
    try {
      await studentService.delete(deleteTarget.id);
      toast.success('Student deleted');
      setDeleteTarget(null);
      fetchStudents();
    } catch { toast.error('Delete failed'); }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-white/10 bg-surface-container-low focus:bg-surface-container-high focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-[14px] text-on-surface placeholder-on-surface-variant/50";

  return (
    <div className="space-y-[32px] animate-fadeIn pb-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-[32px] text-on-surface font-extrabold tracking-tight">Student Management</h1>
          <p className="font-body-md text-[16px] text-on-surface-variant mt-1 max-w-xl">Manage enrollments, update details, and view academic records.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none items-center justify-center gap-2 px-6 py-3 bg-surface-container-high border border-white/10 text-on-surface font-label-md rounded-xl hover:bg-white/5 transition-all flex">
            <HiOutlineArrowDownTray className="w-5 h-5" /> Export Data
          </button>
          <button onClick={openAdd} className="flex-1 md:flex-none items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary font-label-md rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-primary/20 flex font-bold">
            <HiOutlinePlus className="w-5 h-5" /> Add Student
          </button>
        </div>
      </div>

      {/* Main Glass Card */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col">
        {/* Toolbar & Advanced Filters */}
        <div className="p-[24px] border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between bg-surface-container-lowest/50">
          <div className="relative w-full md:max-w-sm group">
            <div className="relative w-full flex items-center">
              <HiOutlineMagnifyingGlass className="absolute left-4 w-5 h-5 text-on-surface-variant pointer-events-none group-focus-within:text-primary transition-colors" />
              <input 
                placeholder="Search students by name or enrollment..." 
                value={search} 
                onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
                className="w-full py-3 pr-4 pl-12 rounded-full border border-white/10 bg-surface-container-low text-[14px] text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all" 
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none min-w-[160px]">
              <select 
                value={deptFilter} 
                onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }} 
                className="w-full appearance-none pl-4 pr-10 py-3 bg-surface-container-low border border-white/10 text-on-surface rounded-full text-[14px] focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none cursor-pointer font-medium"
              >
                <option value="">All Departments</option>
                <option value="1">Computer Science</option>
                <option value="2">Electronics</option>
                <option value="3">Mechanical</option>
              </select>
              <HiOutlineFunnel className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
            </div>
            <div className="relative flex-1 md:flex-none min-w-[160px]">
              <select 
                value={semFilter} 
                onChange={(e) => { setSemFilter(e.target.value); setPage(1); }} 
                className="w-full appearance-none pl-4 pr-10 py-3 bg-surface-container-low border border-white/10 text-on-surface rounded-full text-[14px] focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none cursor-pointer font-medium"
              >
                <option value="">All Semesters</option>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
              <HiOutlineFunnel className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto relative custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-surface-container-highest/30 border-b border-white/5 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                {['Student', 'Enrollment No', 'Department', 'Course', 'Sem', 'Section', 'Status', 'Actions'].map(h => (
                  <th key={h} className="py-4 px-6 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <HiOutlineUserGroup className="w-8 h-8 text-on-surface-variant" />
                    </div>
                    <p className="text-on-surface font-headline-md text-[18px]">No students found</p>
                    <p className="text-on-surface-variant text-[14px] mt-1">Try adjusting your filters or search query.</p>
                  </td>
                </tr>
              ) : students.map((s) => (
                <tr key={s.id} className="border-b border-transparent hover:bg-white/5 transition-colors duration-200 group">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-primary/10 text-primary border border-primary/20">
                        {s.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-label-md text-[14px] text-on-surface font-semibold">{s.name}</p>
                        <p className="text-[12px] text-on-surface-variant mt-0.5">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="bg-secondary/10 text-secondary border border-secondary/20 px-2.5 py-1 rounded-md font-mono-sm font-semibold tracking-wider">{s.enrollmentNo}</span>
                  </td>
                  <td className="py-4 px-6 font-label-md text-[14px] text-on-surface-variant whitespace-nowrap">{s.department}</td>
                  <td className="py-4 px-6 font-label-md text-[14px] text-on-surface-variant whitespace-nowrap">{s.course}</td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="bg-surface-container-high text-on-surface px-3 py-1 rounded-full font-label-sm font-bold border border-white/5">{s.semester}</span>
                  </td>
                  <td className="py-4 px-6 font-label-md text-[14px] text-on-surface-variant whitespace-nowrap">{s.section || '—'}</td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest flex items-center gap-1.5 w-max uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> Active
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(s)} className="p-2 rounded-lg bg-surface-container-high border border-white/10 text-on-surface-variant hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all" title="Edit Student">
                        <HiOutlinePencilSquare className="w-5 h-5" />
                      </button>
                      <button onClick={() => setDeleteTarget(s)} className="p-2 rounded-lg bg-surface-container-high border border-white/10 text-on-surface-variant hover:text-error hover:border-error/50 hover:bg-error/10 transition-all" title="Delete Student">
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-[24px] border-t border-white/5 bg-surface-container-lowest/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-label-sm text-[12px] text-on-surface-variant uppercase tracking-wider">
            Showing <span className="font-bold text-on-surface">{students.length > 0 ? ((page - 1) * 10) + 1 : 0}</span> to <span className="font-bold text-on-surface">{Math.min(page * 10, pagination.total || 0)}</span> of <span className="font-bold text-on-surface">{pagination.total || 0}</span>
          </span>
          <div className="flex gap-2">
            <button 
              disabled={page <= 1} 
              onClick={() => setPage(p => p - 1)} 
              className={`p-2.5 rounded-xl border transition-all ${page <= 1 ? 'bg-surface-container border-transparent text-on-surface-variant/30 cursor-not-allowed' : 'bg-surface-container-high border-white/10 text-on-surface hover:bg-white/5'}`}
            >
              <HiOutlineChevronLeft className="w-5 h-5" />
            </button>
            <button 
              disabled={page >= pagination.totalPages} 
              onClick={() => setPage(p => p + 1)} 
              className={`p-2.5 rounded-xl border transition-all ${page >= pagination.totalPages ? 'bg-surface-container border-transparent text-on-surface-variant/30 cursor-not-allowed' : 'bg-surface-container-high border-white/10 text-on-surface hover:bg-white/5'}`}
            >
              <HiOutlineChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={() => setShowModal(false)}>
          <div className="bg-surface-container-high rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-surface-container-high/90 backdrop-blur-xl px-8 py-6 border-b border-white/5 flex justify-between items-center z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <HiOutlineAcademicCap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-headline-md text-[20px] font-bold text-on-surface">{editingStudent ? 'Edit Student Details' : 'Add New Student'}</h2>
                  <p className="font-label-sm text-[12px] text-on-surface-variant mt-1">Fill in the required student information.</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-colors">
                <HiOutlineXMark className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                {[
                  { label: 'Full Name *', key: 'name', type: 'text', span: 2 },
                  { label: 'Email Address *', key: 'email', type: 'email' },
                  { label: 'Phone Number', key: 'phone', type: 'text' },
                  { label: 'Enrollment No *', key: 'enrollmentNo', type: 'text' },
                  { label: 'Course ID *', key: 'courseId', type: 'number' },
                  { label: 'Semester', key: 'semester', type: 'number' },
                  { label: 'Section', key: 'section', type: 'text' },
                  { label: 'Admission Year', key: 'admissionYear', type: 'number' },
                  { label: 'Department ID', key: 'departmentId', type: 'number' },
                  { label: 'Guardian Name', key: 'guardianName', type: 'text' },
                  { label: 'Guardian Phone', key: 'guardianPhone', type: 'text' },
                ].map(({ label, key, type, span }) => (
                  <div key={key} className={span === 2 ? 'md:col-span-2' : ''}>
                    <label className="block font-label-sm text-[12px] font-bold text-on-surface mb-2 uppercase tracking-wider">{label}</label>
                    {key === 'courseId' ? (
                      <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className={inputClass}>
                        <option value="">Select Course</option>
                        {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    ) : key === 'departmentId' ? (
                      <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className={inputClass}>
                        <option value="">Select Department</option>
                        <option value="1">Computer Science (CSE)</option>
                        <option value="2">Electronics & Comm (ECE)</option>
                        <option value="3">Mechanical (ME)</option>
                      </select>
                    ) : (
                      <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className={inputClass} placeholder={`Enter ${label.replace(' *', '').toLowerCase()}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-10 justify-end pt-6 border-t border-white/5">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl border border-white/10 text-on-surface font-label-md font-bold hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-3 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:scale-[1.02] shadow-lg shadow-primary/20 transition-all">
                  {editingStudent ? 'Save Changes' : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={() => setDeleteTarget(null)}>
          <div className="bg-surface-container-high rounded-2xl w-full max-w-md p-8 text-center shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
            <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-error/20">
              <HiOutlineTrash className="w-10 h-10 text-error" />
            </div>
            <h3 className="font-headline-md text-[24px] font-bold text-on-surface mb-2">Delete Student Record?</h3>
            <p className="font-body-md text-[14px] text-on-surface-variant mb-8 leading-relaxed">
              Are you sure you want to delete <strong className="text-on-surface">{deleteTarget.name}</strong>? This action cannot be undone and will permanently remove all associated data.
            </p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => setDeleteTarget(null)} className="px-6 py-3 rounded-xl border border-white/10 text-on-surface font-label-md font-bold hover:bg-white/5 transition-colors w-full">Cancel</button>
              <button onClick={handleDelete} className="px-6 py-3 rounded-xl bg-error text-on-error font-label-md font-bold hover:scale-[1.02] shadow-lg shadow-error/20 transition-all w-full">Delete Record</button>
            </div>
          </div>
        </div>
      )}

      {/* Password Display Modal */}
      {createdPassword && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={() => setCreatedPassword(null)}>
          <div className="bg-surface-container-high rounded-2xl w-full max-w-md p-8 shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
              <HiOutlineCheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-headline-md text-[24px] font-bold text-on-surface mb-2 text-center">Student Created Successfully</h3>
            <div className="bg-surface-container-low rounded-xl p-6 mt-6 border border-white/10 space-y-3">
              <div className="flex justify-between">
                <span className="text-on-surface-variant text-[13px]">Name</span>
                <span className="text-on-surface font-semibold text-[14px]">{createdPassword.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant text-[13px]">Email</span>
                <span className="text-on-surface font-semibold text-[14px]">{createdPassword.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant text-[13px]">Temporary Password</span>
                <div className="flex items-center gap-2">
                  <span className="text-on-surface font-mono font-bold text-[14px] bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">{createdPassword.password}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(createdPassword.password);
                      toast.success('Password copied!');
                    }}
                    className="p-2 rounded-lg bg-surface-container-high border border-white/10 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all"
                    title="Copy password"
                  >
                    <HiOutlineArrowDownTray className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 rounded-xl bg-error/5 border border-error/20">
              <p className="text-[12px] text-error font-semibold text-center">
                Share this password with the student securely. It will not be shown again.
              </p>
            </div>
            <button
              onClick={() => setCreatedPassword(null)}
              className="mt-6 w-full py-3 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:scale-[1.02] shadow-lg shadow-primary/20 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
