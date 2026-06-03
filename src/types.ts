export interface Coach {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  price: number;
  category: 'Coach' | 'Accompanist';
  composerExpertise: string[];
  languages: string[];
  distance: number; // in miles
  availability: string[]; // e.g., ['Monday', 'Wednesday']
  nextAvailabilityDate: string; // e.g., '2026-06-05'
  styles: string[];
  bio: string;
  avatarUrl: string;
}

export interface Song {
  id: string;
  title: string;
  composer: string;
  year: number;
  category: string; // e.g. "Soprano Aria", "Tenor Aria"
  lines: Array<{
    text: string;
    translation: string;
    measure: string;
  }>;
}

export interface Booking {
  id: string;
  coachId: string;
  coachName: string;
  coachAvatar: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "11:00 AM"
  status: 'upcoming' | 'completed';
}

export interface LiveNote {
  id: string;
  lineIndex: number;
  text: string;
  timestamp: string;
  isStt?: boolean;
}

export interface SessionRecord {
  id: string;
  songId: string;
  songTitle: string;
  composer: string;
  date: string;
  duration: string;
  isSolo: boolean;
  partnerName?: string;
  scores: {
    pronunciation: number;
    tempo: number;
    appoggio: number;
  };
  generalFeedback: string;
  improvements: {
    pronunciation: string;
    tempo: string;
    appoggio: string;
  };
  scoreFeedbackMap: Array<{
    lineIndex: number;
    lineText: string;
    measure: string;
    feedbackText: string;
    scoreType: 'pronunciation' | 'tempo' | 'appoggio';
  }>;
  audioClips: Array<{
    id: string;
    lineIndex: number;
    lineText: string;
    duration: string;
    audioUrl?: string;
  }>;
  overallPercent: number;
  trend: string; // e.g. "68/100 ↑ Congrats on the small improvement!"
}

export interface UserProfile {
  name: string;
  voiceType: string;
  age: number;
  location: string;
  resumeUrl?: string;
  avatarUrl?: string;
}
