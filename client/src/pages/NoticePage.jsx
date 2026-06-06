import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { noticeService } from '../services/noticeService';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineBellAlert, HiOutlineDocumentText } from 'react-icons/hi2';

const NoticePage = () => {
  const { isAdmin, isFaculty } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', priority: 'MEDIUM', targetRole: '' });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = () => {
    noticeService.getAll().then(res => {
      setNotices(res.data.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await noticeService.create({
        ...formData,
        targetRole: formData.targetRole || null
      });
      setIsModalOpen(false);
      setFormData({ title: '', content: '', priority: 'MEDIUM', targetRole: '' });
      toast.success('Notice posted successfully!');
      fetchNotices();
    } catch (err) {
      toast.error('Failed to post notice: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await noticeService.delete(id);
        toast.success('Notice deleted');
        fetchNotices();
      } catch (err) {
        toast.error('Failed to delete: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const inputClass = "w-full px-4 py-3 bg-surface-container-low border border-white/10 rounded-xl focus:ring-2 focus:ring-secondary/10 focus:border-secondary/50 text-on-surface text-[14px] outline-none transition-all placeholder-on-surface-variant/50";

  return (
    <div className="animate-fadeIn max-w-[1000px] mx-auto space-y-[32px] pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-[32px] text-on-surface font-extrabold tracking-tight">Notice Board</h1>
          <p className="font-body-md text-[16px] text-on-surface-variant mt-1">Campus announcements and updates.</p>
        </div>
        {(isAdmin || isFaculty) && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-secondary text-on-secondary font-label-md font-bold rounded-xl hover:scale-[1.02] shadow-lg shadow-secondary/20 transition-all w-full md:w-auto justify-center"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Post Notice
          </button>
        )}
      </div>

      <div className="space-y-[24px]">
        {loading ? (
          <div className="text-center py-10 font-medium text-on-surface-variant">Loading notices...</div>
        ) : notices.length === 0 ? (
          <div className="glass-card p-[48px] rounded-2xl border border-white/10 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
              <HiOutlineDocumentText className="w-8 h-8 text-on-surface-variant" />
            </div>
            <h3 className="font-headline-md text-[20px] font-bold text-on-surface">No notices available</h3>
            <p className="font-body-md text-[14px] text-on-surface-variant mt-2">Check back later for updates.</p>
          </div>
        ) : notices.map(notice => (
          <div key={notice.id} className="glass-card p-[24px] rounded-2xl border border-white/10 hover:border-white/20 transition-all hover:bg-white/5 group">
            <div className="flex justify-between items-start mb-[16px]">
              <div className="flex items-center gap-[16px]">
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl border ${notice.priority === 'HIGH' ? 'bg-error/10 text-error border-error/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                  <HiOutlineBellAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-headline-md text-[20px] font-bold text-on-surface leading-tight">{notice.title}</h3>
                  <div className="flex items-center gap-2 mt-1.5 font-label-sm text-[12px] text-on-surface-variant uppercase tracking-wider">
                    <span>{notice.postedBy?.name}</span>
                    <span className="text-white/20">•</span>
                    <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                    {notice.targetRole && (
                      <>
                        <span className="text-white/20">•</span>
                        <span className="text-secondary font-bold">Target: {notice.targetRole}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {(isAdmin || isFaculty) && (
                <button onClick={() => handleDelete(notice.id)} className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-error/20">
                  <HiOutlineTrash className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="pl-[64px]">
              <p className="font-body-md text-[15px] text-on-surface-variant whitespace-pre-wrap leading-relaxed">{notice.content}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card rounded-2xl w-full max-w-lg shadow-2xl border border-white/10 flex flex-col">
            <div className="p-[24px] border-b border-white/5 bg-surface-container-high">
              <h2 className="font-headline-md text-[20px] font-bold text-on-surface">Post New Notice</h2>
              <p className="font-label-sm text-[12px] text-on-surface-variant mt-1 uppercase tracking-wider">Create a campus announcement</p>
            </div>
            <form onSubmit={handleSubmit} className="p-[24px] space-y-[20px] bg-surface-container-low">
              <div>
                <label className="block font-label-sm text-[12px] font-bold text-on-surface mb-2 uppercase tracking-wider">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} placeholder="Notice Title" />
              </div>
              <div>
                <label className="block font-label-sm text-[12px] font-bold text-on-surface mb-2 uppercase tracking-wider">Content</label>
                <textarea required rows={5} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className={`${inputClass} resize-none`} placeholder="Write your announcement here..." />
              </div>
              <div className="grid grid-cols-2 gap-[20px]">
                <div>
                  <label className="block font-label-sm text-[12px] font-bold text-on-surface mb-2 uppercase tracking-wider">Priority</label>
                  <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className={inputClass}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-sm text-[12px] font-bold text-on-surface mb-2 uppercase tracking-wider">Target Audience</label>
                  <select value={formData.targetRole} onChange={e => setFormData({...formData, targetRole: e.target.value})} className={inputClass}>
                    <option value="">All Users</option>
                    <option value="STUDENT">Students Only</option>
                    <option value="FACULTY">Faculty Only</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 justify-end pt-4 border-t border-white/5 mt-[24px]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-white/10 text-on-surface font-label-md font-bold hover:bg-white/5 rounded-xl transition-all">Cancel</button>
                <button type="submit" className="px-6 py-3 bg-secondary text-on-secondary font-label-md font-bold rounded-xl hover:scale-[1.02] shadow-lg shadow-secondary/20 transition-all">Post Notice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticePage;
