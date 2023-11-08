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
