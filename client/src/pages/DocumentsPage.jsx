import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { documentService } from '../services/documentService';
import toast from 'react-hot-toast';
import { 
  HiOutlineDocumentText, 
  HiOutlineCloudUpload, 
  HiOutlineTrash, 
  HiOutlineDownload,
  HiOutlineEye,
  HiOutlineDocument,
  HiOutlinePhotograph,
  HiOutlineFolder
} from 'react-icons/hi';

const DocumentsPage = () => {
  const { user, isAdmin, isFaculty } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Form State
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);

  const fetchDocuments = async () => {
    try {
      const res = await documentService.getDocuments();
      setDocuments(res.data.data);
    } catch (error) {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // File Validation (Max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      e.target.value = '';
      return;
    }

    setFile(selectedFile);
    if (!title) setTitle(selectedFile.name.split('.')[0]); // Auto-fill title
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      toast.error('Please provide a title and select a file');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    setUploading(true);
    setUploadProgress(0);

    try {
      // Axios request with upload progress
      await documentService.uploadDocument(formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });

      toast.success('Document uploaded successfully');
      setTitle('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchDocuments();
    } catch (error) {
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await documentService.deleteDocument(id);
      toast.success('Document deleted');
      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return <HiOutlinePhotograph className="w-8 h-8 text-primary" />;
    if (fileType.includes('pdf')) return <HiOutlineDocumentText className="w-8 h-8 text-error" />;
    return <HiOutlineDocument className="w-8 h-8 text-on-surface-variant" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-[32px] animate-fadeIn max-w-[1280px] mx-auto pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-[32px] text-on-surface font-extrabold tracking-tight">Document Center</h1>
          <p className="font-body-md text-[16px] text-on-surface-variant mt-1">Manage assignments, receipts, and study materials.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
        
        {/* Upload Panel */}
        <div className="lg:col-span-1 space-y-[24px]">
          <div className="glass-card p-[24px] rounded-2xl border border-white/10">
            <h2 className="font-headline-md text-[20px] font-bold text-on-surface mb-[24px] flex items-center gap-2">
              <HiOutlineCloudUpload className="w-6 h-6 text-primary" />
              Upload Document
            </h2>
            
            <form onSubmit={handleUpload} className="space-y-[20px]">
              <div>
                <label className="block font-label-sm text-[12px] font-bold text-on-surface mb-2 uppercase tracking-wider">Document Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary/50 text-on-surface text-[14px] outline-none transition-all placeholder-on-surface-variant/50"
                  placeholder="e.g. Sem 3 Fee Receipt"
                />
              </div>

              <div>
                <label className="block font-label-sm text-[12px] font-bold text-on-surface mb-2 uppercase tracking-wider">Select File</label>
                <div className="relative border-2 border-dashed border-white/20 rounded-xl p-[24px] text-center hover:bg-white/5 transition-colors group cursor-pointer">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  {file ? (
                    <div className="flex flex-col items-center">
                      <HiOutlineDocumentText className="w-8 h-8 text-primary mb-2" />
                      <p className="font-label-md text-[14px] font-bold text-on-surface truncate w-full px-4">{file.name}</p>
                      <p className="font-mono-sm text-[12px] text-on-surface-variant mt-1">{formatFileSize(file.size)}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <HiOutlineFolder className="w-6 h-6 text-on-surface-variant group-hover:text-primary transition-colors" />
                      </div>
                      <p className="font-label-md text-[14px] font-bold text-on-surface">Click to browse or drag file</p>
                      <p className="font-label-sm text-[12px] text-on-surface-variant mt-1">PDF, DOC, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {uploading && (
                <div className="w-full bg-surface-container rounded-full h-2 mt-4 overflow-hidden border border-white/5">
                  <div className="bg-primary h-2 rounded-full transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={uploading || !file || !title}
                className="w-full py-3 bg-primary text-on-primary font-label-md font-bold hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 rounded-xl transition-all shadow-lg shadow-primary/20 mt-4"
              >
                {uploading ? `Uploading (${uploadProgress}%)...` : 'Upload File'}
              </button>
            </form>
          </div>
        </div>

        {/* Documents List */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="p-[24px] border-b border-white/5 bg-surface-container-lowest/50 flex justify-between items-center">
              <h2 className="font-headline-md text-[20px] font-bold text-on-surface">My Files</h2>
              <span className="font-label-sm text-[10px] font-bold bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-full uppercase tracking-widest">
                {documents.length} Files
              </span>
            </div>

            {loading ? (
              <div className="p-[48px] text-center font-medium text-on-surface-variant flex-1 flex items-center justify-center">Loading documents...</div>
            ) : documents.length === 0 ? (
              <div className="p-[48px] text-center flex-1 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                  <HiOutlineDocument className="w-8 h-8 text-on-surface-variant" />
                </div>
                <h3 className="font-headline-md text-[20px] font-bold text-on-surface">No documents yet</h3>
                <p className="font-body-md text-[14px] text-on-surface-variant mt-2">Upload your first file to get started.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5 overflow-y-auto custom-scrollbar flex-1 max-h-[600px]">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-[20px] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center flex-shrink-0 border border-white/5">
                        {getFileIcon(doc.fileType)}
                      </div>
                      <div>
                        <h4 className="font-label-md text-[14px] font-bold text-on-surface group-hover:text-primary transition-colors">
                          {doc.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1 font-label-sm text-[11px] text-on-surface-variant tracking-wider uppercase">
                          <span>{formatFileSize(doc.size)}</span>
                          <span className="text-white/20">•</span>
                          <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                          <span className="text-white/20">•</span>
                          <span>{doc.uploader?.name}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity self-end sm:self-auto">
                      {doc.fileType.includes('image') && (
                        <button 
                          onClick={() => setPreviewUrl(`http://localhost:5005${doc.fileUrl}`)}
                          className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 rounded-lg transition-all"
                          title="Preview"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </button>
                      )}
                      <a 
                        href={`http://localhost:5005${doc.fileUrl}`} 
                        download={doc.filename}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-on-surface-variant hover:text-secondary hover:bg-secondary/10 border border-transparent hover:border-secondary/20 rounded-lg transition-all"
                        title="Download"
                      >
                        <HiOutlineDownload className="w-5 h-5" />
                      </a>
                      {(isAdmin || user.id === doc.uploadedById) && (
                        <button 
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 border border-transparent hover:border-error/20 rounded-lg transition-all"
                          title="Delete"
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md animate-fadeIn" onClick={() => setPreviewUrl(null)}>
          <div className="relative max-w-4xl max-h-screen">
            <button 
              className="absolute -top-12 right-0 text-on-surface-variant hover:text-on-surface font-label-md text-[14px] font-bold bg-surface-container px-4 py-2 rounded-lg border border-white/10 transition-colors"
              onClick={() => setPreviewUrl(null)}
            >
              Close Preview
            </button>
            <img src={previewUrl} alt="Preview" className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain border border-white/10" />
          </div>
        </div>
      )}

    </div>
  );
};

export default DocumentsPage;
