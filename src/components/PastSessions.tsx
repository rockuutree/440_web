import { SessionRecord } from '../types';
import { ClipboardList, ChevronRight, Calendar, Clock, Award, Music, BookOpen, Volume2, Sparkles, User } from 'lucide-react';
import { useState } from 'react';

interface PastSessionsProps {
  sessions: SessionRecord[];
  onSelectSession: (session: SessionRecord) => void;
}

export default function PastSessions({ sessions, onSelectSession }: PastSessionsProps) {
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  return (
    <div className="max-w-xl mx-auto space-y-6" id="past-sessions-panel-viewport">
      <div className="bg-gradient-to-r from-amber-800 to-amber-950 text-white rounded-3xl p-5 md:p-6 border border-amber-900/40">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-white/10 rounded-xl border border-white/10 text-white shadow-md">
            <ClipboardList className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-black tracking-wide">Past Sessions &amp; Recordings</h2>
            <p className="text-xs text-slate-300">Track vocal progression trends, clipped tapes, and coach reviews.</p>
          </div>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-205 text-center shadow-xs">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-slate-700 text-sm">No recorded rehearsals yet</h3>
          <p className="text-xs text-slate-400 mt-1">Start singing in the Practice loom to capture initial feedback logs!</p>
        </div>
      ) : (
        <div className="space-y-3.5" id="sessions-listing">
          {sessions.map((session) => {
            const isExpanded = expandedSessionId === session.id;
            return (
              <div 
                key={session.id}
                className="bg-white rounded-3xl border border-slate-200 p-4 hover:shadow-xs transition-shadow relative overflow-hidden"
              >
                {/* Score percentage tag in corner */}
                <div className="absolute right-4 top-4 bg-amber-500/10 text-amber-900 border border-amber-200 px-3 py-1 rounded-full font-mono text-xs font-bold shadow-3xs">
                  {session.overallPercent}%
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-amber-800" />
                    <span>Rehearsed {session.date}</span>
                    <span>·</span>
                    <Clock className="w-3.5 h-3.5 text-amber-800" />
                    <span>Duration: {session.duration}</span>
                  </div>

                  <div>
                    <h3 className="font-serif font-black text-slate-800 text-[15px]">{session.songTitle}</h3>
                    <p className="text-xs text-slate-500 font-serif">{session.composer} Aria · {session.isSolo ? 'Solo Rehearsal' : `Partnered with ${session.partnerName}`}</p>
                  </div>
                </div>

                {/* Score drilldowns preview */}
                <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3.5 border-t border-slate-100 text-center text-[10px] font-mono">
                  <div>
                    <span className="text-slate-400 block uppercase">Diction</span>
                    <strong className="text-slate-700">{session.scores.pronunciation}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase">Agility</span>
                    <strong className="text-slate-700">{session.scores.tempo}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase">Breath</span>
                    <strong className="text-slate-705 text-red-700 font-bold">{session.scores.appoggio}%</strong>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-50 flex gap-2">
                  {/* Detailed inspection button */}
                  <button
                    onClick={() => onSelectSession(session)}
                    className="flex-1 py-2 bg-amber-50 hover:bg-amber-100/60 border border-amber-200/40 text-amber-900 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Review Full AI Report</span>
                  </button>

                  <button
                    onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                    className="py-2 px-3 hover:bg-slate-55 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    {isExpanded ? "Hide notes" : "Quick notes"}
                  </button>
                </div>

                {/* EXPANDE QUICK PREVIEW LOGS */}
                {isExpanded && (
                  <div className="mt-3.5 p-3.5 bg-amber-50/15 rounded-2xl border border-amber-200/20 text-xs text-slate-650 space-y-2 animate-fade-in font-sans leading-relaxed">
                    <span className="font-serif font-bold text-slate-800 block">General feedback preview:</span>
                    <p className="italic">"{session.generalFeedback}"</p>
                    {session.scoreFeedbackMap.length > 0 && (
                      <div className="pt-2 border-t border-amber-200/20 space-y-1">
                        <span className="font-bold text-[10.5px] text-slate-755 block">Specific lines marked:</span>
                        <ul className="list-disc list-inside space-y-1 font-sans text-[11px] text-slate-600 pl-1">
                          {session.scoreFeedbackMap.slice(0, 2).map((item, idx) => (
                            <li key={idx}>
                              <strong className="font-mono text-amber-800">{item.measure}</strong>: {item.feedbackText}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
