export interface PointLog {
  id: number;
  date: string;
  description: string;
  points: number;
  source: 'LeetCode' | 'Google Form' | 'Manual Allocation' | 'GitHub';
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  github: string;
  linkedin: string;
  totalPoints: number;
  pointsLog: PointLog[];
}
