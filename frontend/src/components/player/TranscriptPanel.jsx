import React, { useRef, useEffect } from 'react';
import { FileText, Play, Sparkles } from 'lucide-react';

export default function TranscriptPanel({ transcript = [], currentTime = 0, onSeek }) {
  const containerRef = useRef(null);
  const activeLineRef = useRef(null);

  // Format seconds to MM:SS
  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Find currently active cue index
  const activeIndex = transcript.findIndex(
    (cue) => currentTime >= cue.start && currentTime <= cue.end
  );

  // Auto-scroll to active line
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeIndex]);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
      {/* Panel Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-brand-600" />
          <h3 className="text-sm font-bold text-slate-800">Interactive Transcript</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200 font-medium">
          <Sparkles className="w-3 h-3 text-brand-500 animate-spin" />
          Synced with audio
        </div>
      </div>

      {/* Transcript List */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth"
      >
        {(!transcript || transcript.length === 0) ? (
          <div className="text-center py-12 px-4">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-600">No transcript available for this lesson.</p>
          </div>
        ) : (
          transcript.map((cue, idx) => {
            const isActive = idx === activeIndex;

            return (
              <div
                key={idx}
                ref={isActive ? activeLineRef : null}
                onClick={() => onSeek && onSeek(cue.start)}
                className={`p-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 group ${
                  isActive
                    ? 'bg-brand-50/90 border border-brand-200 text-brand-950 font-medium shadow-sm'
                    : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                }`}
              >
                {/* Timestamp badge */}
                <span
                  className={`font-mono text-[11px] px-2 py-0.5 rounded-md flex-shrink-0 transition-colors ${
                    isActive
                      ? 'bg-brand-600 text-white font-bold'
                      : 'bg-slate-100 group-hover:bg-brand-100 group-hover:text-brand-700 text-slate-500'
                  }`}
                >
                  {formatSeconds(cue.start)}
                </span>

                {/* Sentence text */}
                <p className="text-xs leading-relaxed flex-1">
                  {cue.text}
                </p>

                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-brand-600 mt-1.5 flex-shrink-0 animate-ping"></span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
