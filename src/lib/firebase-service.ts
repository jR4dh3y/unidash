
'use server';

import { db } from './firebase-config';
import { collection, getDocs, doc, getDoc, query, orderBy, where, limit, Timestamp, updateDoc, setDoc } from 'firebase/firestore';
import type { Student, AppEvent } from './types';
import { revalidatePath } from 'next/cache';

// A helper to get the database instance and handle initialization errors
function getDb() {
    if (!db) {
        // This can happen if the admin credentials are not set up
        console.warn("Firestore is not initialized. Check your environment variables.");
        return null;
    }
    return db;
}


export async function createStudent(userId: string, name: string) {
    const firestore = getDb();
    if (!firestore) return; // Exit if DB is not available

    if (!userId || !name) {
        throw new Error("User ID and name are required to create a student.");
    }
    try {
        const studentDocRef = doc(firestore, 'students', userId);
        await setDoc(studentDocRef, {
            name: name,
            avatar: `https://placehold.co/200x200.png`,
            totalPoints: 0,
            pointsLog: []
        });
        revalidatePath('/'); // Revalidate leaderboard page
    } catch (error) {
        console.error("Error creating student document:", error);
        throw new Error("Could not create student profile.");
    }
}


export async function getAllStudents(): Promise<Student[]> {
  const firestore = getDb();
  if (!firestore) return []; // Return empty array if DB is not available

  try {
    const studentsCollection = collection(firestore, 'students');
    const q = query(studentsCollection, orderBy('totalPoints', 'desc'));
    const studentSnapshot = await getDocs(q);
    
    if (studentSnapshot.empty) {
      console.warn("No students found in the 'students' collection in Firestore.");
      return [];
    }

    const studentList = studentSnapshot.docs.map(doc => {
        const data = doc.data();
        const pointsLog = data.pointsLog ? data.pointsLog.map((log: any) => ({
            ...log,
            // Convert Firestore Timestamp to ISO string if it exists
            date: log.date instanceof Timestamp ? log.date.toDate().toISOString() : log.date,
        })) : [];

        return { 
            id: doc.id, 
            ...data,
            pointsLog,
        } as Student;
    });

    return studentList;
  } catch (error) {
    console.error("Error fetching students from Firestore:", error);
    // In case of error, return an empty array to prevent the app from crashing.
    return [];
  }
}

export async function getStudentById(id: string): Promise<Student | null> {
  const firestore = getDb();
  if (!firestore) return null; // Return null if DB is not available

  try {
    const studentDocRef = doc(firestore, 'students', id);
    const studentSnap = await getDoc(studentDocRef);

    if (studentSnap.exists()) {
      const studentData = studentSnap.data();
      const pointsLog = studentData.pointsLog ? studentData.pointsLog.map((log: any) => ({
        ...log,
        date: log.date instanceof Timestamp ? log.date.toDate().toISOString() : log.date,
      })) : [];

      return { 
        id: studentSnap.id, 
        ...studentData,
        pointsLog
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
    if (!firestore) {
        throw new Error("Firestore is not available.");
    }

    if (!userId) {
        throw new Error("User ID is required to update profile.");
    }
    
    try {
        const studentDocRef = doc(firestore, 'students', userId);
        await updateDoc(studentDocRef, data);
        
        // Revalidate paths to show updated data
        revalidatePath(`/student/${userId}`);
        revalidatePath('/');
        revalidatePath('/profile');

    } catch (error) {
        console.error("Error updating student profile:", error);
        throw new Error("Could not update profile.");
    }
}


export async function getUpcomingEvents(): Promise<AppEvent[]> {
  const firestore = getDb();
  if (!firestore) return []; // Return empty array if DB is not available
  
  try {
    const eventsCollection = collection(firestore, 'events');
    const today = new Date();
    const q = query(
      eventsCollection, 
      where('date', '>=', today), 
      orderBy('date', 'asc'),
      limit(5)
    );
    const eventSnapshot = await getDocs(q);

    if (eventSnapshot.empty) {
      console.log("No upcoming events found.");
      return [];
    }

    const eventList = eventSnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
            id: doc.id, 
            ...data,
            // Convert Firestore Timestamp to ISO string
            date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date,
        } as AppEvent
    });
    return eventList;
  } catch (error) {
    console.error("Error fetching events from Firestore:", error);
    return [];
  }
}
