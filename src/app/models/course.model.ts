import { Program } from "./program.model";
import { Season } from "./season.model";

export interface Course {
  id: number;
  program: Program;
  season: Season;
  registrationStartDate: Date;
  registrationEndDate: Date;
  price: number;
  maxMembers: number;
  minAge: number;
  maxAge: number;
}