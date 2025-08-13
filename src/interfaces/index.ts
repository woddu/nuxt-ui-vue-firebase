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

export type { Student, Section };