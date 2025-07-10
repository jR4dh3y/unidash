import type { Student } from './types';

export const students: Student[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://placehold.co/100x100.png',
    github: 'https://github.com/alice',
    linkedin: 'https://linkedin.com/in/alice',
    totalPoints: 1250,
    pointsLog: [
      { id: 1, date: '2024-07-20', description: 'LeetCode Daily Challenge', points: 50, source: 'LeetCode' },
      { id: 2, date: '2024-07-19', description: 'Workshop Attendance', points: 100, source: 'Google Form' },
      { id: 3, date: '2024-07-18', description: 'Project Contribution', points: 200, source: 'Manual Allocation' },
    ],
  },
  {
    id: '2',
    name: 'Bob Williams',
    avatar: 'https://placehold.co/100x100.png',
    github: 'https://github.com/bob',
    linkedin: 'https://linkedin.com/in/bob',
    totalPoints: 1100,
    pointsLog: [
      { id: 1, date: '2024-07-20', description: 'Technical Quiz Top Scorer', points: 150, source: 'Google Form' },
      { id: 2, date: '2024-07-19', description: 'LeetCode Daily Challenge', points: 50, source: 'LeetCode' },
      { id: 3, date: '2024-07-17', description: 'Mentorship Session', points: 100, source: 'Manual Allocation' },
    ],
  },
  {
    id: '3',
    name: 'Charlie Brown',
    avatar: 'https://placehold.co/100x100.png',
    github: 'https://github.com/charlie',
    linkedin: 'https://linkedin.com/in/charlie',
    totalPoints: 980,
    pointsLog: [
      { id: 1, date: '2024-07-20', description: 'LeetCode Daily Challenge', points: 50, source: 'LeetCode' },
      { id: 2, date: '2024-07-18', description: 'Open Source Contribution', points: 300, source: 'GitHub' },
      { id: 3, date: '2024-07-15', description: 'Hackathon Participation', points: 150, source: 'Google Form' },
    ],
  },
  {
    id: '4',
    name: 'Diana Miller',
    avatar: 'https://placehold.co/100x100.png',
    github: 'https://github.com/diana',
    linkedin: 'https://linkedin.com/in/diana',
    totalPoints: 850,
    pointsLog: [
      { id: 1, date: '2024-07-19', description: 'LeetCode Daily Challenge', points: 50, source: 'LeetCode' },
      { id: 2, date: '2024-07-16', description: 'Coding Competition Runner-up', points: 200, source: 'Manual Allocation' },
    ],
  },
  {
    id: '5',
    name: 'Ethan Garcia',
    avatar: 'https://placehold.co/100x100.png',
    github: 'https://github.com/ethan',
    linkedin: 'https://linkedin.com/in/ethan',
    totalPoints: 720,
    pointsLog: [
      { id: 1, date: '2024-07-20', description: 'LeetCode Daily Challenge', points: 50, source: 'LeetCode' },
      { id: 2, date: '2024-07-19', description: 'Volunteer for Event', points: 70, source: 'Manual Allocation' },
    ],
  },
    {
    id: '6',
    name: 'Fiona Clark',
    avatar: 'https://placehold.co/100x100.png',
    github: 'https://github.com/fiona',
    linkedin: 'https://linkedin.com/in/fiona',
    totalPoints: 1350,
    pointsLog: [
      { id: 1, date: '2024-07-21', description: 'Hackathon Winner', points: 500, source: 'Manual Allocation' },
      { id: 2, date: '2024-07-20', description: 'LeetCode Daily Challenge', points: 50, source: 'LeetCode' },
      { id: 3, date: '2024-07-18', description: 'Article Publication', points: 150, source: 'Google Form' },
    ],
  },
  {
    id: '7',
    name: 'George Hall',
    avatar: 'https://placehold.co/100x100.png',
    github: 'https://github.com/george',
    linkedin: 'https://linkedin.com/in/george',
    totalPoints: 650,
    pointsLog: [
      { id: 1, date: '2024-07-20', description: 'LeetCode Daily Challenge', points: 50, source: 'LeetCode' },
      { id: 2, date: '2024-07-15', description: 'Workshop Host', points: 250, source: 'Manual Allocation' },
    ],
  },
];
