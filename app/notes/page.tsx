"use client";

import { useState, type FormEvent } from "react";
import { useNotes } from "@/lib/notes/useNotes";
import {
  inputClasses,
  labelClasses,
} from "@/components/formStyles";

export default function NotesPage() {
  const { notes, addNote, removeNote } = useNotes();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedText = text.trim();
    if (!trimmedTitle || !trimmedText) {
      return;
    }
    addNote(trimmedTitle, trimmedText);
    setTitle("");
    setText("");
  }

  return (
    <div className="w-full px-6 py-16">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Notes
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Quick notes kept in your browser&rsquo;s local storage. They stay on
          this device and reload the next time you visit.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-5">
          <div>
            <label htmlFor="note-title" className={labelClasses}>
              Title
            </label>
            <input
              id="note-title"
              name="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="note-text" className={labelClasses}>
              Note
            </label>
            <textarea
              id="note-text"
              name="text"
              rows={4}
              value={text}
              onChange={(event) => setText(event.target.value)}
              className={inputClasses}
            />
          </div>

          <button
            type="submit"
            disabled={!title.trim() || !text.trim()}
            className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save Note
          </button>
        </form>

        <div className="mt-12 space-y-4">
          {notes.length === 0 && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              No notes yet. Save your first one above.
            </p>
          )}
          {notes.map((note) => (
            <article
              key={note.id}
              className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                {note.title}
              </h2>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {new Date(note.createdAt).toLocaleString()}
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                {note.text}
              </p>
              <button
                type="button"
                onClick={() => removeNote(note.id)}
                aria-label={`Delete note: ${note.title}`}
                className="mt-4 rounded-full border border-red-600 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-950"
              >
                Delete
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
