import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import facultyService from '../services/facultyService';
import { 
  HiOutlineMagnifyingGlass, 
  HiOutlinePlus, 
  HiOutlinePencilSquare, 
  HiOutlineTrash, 
  HiOutlineXMark, 
  HiOutlineUserGroup, 
  HiOutlineChevronLeft, 
  HiOutlineChevronRight, 
  HiOutlineAcademicCap 
} from 'react-icons/hi2';

const FacultyPage = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ 
    name: '', email: '', phone: '', employeeId: '', designation: '', 
    qualification: '', joiningDate: new Date().toISOString().split('T')[0], departmentId: '' 
  });

  const fetchFaculties = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (search) params.search = search;
      const res = await facultyService.getAll(params);
      setFaculties(res.data.data);
      setPagination(res.data.pagination);
    } catch { toast.error('Failed to load faculty members'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchFaculties(); }, [fetchFaculties]);

  const openAdd = () => {
    setForm({ name: '', email: '', phone: '', employeeId: '', designation: '', qualification: '', joiningDate: new Date().toISOString().split('T')[0], departmentId: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await facultyService.create(form);
      toast.success('Faculty added!');
      setShowModal(false);
      fetchFaculties();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    try {
      await facultyService.delete(deleteTarget.id);
      toast.success('Faculty deleted');
      setDeleteTarget(null);
      fetchFaculties();
    } catch { toast.error('Delete failed'); }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-white/10 bg-surface-container-low focus:bg-surface-container-high focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10 transition-all outline-none text-[14px] text-on-surface placeholder-on-surface-variant/50";

  return (
    <div className="space-y-[32px] animate-fadeIn pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-[32px] text-on-surface font-extrabold tracking-tight">Faculty Management</h1>
          <p className="font-body-md text-[16px] text-on-surface-variant mt-1">Manage faculty records, designations, and assignments.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={openAdd} className="flex-1 md:flex-none items-center justify-center gap-2 px-6 py-3 bg-secondary text-on-secondary font-label-md rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-secondary/20 flex font-bold">
            <HiOutlinePlus className="w-5 h-5" /> Add Faculty
          </button>
        </div>
      </div>

      {/* Main Glass Card */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col">
        <div className="p-[24px] border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between bg-surface-container-lowest/50">
          <div className="relative w-full md:max-w-md group">
            <div className="relative w-full flex items-center">
              <HiOutlineMagnifyingGlass className="absolute left-4 w-5 h-5 text-on-surface-variant pointer-events-none group-focus-within:text-secondary transition-colors" />
              <input 
                placeholder="Search by name, email, or employee ID..." 
                value={search} 
                onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
                className="w-full py-3 pr-4 pl-12 rounded-full border border-white/10 bg-surface-container-low text-[14px] text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10 transition-all" 
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto relative custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-surface-container-highest/30 border-b border-white/5 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                {['Faculty Member', 'Employee ID', 'Department', 'Designation', 'Qualification', 'Joining Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="py-4 px-6 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-20 text-center text-on-surface-variant font-medium">Loading faculty...</td>
                </tr>
              ) : faculties.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                      <HiOutlineUserGroup className="w-8 h-8 text-on-surface-variant" />
                    </div>
                    <p className="text-on-surface font-headline-md text-[18px]">No faculty found</p>
                    <p className="text-on-surface-variant text-[14px] mt-1">Try adjusting your search query.</p>
                  </td>
                </tr>
              ) : faculties.map((f) => (
                <tr key={f.id} className="border-b border-transparent hover:bg-white/5 transition-colors duration-200 group">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-secondary/10 text-secondary border border-secondary/20">
                        {f.user?.name?.charAt(0) || 'F'}
                      </div>
                      <div>
                        <p className="font-label-md text-[14px] text-on-surface font-semibold">{f.user?.name || 'Unknown'}</p>
                        <p className="text-[12px] text-on-surface-variant mt-0.5">{f.user?.email || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="bg-tertiary/10 text-tertiary border border-tertiary/20 px-2.5 py-1 rounded-md font-mono-sm font-semibold tracking-wider">{f.employeeId}</span>
                  </td>
                  <td className="py-4 px-6 font-label-md text-[14px] text-on-surface-variant whitespace-nowrap">{f.user?.department?.name || f.user?.departmentId || '—'}</td>
                  <td className="py-4 px-6 font-label-md text-[14px] text-on-surface-variant whitespace-nowrap">{f.designation}</td>
                  <td className="py-4 px-6 font-label-md text-[14px] text-on-surface-variant whitespace-nowrap">{f.qualification}</td>
                  <td className="py-4 px-6 font-label-md text-[14px] text-on-surface-variant whitespace-nowrap">{new Date(f.joiningDate).toLocaleDateString()}</td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest flex items-center gap-1.5 w-max uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> Active
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setDeleteTarget(f)} className="p-2 rounded-lg bg-surface-container-high border border-white/10 text-on-surface-variant hover:text-error hover:border-error/50 hover:bg-error/10 transition-all" title="Delete">
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
        <div className="p-[24px] border-t border-white/5 bg-surface-container-lowest/50 flex justify-between items-center transition-colors">
          <span className="font-label-sm text-[12px] text-on-surface-variant uppercase tracking-wider">
            Page <span className="font-bold text-on-surface">{page}</span> of <span className="font-bold text-on-surface">{pagination.totalPages}</span>
          </span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className={`p-2.5 rounded-xl border transition-all ${page <= 1 ? 'bg-surface-container border-transparent text-on-surface-variant/30 cursor-not-allowed' : 'bg-surface-container-high border-white/10 text-on-surface hover:bg-white/5'}`}>
              <HiOutlineChevronLeft className="w-5 h-5" />
            </button>
            <button disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)} className={`p-2.5 rounded-xl border transition-all ${page >= pagination.totalPages ? 'bg-surface-container border-transparent text-on-surface-variant/30 cursor-not-allowed' : 'bg-surface-container-high border-white/10 text-on-surface hover:bg-white/5'}`}>
              <HiOutlineChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={() => setShowModal(false)}>
          <div className="bg-surface-container-high rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-surface-container-high/90 backdrop-blur-xl px-8 py-6 border-b border-white/5 flex justify-between items-center z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center border border-secondary/20">
                  <HiOutlineAcademicCap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-headline-md text-[20px] font-bold text-on-surface">Add New Faculty</h2>
                  <p className="font-label-sm text-[12px] text-on-surface-variant mt-1">Enter faculty details below.</p>
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
                  { label: 'Email *', key: 'email', type: 'email' },
                  { label: 'Phone', key: 'phone', type: 'text' },
                  { label: 'Employee ID *', key: 'employeeId', type: 'text' },
                  { label: 'Department ID', key: 'departmentId', type: 'number' },
                  { label: 'Designation *', key: 'designation', type: 'text' },
                  { label: 'Qualification *', key: 'qualification', type: 'text' },
                  { label: 'Joining Date *', key: 'joiningDate', type: 'date', span: 2 },
                ].map(({ label, key, type, span }) => (
                  <div key={key} className={span === 2 ? 'md:col-span-2' : ''}>
                    <label className="block font-label-sm text-[12px] font-bold text-on-surface mb-2 uppercase tracking-wider">{label}</label>
                    {key === 'departmentId' ? (
                      <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className={inputClass}>
                        <option value="">Select Department</option>
                        <option value="1">Computer Science (CSE)</option>
                        <option value="2">Electronics & Comm (ECE)</option>
                        <option value="3">Mechanical (ME)</option>
                      </select>
                    ) : (
                      <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className={inputClass} placeholder={`Enter ${label.replace(' *', '').toLowerCase()}`} required={label.includes('*')} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-10 justify-end pt-6 border-t border-white/5">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl border border-white/10 text-on-surface font-label-md font-bold hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-3 rounded-xl bg-secondary text-on-secondary font-label-md font-bold hover:scale-[1.02] shadow-lg shadow-secondary/20 transition-all">Add Faculty</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={() => setDeleteTarget(null)}>
          <div className="bg-surface-container-high rounded-2xl w-full max-w-md p-8 text-center shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
            <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-error/20">
              <HiOutlineTrash className="w-10 h-10 text-error" />
            </div>
            <h3 className="font-headline-md text-[24px] font-bold text-on-surface mb-2">Delete Faculty Member?</h3>
            <p className="font-body-md text-[14px] text-on-surface-variant mb-8 leading-relaxed">Are you sure you want to delete <strong className="text-on-surface">{deleteTarget.user?.name}</strong>? This action cannot be undone.</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => setDeleteTarget(null)} className="px-6 py-3 rounded-xl border border-white/10 text-on-surface font-label-md font-bold hover:bg-white/5 transition-colors w-full">Cancel</button>
              <button onClick={handleDelete} className="px-6 py-3 rounded-xl bg-error text-on-error font-label-md font-bold hover:scale-[1.02] shadow-lg shadow-error/20 transition-all w-full">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyPage;
