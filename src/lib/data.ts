import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string): ImagePlaceholder => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    // Fallback image if not found
    return {
      id: 'fallback',
      imageUrl: 'https://picsum.photos/seed/fallback/500/500',
      imageHint: 'abstract',
      description: 'Fallback placeholder image',
    };
  }
  return image;
};

export const speakers = [
  {
    id: '1',
    name: 'Aria Wijaya',
    title: 'Cloud Engineering Lead, TechCorp',
    photo: findImage('speaker-1'),
    bio: '',
    socials: { twitter: '#', linkedin: '#' },
  },
  {
    id: '2',
    name: 'Bima Satria',
    title: 'AI/ML Researcher, InnoAI',
    photo: findImage('speaker-2'),
    bio: '',
    socials: { twitter: '#', linkedin: '#' },
  },
  {
    id: '3',
    name: 'Citra Kirana',
    title: 'Frontend Architect, WebWeavers',
    photo: findImage('speaker-3'),
    bio: '',
    socials: { twitter: '#', linkedin: '#' },
  },
  {
    id: '4',
    name: 'Dharma Putra',
    title: 'Mobile Developer, AppWorks',
    photo: findImage('speaker-4'),
    bio: '',
    socials: { twitter: '#', linkedin: '#' },
  },
  {
    id: '5',
    name: 'Eka Lestari',
    title: 'Data Scientist, DataDriven',
    photo: findImage('speaker-5'),
    bio: '',
    socials: { twitter: '#', linkedin: '#' },
  },
  {
    id: '6',
    name: 'Fajar Nugroho',
    title: 'Cybersecurity Analyst, SecureNet',
    photo: findImage('speaker-6'),
    bio: '',
    socials: { twitter: '#', linkedin: '#' },
  },
];

export const schedule = {
  day1: [
    { id: 'd1-1', time: '08:00', title: 'Open Gate', speakerId: '', location: 'Lobby', description: 'Registration and badge collection' },
    { id: 'd1-2', time: '09:00', title: 'Opening', speakerId: '', location: 'Main Stage', description: 'Welcome remarks' },
    { id: 'd1-3', time: '09:30', title: 'Keynote 1', speakerId: '1', location: 'Main Stage', description: '' },
    { id: 'd1-4', time: '10:00', title: 'Session 1', speakerId: '2', location: 'Main Stage', description: '' },
    { id: 'd1-5', time: '10:30', title: 'Coffee Break', speakerId: '', location: 'Lobby', description: 'Networking' },
    { id: 'd1-6', time: '11:00', title: 'Session 2', speakerId: '3', location: 'Room A', description: '' },
    { id: 'd1-7', time: '11:00', title: 'Session 3', speakerId: '4', location: 'Room B', description: '' },
    { id: 'd1-8', time: '12:00', title: 'Lunch Break', speakerId: '', location: 'Lobby', description: 'Lunch and networking' },
    { id: 'd1-9', time: '13:00', title: 'Session 4', speakerId: '5', location: 'Room A', description: '' },
    { id: 'd1-10', time: '13:00', title: 'Session 5', speakerId: '6', location: 'Room B', description: '' },
    { id: 'd1-11', time: '14:00', title: 'Closing', speakerId: '', location: 'Main Stage', description: 'Closing remarks' },
  ],
  day2: [],
};

export const sponsors = {
  platinum: [
    { id: 'p1', name: 'Google', website: 'https://google.com', logo: findImage('sponsor-google') },
  ],
  gold: [
    { id: 'g1', name: 'Dicoding', website: 'https://dicoding.com', logo: findImage('sponsor-dicoding') },
    { id: 'g2', name: 'Dewaweb', website: 'https://dewaweb.com', logo: findImage('sponsor-dewaweb') },
  ],
  silver: [
  ]
};

export const getSpeakerById = (id: string | null) => {
  if (!id) return null;
  return speakers.find(s => s.id === id);
};
