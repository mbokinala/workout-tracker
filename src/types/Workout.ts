import { Exercise } from "./Exercise";

export type Workout = {
  id: string;
  name: string;
  exercises: Exercise[];
  timestamp: number;
};
