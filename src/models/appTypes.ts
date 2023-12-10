import { Request } from "express";
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

export interface User extends Entity {
  firstName: "string";
  lastName: "string";
  email: "string";
  password: "string";
  role: Roles;
}

export interface AppRequest extends Request {
  user: User;
}

export type Roles = "user" | "manager";

export type FilterFunction =
  | "eq"
  | "equal"
  | "equals"
  | "equalTo"
  | "match"
  | "matches"
  | "matchExact"
  | "matchExactly"
  | "matchesExactly"
  | "true"
  | "false"
  | "gt"
  | "greaterThan"
  | "gte"
  | "greaterThanOrEqualTo"
  | "lt"
  | "lessThan"
  | "lte"
  | "lessThanOrEqualTo"
  | "between"
  | "contain"
  | "contains"
  | "containOneOf"
  | "containsOneOf"
  | "inCircle"
  | "inRadius"
  | "on"
  | "before"
  | "after"
  | "onOrBefore"
  | "onOrAfter";

export type PolarWord = "does" | "not";

export type LogicOperation = "and" | "or";
