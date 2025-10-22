import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string): ImagePlaceholder => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    // Fallback image if not found
    return {
      id: 'fallback',
      imageUrl: 'https://picsum.photos/seed/fallback/600/400',
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
    bio: 'Aria is a seasoned cloud engineer with over a decade of experience in building scalable and resilient infrastructure. She is passionate about DevOps culture and serverless technologies.',
    socials: {
      twitter: 'https://twitter.com/ariawijaya',
      linkedin: 'https://linkedin.com/in/ariawijaya',
    },
  },
  {
    id: '2',
    name: 'Bima Satria',
    title: 'AI/ML Researcher, InnoAI',
    photo: findImage('speaker-2'),
    bio: 'Bima is at the forefront of artificial intelligence research, with a focus on natural language processing and computer vision. His work has been published in numerous academic journals.',
    socials: {
      twitter: 'https://twitter.com/bimasatria',
      linkedin: 'https://linkedin.com/in/bimasatria',
    },
  },
  {
    id: '3',
    name: 'Citra Kirana',
    title: 'Frontend Architect, WebWeavers',
    photo: findImage('speaker-3'),
    bio: 'Citra is a JavaScript enthusiast and an advocate for accessible web design. She specializes in modern frontend frameworks and performance optimization.',
    socials: {
      twitter: 'https://twitter.com/citrakirana',
      linkedin: 'https://linkedin.com/in/citrakirana',
    },
  },
  {
    id: '4',
    name: 'Dharma Putra',
    title: 'Mobile Developer, AppWorks',
    photo: findImage('speaker-4'),
    bio: 'Dharma builds beautiful and performant mobile applications for both Android and iOS. He has a keen eye for UI/UX and loves exploring cross-platform development.',
    socials: {
      twitter: 'https://twitter.com/dharmaputra',
      linkedin: 'https://linkedin.com/in/dharmaputra',
    },
  },
  {
    id: '5',
    name: 'Eka Lestari',
    title: 'Data Scientist, DataDriven',
    photo: findImage('speaker-5'),
    bio: 'Eka transforms complex datasets into actionable insights. Her expertise lies in predictive modeling, data visualization, and machine learning pipelines.',
    socials: {
      twitter: 'https://twitter.com/ekalestari',
      linkedin: 'https://linkedin.com/in/ekalestari',
    },
  },
  {
    id: '6',
    name: 'Fajar Nugroho',
    title: 'Cybersecurity Analyst, SecureNet',
    photo: findImage('speaker-6'),
    bio: 'Fajar is dedicated to making the digital world a safer place. He specializes in ethical hacking, threat intelligence, and secure software development practices.',
    socials: {
      twitter: 'https://twitter.com/fajarnugroho',
      linkedin: 'https://linkedin.com/in/fajarnugroho',
    },
  },
];

export const schedule = {
  day1: [
    { id: 'd1-1', time: '09:00 - 09:45', title: 'Keynote: The Next Decade of Technology', speakerId: '1', location: 'Main Stage', description: 'Join us for an inspiring keynote address on the future of technology and its impact on our lives. Learn about upcoming trends and how to prepare for them.', audience: 'All', objectives: ['Understand future tech trends', 'Gain inspiration for innovation'] },
    { id: 'd1-2', time: '10:00 - 10:45', title: 'Deep Dive into Serverless Architectures', speakerId: '1', location: 'Room A', description: 'Explore the benefits and challenges of serverless computing. This session will cover best practices for designing, deploying, and managing serverless applications.', audience: 'Backend Developers, DevOps', objectives: ['Learn serverless design patterns', 'Understand cost optimization techniques'] },
    { id: 'd1-3', time: '10:00 - 10:45', title: 'The Art of Component-Based UI', speakerId: '3', location: 'Room B', description: 'Discover how to build maintainable and scalable user interfaces using a component-based approach. We will cover principles of design systems and component libraries.', audience: 'Frontend Developers, UI/UX Designers', objectives: ['Master component-based architecture', 'Learn to build a simple design system'] },
    { id: 'd1-4', time: '11:00 - 11:45', title: 'AI for Everyone: Practical Applications', speakerId: '2', location: 'Main Stage', description: 'This session demystifies AI and showcases real-world applications that you can implement today. No advanced math degree required!', audience: 'All', objectives: ['Grasp core AI concepts', 'Discover practical AI tools and services'] },
    { id: 'd1-5', time: '11:00 - 11:45', title: 'Building Secure Mobile Apps', speakerId: '4', location: 'Room C', description: 'Learn the fundamentals of mobile application security. We will cover common vulnerabilities and how to defend against them on both iOS and Android platforms.', audience: 'Mobile Developers', objectives: ['Identify common mobile security threats', 'Implement secure coding practices'] },
    { id: 'd1-6', time: '12:00 - 13:00', title: 'Lunch Break', location: 'Exhibition Hall', description: 'Enjoy lunch and network with fellow attendees.', audience: 'All', objectives: [] },
    { id: 'd1-7', time: '13:00 - 13:45', title: 'Data Storytelling: From Numbers to Narratives', speakerId: '5', location: 'Main Stage', description: 'Learn how to effectively communicate insights from data through compelling visualizations and narratives.', audience: 'Data Analysts, Product Managers', objectives: ['Learn data visualization principles', 'Craft compelling narratives with data'] },
    { id: 'd1-8', time: '14:00 - 14:45', title: 'Penetration Testing 101', speakerId: '6', location: 'Room A', description: 'Step into the shoes of a hacker to find and fix vulnerabilities in your systems.', audience: 'Developers, Security Enthusiasts', objectives: ['Understand the penetration testing lifecycle', 'Learn to use basic security tools'] },
    { id: 'd1-9', time: '15:00 - 15:45', title: 'Closing Ceremony & Awards', speakerId: '1', location: 'Main Stage', description: 'Join us as we wrap up an amazing conference. We will announce hackathon winners, give away prizes, and share closing thoughts.', audience: 'All', objectives: ['Celebrate achievements', 'Network with fellow attendees'] },
  ],
  day2: [],
};

export const sponsors = {
  platinum: [
    { id: 'p1', name: 'TechGiant Inc.', logo: findImage('sponsor-1') },
  ],
  gold: [
    { id: 'g1', name: 'Innovate Solutions', logo: findImage('sponsor-2') },
    { id: 'g2', name: 'CodeCrafters', logo: findImage('sponsor-3') },
  ],
  silver: [
    { id: 's1', name: 'DevTools Co.', logo: findImage('sponsor-4') },
  ]
};

export const getSpeakerById = (id: string) => speakers.find(s => s.id === id);
