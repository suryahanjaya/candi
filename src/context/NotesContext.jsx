import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  getActiveNotes as apiGetActiveNotes,
  getArchivedNotes as apiGetArchivedNotes,
  addNote as apiAddNote,
  deleteNote as apiDeleteNote,
  archiveNote as apiArchiveNote,
  unarchiveNote as apiUnarchiveNote,
  getNote as apiGetNote,
} from '../utils/network-data';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';

const NotesContext = createContext();

export const useNotes = () => useContext(NotesContext);

// Helper to normalize a note object
function normalizeNote(note = {}) {
  return {
    id: note.id || '',
    title: note.title || '',
    body: note.body || '',
    createdAt: note.createdAt || new Date().toISOString(),
    updatedAt: note.updatedAt || note.createdAt || new Date().toISOString(),
    archived: typeof note.archived === 'boolean' ? note.archived : false,
  };
}

export const NotesProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const [activeNotes, setActiveNotes] = useState([]);
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const notesKey = useMemo(() => (user?.email ? `notes:${user.email}` : 'notes:guest'), [user]);

  const loadNotes = async () => {
    if (!isAuthenticated) {
      setActiveNotes([]);
      setArchivedNotes([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      // First, try to load from localStorage for immediate display
      const savedNotes = localStorage.getItem(notesKey);
      if (savedNotes) {
        const notes = JSON.parse(savedNotes);
        const active = notes.filter(note => !note.archived);
        const archived = notes.filter(note => note.archived);
        setActiveNotes(active);
        setArchivedNotes(archived);
      }
      
      // Then try to sync with backend (but don't override newer localStorage data)
      try {
        // If this user just re-registered fresh, skip backend sync this session
        const freshFlag = user?.email ? localStorage.getItem(`freshUser:${user.email}`) : null;
        // If backend sync is blocked for this email, skip syncing entirely
        const blockFlag = user?.email ? localStorage.getItem(`blockBackendSync:${user.email}`) : null;
        if (freshFlag === '1' || blockFlag === '1') {
          return;
        }
        const [act, arc] = await Promise.all([
          apiGetActiveNotes(),
          apiGetArchivedNotes(),
        ]);
        
        // Only update if backend has newer data or if localStorage is empty
        const currentLocalNotes = localStorage.getItem(notesKey);
        if (currentLocalNotes) {
          const localNotes = JSON.parse(currentLocalNotes);
          const localNotesMap = new Map(localNotes.map(note => [note.id, note]));
          
          // Helper to decide if local note is newer than backend note
          const localIsNewer = (localNote, backendNote) => {
            const l = localNote?.updatedAt ? new Date(localNote.updatedAt) : null;
            const b = backendNote?.updatedAt ? new Date(backendNote.updatedAt) : null;
            if (l && !b) return true; // local has updatedAt, backend doesn't -> local wins
            if (!l && b) return false; // backend has updatedAt, local doesn't -> backend wins
            if (l && b) return l > b; // compare timestamps
            return false; // no updatedAt on both -> backend wins by default
          };

          // Merge backend data with localStorage data, prioritizing newer localStorage for edited notes
          if (!act.error && Array.isArray(act.data)) {
            const mergedActive = act.data.map(backendNote => {
              const localNote = localNotesMap.get(backendNote.id);
              let chosen = backendNote;
              if (localNote && localIsNewer(localNote, backendNote)) {
                chosen = localNote;
              }
              return normalizeNote(chosen);
            });
            setActiveNotes(mergedActive);
          }
          
          if (!arc.error && Array.isArray(arc.data)) {
            const mergedArchived = arc.data.map(backendNote => {
              const localNote = localNotesMap.get(backendNote.id);
              let chosen = backendNote;
              if (localNote && localIsNewer(localNote, backendNote)) {
                chosen = localNote;
              }
              return normalizeNote(chosen);
            });
            setArchivedNotes(mergedArchived);
          }

          // Persist merged view back to localStorage so refresh keeps local edits
          const finalActive = (!act.error && Array.isArray(act.data)) ? act.data.map(b => {
            const l = localNotesMap.get(b.id);
            return l && localIsNewer(l, b) ? l : b;
          }) : (activeNotes || []);
          const finalArchived = (!arc.error && Array.isArray(arc.data)) ? arc.data.map(b => {
            const l = localNotesMap.get(b.id);
            return l && localIsNewer(l, b) ? l : b;
          }) : (archivedNotes || []);
          localStorage.setItem(notesKey, JSON.stringify([...(finalActive || []), ...(finalArchived || [])]));
        } else {
          // If no localStorage data, use backend data
          if (!act.error && Array.isArray(act.data)) {
            setActiveNotes(act.data);
            const allNotes = [...act.data, ...(arc.data || [])];
            localStorage.setItem(notesKey, JSON.stringify(allNotes));
          }
          if (!arc.error && Array.isArray(arc.data)) {
            setArchivedNotes(arc.data);
            const allNotes = [...(act.data || []), ...arc.data];
            localStorage.setItem(notesKey, JSON.stringify(allNotes));
          }
        }
      } catch (backendError) {
        // If backend fails, keep using localStorage data
        console.log('Backend sync failed, using localStorage data');
      }
    } catch (e) {
      setError(t('failedLoadNotes'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [isAuthenticated, notesKey, user]);

  const addNote = async ({ title, body }) => {
    setLoading(true);
    try {
      const res = await apiAddNote({ title, body });
      if (!res.error && res.data) {
        // The add API may return only the newly created id (noteId)
        const createdId = res.data.id || res.data.noteId || res.data;

        // Try to fetch the full note from API; if it fails, fall back to a locally constructed note
        let fullNote = null;
        try {
          const fetched = await apiGetNote(createdId);
          if (!fetched.error && fetched.data) {
            fullNote = fetched.data;
          }
        } catch (_) {
          // ignore and use fallback
        }

        if (!fullNote) {
          fullNote = normalizeNote({
            id: createdId,
            title,
            body,
            archived: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
        else {
          fullNote = normalizeNote(fullNote);
        }

        setActiveNotes(prev => {
          const updated = [fullNote, ...prev];
          const allNotes = [...updated, ...archivedNotes];
          localStorage.setItem(notesKey, JSON.stringify(allNotes));
          return updated;
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    setLoading(true);
    try {
      const res = await apiDeleteNote(id);
      if (!res.error) {
        setActiveNotes(prev => {
          const updated = prev.filter(n => n.id !== id);
          // Save to localStorage
          const allNotes = [...updated, ...archivedNotes];
          localStorage.setItem(notesKey, JSON.stringify(allNotes));
          return updated;
        });
        setArchivedNotes(prev => {
          const updated = prev.filter(n => n.id !== id);
          // Save to localStorage
          const allNotes = [...activeNotes, ...updated];
          localStorage.setItem(notesKey, JSON.stringify(allNotes));
          return updated;
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const archiveNote = async (id) => {
    setLoading(true);
    try {
      const res = await apiArchiveNote(id);
      if (!res.error) {
        const note = activeNotes.find(n => n.id === id);
        if (note) {
          setActiveNotes(prev => {
            const updated = prev.filter(n => n.id !== id);
            // Save to localStorage
            const allNotes = [...updated, ...archivedNotes];
            localStorage.setItem(notesKey, JSON.stringify(allNotes));
            return updated;
          });
          setArchivedNotes(prev => {
            const updated = [{ ...note, archived: true }, ...prev];
            // Save to localStorage
            const allNotes = [...activeNotes, ...updated];
            localStorage.setItem(notesKey, JSON.stringify(allNotes));
            return updated;
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const unarchiveNote = async (id) => {
    setLoading(true);
    try {
      const res = await apiUnarchiveNote(id);
      if (!res.error) {
        const note = archivedNotes.find(n => n.id === id);
        if (note) {
          setArchivedNotes(prev => {
            const updated = prev.filter(n => n.id !== id);
            // Save to localStorage
            const allNotes = [...activeNotes, ...updated];
            localStorage.setItem(notesKey, JSON.stringify(allNotes));
            return updated;
          });
          setActiveNotes(prev => {
            const updated = [{ ...note, archived: false }, ...prev];
            // Save to localStorage
            const allNotes = [...updated, ...archivedNotes];
            localStorage.setItem(notesKey, JSON.stringify(allNotes));
            return updated;
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const getNote = async (id) => {
    console.log('Getting note with id:', id, 'type:', typeof id);
    console.log('Current activeNotes:', activeNotes.length);
    console.log('Current archivedNotes:', archivedNotes.length);
    
    // Convert id to string for comparison (URL params are strings)
    const idStr = String(id);
    const idNum = Number(id);
    
    // First try to get from localStorage (most reliable)
    const savedNotes = localStorage.getItem(notesKey);
    if (savedNotes) {
      const notes = JSON.parse(savedNotes);
      console.log('All notes in localStorage:', notes.map(n => ({ id: n.id, type: typeof n.id })));
      
      // Try both string and number comparison
      const note = notes.find(n => n.id === id || n.id === idStr || n.id === idNum);
      if (note) {
        console.log('Found note in localStorage:', note);
        return { success: true, data: normalizeNote(note) };
      }
    }
    
    // Then try to get from local state
    const allNotes = [...activeNotes, ...archivedNotes];
    console.log('All notes in state:', allNotes.map(n => ({ id: n.id, type: typeof n.id })));
    const localNote = allNotes.find(note => note.id === id || note.id === idStr || note.id === idNum);
    if (localNote) {
      console.log('Found note in state:', localNote);
      return { success: true, data: normalizeNote(localNote) };
    }
    
    console.log('Note not found in localStorage or state, trying API');
    // If not found locally, try API
    try {
      const result = await apiGetNote(id);
      console.log('API result:', result);
      // Normalize to { success, data }
      return { success: !result.error, data: normalizeNote(result.data), error: result.error };
    } catch (error) {
      console.error('API error:', error);
      return { success: false, error: error.message };
    }
  };

  const editNote = async (id, { title, body }) => {
    setLoading(true);
    try {
      console.log('Editing note:', id, 'with title:', title);
      const updatedNote = normalizeNote({ id, title, body, updatedAt: new Date().toISOString() });
      
      // Update both active and archived notes in one operation
      let updatedActiveNotes = [];
      let updatedArchivedNotes = [];
      
      // Update active notes
      setActiveNotes(prev => {
        updatedActiveNotes = prev.map(note => 
          note.id === id ? { ...note, ...updatedNote } : note
        );
        return updatedActiveNotes;
      });
      
      // Update archived notes
      setArchivedNotes(prev => {
        updatedArchivedNotes = prev.map(note => 
          note.id === id ? { ...note, ...updatedNote } : note
        );
        return updatedArchivedNotes;
      });
      
      // Save to localStorage once with all updated data
      const allNotes = [...updatedActiveNotes, ...updatedArchivedNotes];
      localStorage.setItem(notesKey, JSON.stringify(allNotes));
      console.log('Saved to localStorage:', allNotes.find(n => n.id === id));
      
      console.log('Edit note completed successfully');
      return { success: true };
    } catch (error) {
      console.error('Error editing note:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };


  const value = useMemo(() => ({
    loading,
    error,
    getActive: () => activeNotes,
    getArchived: () => archivedNotes,
    addNote,
    deleteNote,
    archiveNote,
    unarchiveNote,
    getNote,
    editNote,
  }), [loading, error, activeNotes, archivedNotes]);

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};
