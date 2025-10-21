interface Teacher {
    id: string;
    verified: boolean;
    lastName: string;
    firstName: string;
    email: string;
    username: string;
    role: string;
    middleName?: string;
    contactNumber?: string;
    age?: number;
    gender?: string;
}

// Student
interface Student {
  id: string;
  lastName: string;
  firstName: string;
  middleName: string;
  gender: string; // or string if you want more flexibility
  age?: number;
  birthDate?: string; // store as ISO string or Firestore Timestamp
  address?: string;
  sectionId?: string; // reference to Section
  extraFields?: StudentExtraField[];
}

// Extra fields for students
interface StudentExtraField {
  id: string;
  fieldName: string;
  fieldValue: string;
}

// Section
interface Section {
  id: string;
  name: string;
  strand: string;
  yearLevel: number;
  adviserId?: string; // reference to LMSUser
  studentIds?: string[]; // array of Student IDs
}

// Subject
interface Subject {
  id: string;
  name: string;
  track: string;
}

// TeacherSubject (link between teacher and subject)
interface TeacherSubject {
  id: string;
  teacherId: string; // LMSUser UID
  subjectId: string;
}

// TeacherSubjectSection (link between TeacherSubject and Section)
interface TeacherSubjectSection {
  teacherSubjectId: string;
  sectionId: string;
  subjectId: string;
}

// Score
interface Score {
  id: string;
  studentId: string;
  teacherSubjectId: string;

  // Written Works
  WW1_First?: number;
  WW2_First?: number;
  // ... up to WW10_First

  // Performance Tasks
  PT1_First?: number;
  PT2_First?: number;
  // ... up to PT10_First

  // Exams
  Exam_First?: number;
  Exam_Second?: number;

  // Final Grades
  FinalGrade_First?: number;
  FinalGrade_Second?: number;
}

interface SelectOptions {
  label: string;
  value: string;
}

type Role = 'admin' | 'headteacher' | 'teacher';

export type { 
  Teacher, 
  Student, 
  Section, 
  Subject, 
  TeacherSubject, 
  TeacherSubjectSection, 
  Score, 
  SelectOptions, 
  Role, 
  StudentExtraField
 };