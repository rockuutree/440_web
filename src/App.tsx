import { useState, useEffect } from 'react';
import { UserProfile, Booking, SessionRecord, Song } from './types';
import { 
  INITIAL_USER_PROFILE, INITIAL_COACHES, INITIAL_BOOKINGS, 
  INITIAL_SESSIONS, INITIAL_REPERTOIRE 
} from './data';
import Home from './components/Home';
import AccountSettings from './components/AccountSettings';
import Coaches from './components/Coaches';
import Practice from './components/Practice';
import PastSessions from './components/PastSessions';
import { 
  Home as HomeIcon, Music, Search, ClipboardList, Shield, X, Award, MapPin, Check, GraduationCap, FileText
} from 'lucide-react';

export default function App() {
  // Global App states
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [sessions, setSessions] = useState<SessionRecord[]>(INITIAL_SESSIONS);
  const songs: Song[] = INITIAL_REPERTOIRE;

  // Active Navigation Tab: 'home' | 'practice' | 'coaches' | 'sessions'
  const [activeTab, setActiveTab] = useState<'home' | 'practice' | 'coaches' | 'sessions'>('home');

  // Popup / View Mode States
  const [showSettingsView, setShowSettingsView] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  // Reference for detailed past session viewer
  const [selectedPastSession, setSelectedPastSession] = useState<SessionRecord | null>(null);

  // Callback to navigate and optionally transition deeper states
  const handleNavigate = (tab: 'home' | 'practice' | 'coaches' | 'sessions', subView?: string) => {
    setActiveTab(tab);
    setShowSettingsView(false);
    setSelectedPastSession(null);
  };

  // Callback for editing settings
  const handleSaveProfileSettings = (updated: UserProfile) => {
    setUserProfile(updated);
    setShowSettingsView(false);
  };

  // Callback for adding bookings
  const handleAddBooking = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
  };

  // Callback for completing a recording session
  const handleAddSession = (newSession: SessionRecord) => {
    setSessions(prev => [newSession, ...prev]);
  };

  // Force scroll-to-top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, showSettingsView]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900 leading-normal" id="app-wrapper">
      
      {/* 1. TOP MARBLE & BRONZE BRAND GLASS HEADER BAR */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-amber-200/40 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2.5">
          {/* Logo emblem */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 border border-amber-300 flex items-center justify-center text-white font-serif font-black text-md select-none shadow-xs">
            𝔅
          </div>
          <div>
            <h1 className="text-sm font-serif font-black tracking-wider text-amber-950 uppercase">Bel Canto Studio</h1>
            <span className="text-[9px] font-mono tracking-widest text-slate-400 block uppercase">Classical Vocal Laboratory</span>
          </div>
        </div>

        {/* Quick status indicators (clean literal labels) */}
        <div className="flex items-center space-x-3.5 text-xs">
          <button 
            onClick={() => setShowResumeModal(true)}
            className="hidden sm:flex items-center space-x-1 text-[11px] text-amber-900 hover:text-amber-955 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/15 py-1 px-2.5 rounded-full font-serif font-semibold transition-all cursor-pointer"
            id="view-curriculum-vitae"
          >
            <FileText className="w-3.5 h-3.5 text-amber-700" />
            <span>Curriculum Resume</span>
          </button>
          
          <div className="flex items-center space-x-1 bg-slate-100 border border-slate-200/60 px-3 py-1 rounded-full text-[10.5px] text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono">June 2026</span>
          </div>
        </div>
      </header>

      {/* 2. RESUME PROFILE MODAL OVERLAY */}
      {showResumeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="resume-cv-modal">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-amber-250/20 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setShowResumeModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
              aria-label="Close CV Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6 font-sans text-xs">
              {/* Header profile info */}
              <div className="flex items-center space-x-4 pb-4 border-b border-amber-200/50">
                <img 
                  src={userProfile.avatarUrl} 
                  alt="Singer" 
                  className="w-14 h-14 rounded-full object-cover border-2 border-amber-400"
                />
                <div>
                  <h3 className="font-serif text-[16px] text-slate-800 font-bold">{userProfile.name}</h3>
                  <span className="text-xs text-amber-800 font-serif font-semibold">Classification: {userProfile.voiceType}</span>
                  <p className="text-[10px] text-slate-400">{userProfile.location}</p>
                </div>
              </div>

              {/* Roles list */}
              <div className="space-y-2">
                <h4 className="font-serif font-black text-slate-800 uppercase tracking-widest text-[11px] flex items-center gap-1">
                  <Award className="w-4 h-4 text-amber-800" />
                  Operatic Role Experience
                </h4>
                <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-105">
                  <div className="flex justify-between font-bold">
                    <span>Queen of the Night</span>
                    <span className="text-amber-800 font-serif font-medium">W.A. Mozart · Die Zauberflöte</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Adina</span>
                    <span className="text-amber-805 font-serif font-medium">G. Donizetti · L'elisir d'amore</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Liù</span>
                    <span className="text-amber-805 font-serif font-medium">G. Puccini · Turandot</span>
                  </div>
                </div>
              </div>

              {/* Conservatory Training */}
              <div className="space-y-2">
                <h4 className="font-serif font-black text-slate-800 uppercase tracking-widest text-[11px] flex items-center gap-1">
                  <GraduationCap className="w-4.5 h-4.5 text-amber-800" />
                  Conservatory &amp; Academic Training
                </h4>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-105 space-y-1">
                  <p className="font-bold">The Juilliard School — Bachelor of Music</p>
                  <p className="text-slate-500 italic">Vocal Arts &amp; Performance majors, Graduate 2022</p>
                  <p className="font-bold pt-1">San Francisco Opera Conservatory Program</p>
                  <p className="text-slate-500 italic">Concentrated Operatic Repertory, 2024 Study</p>
                </div>
              </div>

              {/* Skills / masterclasses */}
              <div className="space-y-2">
                <h4 className="font-serif font-black text-slate-850 uppercase tracking-widest text-[11px] block">Specialist Skills</h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["German Lieder diction", "Bel Canto breathing", "French Melodie phrasing", "Coloratura agility Runs", "Recitativo pacing"].map((s, i) => (
                    <span key={i} className="bg-amber-50 text-amber-900 px-2.5 py-1 rounded-md border border-amber-200/50">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. DYNAMIC VIEWS CONTAINER */}
      <main className="flex-1 px-4 md:px-8 py-6 max-w-5xl w-full mx-auto pb-24">
        
        {/* If Settings View is toggled active */}
        {showSettingsView ? (
          <AccountSettings 
            profile={userProfile}
            onSave={handleSaveProfileSettings}
            onCancel={() => setShowSettingsView(false)}
          />
        ) : (
          <>
            {/* HOME VIEW */}
            {activeTab === 'home' && (
              <Home 
                profile={userProfile}
                bookings={bookings}
                sessionsCount={sessions.length}
                onNavigate={handleNavigate}
                onOpenSettings={() => setShowSettingsView(true)}
              />
            )}

            {/* COACHES VIEW */}
            {activeTab === 'coaches' && (
              <Coaches 
                coaches={INITIAL_COACHES}
                bookings={bookings}
                onAddBooking={handleAddBooking}
              />
            )}

            {/* PRACTICE WORKFLOW (includes RecordingScore & SessionFeedback) */}
            {activeTab === 'practice' && (
              <Practice 
                songs={songs}
                bookings={bookings}
                sessions={sessions}
                onAddSession={handleAddSession}
                onNavigateToPastSessions={() => setActiveTab('sessions')}
              />
            )}

            {/* SESSIONS HISTORY REVIEW VIEW */}
            {activeTab === 'sessions' && (
              <>
                {selectedPastSession ? (
                  <div className="space-y-4">
                    <button 
                      onClick={() => setSelectedPastSession(null)}
                      className="inline-flex items-center space-x-1 bg-white border border-slate-200 hover:bg-slate-50 px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer"
                    >
                      <span>← Back past sessions</span>
                    </button>
                    
                    {/* Render active feedback details */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
                      <div className="pb-3 border-b border-slate-100">
                        <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Archived Rehearsal Assessment</span>
                        <h2 className="font-serif font-black text-xl text-slate-800">{selectedPastSession.songTitle} ({selectedPastSession.date})</h2>
                        <span className="text-xs text-amber-800 font-serif font-semibold">{selectedPastSession.composer} Aria · {selectedPastSession.isSolo ? 'Solo Rehearsal' : `Partnered with ${selectedPastSession.partnerName}`}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-slate-50 p-3 rounded-2xl">
                          <span className="text-[10px] block font-mono text-slate-400 uppercase">Diction</span>
                          <strong className="text-lg font-serif">{selectedPastSession.scores.pronunciation}%</strong>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl">
                          <span className="text-[10px] block font-mono text-slate-400 uppercase">Agility</span>
                          <strong className="text-lg font-serif">{selectedPastSession.scores.tempo}%</strong>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl">
                          <span className="text-[10px] block font-mono text-slate-400 uppercase">Breath</span>
                          <strong className="text-lg font-serif text-red-700">{selectedPastSession.scores.appoggio}%</strong>
                        </div>
                      </div>

                      {/* Display detail guidelines */}
                      <div className="space-y-3.5 text-xs leading-relaxed text-slate-650">
                        <div className="bg-slate-50 p-4 rounded-2xl">
                          <strong className="text-slate-800 block mb-1">Diction Annotation:</strong>
                          <p>{selectedPastSession.improvements.pronunciation}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl">
                          <strong className="text-slate-800 block mb-1">Timing &amp; Agility Annotation:</strong>
                          <p>{selectedPastSession.improvements.tempo}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl">
                          <strong className="text-slate-850 block mb-1">Appoggio Breath support:</strong>
                          <p>{selectedPastSession.improvements.appoggio}</p>
                        </div>
                      </div>

                      <div className="bg-amber-50 p-4 rounded-2xl text-xs italic text-slate-600">
                        "{selectedPastSession.generalFeedback}"
                      </div>
                    </div>
                  </div>
                ) : (
                  <PastSessions 
                    sessions={sessions}
                    onSelectSession={(sess) => setSelectedPastSession(sess)}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* 4. STATIC FLOATING ACTION NAVIGATION BAR AT BOTTOM (Fixed viewport) */}
      <nav className="fixed bottom-0 mt-auto inset-x-0 bg-white/90 backdrop-blur-md border-t border-amber-200/40 px-6 py-2 z-40 flex justify-around items-center max-w-md mx-auto sm:rounded-t-3xl sm:border shadow-xl">
        {/* Home option */}
        <button 
          onClick={() => handleNavigate('home')}
          className={`flex flex-col items-center justify-center space-y-0.5 py-1 px-4 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'home' && !showSettingsView ? 'text-amber-800 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
          id="nav-home"
        >
          <HomeIcon className="w-[19px] h-[19px]" />
          <span className="text-[10px] font-medium tracking-wide">Home</span>
        </button>

        {/* Practice option */}
        <button 
          onClick={() => handleNavigate('practice')}
          className={`flex flex-col items-center justify-center space-y-0.5 py-1 px-4 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'practice' && !showSettingsView ? 'text-amber-800 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
          id="nav-practice"
        >
          <Music className="w-[19px] h-[19px]" />
          <span className="text-[10px] font-medium tracking-wide">Practice</span>
        </button>

        {/* Coaches search options */}
        <button 
          onClick={() => handleNavigate('coaches')}
          className={`flex flex-col items-center justify-center space-y-0.5 py-1 px-4 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'coaches' && !showSettingsView ? 'text-amber-800 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
          id="nav-coaches"
        >
          <Search className="w-[19px] h-[19px]" />
          <span className="text-[10px] font-medium tracking-wide">Coaches</span>
        </button>

        {/* Past Sessions browse history */}
        <button 
          onClick={() => handleNavigate('sessions')}
          className={`flex flex-col items-center justify-center space-y-0.5 py-1 px-4 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'sessions' && !showSettingsView ? 'text-amber-800 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
          id="nav-sessions"
        >
          <ClipboardList className="w-[19px] h-[19px]" />
          <span className="text-[10px] font-medium tracking-wide">History</span>
        </button>
      </nav>
    </div>
  );
}
