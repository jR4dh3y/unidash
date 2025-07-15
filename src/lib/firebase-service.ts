


'use server';

import { db } from './firebase-config';
import { collection, getDocs, doc, getDoc, query, orderBy, where, limit, Timestamp, updateDoc, setDoc, addDoc, deleteDoc, increment, arrayUnion } from 'firebase/firestore';
import type { Student, AppEvent, PointLog, Badge } from './types';
import { revalidatePath } from 'next/cache';

const ADMIN_UID = 'IMZ23UOOblMG1Dm6HDF4Hf7UOvK2';

const allBadges: Record<string, Badge> = {
    'first-problem': { id: 'first-problem', name: 'First Blood', description: 'Solved your first problem.', icon: 'Sword' },
    'weekly-streak-1': { id: 'weekly-streak-1', name: 'Streak Starter', description: 'Maintained a 1-week solving streak.', icon: 'Flame' },
    'top-10': { id: 'top-10', name: 'Top 10 Finisher', description: 'Ranked in the Top 10.', icon: 'Trophy' },
    'hard-problem': { id: 'hard-problem', name: 'Brainiac', description: 'Solved a Hard-difficulty problem.', icon: 'BrainCircuit' },
    'event-attendee': { id: 'event-attendee', name: 'Social Butterfly', description: 'Attended a community event.', icon: 'CalendarCheck' },
};


const tempStudents: Student[] = [
    {
        id: 'temp-1',
        name: 'Olivia Chen',
        avatar: 'https://placehold.co/200x200.png',
        github: 'https://github.com/oliviac',
        linkedin: 'https://linkedin.com/in/oliviac',
        totalPoints: 1550,
        pointsLog: [
            { id: 'log-1-1', date: '2024-07-20T10:00:00Z', description: 'Solved LeetCode daily problem', points: 50, source: 'LeetCode' },
            { id: 'log-1-2', date: '2024-07-19T11:00:00Z', description: 'Peer review session', points: 100, source: 'Manual Allocation' },
            { id: 'log-1-3', date: '2024-07-18T15:30:00Z', description: 'Merged PR for new feature', points: 200, source: 'GitHub' },
            { id: 'log-1-4', date: '2024-07-15T09:00:00Z', description: 'Tech talk presentation', points: 500, source: 'Google Form' },
            { id: 'log-1-5', date: '2024-07-10T14:00:00Z', description: 'Won monthly coding challenge', points: 700, source: 'Manual Allocation' }
        ],
        achievements: [allBadges['top-10'], allBadges['hard-problem'], allBadges['weekly-streak-1'], allBadges['event-attendee']],
    },
    {
        id: 'temp-2',
        name: 'Benjamin Carter',
        avatar: 'https://placehold.co/200x200.png',
        totalPoints: 1400,
        pointsLog: [
            { id: 'log-2-1', date: '2024-07-21T10:00:00Z', description: 'Solved LeetCode daily problem', points: 50, source: 'LeetCode' },
            { id: 'log-2-2', date: '2024-07-18T11:00:00Z', description: 'Helped a junior developer', points: 150, source: 'Manual Allocation' },
            { id: 'log-2-3', date: '2024-07-17T15:30:00Z', description: 'Refactored legacy code', points: 250, source: 'GitHub' },
            { id: 'log-2-4', date: '2024-07-16T09:00:00Z', description: 'Workshop attendance', points: 200, source: 'Google Form' },
            { id: 'log-2-5', date: '2024-07-12T14:00:00Z', description: 'Project milestone completion', points: 750, source: 'Manual Allocation' }
        ],
        achievements: [allBadges['top-10'], allBadges['event-attendee'], allBadges['first-problem']],
    },
    {
        id: 'temp-3',
        name: 'Sophia Rodriguez',
        avatar: 'https://placehold.co/200x200.png',
        totalPoints: 1250,
        pointsLog: [
            { id: 'log-3-1', date: '2024-07-22T10:00:00Z', description: 'Solved LeetCode daily problem', points: 50, source: 'LeetCode' },
            { id: 'log-3-2', date: '2024-07-20T11:00:00Z', description: 'Bug fix contribution', points: 100, source: 'GitHub' },
            { id: 'log-3-3', date: '2024-07-19T09:00:00Z', description: 'Quiz completion', points: 300, source: 'Google Form' },
            { id: 'log-3-4', date: '2024-07-14T14:00:00Z', description: 'Hackathon participation', points: 800, source: 'Manual Allocation' }
        ],
        achievements: [allBadges['top-10'], allBadges['first-problem']],
    },
    {
        id: 'temp-4',
        name: 'Liam Goldberg',
        avatar: 'https://placehold.co/200x200.png',
        totalPoints: 1100,
        pointsLog: [
            { id: 'log-4-1', date: '2024-07-19T10:00:00Z', description: 'Solved LeetCode daily problem', points: 50, source: 'LeetCode' },
            { id: 'log-4-2', date: '2024-07-17T11:00:00Z', description: 'Documentation improvements', points: 150, source: 'GitHub' },
            { id: 'log-4-3', date: '2024-07-16T15:30:00Z', description: 'Code challenge submission', points: 400, source: 'Google Form' },
            { id: 'log-4-4', date: '2024-07-11T14:00:00Z', description: 'Side project showcase', points: 500, source: 'Manual Allocation' }
        ],
        achievements: [allBadges['top-10'], allBadges['weekly-streak-1']],
    },
    {
        id: 'temp-5',
        name: 'Ava Nguyen',
        avatar: 'https://placehold.co/200x200.png',
        totalPoints: 950,
        pointsLog: [
            { id: 'log-5-1', date: '2024-07-18T10:00:00Z', description: 'Solved LeetCode daily problem', points: 50, source: 'LeetCode' },
            { id: 'log-5-2', date: '2024-07-15T11:00:00Z', description: 'Created a new component', points: 300, source: 'GitHub' },
            { id: 'log-5-3', date: '2024-07-12T09:00:00Z', description: 'Submitted weekly report', points: 100, source: 'Google Form' },
            { id: 'log-5-4', date: '2024-07-10T14:00:00Z', description: 'Mentorship program participation', points: 500, source: 'Manual Allocation' }
        ],
        achievements: [allBadges['first-problem']],
    },
    {
        id: 'temp-6',
        name: 'Noah Kim',
        avatar: 'https://placehold.co/200x200.png',
        totalPoints: 800,
        pointsLog: [
            { id: 'log-6-1', date: '2024-07-17T10:00:00Z', description: 'Solved LeetCode daily problem', points: 50, source: 'LeetCode' },
            { id: 'log-6-2', date: '2024-07-14T11:00:00Z', description: 'Fixed a critical bug', points: 250, source: 'GitHub' },
            { id: 'log-6-3', date: '2024-07-11T09:00:00Z', description: 'Attended training session', points: 100, source: 'Google Form' },
            { id: 'log-6-4', date: '2024-07-09T14:00:00Z', description: 'Team collaboration award', points: 400, source: 'Manual Allocation' }
        ],
        achievements: [allBadges['event-attendee']],
    }
].sort((a, b) => b.totalPoints - a.totalPoints);


// A helper to get the database instance and handle initialization errors
function getDb() {
    if (!db) {
        throw new Error("Firestore is not initialized. Check your environment variables.");
    }
    return db;
}

export async function createStudent(userId: string, name: string) {
    let firestore;
    try {
        firestore = getDb();
    } catch (e) {
        console.warn("Firestore is not initialized. Skipping student creation.");
        return; 
    }

    if (!userId || !name) {
        throw new Error("User ID and name are required to create a student.");
    }
    try {
        const studentDocRef = doc(firestore, 'students', userId);
        await setDoc(studentDocRef, {
            name: name,
            avatar: `https://placehold.co/200x200.png`,
            totalPoints: 0,
            pointsLog: [],
            achievements: []
        });
        revalidatePath('/'); 
    } catch (error) {
        console.error("Error creating student document:", error);
        throw new Error("Could not create student profile.");
    }
}


export async function getAllStudents(): Promise<Student[]> {
    // --- TEMPORARY DATA ---
    return Promise.resolve(tempStudents);
    // --- END TEMPORARY DATA ---

  let firestore;
  try {
     firestore = getDb();
  } catch(e) {
      console.warn("Firestore is not initialized. Returning empty student list.");
      return [];
  }

  try {
    const studentsCollection = collection(firestore, 'students');
    const q = query(studentsCollection, orderBy('totalPoints', 'desc'));
    const studentSnapshot = await getDocs(q);
    
    if (studentSnapshot.empty) {
      return [];
    }

    const studentList = studentSnapshot.docs.map(doc => {
        const data = doc.data();
        const pointsLog = Array.isArray(data.pointsLog) ? data.pointsLog.map((log: any) => ({
            ...log,
            // Ensure date is always a string
            date: log.date instanceof Timestamp ? log.date.toDate().toISOString() : String(log.date || ''),
        })) : [];

        return { 
            id: doc.id, 
            ...data,
            pointsLog,
            achievements: data.achievements || [],
        } as Student;
    });

    // Exclude admin from leaderboard
    return studentList.filter(student => student.id !== ADMIN_UID);
    
  } catch (error) {
    console.error("Error fetching students from Firestore:", error);
    return [];
  }
}

export async function getStudentById(id: string): Promise<Student | null> {
    // --- TEMPORARY DATA ---
    const student = tempStudents.find(s => s.id === id) || null;
    return Promise.resolve(student);
    // --- END TEMPORARY DATA ---

  const firestore = getDb();

  try {
    const studentDocRef = doc(firestore, 'students', id);
    const studentSnap = await getDoc(studentDocRef);

    if (studentSnap.exists()) {
      const data = studentSnap.data();
      const pointsLog = Array.isArray(data.pointsLog) ? data.pointsLog.map((log: any) => ({
        ...log,
        // Ensure date is always a string
        date: log.date instanceof Timestamp ? log.date.toDate().toISOString() : String(log.date || ''),
      })) : [];

      return { 
        id: studentSnap.id, 
        ...data,
        pointsLog,
        achievements: data.achievements || [],
      } as Student;
    } else {
      console.warn(`Student with id ${id} not found in Firestore.`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching student with id ${id} from Firestore:`, error);
    return null;
  }
}


export async function updateStudentProfile(userId: string, data: { name?: string; github?: string; linkedin?: string; }) {
    const firestore = getDb();

    if (!userId) {
        throw new Error("User ID is required to update profile.");
    }
    
    try {
        const studentDocRef = doc(firestore, 'students', userId);
        await updateDoc(studentDocRef, data);
        
        revalidatePath(`/student/${userId}`);
        revalidatePath('/');
        revalidatePath('/admin');

    } catch (error) {
        console.error("Error updating student profile:", error);
        throw new Error("Could not update profile.");
    }
}

export async function awardPoints(userId: string, points: number, reason: string) {
    const firestore = getDb();

    if (!userId) {
        throw new Error("User ID is required to award points.");
    }

    try {
        const studentDocRef = doc(firestore, 'students', userId);
        const studentSnap = await getDoc(studentDocRef);

        if (!studentSnap.exists()) {
            throw new Error("Student not found.");
        }

        const newLogEntry: Omit<PointLog, 'id'> = {
            date: new Date().toISOString(),
            description: reason,
            points: points,
            source: 'Manual Allocation',
        };

        await updateDoc(studentDocRef, {
            totalPoints: increment(points),
            pointsLog: arrayUnion(newLogEntry)
        });

        revalidatePath(`/student/${userId}`);
        revalidatePath('/');
        revalidatePath('/admin');

    } catch (error) {
        console.error("Error awarding points:", error);
        throw new Error("Could not award points.");
    }
}


export async function getUpcomingEvents(): Promise<AppEvent[]> {
    let firestore;
    try {
        firestore = getDb();
    } catch (e) {
        console.warn("Firestore is not initialized. Returning empty event list.");
        return [];
    }
  
  try {
    const eventsCollection = collection(firestore, 'events');
    const today = new Date();
    const q = query(
      eventsCollection, 
      where('date', '>=', Timestamp.fromDate(today)), 
      orderBy('date', 'asc'),
      limit(5)
    );
    const eventSnapshot = await getDocs(q);

    if (eventSnapshot.empty) {
      return [];
    }

    const eventList = eventSnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
            id: doc.id, 
            ...data,
            date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date,
        } as AppEvent
    });
    return eventList;
  } catch (error) {
    console.error("Error fetching events from Firestore:", error);
    return [];
  }
}

export async function getAllEvents(): Promise<AppEvent[]> {
    let firestore;
    try {
        firestore = getDb();
    } catch (e) {
        console.warn("Firestore is not initialized. Returning empty event list.");
        return [];
    }
  
  try {
    const eventsCollection = collection(firestore, 'events');
    const q = query(eventsCollection, orderBy('date', 'desc'));
    const eventSnapshot = await getDocs(q);

    if (eventSnapshot.empty) {
      return [];
    }

    const eventList = eventSnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
            id: doc.id, 
            ...data,
            date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date,
        } as AppEvent
    });
    return eventList;
  } catch (error) {
    console.error("Error fetching all events from Firestore:", error);
    return [];
  }
}


export async function addEvent(event: Omit<AppEvent, 'id'>) {
    const firestore = getDb();
    try {
        const eventsCollection = collection(firestore, 'events');
        await addDoc(eventsCollection, {
            ...event,
            date: Timestamp.fromDate(new Date(event.date)),
        });
        revalidatePath('/'); // Revalidate home page to show new event
        revalidatePath('/admin');
    } catch (error) {
        console.error("Error adding event:", error);
        throw new Error("Could not add the event.");
    }
}

export async function deleteEvent(eventId: string) {
    const firestore = getDb();
    try {
        const eventDocRef = doc(firestore, 'events', eventId);
        await deleteDoc(eventDocRef);
        revalidatePath('/');
        revalidatePath('/admin');
    } catch (error) {
        console.error("Error deleting event:", error);
        throw new Error("Could not delete the event.");
    }
}
