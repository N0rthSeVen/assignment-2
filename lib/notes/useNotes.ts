"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Note = {
  id: string;
  title: string;
  text: string;
  createdAt: string;
};

const NOTES_STORAGE_KEY = "notes";
const EMPTY_NOTES: Note[] = [];
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedNotes: Note[] = EMPTY_NOTES;

function isNote(value: unknown): value is Note {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const note = value as Record<string, unknown>;
  return (
    typeof note.id === "string" &&
    typeof note.title === "string" &&
    typeof note.text === "string" &&
    typeof note.createdAt === "string"
  );
}

function parseNotes(raw: string | null): Note[] {
  if (raw === null) {
    return EMPTY_NOTES;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isNote)) {
      return EMPTY_NOTES;
    }
    return parsed;
  } catch {
    return EMPTY_NOTES;
  }
}

function getSnapshot(): Note[] {
  const raw = window.localStorage.getItem(NOTES_STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedNotes = parseNotes(raw);
  }
  return cachedNotes;
}

function getServerSnapshot(): Note[] {
  return EMPTY_NOTES;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export function useNotes() {
  const notes = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addNote = useCallback((title: string, text: string) => {
    const note: Note = {
      id: crypto.randomUUID(),
      title,
      text,
      createdAt: new Date().toISOString(),
    };

    const next = [note, ...getSnapshot()];
    try {
      window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(next));
    } catch {
      return;
    }
    emitChange();
  }, []);

  const removeNote = useCallback((id: string) => {
    const next = getSnapshot().filter((note) => note.id !== id);
    try {
      window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(next));
    } catch {
      return;
    }
    emitChange();
  }, []);

  return { notes, addNote, removeNote };
}
