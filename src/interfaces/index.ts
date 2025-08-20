interface Student {
    id: string;
    lastname: string;
    firstname: string;
    middlename?: string;
    age: number;
    gender: string;
    section?: string;
    grade?: string;
}

interface Section {
    id: string;
    name: string;
    grade: number;
}

interface SelectOptions {
  label: string;
  value: string;
}

export type { Student, Section, SelectOptions };