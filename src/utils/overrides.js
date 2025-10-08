const STORAGE_KEY = 'noteOverrides';

function readOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

function writeOverrides(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getNoteOverride(noteId) {
  const map = readOverrides();
  return map[noteId] || null;
}

export function upsertNoteOverride(noteId, partial) {
  const map = readOverrides();
  const prev = map[noteId] || {};
  map[noteId] = { ...prev, ...partial };
  writeOverrides(map);
}

export function removeNoteOverride(noteId) {
  const map = readOverrides();
  if (map[noteId]) {
    delete map[noteId];
    writeOverrides(map);
  }
}


