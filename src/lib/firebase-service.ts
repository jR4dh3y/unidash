'use server';

import { db } from './firebase-config';
import { collection, getDocs, doc, getDoc, query, orderBy, where, limit } from 'firebase/firestore';
import type { Student, AppEvent } from './types';

export async function getAllStudents(): Promise<Student[]> {
  try {
    const studentsCollection = collection(db, 'students');
    const q = query(studentsCollection, orderBy('totalPoints', 'desc'));
    const studentSnapshot = await getDocs(q);
    
    if (studentSnapshot.empty) {
      console.warn("No students found in the 'students' collection in Firestore.");
      return [];
    }

    const studentList = studentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
    return studentList;
  } catch (error) {
    console.error("Error fetching students from Firestore:", error);
    // In case of error, return an empty array to prevent the app from crashing.
    return [];
  }
}

export async function getStudentById(id: string): Promise<Student | null> {
  try {
    const studentDocRef = doc(db, 'students', id);
    const studentSnap = await getDoc(studentDocRef);

    if (studentSnap.exists()) {
      const studentData = studentSnap.data();
      const pointsLog = studentData.pointsLog ? studentData.pointsLog.map((log: any) => ({
        ...log,
        date: new Date(log.date).toISOString(),
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

export async function getUpcomingEvents(): Promise<AppEvent[]> {
  try {
    const eventsCollection = collection(db, 'events');
    const today = new Date().toISOString();
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

    const eventList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppEvent));
    return eventList;
  } catch (error) {
    console.error("Error fetching events from Firestore:", error);
    return [];
  }
}
