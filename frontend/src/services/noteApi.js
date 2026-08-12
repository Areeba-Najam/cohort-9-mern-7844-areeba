import api from './api';

export const fetchNotes = () => api.get('/notes').then((res) => res.data.data.notes);
export const fetchNote = (id) => api.get(`/notes/${id}`).then((res) => res.data.data.note);
export const createNote = (payload) => api.post('/notes', payload).then((res) => res.data.data.note);
export const updateNote = (id, payload) => api.patch(`/notes/${id}`, payload).then((res) => res.data.data.note);
export const deleteNote = (id) => api.delete(`/notes/${id}`);