import { FieldValue, Timestamp } from "firebase/firestore";

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
  subjectIds: string[]; // array of Subject IDs
  adviserId?: string; // reference to LMSUser
}

// Subject
interface Subject {
  id: string;
  name: string;
  track: string;
  semester: string;
  teacherIds: string[]; // array of Teacher IDs
}

interface TeacherSubject {
  id: string;
  teacherSubjectId: string;

  WW1_First: number;
  WW2_First: number;
  WW3_First: number;
  WW4_First: number;
  WW5_First: number;
  WW6_First: number;
  WW7_First: number;
  WW8_First: number;
  WW9_First: number;
  WW10_First: number;
  
  WW1_Second: number;
  WW2_Second: number;
  WW3_Second: number;
  WW4_Second: number;
  WW5_Second: number;
  WW6_Second: number;
  WW7_Second: number;
  WW8_Second: number;
  WW9_Second: number;
  WW10_Second: number;

  PT1_First: number;
  PT2_First: number;
  PT3_First: number;
  PT4_First: number;
  PT5_First: number;
  PT6_First: number;
  PT7_First: number;
  PT8_First: number;
  PT9_First: number;
  PT10_First: number;

  PT1_Second: number;
  PT2_Second: number;
  PT3_Second: number;
  PT4_Second: number;
  PT5_Second: number;
  PT6_Second: number;
  PT7_Second: number;
  PT8_Second: number;
  PT9_Second: number;
  PT10_Second: number;

  Exam_First: number;
  Exam_Second: number;
}

interface SectionSubject {
  subjectTeacherId: string;
  sectionId: string;
  sectionName: string;
}

interface SectionSubjectWrite extends SectionSubject {
  assignedAt: FieldValue; // for serverTimestamp()
}

interface SectionSubjectRead extends SectionSubject {  
  assignedAt: Timestamp; // what Firestore actually stores
}

// Score
interface Score {
  id: string;
  studentId: string;
  studentLastName: string;
  studentFirstName: string;
  studentGender: string;

  subjectId: string;
  subjectName: string;
  subjectTrack: string;

  sectionId: string;
  sectionName: string;

  teacherSubjectId: string;

  semester: string;

  WW1_First: number;
  WW2_First: number;
  WW3_First: number;
  WW4_First: number;
  WW5_First: number;
  WW6_First: number;
  WW7_First: number;
  WW8_First: number;
  WW9_First: number;
  WW10_First: number;
  
  WW1_Second: number;
  WW2_Second: number;
  WW3_Second: number;
  WW4_Second: number;
  WW5_Second: number;
  WW6_Second: number;
  WW7_Second: number;
  WW8_Second: number;
  WW9_Second: number;
  WW10_Second: number;

  PT1_First: number;
  PT2_First: number;
  PT3_First: number;
  PT4_First: number;
  PT5_First: number;
  PT6_First: number;
  PT7_First: number;
  PT8_First: number;
  PT9_First: number;
  PT10_First: number;

  PT1_Second: number;
  PT2_Second: number;
  PT3_Second: number;
  PT4_Second: number;
  PT5_Second: number;
  PT6_Second: number;
  PT7_Second: number;
  PT8_Second: number;
  PT9_Second: number;
  PT10_Second: number;

  Exam_First: number;
  Exam_Second: number;
  
  Initial_Grade: number;
  Final_Grade: number;
}

interface InitalScoreDetails{
  studentId: string;
  studentLastName: string;
  studentFirstName: string;
  studentGender: string;

  subjectId: string;
  subjectName: string;

  sectionId: string;
  sectionName: string;

  teacherSubjectId: string;

  semester: string;
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
  SectionSubjectRead, 
  SectionSubjectWrite,
  Score, 
  SelectOptions, 
  Role, 
  StudentExtraField,
  InitalScoreDetails
 };