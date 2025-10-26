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
    name: 'Azhar Fuad',
    title: 'Cloud Engineering Lead, TechCorp',
    photo: findImage('speaker-1'),
    bio: '',
    socials: { twitter: '#', linkedin: '#' },
  },
  {
    id: '2',
    name: 'Adhitia (TBD)',
    title: 'AI/ML Researcher, InnoAI',
    photo: findImage('speaker-2'),
    bio: '',
    socials: { twitter: '#', linkedin: '#' },
  },
  {
    id: '3',
    name: 'Cendekia',
    title: 'Frontend Architect, WebWeavers',
    photo: findImage('speaker-3'),
    bio: '',
    socials: { twitter: '#', linkedin: '#' },
  },
  {
    id: '4',
    name: 'Luqman Aljundi',
    title: 'Mobile Developer, AppWorks',
    photo: findImage('speaker-4'),
    bio: '',
    socials: { twitter: '#', linkedin: '#' },
  },
  {
    id: '5',
    name: 'Farah Clara (TBD)',
    title: 'Data Scientist, DataDriven',
    photo: findImage('speaker-5'),
    bio: '',
    socials: { twitter: '#', linkedin: '#' },
  },
  {
    id: '6',
    name: 'TBA',
    title: 'Cybersecurity Analyst, SecureNet',
    photo: findImage('speaker-6'),
    bio: '',
    socials: { twitter: '#', linkedin: '#' },
  },
];

export const schedule = {
  mainHall: [
    { id: 'mh-1', time: '9:15 AM - 9:50 AM', duration: '35 min', title: 'Opening & Keynote', speakerId: '', location: 'Main Hall', description: '' },
    { id: 'mh-2', time: '10:00 AM - 10:35 AM', duration: '35 min', title: 'Techtalk 1: Al di Industri Film', speakerId: '1', location: 'Main Hall', description: '' },
    { id: 'mh-3', time: '10:55 AM - 11:30 AM', duration: '35 min', title: 'Techtalk 2: Persib', speakerId: '2', location: 'Main Hall', description: '' },
    { id: 'mh-4', time: '11:30 AM - 1:00 PM', duration: '1.5 hrs', title: 'LUNCH BREAK', speakerId: '', location: 'Lobby', description: '' },
    { id: 'mh-5', time: '1:00 PM - 1:35 PM', duration: '35 min', title: 'Techtalk 3: Al di PLN', speakerId: '3', location: 'Main Hall', description: '' },
    { id: 'mh-6', time: '1:55 PM - 2:30 PM', duration: '35 min', title: 'Techtalk 4: GCP Billing', speakerId: '4', location: 'Main Hall', description: '' },
    { id: 'mh-7', time: '2:50 PM - 3:25 PM', duration: '35 min', title: 'Techtalk 5: Python', speakerId: '5', location: 'Main Hall', description: '' },
    { id: 'mh-8', time: '3:45 PM - 4:20 PM', duration: '35 min', title: 'Techtalk 6', speakerId: '6', location: 'Main Hall', description: '' },
    { id: 'mh-9', time: '4:40 PM - 4:50 PM', duration: '10 min', title: 'CLOSING', speakerId: '', location: 'Main Hall', description: '' },
  ],
  upperHall: [],
  day1: [],
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
    { id: 's1', name: 'Sponsor 1', website: '#', logo: findImage('sponsor-default-1') },
    { id: 's2', name: 'Sponsor 2', website: '#', logo: findImage('sponsor-default-2') },
    { id: 's3', name: 'Sponsor 3', website: '#', logo: findImage('sponsor-default-3') },
  ]
};

export const getSpeakerById = (id: string | null) => {
  if (!id) return null;
  return speakers.find(s => s.id === id);
};
