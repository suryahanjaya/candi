import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getAllNotes,
  getActiveNotes,
  getArchivedNotes,
  addNote as addNoteUtil,
  deleteNote as deleteNoteUtil,
  archiveNote as archiveNoteUtil,
  unarchiveNote as unarchiveNoteUtil,
  editNote as editNoteUtil,
  getNote as getNoteUtil,
  updateNoteDate as updateNoteDateUtil,
} from '../utils/local-data';

const NotesContext = createContext();

export const useNotes = () => useContext(NotesContext);

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState(getAllNotes());

  const refreshNotes = () => {
    setNotes(getAllNotes());
  };

  const addNote = (note) => {
    addNoteUtil(note);
    refreshNotes();
  };

  const deleteNote = (id) => {
    deleteNoteUtil(id);
    refreshNotes();
  };

  const archiveNote = (id) => {
    archiveNoteUtil(id);
    refreshNotes();
  };

  const unarchiveNote = (id) => {
    unarchiveNoteUtil(id);
    refreshNotes();
  };

  const editNote = (note) => {
    editNoteUtil(note);
    refreshNotes();
  };

  const updateNoteDate = (id) => {
    console.log('Context updateNoteDate called with id:', id);
    updateNoteDateUtil(id);
    refreshNotes();
    console.log('Notes refreshed after date update');
  };

  const getNote = (id) => {
    return getNoteUtil(id);
  };

  const getActive = () => {
    return getActiveNotes();
  };

  const getArchived = () => {
    return getArchivedNotes();
  };

  return (
    <NotesContext.Provider value={{
      notes,
      addNote,
      deleteNote,
      archiveNote,
      unarchiveNote,
      editNote,
      updateNoteDate,
      getNote,
      getActive,
      getArchived,
    }}>
      {children}
    </NotesContext.Provider>
  );
};
