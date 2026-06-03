import React, { useState, useMemo } from 'react';
import { Coach, Booking } from '../types';
import { 
  Search, SlidersHorizontal, ArrowUpDown, Star, MapPin, 
  Languages, Calendar, DollarSign, ChevronLeft, ArrowRight,
  MessageSquare, BookOpen, Send, CheckCircle2, User, HelpCircle, Sparkles
} from 'lucide-react';

interface CoachesProps {
  coaches: Coach[];
  bookings: Booking[];
  onAddBooking: (booking: Booking) => void;
}

export default function Coaches({ coaches, bookings, onAddBooking }: CoachesProps) {
  // Views navigation inside the coaches tab
  // 'list' | 'profile' | 'booking' | 'chat'
  const [viewState, setViewState] = useState<'list' | 'profile' | 'booking' | 'chat'>('list');
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Individual filter state fields
  const [selectedComposers, setSelectedComposers] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [maxDistance, setMaxDistance] = useState<number>(15); // miles
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Coach' | 'Accompanist'>('All');

  // Sort criteria state
  // 'relevance' | 'highest-rating' | 'lowest-rating' | 'price-asc' | 'price-desc' | 'reviews'
  const [sortCriteria, setSortCriteria] = useState<string>('relevance');

  // Booking specific states
  const [selectedDate, setSelectedDate] = useState<string>('2026-06-05');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00 AM');
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);

  // Message chat simulation states
  const [typedMessage, setTypedMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'coach'; text: string; time: string }>>([]);

  const allComposers = ["Verdi", "Mozart", "Puccini", "Donizetti", "Schubert", "Handel", "Bach", "Tchaikovsky", "Rachmaninoff"];
  const allLanguages = ["English", "Italian", "German", "French", "Russian"];
  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Toggle helpers for lists
  const handleComposerToggle = (composer: string) => {
    setSelectedComposers(prev => 
      prev.includes(composer) ? prev.filter(c => c !== composer) : [...prev, composer]
    );
  };

  const handleLanguageToggle = (lang: string) => {
    setSelectedLanguages(prev => 
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedComposers([]);
    setPriceRange({ min: '', max: '' });
    setMaxDistance(15);
    setSelectedLanguages([]);
    setSelectedDays([]);
    setSelectedCategory('All');
  };

  // Filter & Sort Logic
  const processedCoaches = useMemo(() => {
    let list = [...coaches];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.bio.toLowerCase().includes(q) ||
        c.styles.some(style => style.toLowerCase().includes(q))
      );
    }

    // 2. Category
    if (selectedCategory !== 'All') {
      list = list.filter(c => c.category === selectedCategory);
    }

    // 3. Price
    if (priceRange.min) {
      list = list.filter(c => c.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      list = list.filter(c => c.price <= Number(priceRange.max));
    }

    // 4. Distance
    list = list.filter(c => c.distance <= maxDistance);

    // 5. Composers Expertise
    if (selectedComposers.length > 0) {
      list = list.filter(c => 
        c.composerExpertise.some(comp => selectedComposers.includes(comp))
      );
    }

    // 6. Languages Spoken
    if (selectedLanguages.length > 0) {
      list = list.filter(c => 
        c.languages.some(lang => selectedLanguages.includes(lang))
      );
    }

    // 7. Days Available
    if (selectedDays.length > 0) {
      list = list.filter(c => 
        c.availability.some(day => selectedDays.includes(day))
      );
    }

    // Sort mapping
    switch (sortCriteria) {
      case 'highest-rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest-rating':
        list.sort((a, b) => a.rating - b.rating);
        break;
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'reviews':
        list.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
      case 'relevance':
      default:
        // Default relevance is rating * reviews count
        list.sort((a, b) => (b.rating * b.reviewsCount) - (a.rating * a.reviewsCount));
        break;
    }

    return list;
  }, [coaches, searchQuery, selectedCategory, priceRange, maxDistance, selectedComposers, selectedLanguages, selectedDays, sortCriteria]);

  // Handle open coach details
  const openCoachProfile = (coach: Coach) => {
    setSelectedCoach(coach);
    setViewState('profile');
  };

  // Open Messaging and preload greetings
  const openChatWithCoach = (coach: Coach) => {
    setSelectedCoach(coach);
    setViewState('chat');
    setMessages([
      { 
        sender: 'coach', 
        text: `Salve! I am ${coach.name}. Welcome to our classical vocal chatroom. How can I help you perfect your repertoire, ornamentation, or breath support today?`, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }
    ]);
  };

  // Handle message sending & automatic simulated reply
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !selectedCoach) return;

    const userMsg = typedMessage;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: 'user', text: userMsg, time: now }]);
    setTypedMessage('');

    // Simulated response delay
    setTimeout(() => {
      let coachReply = `That is an excellent point about your vocal development cycle. In classical bel canto styles, keeping the voice floaty yet chest-backed helps ensure rich high notes. Let's schedule a lesson to look closely at your score!`;
      const docQuery = userMsg.toLowerCase();
      
      if (docQuery.includes('mozart') || docQuery.includes('hölle') || docQuery.includes('rache')) {
        coachReply = `Ah, the Queen of the Night's staccato is legendary! Make sure your diction on 'Der Hölle Rache' does not constrain the jaw. Let's book a rehearsal slot to trace those triplet runs!`;
      } else if (docQuery.includes('breath') || docQuery.includes('support') || docQuery.includes('appoggio')) {
        coachReply = `Vocal appoggio is the key! Keep the intercostal muscles expanded during the whole phrase, and let the respiratory support push forward. I'd love to coach you through some drills!`;
      } else if (docQuery.includes('price') || docQuery.includes('lessons') || docQuery.includes('cost')) {
        coachReply = `My rate is $${selectedCoach.price}/hour. I provide full-rehearsal audio multi-clips, custom score markup, and immediate feedback logs which will save directly inside your Classical Vocal Studio app!`;
      } else if (docQuery.includes('hello') || docQuery.includes('hi') || docQuery.includes('hey')) {
        coachReply = `Hello! It is wonderful to meet another passionate classical singer. Are you working on any German Lieder or Italian Bel Canto arias right now?`;
      }

      setMessages(prev => [...prev, {
        sender: 'coach',
        text: coachReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };

  // Pre-configured timeslots for booking grid
  const bookingTimeSlots = ["09:00 AM", "10:30 AM", "11:00 AM", "01:30 PM", "03:00 PM", "04:30 PM"];

  // Handle Book Confirmation
  const confirmBooking = () => {
    if (!selectedCoach) return;

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      coachId: selectedCoach.id,
      coachName: selectedCoach.name,
      coachAvatar: selectedCoach.avatarUrl,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      status: 'upcoming'
    };

    onAddBooking(newBooking);
    setShowBookingSuccess(true);
  };

  return (
    <div className="space-y-6" id="coaches-section-viewport">
      {/* SUCCESS MODAL FOR BOOKING */}
      {showBookingSuccess && selectedCoach && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="booking-success-modal">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full text-center border-t-8 border-emerald-600 shadow-2xl relative">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <h3 className="text-xl font-serif font-bold text-slate-800">Booking Confirmed!</h3>
            <p className="text-sm text-slate-600 mt-2">
              Your coaching rehearsal with <strong className="text-slate-800">{selectedCoach.name}</strong> is scheduled on:
            </p>
            
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl my-4 text-xs font-mono text-amber-900 font-bold">
              {selectedDate} @ {selectedTimeSlot}
            </div>

            <p className="text-slate-500 text-xs leading-relaxed">
              This masterclass has been synced to your rehearsal calendar on the homepage dashboard.
            </p>

            <button 
              onClick={() => {
                setShowBookingSuccess(false);
                setViewState('list');
              }}
              className="w-full mt-6 py-3 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl font-serif transition-colors cursor-pointer"
              id="confirm-success-close"
            >
              Back to Studio Central
            </button>
          </div>
        </div>
      )}

      {/* VIEW STATE 1: MAIN SEARCH & COACHES LIST */}
      {viewState === 'list' && (
        <div className="space-y-6">
          {/* Top Control Bar containing Search & filters */}
          <div className="bg-amber-50/20 p-4 rounded-3xl border border-amber-200/40 shadow-xs flex flex-col md:flex-row gap-3">
            {/* Search Input Box */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                placeholder="Search vocal coaches by name, style, or experience..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-800 font-sans shadow-2xs"
                id="coach-search-input"
              />
            </div>

            {/* Quick Action buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl border text-sm font-medium transition-all cursor-pointer ${
                  showFilters || selectedComposers.length > 0 || selectedLanguages.length > 0
                    ? 'bg-amber-800 text-white border-amber-800' 
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
                id="toggle-filter-button"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="font-serif">Filters</span>
                {(selectedComposers.length + selectedLanguages.length + (priceRange.min || priceRange.max ? 1 : 0)) > 0 && (
                  <span className="bg-amber-200 text-amber-900 rounded-full w-4.5 h-4.5 flex items-center justify-center text-[10px] font-bold">
                    {selectedComposers.length + selectedLanguages.length + (priceRange.min || priceRange.max ? 1 : 0)}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center space-x-1.5 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 hover:border-slate-300 text-sm font-medium text-slate-700 transition-all cursor-pointer"
                  id="toggle-sort-button"
                >
                  <ArrowUpDown className="w-4 h-4 text-slate-500" />
                  <span className="font-serif">Sort</span>
                </button>

                {/* Dropdown sort menu overlay */}
                {showSortMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-100 shadow-xl py-2 z-30 animate-fade-in font-sans">
                    <div className="px-4 py-1 text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Sort Studios By</div>
                    <button onClick={() => { setSortCriteria('relevance'); setShowSortMenu(false); }} className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center justify-between ${sortCriteria === 'relevance' ? 'text-amber-800 font-bold' : 'text-slate-600'}`}>
                      Relevance
                    </button>
                    <button onClick={() => { setSortCriteria('highest-rating'); setShowSortMenu(false); }} className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center justify-between ${sortCriteria === 'highest-rating' ? 'text-amber-800 font-bold' : 'text-slate-600'}`}>
                      Highest Star Rating
                    </button>
                    <button onClick={() => { setSortCriteria('lowest-rating'); setShowSortMenu(false); }} className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center justify-between ${sortCriteria === 'lowest-rating' ? 'text-amber-800 font-bold' : 'text-slate-600'}`}>
                      Lowest Star Rating
                    </button>
                    <button onClick={() => { setSortCriteria('price-asc'); setShowSortMenu(false); }} className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center justify-between ${sortCriteria === 'price-asc' ? 'text-amber-800 font-bold' : 'text-slate-600'}`}>
                      Cost - Least to Greatest
                    </button>
                    <button onClick={() => { setSortCriteria('price-desc'); setShowSortMenu(false); }} className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center justify-between ${sortCriteria === 'price-desc' ? 'text-amber-800 font-bold' : 'text-slate-600'}`}>
                      Cost - Greatest to Least
                    </button>
                    <button onClick={() => { setSortCriteria('reviews'); setShowSortMenu(false); }} className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center justify-between ${sortCriteria === 'reviews' ? 'text-amber-800 font-bold' : 'text-slate-600'}`}>
                      Most Hired
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* FILTER CRITERIA SCREEN DRAWER/PANEL */}
          {showFilters && (
            <div className="bg-amber-50/20 p-5 rounded-3xl border border-amber-200/50 space-y-5 animate-fade-in" id="filter-drawer-panel">
              <div className="flex items-center justify-between pb-3 border-b border-amber-200/30">
                <h3 className="font-serif font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-amber-800" />
                  Apply Search Filters
                </h3>
                <button 
                  onClick={resetFilters}
                  className="text-xs text-amber-900 border-b border-transparent hover:border-amber-900 transition-all font-mono"
                >
                  Clear All Filters
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                {/* 1. Category and Price */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="font-semibold text-slate-700 block font-serif">Studio Category</span>
                    <div className="flex space-x-2">
                      {['All', 'Coach', 'Accompanist'].map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category as any)}
                          className={`flex-1 py-1.5 px-3 rounded-lg border text-center font-medium transition-all cursor-pointer ${
                            selectedCategory === category 
                              ? 'bg-amber-800 text-white border-amber-800' 
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-semibold text-slate-700 block font-serif">Price per Hour</span>
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-slate-400">
                          <DollarSign className="w-3.5 h-3.5" />
                        </span>
                        <input 
                          type="number" 
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                          className="w-full pl-6 pr-2 py-1.5 bg-white rounded-lg border border-slate-200 text-xs focus:outline-none"
                        />
                      </div>
                      <span className="text-slate-400">to</span>
                      <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-slate-400">
                          <DollarSign className="w-3.5 h-3.5" />
                        </span>
                        <input 
                          type="number" 
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                          className="w-full pl-6 pr-2 py-1.5 bg-white rounded-lg border border-slate-200 text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Distance Slider */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-semibold font-serif">Distance Limit</span>
                      <span className="font-mono text-amber-800 font-bold">{maxDistance} miles</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="20" 
                      value={maxDistance}
                      onChange={(e) => setMaxDistance(Number(e.target.value))}
                      className="w-full accent-amber-800 focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* 2. Composer Expertise */}
                <div className="space-y-2">
                  <span className="font-semibold text-slate-700 block font-serif">Composer Expertise</span>
                  <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                    {allComposers.map((composer) => {
                      const isSelected = selectedComposers.includes(composer);
                      return (
                        <button
                          key={composer}
                          onClick={() => handleComposerToggle(composer)}
                          className={`py-1.5 px-2 rounded-lg border text-left truncate transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold' 
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {composer}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Languages & Availability */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="font-semibold text-slate-700 block font-serif">Language Spoken</span>
                    <div className="flex flex-wrap gap-1.5">
                      {allLanguages.map((lang) => {
                        const isSelected = selectedLanguages.includes(lang);
                        return (
                          <button
                            key={lang}
                            onClick={() => handleLanguageToggle(lang)}
                            className={`py-1 px-2.5 rounded-full border text-[11px] transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold' 
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {lang}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-semibold text-slate-700 block font-serif">Days Available</span>
                    <div className="flex flex-wrap gap-1.5">
                      {allDays.map((day) => {
                        const isSelected = selectedDays.includes(day);
                        return (
                          <button
                            key={day}
                            onClick={() => handleDayToggle(day)}
                            className={`py-1 px-2.5 rounded-full border text-[11px] transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-amber-100 text-amber-950 border-amber-300 font-semibold' 
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {day.slice(0, 3)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Matches Status Info bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono px-1">
            <span>Showing {processedCoaches.length} vocal experts match your preferences</span>
            {searchQuery && <span>Search: "{searchQuery}"</span>}
          </div>

          {/* Coach grid cards list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="coaches-grid">
            {processedCoaches.map((coach) => (
              <div 
                key={coach.id}
                onClick={() => openCoachProfile(coach)}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
              >
                {/* Background decorative note accent */}
                <div className="absolute -right-3 -top-3 text-slate-50 font-serif font-black text-6xl select-none group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                  ♩
                </div>

                <div>
                  <div className="flex items-start space-x-4">
                    <img 
                      src={coach.avatarUrl} 
                      alt={coach.name} 
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-100/80 shadow-2xs group-hover:scale-105 transition-transform"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1">
                        <span className="text-[10px] font-bold font-mono tracking-wider text-amber-800 uppercase bg-amber-50 border border-amber-200/40 px-2 py-0.5 rounded">
                          {coach.category}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-[16px] text-slate-850 group-hover:text-amber-800 transition-colors">
                        {coach.name}
                      </h3>
                      <div className="flex items-center space-x-1.5 text-xs text-amber-700 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{coach.rating.toFixed(1)}</span>
                        <span className="text-slate-400 font-normal">({coach.reviewsCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Core Tags Expertise fields */}
                  <div className="flex flex-wrap gap-1 mt-4">
                    {coach.composerExpertise.map((composer) => (
                      <span key={composer} className="bg-slate-50 text-slate-600 text-[10.5px] px-2 py-0.5 rounded-md font-medium border border-slate-200/40">
                        {composer} Expert
                      </span>
                    ))}
                    {coach.styles.slice(0, 1).map((style) => (
                      <span key={style} className="bg-amber-500/5 text-amber-900/80 text-[10.5px] px-2  py-0.5 rounded-md font-medium border border-amber-500/10">
                        {style}
                      </span>
                    ))}
                  </div>

                  {/* Biography excerpt */}
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mt-3 pt-3 border-t border-slate-100 font-sans">
                    {coach.bio}
                  </p>
                </div>

                {/* Card pricing and trigger indicators */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block font-mono text-[9px] uppercase tracking-wider">Hourly Rate</span>
                    <span className="text-slate-900 font-serif font-black text-sm">${coach.price} / hr</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {coach.distance.toFixed(1)}m away
                    </span>
                    <span className="w-7 h-7 bg-amber-50 group-hover:bg-amber-800 text-amber-800 group-hover:text-white rounded-full flex items-center justify-center transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW STATE 2: SELECTED COACH PROFILE DETAILS */}
      {viewState === 'profile' && selectedCoach && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-lg overflow-hidden animate-fade-in" id="profile-container">
          {/* Header Banner Background */}
          <div className="bg-gradient-to-r from-amber-850 to-amber-950 p-6 text-white flex items-center justify-between">
            <button 
              onClick={() => setViewState('list')}
              className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/10 text-xs transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="font-serif">Back to Coaches</span>
            </button>
            <span className="text-xs font-mono tracking-widest text-amber-300 uppercase font-bold">Studio Master Profile</span>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Coach Heading Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <img 
                src={selectedCoach.avatarUrl} 
                alt={selectedCoach.name} 
                className="w-24 h-24 rounded-3xl object-cover border-4 border-amber-50 shadow-md"
              />
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-[10px] font-bold font-mono tracking-widest uppercase bg-amber-50 border border-amber-200 text-amber-800 px-3 py-0.5 rounded-full">
                    {selectedCoach.category}
                  </span>
                  <span className="text-[10.5px] text-slate-500 font-mono flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-amber-700 mr-1" />
                    Located {selectedCoach.distance} miles away
                  </span>
                </div>
                <h2 className="text-2xl font-serif font-black text-slate-850">{selectedCoach.name}</h2>
                <div className="flex items-center justify-center sm:justify-start space-x-2 text-sm text-slate-600">
                  <span className="flex items-center text-amber-700 font-semibold">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    {selectedCoach.rating.toFixed(1)}
                  </span>
                  <span>·</span>
                  <span className="font-mono">{selectedCoach.reviewsCount} reviews & masterclasses</span>
                  <span>·</span>
                  <span className="text-slate-800 font-serif font-bold text-sm">${selectedCoach.price} / hr</span>
                </div>
              </div>
            </div>

            {/* Profile body content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-slate-700 text-xs leading-relaxed">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-sm text-slate-800 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-amber-855" />
                    Expertise & Focus
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCoach.composerExpertise.map((c) => (
                      <span key={c} className="bg-amber-50 text-amber-900 border border-amber-200/40 px-2.5 py-1 rounded-md font-semibold">
                        Classical {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-sm text-slate-800 flex items-center gap-1">
                    <Languages className="w-4 h-4 text-amber-850" />
                    Languages Spoken
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedCoach.languages.map((l) => (
                      <span key={l} className="bg-slate-50 text-slate-600 border border-slate-200/50 px-2.5 py-1 rounded-md">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-sm text-slate-800 flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-amber-850" />
                    Availability
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedCoach.availability.map((day) => (
                      <span key={day} className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-mono">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3 bg-amber-50/25 p-4 rounded-3xl border border-amber-200/30">
                <h3 className="font-serif font-bold text-slate-800 text-sm">Vocal Pedagogy biography</h3>
                <p className="text-slate-600 italic">
                  "{selectedCoach.bio}"
                </p>
                <div className="pt-2 border-t border-amber-200/30 font-serif">
                  <span className="font-bold text-slate-800 text-[10.5px] uppercase tracking-wider block">Specialty styles</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {selectedCoach.styles.map((st) => (
                      <span key={st} className="text-slate-600 bg-white px-2 py-0.5 rounded border border-amber-200/30 text-[10px]">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Action footer Buttons */}
            <div className="flex gap-4 pt-6 mt-6 border-t border-slate-100">
              <button
                onClick={() => openChatWithCoach(selectedCoach)}
                className="flex-1 py-3 text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-250 font-serif text-sm font-semibold flex items-center justify-center space-x-2 cursor-pointer"
                id="message-coach-button"
              >
                <MessageSquare className="w-4.5 h-4.5 text-slate-600" />
                <span>Message Mentor</span>
              </button>
              
              <button
                onClick={() => setViewState('booking')}
                className="flex-1 py-3 bg-amber-800 hover:bg-amber-900 text-white font-serif rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                id="book-coach-button"
              >
                <BookOpen className="w-4.5 h-4.5" />
                <span>Book Rehearsal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW STATE 3: INTERACTIVE BOOKING TIME SLOTS PANEL */}
      {viewState === 'booking' && selectedCoach && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-lg overflow-hidden animate-fade-in" id="booking-slots-panel">
          <div className="bg-gradient-to-r from-amber-850 to-amber-950 p-6 text-white flex items-center justify-between">
            <button 
              onClick={() => setViewState('profile')}
              className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/10 text-xs transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Profile</span>
            </button>
            <span className="font-serif text-xs font-bold text-amber-300">Schedule Coach Lesson</span>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center space-x-4 bg-amber-50/20 p-4 rounded-2xl border border-amber-200/40">
              <img 
                src={selectedCoach.avatarUrl} 
                alt={selectedCoach.name} 
                className="w-12 h-12 rounded-xl object-cover border border-amber-300 shadow-sm"
              />
              <div>
                <h3 className="font-serif font-black text-slate-800">{selectedCoach.name}</h3>
                <span className="text-xs text-slate-500 font-mono">Expertise: {selectedCoach.composerExpertise.join(', ')} · ${selectedCoach.price}/hour</span>
              </div>
            </div>

            {/* Date Picker Grid Selector */}
            <div className="space-y-2">
              <span className="font-serif text-sm font-bold text-slate-800 block">Select Rehearsal Date</span>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {[
                  { label: "Jun 4, 2026", dateStr: "2026-06-04" },
                  { label: "Jun 5, 2026", dateStr: "2026-06-05" },
                  { label: "Jun 6, 2026", dateStr: "2026-06-06" },
                  { label: "Jun 8, 2026", dateStr: "2026-06-08" },
                ].map((dObj) => {
                  const isActive = selectedDate === dObj.dateStr;
                  return (
                    <button
                      key={dObj.dateStr}
                      onClick={() => setSelectedDate(dObj.dateStr)}
                      className={`py-3.5 px-2 rounded-2xl border flex flex-col justify-center items-center transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-amber-800 text-white font-bold border-amber-800 shadow-sm' 
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-350'
                      }`}
                    >
                      <span className="font-mono font-bold">{dObj.label.split(',')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulated Time Slots Grid */}
            <div className="space-y-2 pt-2">
              <span className="font-serif text-sm font-bold text-slate-800 block">Available Time Slots</span>
              <div className="grid grid-cols-3 gap-2.5">
                {bookingTimeSlots.map((slot) => {
                  const isSlotActive = selectedTimeSlot === slot;
                  return (
                    <button
                      key={slot}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-3 rounded-xl border text-center text-xs font-mono font-bold transition-all cursor-pointer ${
                        isSlotActive 
                          ? 'bg-amber-100 text-amber-950 border-amber-400 font-extrabold shadow-xs' 
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200/40 text-xs text-slate-600 space-y-1">
              <span className="font-sans font-bold text-slate-850 block">Payment and Policy notes</span>
              <p>
                Fees are settled in-app securely. This pricing covers high-accuracy pronunciation/tempo assessment, custom score marker saves, and unlimited video playback within your studio files.
              </p>
            </div>

            {/* Confirm booking button */}
            <button
              onClick={confirmBooking}
              className="w-full py-3.5 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-2xl font-serif text-sm font-bold shadow-md hover:from-amber-800 hover:to-amber-900 transition-all cursor-pointer flex items-center justify-center space-x-2"
              id="confirm-booking-submit"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Confirm Vocal Rehearsal Booking</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW STATE 4: CHAT MESSAGE ROOM PANEL */}
      {viewState === 'chat' && selectedCoach && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-lg overflow-hidden animate-fade-in flex flex-col h-[520px]" id="chat-conversation-panel">
          {/* Top Header info */}
          <div className="bg-slate-850 p-4 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setViewState('profile')}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors cursor-pointer"
                aria-label="Back to profile"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <img 
                src={selectedCoach.avatarUrl} 
                alt={selectedCoach.name} 
                className="w-10 h-10 rounded-full object-cover border border-amber-400"
              />
              <div className="space-y-0.5">
                <h3 className="font-serif font-black text-xs md:text-sm">{selectedCoach.name}</h3>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
                  Active Mentor
                </span>
              </div>
            </div>

            <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase font-extrabold hidden sm:inline">
              Vocal Chat Lounge
            </span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-amber-50/10">
            {messages.map((m, idx) => {
              const isCoach = m.sender === 'coach';
              return (
                <div 
                  key={idx}
                  className={`flex ${isCoach ? 'justify-start' : 'justify-end'} animate-fade-in`}
                >
                  <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs shadow-3xs leading-relaxed ${
                    isCoach 
                      ? 'bg-amber-50 text-slate-750 rounded-tl-none border border-amber-200/30' 
                      : 'bg-amber-800 text-white rounded-tr-none'
                  }`}>
                    <p className="font-sans font-medium whitespace-pre-wrap">{m.text}</p>
                    <span className={`text-[9px] block text-right mt-1.5 uppercase font-mono tracking-widest ${
                      isCoach ? 'text-slate-400' : 'text-white/70'
                    }`}>
                      {m.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Helper prompts */}
          <div className="bg-slate-50 border-t border-slate-100 p-2 flex flex-wrap gap-1.5 justify-center">
            <span className="text-[9.5px] font-serif text-slate-400 self-center">Ask:</span>
            {[
              "Hello, I need help with Mozart 'Der Hölle Rache'",
              "What breathing drill works best for appoggio?",
              "What is your package rate?"
            ].map((suggested, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTypedMessage(suggested)}
                className="text-[10px] bg-white hover:bg-amber-100/50 border border-slate-200 text-slate-600 px-2 py-1 rounded-full transition-colors truncate max-w-xs text-left cursor-pointer"
              >
                {suggested}
              </button>
            ))}
          </div>

          {/* Message input bar */}
          <form onSubmit={sendMessage} className="p-3 border-t border-slate-100 flex space-x-2 bg-white">
            <input 
              type="text" 
              placeholder="Type message exploring operatic styles, bookings, repertoire support..."
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:bg-white focus:border-amber-500"
              id="message-text-input"
            />
            <button
              type="submit"
              className="p-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl transition-colors shrink-0 flex items-center justify-center cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
