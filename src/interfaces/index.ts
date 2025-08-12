interface Student {
    id: string;
    lastname: string;
    firstname: string;
    middlename?: string;
    age: number;
    section?: string;
}

export type { Student };