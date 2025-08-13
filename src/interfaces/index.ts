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

export type { Student };