import React, { useState, useEffect, useRef } from 'react';
import { Song, Booking, SessionRecord, LiveNote } from '../types';
import { 
  Play, Square, HelpCircle, ArrowLeft, Library, MessageSquare, 
  Mic, Keyboard, ClipboardList, CheckCircle2, Award, Volume2, 
  ExternalLink, Sparkles, AlertCircle, ChevronRight, User, PlusCircle, Check
} from 'lucide-react';

interface PracticeProps {
  songs: Song[];
  bookings: Booking[];
  sessions: SessionRecord[];
  onAddSession: (session: SessionRecord) => void;
  onNavigateToPastSessions: () => void;
}

export default function Practice({ songs, bookings, sessions, onAddSession, onNavigateToPastSessions }: PracticeProps) {
  // Navigation inside Practice:
  // 'invite' | 'repertoire' | 'score' | 'feedback'
  const [practiceStep, setPracticeStep] = useState<'invite' | 'repertoire' | 'score' | 'feedback'>('invite');
  const [isSolo, setIsSolo] = useState(true);
  const [collaboratorName, setCollaboratorName] = useState<string | undefined>(undefined);
  const [selectedSong, setSelectedSong] = useState<Song>(songs[0]);
  
  // Repertoire list tab active: 'library' | 'setlist' | 'recent'
  const [repertoireTab, setRepertoireTab] = useState<'library' | 'setlist' | 'recent'>('library');

  // Rehearsal Score states
  const [isRecording, setIsRecording] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Note taking details
  const [manualNoteText, setManualNoteText] = useState('');
  const [sessionNotes, setSessionNotes] = useState<LiveNote[]>([]);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Feedback display details
  const [activeFeedbackSession, setActiveFeedbackSession] = useState<SessionRecord | null>(null);

  // Audio simulation playback active clips
  const [playingClipId, setPlayingClipId] = useState<string | null>(null);
  const [clipProgress, setClipProgress] = useState(0);
  const clipIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer run effect
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Select solo or companion practice
  const handleSelectMode = (soloMode: boolean, partner?: string) => {
    setIsSolo(soloMode);
    setCollaboratorName(partner);
    setPracticeStep('repertoire');
  };

  // Start scoring room
  const startRehearsalRoom = (song: Song) => {
    setSelectedSong(song);
    setPracticeStep('score');
    setIsRecording(false);
    setSecondsElapsed(0);
    setSessionNotes([]);
    setSelectedLineIndex(0); // Start on first line
  };

  // Generate Simulated Speech-to-Text
  const handleSimulateStt = () => {
    if (selectedLineIndex === null) return;
    
    const sttPhrases = [
      "Pronunciation is excellent, but keep the German 'ch' friction soft and forward.",
      "The breath appoggio is lagging here, try adding a pre-emptive support breath catch.",
      "Vocal placement is focused. Be careful not to rush the rubato tempo on the staccatos.",
      "Hold this note longer. Make sure the vowel is pure and soft palette remains lifted.",
      "Excellent dramatic delivery! Pronounce the final consonants with forward placement."
    ];
    
    const randomPhrase = sttPhrases[Math.floor(Math.random() * sttPhrases.length)];
    setManualNoteText(randomPhrase);
  };

  // Conclude active note editing and apply to score
  const handleSaveNote = () => {
    if (selectedLineIndex === null || !manualNoteText.trim()) return;

    const newNote: LiveNote = {
      id: `note-${Date.now()}`,
      lineIndex: selectedLineIndex,
      text: manualNoteText,
      timestamp: formatTimer(secondsElapsed),
      isStt: true
    };

    setSessionNotes(prev => [...prev, newNote]);
    setManualNoteText('');
    
    // Auto-advance to next line if available to make it easy to practice!
    if (selectedLineIndex < selectedSong.lines.length - 1) {
      setSelectedLineIndex(selectedLineIndex + 1);
    }
  };

  // Finish Recording and auto parse notes to synthesize realistic AI feedback report
  const handleEndRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    // Dynamic generation based on notes actually taken during rehearsal!
    // Let's create realistic calculations
    const scorePron = sessionNotes.some(n => n.text.toLowerCase().includes('pronunciation') || n.text.toLowerCase().includes('german')) ? 78 : 84;
    const scoreTempo = sessionNotes.some(n => n.text.toLowerCase().includes('tempo') || n.text.toLowerCase().includes('rubato')) ? 68 : 82;
    const scoreAppoggio = sessionNotes.some(n => n.text.toLowerCase().includes('breath') || n.text.toLowerCase().includes('appoggio')) ? 58 : 74;

    const notesSummary = sessionNotes.map(n => n.text).join(' ');

    const generalRec = sessionNotes.length > 0 
      ? `Good work applying feedback in real-time. Your target highlights focus primarily on ${sessionNotes.length} specific lines. Focus on continuing to relax the soft palette on high notes.` 
      : "Fine steady solo rehearsal! Ensure you activate the stethoscopic recorder or highlight specific score lines to annotate live expert remarks next time.";

    // Preload feedback maps corresponding to the notes taken!
    const feedbackMap = sessionNotes.map(note => {
      const type: 'pronunciation' | 'tempo' | 'appoggio' = 
        note.text.toLowerCase().includes('breath') || note.text.toLowerCase().includes('appoggio') ? 'appoggio' :
        note.text.toLowerCase().includes('tempo') || note.text.toLowerCase().includes('rubato') ? 'tempo' : 'pronunciation';
        
      return {
        lineIndex: note.lineIndex,
        lineText: selectedSong.lines[note.lineIndex].text,
        measure: selectedSong.lines[note.lineIndex].measure,
        feedbackText: note.text,
        scoreType: type
      };
    });

    const newSessionRecord: SessionRecord = {
      id: `session-${Date.now()}`,
      songId: selectedSong.id,
      songTitle: selectedSong.title,
      composer: selectedSong.composer,
      date: new Date().toISOString().split('T')[0],
      duration: formatTimer(secondsElapsed === 0 ? 122 : secondsElapsed),
      isSolo,
      partnerName: collaboratorName,
      scores: {
        pronunciation: scorePron,
        tempo: scoreTempo,
        appoggio: scoreAppoggio
      },
      generalFeedback: generalRec,
      improvements: {
        pronunciation: sessionNotes.find(n => n.text.toLowerCase().includes('pronunciation'))?.text || "Keep the vowels high-placed with stable jaw support.",
        tempo: sessionNotes.find(n => n.text.toLowerCase().includes('tempo'))?.text || "Integrate a subtle ritardando into the cadenza lines.",
        appoggio: sessionNotes.find(n => n.text.toLowerCase().includes('breath') || n.text.toLowerCase().includes('appoggio'))?.text || "Support the dramatic triplets through expand-and-hold breathing curves."
      },
      scoreFeedbackMap: feedbackMap.length > 0 ? feedbackMap : [
        {
          lineIndex: 0,
          lineText: selectedSong.lines[0].text,
          measure: selectedSong.lines[0].measure,
          feedbackText: "Diction alert: Keep vowels floating and crisp.",
          scoreType: "pronunciation"
        }
      ],
      audioClips: sessionNotes.map((note, i) => ({
        id: `clip-${i}`,
        lineIndex: note.lineIndex,
        lineText: selectedSong.lines[note.lineIndex].text.slice(0, 20) + "...",
        duration: "0:11"
      })),
      overallPercent: Math.round((scorePron + scoreTempo + scoreAppoggio) / 3),
      trend: "70/100 ↑ Congrats on the small improvement!"
    };

    onAddSession(newSessionRecord);
    setActiveFeedbackSession(newSessionRecord);
    setPracticeStep('feedback');
  };

  // Simulated audio player playback logic
  const handlePlayAudioClip = (clipId: string) => {
    if (playingClipId === clipId) {
      // Pause
      setPlayingClipId(null);
      if (clipIntervalRef.current) clearInterval(clipIntervalRef.current);
    } else {
      // Play
      setPlayingClipId(clipId);
      setClipProgress(0);
      if (clipIntervalRef.current) clearInterval(clipIntervalRef.current);
      
      clipIntervalRef.current = setInterval(() => {
        setClipProgress(prev => {
          if (prev >= 100) {
            setPlayingClipId(null);
            if (clipIntervalRef.current) clearInterval(clipIntervalRef.current);
            return 0;
          }
          return prev + 10; // Progress bar increment
        });
      }, 300);
    }
  };

  useEffect(() => {
    return () => {
      if (clipIntervalRef.current) clearInterval(clipIntervalRef.current);
    };
  }, []);

  return (
    <div className="w-full" id="practice-viewport">
      
      {/* 1. PRACTICING alone OR WITH A booked COCH COLLABORATOR? */}
      {practiceStep === 'invite' && (
        <div className="max-w-xl mx-auto space-y-6 bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-lg text-center font-sans animate-fade-in" id="invite-collaborator-page">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-800 bg-amber-50 border border-amber-250 px-3 py-1 rounded-full font-bold">
              Practice Configuration
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-black text-slate-800">Choose Rehearsal Mode</h2>
            <p className="text-xs text-slate-500">Would you like to practice independently or invite a professional accompanist/coach to collaborate?</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {/* Solo Practice Option */}
            <button 
              onClick={() => handleSelectMode(true)}
              className="p-6 md:p-8 bg-amber-50/20 hover:bg-amber-50/55 rounded-3xl border border-amber-200/50 hover:border-amber-400 text-center flex flex-col items-center space-y-3 cursor-pointer group hover:shadow-md transition-all duration-300"
              id="select-solo-mode"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-amber-700 to-amber-800 text-white rounded-2xl flex items-center justify-center shadow-md">
                <User className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-slate-800 text-md group-hover:text-amber-800 transition-colors">Study Alone</h3>
                <p className="text-[10.5px] text-slate-500 leading-relaxed">
                  Record your vocals with instant AI feedback, score synchronization, and real-time pronunciation checks.
                </p>
              </div>
            </button>

            {/* Collaborative Option */}
            <button 
              onClick={() => handleSelectMode(false, bookings.length > 0 ? bookings[0].coachName : "Mara Mihali")}
              className="p-6 md:p-8 bg-slate-50 hover:bg-slate-100 rounded-3xl border border-slate-200 hover:border-slate-350 text-center flex flex-col items-center space-y-3 cursor-pointer group hover:shadow-md transition-all duration-300"
              id="select-collab-mode"
            >
              <div className="w-14 h-14 bg-slate-850 text-white rounded-2xl flex items-center justify-center shadow-md">
                <PlusCircle className="w-7 h-7 text-amber-300" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-slate-800 text-md group-hover:text-amber-900 transition-colors">Invite Collaborator</h3>
                <p className="text-[10.5px] text-slate-500 leading-relaxed">
                  Connect with live vocal mentors or accompanists booked on your calendar to co-study in real-time.
                </p>
              </div>
            </button>
          </div>

          {/* Quick booked details banner */}
          {!isSolo && bookings.length > 0 && (
            <div className="bg-emerald-50 text-emerald-850 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between text-left text-xs">
              <div className="flex items-center space-x-3">
                <img 
                  src={bookings[0].coachAvatar} 
                  alt={bookings[0].coachName} 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium">Active Booked Mentor: <strong className="text-emerald-950 font-serif">{bookings[0].coachName}</strong></span>
              </div>
              <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full font-mono text-[9px] font-bold">ONLINE</span>
            </div>
          )}
        </div>
      )}

      {/* 2. REPERTOIRE SELECTION CARD */}
      {practiceStep === 'repertoire' && (
        <div className="max-w-xl mx-auto bg-white/90 rounded-3xl border border-slate-200/80 shadow-md p-6 space-y-5 animate-fade-in" id="repertoire-selection-room">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <button 
              onClick={() => setPracticeStep('invite')}
              className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back Mode</span>
            </button>
            <h2 className="font-serif font-black text-slate-850 text-md">Repertoire Selection</h2>
          </div>

          {/* Tab buttons */}
          <div className="flex border-b border-slate-100 text-xs">
            {['library', 'setlist', 'recent'].map((tab) => (
              <button
                key={tab}
                onClick={() => setRepertoireTab(tab as any)}
                className={`flex-1 pb-2 text-center text-xs font-semibold capitalize transition-all cursor-pointer ${
                  repertoireTab === tab 
                    ? 'border-b-2 border-amber-800 text-amber-850 font-bold' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Songs List */}
          <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
            {songs.map((song) => (
              <button
                key={song.id}
                onClick={() => startRehearsalRoom(song)}
                className="w-full flex items-center justify-between p-4 bg-amber-50/15 hover:bg-amber-50/45 rounded-2xl border border-amber-200/40 hover:border-amber-400 text-left transition-all group cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-serif font-black text-slate-800 group-hover:text-amber-850 transition-colors text-sm">{song.title}</h3>
                    <span className="text-[9.5px] font-mono text-slate-400 font-bold uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                      {song.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-serif">{song.composer} · {song.year}</p>
                </div>
                
                <ChevronRight className="w-5 h-5 text-amber-700/60 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <button
              onClick={onNavigateToPastSessions}
              className="inline-flex items-center space-x-1.5 text-xs text-amber-900 font-serif font-bold border-b-2 border-dotted border-amber-900 hover:text-amber-950 transition-all cursor-pointer"
              id="view-past-sessions-recordings-btn"
            >
              <ClipboardList className="w-4 h-4" />
              <span>View Past Sessions &amp; Recordings</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. DIGITAL SCORE PRACTICE & LIVE REC ORDER ROOM */}
      {practiceStep === 'score' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden animate-fade-in relative" id="digital-score-room">
          
          {/* USER PRACTICE GUIDE MODAL OVERLAY */}
          {showGuideModal && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-xs p-6 md:p-8 z-35 flex flex-col justify-between animate-fade-in" id="guide-modal">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-amber-200/50 mb-4">
                  <h3 className="font-serif text-lg font-black text-slate-800 flex items-center gap-1.5">
                    <HelpCircle className="w-5 h-5 text-amber-800" />
                    How to Rehearsal &amp; Annotation Guide
                  </h3>
                  <button 
                    onClick={() => setShowGuideModal(false)}
                    className="text-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full font-mono text-slate-600 transition-all font-bold cursor-pointer"
                  >
                    Close Guide
                  </button>
                </div>

                <div className="space-y-4 text-xs text-slate-600 leading-relaxed md:text-sm">
                  <p className="font-medium text-slate-800">Follow these key procedures to successfully record practice sessions and annotate feedback:</p>
                  
                  <ol className="list-decimal list-inside space-y-3 pl-1 font-sans">
                    <li>
                      <strong className="text-slate-805">Start the Recording:</strong> Press the red/green <span className="text-emerald-700 font-bold flex-inline items-center bg-emerald-50 px-1.5 py-0.5 rounded">Begin Recording Session</span> button in the top left or stop it anytime.
                    </li>
                    <li>
                      <strong className="text-slate-805">Select a score line text:</strong> Tap directly on any of the operatic lyric line rows inside the digital musical staff blocks.
                    </li>
                    <li>
                      <strong className="text-slate-805">Annotate notes connected to specific lines:</strong>
                      <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-slate-500 font-normal">
                        <li>Type manual notes (expert marks or companion reviews).</li>
                        <li>Or simulate Speech-to-Text dictation by clicking the Mic button.</li>
                      </ul>
                    </li>
                    <li>
                      <strong className="text-slate-850 font-bold">End Session &amp; AI Analysis:</strong> Press the stop recording button to instantly generate performance scores and parsed feedback pointers.
                    </li>
                  </ol>
                </div>
              </div>

              <button 
                onClick={() => setShowGuideModal(false)}
                className="w-full mt-6 py-3 bg-amber-80 * hover:bg-amber-900 text-white font-serif rounded-xl text-xs font-bold shadow-md transition-all bg-amber-800 cursor-pointer"
              >
                Acknowledge and Continue Rehearsal
              </button>
            </div>
          )}

          {/* TOP HEADER CONTROLS BAR */}
          <div className="bg-slate-850 p-4 text-white flex items-center justify-between border-b border-amber-950/20">
            {/* RECORDING CONTROLLERS */}
            <div className="flex items-center space-x-3">
              {!isRecording ? (
                <button
                  onClick={() => setIsRecording(true)}
                  className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold font-mono px-3.5 py-2 rounded-xl border border-emerald-500 shadow-md transition-colors animate-pulse cursor-pointer"
                  id="begin-recording-session-btn"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Begin Recording Session</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  {/* Blinking indicator and Timer */}
                  <div className="flex items-center space-x-1 px-2.5 py-1 bg-red-600/20 border border-red-500/50 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    <span className="text-[11.5px] font-mono font-bold text-red-500">{formatTimer(secondsElapsed)}</span>
                  </div>
                  
                  {/* Stop button as per mockup top left */}
                  <button
                    onClick={handleEndRecording}
                    className="p-1 px-2.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    title="Stop and analyze session"
                    id="stop-recording-session-btn"
                  >
                    <Square className="w-3 h-3 fill-current" />
                    <span>Stop &amp; Analyze</span>
                  </button>
                </div>
              )}
            </div>

            {/* Score header info details */}
            <div className="text-center">
              <h3 className="font-serif font-black text-xs md:text-sm tracking-wide text-amber-100">{selectedSong.title}</h3>
              <p className="text-[10px] text-slate-400 font-mono italic">Role Preps · Solo Practice</p>
            </div>

            {/* LIBRARY BACK & INFO GUIDE CONTROLS */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPracticeStep('repertoire')}
                className="p-2 bg-white/10 hover:bg-white/15 rounded-xl border border-white/10 text-white transition-colors cursor-pointer"
                title="Back to repertoire library"
                id="back-repertoire-btn"
              >
                <Library className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setShowGuideModal(true)}
                className="p-2 bg-amber-500/20 hover:bg-amber-500/30 rounded-xl border border-amber-500/30 text-amber-200 transition-colors cursor-pointer"
                title="Practice Instruction Manual"
                id="rehearsal-help-btn"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 md:p-6 space-y-6">
            
            {/* IN-APP DIGITAL SCORE SHEETS VIEW */}
            <div className="bg-amber-50/20 p-5 rounded-2xl border border-amber-200/30 text-center font-serif relative overflow-hidden">
              <div className="absolute top-2 left-2 text-[8px] font-mono uppercase tracking-widest text-slate-400">Opera Score Reader</div>
              
              {/* Elegant Clef staff graphics to mimic real score */}
              <div className="py-2 flex justify-center items-center font-black text-amber-800/80 text-xl tracking-widest leading-none">
                𝄞 ───────────────────────────────────────────
              </div>

              {/* SHEET LYRIC LINES TABLE */}
              <div className="space-y-4 py-3 relative z-10">
                {selectedSong.lines.map((line, idx) => {
                  const isLineSelected = selectedLineIndex === idx;
                  const hasNote = sessionNotes.some(n => n.lineIndex === idx);
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedLineIndex(idx)}
                      className={`w-full block py-2 px-3 rounded-xl transition-all cursor-pointer border text-center ${
                        isLineSelected 
                          ? 'bg-amber-800 text-white font-bold border-amber-800 shadow-md scale-102' 
                          : hasNote
                            ? 'bg-amber-100 text-amber-950 font-semibold border-amber-400/70 shadow-2xs'
                            : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase font-bold mb-0.5">
                        <span className={isLineSelected ? 'text-amber-200' : 'text-amber-800'}>{line.measure}</span>
                        {hasNote && <span className="bg-amber-800 text-white px-1.5 rounded-sm text-[8px]">Note Tagged</span>}
                      </div>
                      
                      <div className="text-[13px] md:text-[15px] font-serif tracking-wide">{line.text}</div>
                      <div className={`text-[10px] italic mt-0.5 font-sans ${isLineSelected ? 'text-slate-200' : 'text-slate-400'}`}>
                        "{line.translation}"
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="py-2 flex justify-center items-center font-black text-amber-800/80 text-xl tracking-widest leading-none">
                𝄢 ───────────────────────────────────────────
              </div>
            </div>

            {/* DYNAMIC NOTES INPUT PANEL (Focused at bottom of sheet) */}
            {selectedLineIndex !== null && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 space-y-4" id="note-taking-panel">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Taking note on active line</span>
                    <h4 className="text-xs font-serif font-bold text-slate-800 truncate max-w-sm">
                      {selectedSong.lines[selectedLineIndex].measure}: "{selectedSong.lines[selectedLineIndex].text}"
                    </h4>
                  </div>
                  
                  <span className="bg-slate-100 font-mono text-[9px] text-slate-500 font-bold rounded px-2 py-0.5">
                    Live Annotation
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Annotation modes: Dictate STT or click predefined simulation */}
                  <div className="flex items-center justify-between gap-2.5">
                    <button
                      type="button"
                      onClick={handleSimulateStt}
                      className="flex-1 py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-500/20 rounded-xl flex items-center justify-center space-x-2 text-xs font-semibold cursor-pointer transition-colors"
                      id="simulate-stt-mic-btn"
                    >
                      <Mic className="w-3.5 h-3.5 animate-pulse" />
                      <span>Simulate STT Voice Dictation</span>
                    </button>
                  </div>

                  {/* Typing input box */}
                  <div className="relative">
                    <textarea
                      placeholder="Type custom rehearsal remark here, e.g. 'Breath release needed prior to long F6 triplet runs' or enter voice speech notes above..."
                      value={manualNoteText}
                      onChange={(e) => setManualNoteText(e.target.value)}
                      rows={3}
                      className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:bg-white focus:border-amber-500 leading-relaxed text-slate-800"
                      id="manual-note-input"
                    />
                  </div>

                  {/* Submission done action Button */}
                  <div className="flex justify-end gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={handleSaveNote}
                      disabled={!manualNoteText.trim()}
                      className={`py-2 px-5 font-serif rounded-lg text-xs font-bold shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                        manualNoteText.trim() 
                          ? 'bg-amber-800 text-white hover:bg-amber-900' 
                          : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      }`}
                      id="submit-vocal-note-btn"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Done</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* LIVE ANNOTATED LOG LISTING */}
            {sessionNotes.length > 0 && (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150 space-y-3" id="live-notes-log">
                <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400 block">
                  Active Notes Log ({sessionNotes.length})
                </span>
                
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {sessionNotes.map((note) => (
                    <div key={note.id} className="bg-white p-3 rounded-xl border border-slate-200 text-xs flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[9.5px] font-mono text-amber-805 font-bold">
                            Measure {selectedSong.lines[note.lineIndex].measure}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">@{note.timestamp}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed font-sans">{note.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 4. AI SESSION FEEDBACK DETAILED REPORT PAGE (Task 3) */}
      {practiceStep === 'feedback' && activeFeedbackSession && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden animate-fade-in" id="ai-feedback-report-page">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-850 to-amber-950 p-6 text-white flex items-center justify-between">
            <h2 className="font-serif text-lg font-black text-amber-100">Vocal Rehearsal Analytical Report</h2>
            <button
              onClick={() => setPracticeStep('repertoire')}
              className="text-xs bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/10 text-white transition-colors cursor-pointer"
            >
              Back to Library
            </button>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            
            {/* Comparison overall percentage trend widget */}
            <div className="bg-amber-500/5 p-4 rounded-3xl border border-amber-500/10 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono text-slate-400 font-bold block">Improvement Metric</span>
                <span className="font-serif text-slate-800 text-md font-extrabold block">
                  Rehearsal Score: {activeFeedbackSession.overallPercent}/100
                </span>
              </div>
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-3xs">
                <span>{activeFeedbackSession.trend}</span>
              </div>
            </div>

            {/* PERFORMANCE GAUGES (pronunciation, tempo, appoggio) */}
            <div className="grid grid-cols-3 gap-3 text-center">
              {/* Pronunciation Gauge */}
              <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-serif font-black text-slate-705 block">Pronunciation</span>
                
                {/* Circular graphical simulated dial */}
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-amber-600 border-r-transparent border-b-transparent"></div>
                  <span className="text-[13px] font-bold font-mono text-amber-900">{activeFeedbackSession.scores.pronunciation}%</span>
                </div>
              </div>

              {/* Tempo Gauge */}
              <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-serif font-black text-slate-705 block">Tempo &amp; Rhythm</span>
                
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-600 border-t-transparent"></div>
                  <span className="text-[13px] font-bold font-mono text-amber-950">{activeFeedbackSession.scores.tempo}%</span>
                </div>
              </div>

              {/* Appoggio Gauge */}
              <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-serif font-black text-slate-705 block">Appoggio Breath</span>
                
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center text-center">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-red-400 border-l-transparent"></div>
                  <span className="text-[13px] font-bold font-mono text-slate-800">{activeFeedbackSession.scores.appoggio}%</span>
                </div>
              </div>
            </div>

            {/* TUTORED SPECIFIC parsed FEEDBACK list matching scores */}
            <div className="space-y-4">
              <h3 className="font-serif font-black text-slate-800 text-sm flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Sparkles className="w-4.5 h-4.5 text-amber-800" />
                Diction &amp; Phrasing Tutoring Guides
              </h3>

              <div className="space-y-3.5 text-xs text-slate-600">
                {/* 1. Pronunciation */}
                <div className="bg-white p-4 rounded-2xl border border-slate-150 space-y-1.5 hover:shadow-2xs transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 font-serif">Pronunciation Analysis Guide ({activeFeedbackSession.scores.pronunciation} pts)</span>
                    <span className="text-[9.5px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold uppercase">Pass</span>
                  </div>
                  <p className="leading-relaxed">{activeFeedbackSession.improvements.pronunciation}</p>
                </div>

                {/* 2. Tempo */}
                <div className="bg-white p-4 rounded-2xl border border-slate-150 space-y-1.5 hover:shadow-2xs transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 font-serif">Tempo &amp; Agility Guide ({activeFeedbackSession.scores.tempo} pts)</span>
                    <span className="text-[9.5px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold uppercase">Work Required</span>
                  </div>
                  <p className="leading-relaxed">{activeFeedbackSession.improvements.tempo}</p>
                </div>

                {/* 3. Appoggio */}
                <div className="bg-white p-4 rounded-2xl border border-slate-150 space-y-1.5 hover:shadow-2xs transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-850 font-serif">Appoggio Breath Support ({activeFeedbackSession.scores.appoggio} pts)</span>
                    <span className="text-[9.5px] font-mono text-red-650 bg-red-50 text-red-700 px-2   py-0.5 rounded font-bold uppercase border border-red-200/40">Critical Alert</span>
                  </div>
                  <p className="leading-relaxed text-red-850">{activeFeedbackSession.improvements.appoggio}</p>
                </div>
              </div>
            </div>

            {/* AUDIO CLIPS / view relevant recordings block */}
            {activeFeedbackSession.audioClips.length > 0 && (
              <div className="space-y-3 pl-0.5 text-xs">
                <span className="font-serif font-black text-slate-800 text-sm block">Clipped rehearsal feedback recordings</span>
                <p className="text-slate-500 leading-relaxed">
                  Listen back to your vocal capture on the exact measures where diction or timing issues occurred:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="relevant-recordings-grid">
                  {activeFeedbackSession.audioClips.map((clip) => {
                    const isPlaying = playingClipId === clip.id;
                    return (
                      <div key={clip.id} className="bg-slate-55 p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] font-mono text-amber-900 font-bold block truncate">{clip.lineText}</span>
                          <span className="text-[10px] text-slate-405 font-mono block mt-0.5">Vocal Track · {clip.duration}</span>
                          
                          {/* Simulated audio progress bar */}
                          {isPlaying && (
                            <div className="w-full bg-slate-200 h-1 rounded-full mt-2 relative overflow-hidden">
                              <div className="bg-amber-800 h-1 transition-all" style={{ width: `${clipProgress}%` }} />
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handlePlayAudioClip(clip.id)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            isPlaying 
                              ? 'bg-amber-900 text-white' 
                              : 'bg-white hover:bg-slate-100 text-slate-70 \ border border-slate-2.5/50'
                          }`}
                          title={isPlaying ? "Pause track" : "Listen relevant capture"}
                        >
                          {isPlaying ? (
                            <span className="font-mono text-[9px] tracking-tight font-extrabold">PAU</span>
                          ) : (
                            <Volume2 className="w-4 h-4 text-amber-800" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* General Feedback Box */}
            <div className="bg-amber-50/30 p-5 rounded-3xl border border-amber-250/30 text-xs">
              <span className="font-serif font-black text-slate-805 block">General Tutor Summary</span>
              <p className="text-slate-650 italic leading-relaxed mt-1">{activeFeedbackSession.generalFeedback}</p>
            </div>

            <button
              onClick={() => setPracticeStep('repertoire')}
              className="w-full py-3 bg-slate-850 hover:bg-slate-900 text-white text-xs font-mono tracking-widest uppercase font-extrabold rounded-2xl transition-all cursor-pointer"
              id="return-library-bottom-btn"
            >
              Return to Rehearsal Library
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
