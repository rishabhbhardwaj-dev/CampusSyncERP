import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { academicService } from '../services/academicService';
import { feesService } from '../services/feesService';
import { 
  HiOutlineBanknotes, 
  HiOutlineCheckCircle, 
  HiOutlineClock, 
  HiOutlineDocumentText,
  HiOutlineArrowDownTray,
  HiOutlinePlus
} from 'react-icons/hi2';

const StatCard = ({ icon: Icon, label, value, colorClass, borderClass }) => (
  <div className={`glass-card p-[24px] rounded-2xl flex flex-col items-start gap-4 hover:scale-[1.02] transition-transform duration-300 ${borderClass}`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</p>
      <p className="font-display text-[28px] font-bold text-on-surface mt-1 tracking-tight tabular-nums">{value}</p>
    </div>
  </div>
);

const FeesPage = () => {
  const { user, isStudent, isAdmin } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  
  const [studentFees, setStudentFees] = useState([]); // for students
  const [allStudents, setAllStudents] = useState([]); // for admin
  
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  // Admin New Fee Form
  const [feeType, setFeeType] = useState('TUITION');
  const [feeAmount, setFeeAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isStudent) {
      setLoading(true);
      feesService.getMyFees(selectedSemester)
        .then(res => setStudentFees(res.data.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (isAdmin) {
      academicService.getCourses().then(res => setCourses(res.data.data)).catch(() => {});
    }
  }, [isStudent, selectedSemester, isAdmin]);

  const loadAdminData = async () => {
    if (!selectedCourse || !selectedSemester) {
      toast.error('Please select Course and Semester');
      return;
    }
    setLoading(true);
    setHasFetched(false);
    try {
      const res = await feesService.getFees(selectedCourse, selectedSemester);
      setAllStudents(res.data.data);
      setHasFetched(true);
      if (res.data.data.length === 0) {
        toast.error('No students found for this Course and Semester');
      } else {
        toast.success(`Loaded ${res.data.data.length} students`);
      }
    } catch (err) {
      toast.error('Failed to load fee data');
    } finally {
      setLoading(false);
    }
  };

  const assignFeeToAll = async () => {
    if (!feeType || !feeAmount || !dueDate) {
      toast.error('Please fill all fee details');
      return;
    }
    if (allStudents.length === 0) {
      toast.error('No students loaded to assign fees to');
      return;
    }
    
    setCreating(true);
    try {
      for (const st of allStudents) {
        await feesService.createFee({
          studentId: st.id,
          feeType,
          amount: feeAmount,
          dueDate
        });
      }
      toast.success('Fees assigned to all students!');
      loadAdminData();
    } catch (err) {
      toast.error('Failed to assign fees');
    } finally {
      setCreating(false);
    }
  };

  const handlePayFee = async (feeId, amount) => {
    try {
      await feesService.payFee(feeId, amount);
      toast.success('Payment successful!');
      const res = await feesService.getMyFees(selectedSemester);
      setStudentFees(res.data.data);
    } catch (err) {
      toast.error('Payment failed');
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-white/10 bg-surface-container-low focus:bg-surface-container-high focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-[14px] font-medium text-on-surface placeholder-on-surface-variant/50";

  // Calculate simple stats
  const totalDues = isStudent 
    ? studentFees.filter(f => f.status !== 'PAID').reduce((sum, f) => sum + (f.amount - f.paidAmount), 0)
    : allStudents.reduce((sum, s) => sum + s.fees.reduce((fs, f) => fs + (f.amount - f.paidAmount), 0), 0);
    
  const totalPaid = isStudent
    ? studentFees.reduce((sum, f) => sum + f.paidAmount, 0)
    : allStudents.reduce((sum, s) => sum + s.fees.reduce((fs, f) => fs + f.paidAmount, 0), 0);

  return (
    <div className="animate-fadeIn max-w-[1280px] mx-auto space-y-[32px] pb-8 print:max-w-full print:m-0 print:p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-[32px] text-on-surface font-extrabold tracking-tight">
            {isStudent ? 'My Fees & Payments' : 'Financial Dashboard'}
          </h1>
          <p className="font-body-md text-[16px] text-on-surface-variant mt-1 print:hidden">
            {isStudent ? 'View and pay your pending academic dues securely.' : 'Manage student fee records, track payments, and assign dues.'}
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          {isStudent && (
            <button 
              onClick={() => window.print()}
              className="print:hidden flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-surface-container-high border border-white/10 text-on-surface font-label-md rounded-xl hover:bg-white/5 transition-all shadow-sm"
            >
              <HiOutlineArrowDownTray className="w-5 h-5" /> Download Invoice
            </button>
          )}
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[24px] print:hidden">
        <StatCard 
          icon={HiOutlineBanknotes} 
          label={isStudent ? "Total Paid" : "Total Collection"} 
          value={`₹${totalPaid.toLocaleString()}`} 
          colorClass="text-primary"
          borderClass="border-b-primary"
        />
        <StatCard 
          icon={HiOutlineClock} 
          label={isStudent ? "Pending Dues" : "Outstanding Dues"} 
          value={`₹${totalDues.toLocaleString()}`} 
          colorClass="text-error"
          borderClass="border-b-error"
        />
        <StatCard 
          icon={HiOutlineDocumentText} 
          label={isStudent ? "Total Invoices" : "Students Tracked"} 
          value={isStudent ? studentFees.length : allStudents.length} 
          colorClass="text-secondary"
          borderClass="border-b-secondary"
        />
      </div>

      {isStudent ? (
        <>
          <div className="print:hidden glass-card p-[24px] rounded-2xl flex flex-col sm:flex-row items-center gap-4 border border-white/10">
            <label className="font-label-sm text-[12px] font-bold text-on-surface uppercase tracking-wider whitespace-nowrap">Filter by Semester:</label>
            <select className={inputClass + " sm:w-64"} value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)}>
              <option value="">All Semesters</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col">
            <div className="overflow-x-auto relative custom-scrollbar flex-1 max-h-[600px]">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-surface-container-highest/30 border-b border-white/5 sticky top-0 z-10 backdrop-blur-md">
                  <tr>
                    <th className="py-4 px-6 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Fee Type</th>
                    <th className="py-4 px-6 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Amount</th>
                    <th className="py-4 px-6 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Due Date</th>
                    <th className="py-4 px-6 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Status</th>
                    <th className="py-4 px-6 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap text-right print:hidden">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr><td colSpan={5} className="py-12 text-center text-on-surface-variant font-medium">Loading records...</td></tr>
                  ) : studentFees.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                          <HiOutlineDocumentText className="w-8 h-8 text-on-surface-variant" />
                        </div>
                        <p className="font-headline-md text-[18px] text-on-surface font-bold">No fee records found</p>
                      </td>
                    </tr>
                  ) : studentFees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-white/5 transition-colors duration-200">
                      <td className="py-4 px-6 font-label-md text-[14px] font-bold text-on-surface">{fee.feeType}</td>
                      <td className="py-4 px-6 font-mono-sm text-[14px] text-on-surface">₹{fee.amount.toLocaleString()}</td>
                      <td className="py-4 px-6 font-label-md text-[14px] text-on-surface-variant">{new Date(fee.dueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                      <td className="py-4 px-6">
                        {fee.status === 'PAID' && <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Paid</span>}
                        {fee.status === 'UNPAID' && <span className="bg-error/10 text-error border border-error/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Unpaid</span>}
                        {fee.status === 'PARTIAL' && <span className="bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Partial</span>}
                      </td>
                      <td className="py-4 px-6 text-right print:hidden">
                        {fee.status !== 'PAID' ? (
                          <button 
                            onClick={() => handlePayFee(fee.id, fee.amount - fee.paidAmount)}
                            className="px-6 py-2 bg-primary text-on-primary text-[12px] font-bold tracking-wider uppercase rounded-lg hover:scale-[1.02] shadow-sm shadow-primary/20 transition-all"
                          >
                            Pay Now
                          </button>
                        ) : (
                          <div className="flex items-center justify-end text-primary">
                            <HiOutlineCheckCircle className="w-6 h-6" />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="hidden print:block mt-12 text-center font-label-sm text-[12px] text-on-surface-variant">
            <p className="font-bold text-on-surface uppercase tracking-wider">Official Fee Receipt Generated by CampusSync ERP</p>
            <p>Date: {new Date().toLocaleDateString()}</p>
          </div>
        </>
      ) : (
        <>
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
                onClick={loadAdminData}
                className="w-full px-6 py-3 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:scale-[1.02] shadow-lg shadow-primary/20 transition-all h-[46px] flex items-center justify-center"
              >
                Fetch Records
              </button>
            </div>
          </div>

          {hasFetched && allStudents.length === 0 && (
            <div className="glass-card p-[48px] rounded-2xl border border-white/10 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                 <HiOutlineDocumentText className="w-8 h-8 text-on-surface-variant" />
              </div>
              <h3 className="font-headline-md text-[20px] font-bold text-on-surface">No Students Found</h3>
              <p className="font-body-md text-[14px] text-on-surface-variant mt-2">There are no students enrolled matching your criteria.</p>
            </div>
          )}

          {allStudents.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
              
              {/* Roster Table */}
              <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col">
                <div className="px-[24px] py-[20px] border-b border-white/5 flex justify-between items-center bg-surface-container-lowest/50">
                  <h2 className="font-headline-md text-[18px] font-bold text-on-surface">Student Roster</h2>
                  <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">{allStudents.length} Students</span>
                </div>
                <div className="overflow-y-auto relative custom-scrollbar flex-1 max-h-[500px]">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead className="bg-surface-container-highest/30 border-b border-white/5 sticky top-0 z-10 backdrop-blur-md">
                      <tr>
                        <th className="py-4 px-6 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Student Info</th>
                        <th className="py-4 px-6 font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap text-right">Pending Dues</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {allStudents.map(student => {
                        const totalPending = student.fees.reduce((sum, fee) => sum + (fee.amount - fee.paidAmount), 0);
                        return (
                          <tr key={student.id} className="hover:bg-white/5 transition-colors duration-200">
                            <td className="py-4 px-6">
                              <p className="font-label-md text-[14px] font-bold text-on-surface">{student.user.name}</p>
                              <p className="font-mono-sm text-[12px] text-on-surface-variant mt-0.5">{student.enrollmentNo}</p>
                            </td>
                            <td className="py-4 px-6 text-right">
                              {totalPending > 0 ? (
                                <span className="font-mono-sm text-[14px] font-bold text-error">₹{totalPending.toLocaleString()}</span>
                              ) : (
                                <span className="font-label-sm text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded uppercase tracking-widest border border-primary/20">Clear</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Assign Panel */}
              <div className="glass-card p-[24px] rounded-2xl border border-white/10 h-fit sticky top-24">
                <div className="flex items-center gap-4 mb-[24px]">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <HiOutlinePlus className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-headline-md text-[18px] font-bold text-on-surface">Assign New Fee</h2>
                    <p className="font-label-sm text-[12px] text-on-surface-variant mt-1">To current batch</p>
                  </div>
                </div>
                
                <div className="space-y-[20px]">
                  <div>
                    <label className="block font-label-sm text-[12px] font-bold text-on-surface mb-2 uppercase tracking-wider">Fee Type</label>
                    <select className={inputClass} value={feeType} onChange={e => setFeeType(e.target.value)}>
                      <option value="TUITION">Tuition Fee</option>
                      <option value="EXAM">Exam Fee</option>
                      <option value="HOSTEL">Hostel Fee</option>
                      <option value="LIBRARY">Library Fee</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-label-sm text-[12px] font-bold text-on-surface mb-2 uppercase tracking-wider">Amount (₹)</label>
                    <input type="number" className={inputClass} value={feeAmount} onChange={e => setFeeAmount(e.target.value)} placeholder="e.g. 50000" />
                  </div>
                  <div>
                    <label className="block font-label-sm text-[12px] font-bold text-on-surface mb-2 uppercase tracking-wider">Due Date</label>
                    <input type="date" className={inputClass} value={dueDate} onChange={e => setDueDate(e.target.value)} />
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <button 
                      onClick={assignFeeToAll}
                      disabled={creating}
                      className="w-full px-6 py-3 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:scale-[1.02] shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex justify-center items-center h-[46px]"
                    >
                      {creating ? 'Assigning...' : 'Assign to All Students'}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeesPage;
