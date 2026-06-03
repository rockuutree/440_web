import { Coach, Song, SessionRecord, UserProfile, Booking } from './types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: "Lyric Soprano",
  voiceType: "Lyric Soprano",
  age: 28,
  location: "Seattle, WA",
  resumeUrl: "soprano_resume_2026.pdf",
  avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250"
};

export const INITIAL_COACHES: Coach[] = [
  {
    id: "coach-1",
    name: "Mara Mihali",
    rating: 5.0,
    reviewsCount: 167,
    price: 50,
    category: "Coach",
    composerExpertise: ["Verdi", "Mozart"],
    languages: ["English", "Italian", "German"],
    distance: 4.8,
    availability: ["Monday", "Tuesday", "Wednesday"],
    nextAvailabilityDate: "2026-06-05",
    styles: ["Bel Canto", "Verismo", "German Lieder"],
    bio: "Mara is an internationally acclaimed vocal coach who specializes in Mozart and late-romantic Italian works. Formerly a staff coach at San Francisco Opera and a graduate of the Juilliard School. Known for her attention to precise diction and appoggio breath technique.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
  },
  {
    id: "coach-2",
    name: "Ryan Vu",
    rating: 4.9,
    reviewsCount: 82,
    price: 65,
    category: "Accompanist",
    composerExpertise: ["Puccini", "Donizetti", "Mozart"],
    languages: ["English", "Italian", "French"],
    distance: 6.2,
    availability: ["Tuesday", "Thursday", "Friday"],
    nextAvailabilityDate: "2026-06-04",
    styles: ["Bel Canto", "Verismo", "French Melodie"],
    bio: "Ryan is an operatic accompanist and repetiteur with extensive experience in Seattle Opera rehearsal rooms. He excels at orchestral reductions on the piano, helping singers master rubato and tempo integration in complex ensembles.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250"
  },
  {
    id: "coach-3",
    name: "Sofia Laurent",
    rating: 4.8,
    reviewsCount: 112,
    price: 75,
    category: "Coach",
    composerExpertise: ["Mozart", "Schubert"],
    languages: ["English", "French", "German"],
    distance: 1.5,
    availability: ["Wednesday", "Friday"],
    nextAvailabilityDate: "2026-06-08",
    styles: ["Classical Style", "German Lieder", "Baroque Oratorio"],
    bio: "Sofia specializes in the classical precision of Mozart and the German romanticism of Franz Schubert. Having spent a decade performing in European opera houses, she teaches singers how to blend technical purity with emotional delivery.",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250"
  },
  {
    id: "coach-4",
    name: "Julian Vance",
    rating: 4.7,
    reviewsCount: 55,
    price: 45,
    category: "Accompanist",
    composerExpertise: ["Handel", "Bach"],
    languages: ["English", "German"],
    distance: 10.5,
    availability: ["Monday", "Thursday"],
    nextAvailabilityDate: "2026-06-09",
    styles: ["Baroque", "Early Music", "Harpsichord Continuo"],
    bio: "Julian is a countertenor and harpsichordist specializing in historical performance practice. He provides expert accompaniment and coaching in Baroque ornaments, trills, and recitativo secco pacing.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250"
  },
  {
    id: "coach-5",
    name: "Elena Rostova",
    rating: 4.9,
    reviewsCount: 143,
    price: 80,
    category: "Coach",
    composerExpertise: ["Tchaikovsky", "Rachmaninoff", "Verdi"],
    languages: ["English", "Russian", "Italian"],
    distance: 3.2,
    availability: ["Tuesday", "Wednesday", "Thursday"],
    nextAvailabilityDate: "2026-06-06",
    styles: ["Verismo", "Russian Song", "Grand Opera"],
    bio: "Elena is a prominent dramatic soprano and master vocal technician. Her lessons concentrate on dynamic breath controls (appoggio) and managing vocal registration shifts for powerful, sustainable high range singing.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250"
  }
];

export const INITIAL_REPERTOIRE: Song[] = [
  {
    id: "song-1",
    title: "Der Hölle Rache",
    composer: "Mozart",
    year: 1791,
    category: "Soprano Aria",
    lines: [
      { text: "Der Höl- le Ra- che kocht in mei- nem Her- zen,", translation: "Hell's vengeance boils in my heart,", measure: "mm. 1-8" },
      { text: "Tod und Ver- zweif- lung flam- met um mich her!", translation: "Death and despair flame around me!", measure: "mm. 9-16" },
      { text: "Fühlt nicht durch dich Sa- ras- tro To- des- schmerz,", translation: "If Sarastro does not feel the pain of death through you,", measure: "mm. 17-24" },
      { text: "so bist du mei- ne Toch- ter nim- mer- mehr.", translation: "then you will be my daughter nevermore.", measure: "mm. 25-32" },
      { text: "Ver- sto- ssen sei auf e- wig,", translation: "Abandoned be forever,", measure: "mm. 33-38" },
      { text: "ver- las- sen sei auf e- wig,", translation: "rejected be forever,", measure: "mm. 39-44" },
      { text: "zer- trüm- mert sei'n auf e- wig al- le Ban- de der Na- tur.", translation: "sundered be forever all the bonds of nature.", measure: "mm. 45-56" }
    ]
  },
  {
    id: "song-2",
    title: "Bel conforto al mietitore",
    composer: "Donizetti",
    year: 1832,
    category: "Soprano Cavatina",
    lines: [
      { text: "Bel con- for- to al mie- ti- to- re,", translation: "Beautiful comfort for the reaper,", measure: "mm. 1-4" },
      { text: "quan- do il sol più fer- ve e bol- le,", translation: "when the sun boils and rages most,", measure: "mm. 5-8" },
      { text: "sot- to un fag- gio, pres- so un col- le,", translation: "under a beech tree near a hill,", measure: "mm. 9-12" },
      { text: "tro- var l'om- bra e la fres- cu- ra!", translation: "to find shade and cool air!", measure: "mm. 13-16" }
    ]
  },
  {
    id: "song-3",
    title: "Signore, ascolta",
    composer: "Puccini",
    year: 1926,
    category: "Soprano Aria",
    lines: [
      { text: "Si- gno- re, a- scol- ta! Ah, si- gno- re, a- scol- ta!", translation: "My lord, listen! Oh, my lord, listen!", measure: "mm. 1-6" },
      { text: "Liù non reg- ge più! Si spez- za il cor!", translation: "Liù can bear no more! My heart is breaking!", measure: "mm. 7-12" },
      { text: "Ah- i- mè, quan- to cam- mi- no col tuo no- me", translation: "Alas, how much I walk with your name", measure: "mm. 13-18" },
      { text: "nel- l'a- ni- ma, col no- me tuo sul- le lab- bra!", translation: "in my soul, with your name on my lips!", measure: "mm. 19-24" }
    ]
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "booking-1",
    coachId: "coach-1",
    coachName: "Mara Mihali",
    coachAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    date: "2026-06-05",
    timeSlot: "11:00 AM",
    status: "upcoming"
  }
];

export const INITIAL_SESSIONS: SessionRecord[] = [
  {
    id: "session-1",
    songId: "song-1",
    songTitle: "Der Hölle Rache",
    composer: "Mozart",
    date: "2026-06-02",
    duration: "4:15",
    isSolo: false,
    partnerName: "Mara Mihali",
    scores: {
      pronunciation: 76,
      tempo: 67,
      appoggio: 54
    },
    generalFeedback: "Excellent dramatic drive overall, but vocal placement during the lightning triplets was restricted. Need more space in the pharynx to avoid constriction on high F6.",
    improvements: {
      pronunciation: "Your coach thinks your pronunciation is good, but the consonants are too harsh. Example: 'ach' sounds too much like 'agh' (mm. 5)",
      tempo: "Your coach noted there were some places where you could've added more rubato. Example: mm. 17-18",
      appoggio: "Your coach said your breath support is lacking. They recommended adding breaths in some places. Example: breathe after 'Rache' in mm. 2 to support the pitch center."
    },
    scoreFeedbackMap: [
      {
        lineIndex: 0,
        lineText: "Der Höl- le Ra- che kocht in mei- nem Her- zen,",
        measure: "mm. 5",
        feedbackText: "Diction alert: Keep German 'ch' in 'Rache' forward and soft. Avoid cracking raw pharyngeal sounds.",
        scoreType: "pronunciation"
      },
      {
        lineIndex: 2,
        lineText: "Fühlt nicht durch dich Sa- ras- tro To- des- schmerz,",
        measure: "mm. 17-18",
        feedbackText: "Phrasing rubato: Ease gently into the 'Fühlt nicht'. There is room for elegant pacing here.",
        scoreType: "tempo"
      },
      {
        lineIndex: 1,
        lineText: "Tod und Ver- zweif- lung flam- met um mich her!",
        measure: "mm. 9",
        feedbackText: "Appoggio release: Add a supportive breath catch prior to 'Tod' to ensure high dramatic resonance.",
        scoreType: "appoggio"
      }
    ],
    audioClips: [
      { id: "clip-1", lineIndex: 0, lineText: "Der Höl- le Ra- che kocht...", duration: "0:12" },
      { id: "clip-2", lineIndex: 2, lineText: "Fühlt nicht durch dich...", duration: "0:09" },
      { id: "clip-3", lineIndex: 1, lineText: "Tod und Ver- zweif- lung...", duration: "0:10" }
    ],
    overallPercent: 65,
    trend: "68/100 ↑ Congrats on the small improvement!"
  },
  {
    id: "session-2",
    songId: "song-2",
    songTitle: "Bel conforto al mietitore",
    composer: "Donizetti",
    date: "2026-05-28",
    duration: "5:30",
    isSolo: true,
    scores: {
      pronunciation: 82,
      tempo: 80,
      appoggio: 84
    },
    generalFeedback: "Lovely sparkling soprano flow. The agility sections were accurate, and breath management was highly supportive of the bel canto style.",
    improvements: {
      pronunciation: "Diction was very pristine with bright Italian vowels.",
      tempo: "Subtle ritardandos at double bars were executed with outstanding communication.",
      appoggio: "Strong constant abdominal support maintained throughout long phrases in Adina's cantabile."
    },
    scoreFeedbackMap: [],
    audioClips: [],
    overallPercent: 82,
    trend: "82/100 ↓ Oops! Go back to what you were doing here"
  }
];
