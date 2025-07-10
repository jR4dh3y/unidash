import { db } from './firebase-config';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import type { Student } from './types';

const isFirebaseConfigured = () => {
    // This is a simple check. A more robust check might be needed for production.
    return process.env.NEXT_PUBLIC_PROJECT_ID && process.env.NEXT_PUBLIC_PROJECT_ID !== 'YOUR_PROJECT_ID';
};

export async function getAllStudents(): Promise<Student[]> {
  if (!isFirebaseConfigured()) {
    console.error("Firebase is not configured. Please check your .env.local file.");
    return [];
  }
  try {
    const studentsCollection = collection(db, 'students');
    const q = query(studentsCollection, orderBy('totalPoints', 'desc'));
    const studentSnapshot = await getDocs(q);
    const studentList = studentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
    return studentList;
  } catch (error) {
    console.error("Error fetching students from Firestore:", error);
    return [];
  }
}

export async function getStudentById(id: string): Promise<Student | null> {
    if (!isFirebaseConfigured()) {
        console.error("Firebase is not configured. Please check your .env.local file.");
        return null;
    }
  try {
    const studentDocRef = doc(db, 'students', id);
    const studentSnap = await getDoc(studentDocRef);

    if (studentSnap.exists()) {
      return { id: studentSnap.id, ...studentSnap.data() } as Student;
    } else {
      console.error(`Student with id ${id} not found in Firestore.`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching student with id ${id} from Firestore:`, error);
    return null;
  }
}
