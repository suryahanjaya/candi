import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotesProvider } from './context/NotesContext';
import NotesList from './pages/NotesList';
import ArchivedNotes from './pages/ArchivedNotes';
import NoteDetail from './pages/NoteDetail';
import AddNote from './pages/AddNote';
import NotFound from './pages/NotFound';
import BottomNav from './components/BottomNav';
import FloatingActionButton from './components/FloatingActionButton';

function App() {
  return (
    <NotesProvider>
      <Router>
        <div className="app-container">
          <header>
            <h1>Notes</h1>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<NotesList />} />
              <Route path="/notes" element={<NotesList />} />
              <Route path="/notes/:id" element={<NoteDetail />} />
              <Route path="/notes/new" element={<AddNote />} />
              <Route path="/archives" element={<ArchivedNotes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <BottomNav />
          <FloatingActionButton />
        </div>
      </Router>
    </NotesProvider>
  );
}

export default App;
