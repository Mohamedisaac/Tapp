
export enum Subject {
  Physics = "Physics",
  Math = "Mathematics",
  Biology = "Biology",
}

export interface Term {
  id: string;
  subject: Subject;
  term: string;
  definition: string;
}
