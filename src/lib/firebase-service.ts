'use server';

import { db } from './firebase-config';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import type { Student } from './types';

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
      return { id: studentSnap.id, ...studentData } as Student;
    } else {
      console.warn(`Student with id ${id} not found in Firestore.`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching student with id ${id} from Firestore:`, error);
    return null;
  }
}
