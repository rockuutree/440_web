import { UserProfile, Booking } from '../types';
import { Settings, Calendar as CalendarIcon, Music, Search, Clock, Award, FileText, CheckCircle2, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useState } from 'react';

interface HomeProps {
  profile: UserProfile;
  bookings: Booking[];
  sessionsCount: number;
  onNavigate: (tab: 'home' | 'practice' | 'coaches', view?: string) => void;
  onOpenSettings: () => void;
}

export default function Home({ profile, bookings, sessionsCount, onNavigate, onOpenSettings }: HomeProps) {
  // We'll showcase June 2026 as the active calendar context (since local time is June 2026!)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(5); // June (0-indexed represents January=0, but let's use 5 for June to keep math simple or 1-indexed)
  // Let's use 6 for June (1-indexed)
  const monthName = "June";
  const daysInJune = 30;
  // June 1, 2026 is a Monday (index 1 of week day: Sun=0, Mon=1, Tue=2, etc.)
  const startDayOffset = 1; 

  const daysGrid = Array.from({ length: daysInJune }, (_, i) => i + 1);
  const paddingGrid = Array.from({ length: startDayOffset }, (_, i) => null);
  const totalDaysCells = [...paddingGrid, ...daysGrid];

  const getBookingsForDay = (day: number) => {
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `2026-06-${formattedDay}`;
    return bookings.filter(b => b.date === dateStr);
  };

  const [selectedDay, setSelectedDay] = useState<number | null>(5); // Default to June 5, where our initial booking is!

  return (
    <div className="space-y-6" id="dashboard-home">
      {/* Visual Header / Welcome Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-6 md:p-8 border border-amber-900/40 relative overflow-hidden shadow-xl">
        <div className="absolute inset-x-0 -top-40 h-80 bg-radial from-amber-500/20 to-transparent blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-5">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full blur-sm opacity-60"></div>
              <img 
                src={profile.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250"} 
                alt="Singer Avatar" 
                className="relative w-20 h-20 rounded-full object-cover border-2 border-amber-400 group-hover:scale-105 transition-transform"
                id="user-avatar-home"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase tracking-widest font-mono text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 font-bold">
                  Singer Dashboard
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-50 mt-1.5" id="welcome-title">
                Welcome {profile.name}!
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-300 text-xs mt-2 font-serif">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  Voice Type: <strong className="text-white">{profile.voiceType}</strong>
                </span>
                <span className="text-slate-500">•</span>
                <span>Age: <strong className="text-white">{profile.age}</strong></span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">{profile.location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-end md:self-center">
            {profile.resumeUrl && (
              <div className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/10 text-xs transition-all font-mono">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-200 truncate max-w-[120px]">{profile.resumeUrl}</span>
              </div>
            )}
            
            <button 
              onClick={onOpenSettings}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all shadow-md flex items-center justify-center cursor-pointer"
              title="Edit Settings"
              id="settings-trigger-button"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Bento Stats Row inside Welcome block */}
        <div className="grid grid-cols-3 gap-2.5 mt-8 pt-6 border-t border-white/10 text-center">
          <div className="bg-white/5 py-2.5 px-1.5 rounded-2xl border border-white/5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Total Practice</span>
            <div className="text-lg md:text-xl font-serif font-semibold text-amber-300 mt-0.5">{sessionsCount} sessions</div>
          </div>
          <div className="bg-white/5 py-2.5 px-1.5 rounded-2xl border border-white/5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Mentor Bookings</span>
            <div className="text-lg md:text-xl font-serif font-semibold text-amber-300 mt-0.5">{bookings.length} active</div>
          </div>
          <div className="bg-white/5 py-2.5 px-1.5 rounded-2xl border border-white/5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Diction Check</span>
            <div className="text-lg md:text-xl font-serif font-semibold text-amber-300 mt-0.5">85% score</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Calendar Section & Side Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Practice and Booking Calendar */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-amber-800" />
                <h2 className="font-serif text-lg font-semibold text-slate-850">June 2026 Rehearsal Calendar</h2>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-mono font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                <span>June 2026</span>
              </div>
            </div>

            {/* Calendar Grid Weekdays */}
            <div className="grid grid-cols-7 gap-1 text-center py-3 text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            {/* Days list */}
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {totalDaysCells.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="h-10"></div>;
                }

                const dayBookings = getBookingsForDay(day);
                const hasBookings = dayBookings.length > 0;
                const isSelected = selectedDay === day;

                return (
                  <button
                    key={`day-${day}`}
                    onClick={() => setSelectedDay(day)}
                    className={`h-10 relative flex flex-col items-center justify-center text-xs rounded-xl transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-amber-800 text-white font-bold shadow-md' 
                        : hasBookings
                          ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-300/60'
                          : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{day}</span>
                    {hasBookings && (
                      <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-emerald-500'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected day content details */}
          <div className="mt-6 pt-4 border-t border-slate-100 bg-amber-50/20 rounded-2xl p-4">
            <h3 className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider">
              Schedule For June {selectedDay}, 2026
            </h3>
            {selectedDay !== null && getBookingsForDay(selectedDay).length > 0 ? (
              <div className="space-y-3 mt-3">
                {getBookingsForDay(selectedDay).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-emerald-100 shadow-xs">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={booking.coachAvatar} 
                        alt={booking.coachName} 
                        className="w-10 h-10 rounded-full object-cover border border-amber-200"
                      />
                      <div>
                        <h4 className="text-sm font-serif font-bold text-slate-800">Coaching Session with {booking.coachName}</h4>
                        <span className="flex items-center text-xs text-slate-500 font-mono mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-amber-700 mr-1" />
                          {booking.timeSlot}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase border border-emerald-300/30">
                      Scheduled
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic mt-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                No rehearsals scheduled yet. Perfect time for self-practice!
              </p>
            )}
          </div>
        </div>

        {/* Action Center Widget */}
        <div className="space-y-6">
          
          {/* Quick Actions Card */}
          <div className="bg-amber-50/30 rounded-3xl border border-amber-200/50 p-6 shadow-sm space-y-4">
            <h3 className="font-serif font-semibold text-slate-800">Direct Rehearsal Lounge</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Record a self-guided operatic aria or connect with a professional operatic coach to receive feedback on phrasing, diction, and breath supports.
            </p>
            
            <div className="space-y-2.5 pt-2">
              <button 
                onClick={() => onNavigate('practice')}
                className="w-full flex items-center justify-between text-left px-4 py-3 bg-white rounded-2xl border border-amber-200/60 hover:border-amber-400 hover:shadow-xs transition-all group"
                id="quick-start-practice"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-serif font-bold text-slate-800">Initialize Rehearsal</h4>
                    <p className="text-[10px] text-slate-400">Record a solo/partner score</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button 
                onClick={() => onNavigate('coaches')}
                className="w-full flex items-center justify-between text-left px-4 py-3 bg-white rounded-2xl border border-amber-200/60 hover:border-amber-400 hover:shadow-xs transition-all group"
                id="quick-find-coach"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-serif font-bold text-slate-800">Search Vocal Coaches</h4>
                    <p className="text-[10px] text-slate-400">Filter by language & composer</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Upcoming Event Alert banner */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-amber-900 font-serif font-bold text-xs uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
              <span>Next Coaching Session</span>
            </div>
            
            {bookings.length > 0 ? (
              <div className="flex items-start space-x-3">
                <img 
                  src={bookings[0].coachAvatar} 
                  alt={bookings[0].coachName} 
                  className="w-12 h-12 rounded-full object-cover border border-amber-400"
                />
                <div className="space-y-1">
                  <h4 className="text-xs font-serif font-bold text-slate-800">Masterclass with {bookings[0].coachName}</h4>
                  <p className="text-[10.5px] font-mono text-slate-500">
                    {bookings[0].date} at {bookings[0].timeSlot}
                  </p>
                  <p className="text-[10px] text-amber-800 italic leading-relaxed">
                    Be prepared with Mozart's 'Der Hölle Rache' for dynamic support analysis.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No coaching sessions booked contextually. Find your next vocal coach now!</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
