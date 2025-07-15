

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Icon name from lucide-react or an SVG string
}

export interface PointLog {
  id?: string;
  date: string;
  description: string;
  points: number;
  source: 'LeetCode' | 'Google Form' | 'Manual Allocation' | 'GitHub';
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  github?: string;
  linkedin?: string;
  totalPoints: number;
  pointsLog: PointLog[];
  achievements?: Badge[];
}

export interface AppEvent {
  id: string;
  title: string;
  date: string; // ISO string format
  description: string;
  location?: string;
  link?: string;
}

export interface LeetCodeQuestion {
    acRate: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    frontendQuestionId: string;
    title: string;
    titleSlug: string;
    paidOnly: boolean;
    topicTags: { name: string; slug: string }[];
}

export interface LeetCodeDailyProblem {
    date: string;
    link: string;
    question: LeetCodeQuestion;
}
