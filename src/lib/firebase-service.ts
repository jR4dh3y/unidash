

'use server';

import { db } from './firebase-config';
import { collection, getDocs, doc, getDoc, query, orderBy, where, limit, Timestamp, updateDoc, setDoc, addDoc, deleteDoc, increment, arrayUnion } from 'firebase/firestore';
import type { Student, AppEvent, PointLog, Badge } from './types';
import { revalidatePath } from 'next/cache';

const ADMIN_UID = 'IMZ23UOOblMG1Dm6HDF4Hf7UOvK2';

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
