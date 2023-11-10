import { Entity } from "redis-om";

export interface Classroom extends Entity {
  classNum: number;
  courseSet: string;
  camera: string;
  courseName: string;
  comment: string;
  time: string;
  completed: boolean;
}

export interface Task extends Entity {
  taskNum: number;
  courseSet: string;
  description: string;
  time: string;
  completed: boolean;
}

export type FilterFunction =
  | "eq"
  | "equal"
  | "equals"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "between";

export type PolarWord = "does" | "not";

export type LogicOperation = "and" | "or";
