import api from './api';

export const documentService = {
  getDocuments: (filters = {}) => {
    return api.get('/documents', { params: filters });
  },

  uploadDocument: (formData, onUploadProgress) => {
    return api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    });
  },

  deleteDocument: (id) => {
    return api.delete(`/documents/${id}`);
  }
};
