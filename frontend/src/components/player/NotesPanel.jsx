import React, { useState, useEffect } from 'react';
import { Bookmark, Plus, Edit2, Trash2, Check, X, Clock } from 'lucide-react';
import { getNotes, createNote, updateNote, deleteNote } from '../../services/noteService';

export default function NotesPanel({ courseId, lessonId, currentTime = 0, onSeek }) {
  const [notes, setNotes] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Format current seconds to MM:SS
  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const loadNotes = async () => {
    if (!courseId || !lessonId) return;
    try {
      setLoading(true);
      const res = await getNotes({ courseId, lessonId });
      setNotes(res.notes || []);
    } catch (err) {
      console.error('Failed to load notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [courseId, lessonId]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    try {
      setSaving(true);
      const res = await createNote({
        courseId,
        lessonId,
        timestamp: Math.floor(currentTime),
        content: newContent.trim(),
      });
      setNotes((prev) => [...prev, res.note].sort((a, b) => a.timestamp - b.timestamp));
      setNewContent('');
    } catch (err) {
      console.error('Failed to save note:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleStartEdit = (note) => {
    setEditingId(note._id);
    setEditContent(note.content);
  };

  const handleSaveEdit = async (noteId) => {
    if (!editContent.trim()) return;
    try {
      const res = await updateNote(noteId, editContent.trim());
      setNotes((prev) => prev.map((n) => (n._id === noteId ? res.note : n)));
      setEditingId(null);
    } catch (err) {
      console.error('Failed to update note:', err);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await deleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
      {/* Panel Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-brand-600" />
          <h3 className="text-sm font-bold text-slate-800">Timestamped Notes</h3>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
          {notes.length} saved
        </span>
      </div>

      {/* Input Form with Auto Current Timestamp */}
      <form onSubmit={handleAddNote} className="p-4 border-b border-slate-100 bg-slate-50/30">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            <Clock className="w-3.5 h-3.5 text-brand-600" />
            Capture note at:
          </span>
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-800">
            {formatSeconds(currentTime)}
          </span>
        </div>

        <textarea
          rows="2"
          placeholder="Write your observation or key concept here..."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
        ></textarea>

        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={saving || !newContent.trim()}
            className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Add Note'}
          </button>
        </div>
      </form>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-600">No notes for this lesson yet.</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Add a note while watching to jump right back to important moments anytime!
            </p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              className="p-3.5 rounded-xl border border-slate-200/90 hover:border-brand-300 bg-white shadow-sm transition-all group"
            >
              {/* Header with clickable jump badge */}
              <div className="flex items-center justify-between mb-1.5">
                <button
                  onClick={() => onSeek && onSeek(note.timestamp)}
                  className="inline-flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 transition-colors"
                  title="Click to jump video to this moment"
                >
                  <Clock className="w-3 h-3 text-brand-500" />
                  {note.formattedTimestamp || formatSeconds(note.timestamp)}
                </button>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleStartEdit(note)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    title="Edit Note"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Note Content / Inline Edit */}
              {editingId === note._id ? (
                <div className="mt-2 space-y-2">
                  <textarea
                    rows="2"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleSaveEdit(note._id)}
                      className="p-1 text-emerald-600 hover:text-emerald-700 font-bold"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-700 leading-relaxed break-words whitespace-pre-wrap">
                  {note.content}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
