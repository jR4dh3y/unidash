import { db } from './firebase-config';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import type { Student } from './types';
import { students as fallbackStudents } from './data';

const isFirebaseConfigured = () => {
    return process.env.NEXT_PUBLIC_API_KEY && process.env.NEXT_PUBLIC_API_KEY !== 'YOUR_API_KEY';
};

export async function getAllStudents(): Promise<Student[]> {
  try {
    const studentsCollection = collection(db, 'students');
    const q = query(studentsCollection, orderBy('totalPoints', 'desc'));
    const studentSnapshot = await getDocs(q);
    const studentList = studentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
    
    // If firestore returns no students, it might not be seeded yet.
    if(studentList.length === 0){
        console.warn("Firestore returned no students. Using fallback data. Make sure you have seeded your database.")
        return [...fallbackStudents].sort((a,b) => b.totalPoints - a.totalPoints);
    }
    
    return studentList;
  } catch (error) {
    console.error("Error fetching students from Firestore:", error);
    console.warn("Falling back to local data due to Firestore error.");
    return [...fallbackStudents].sort((a,b) => b.totalPoints - a.totalPoints);
  }
}

export async function getStudentById(id: string): Promise<Student | null> {
  try {
    const studentDocRef = doc(db, 'students', id);
    const studentSnap = await getDoc(studentDocRef);

    if (studentSnap.exists()) {
      return { id: studentSnap.id, ...studentSnap.data() } as Student;
    } else {
      console.warn(`Student with id ${id} not found in Firestore. Trying fallback.`);
      const fallbackStudent = fallbackStudents.find(s => s.id === id);
      if (fallbackStudent) return fallbackStudent;
      
      console.error(`Student with id ${id} not found.`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching student with id ${id} from Firestore:`, error);
    console.warn("Falling back to local data due to Firestore error.");
    const fallbackStudent = fallbackStudents.find(s => s.id === id);
    return fallbackStudent || null;
  }
}
