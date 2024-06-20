import { Program } from './program.model';
import { Season } from './season.model';
import { TrainingSlot } from './trainingSlot';

export interface Course {
  id: number;
  courseName: string;
  program: Program;
  season: Season;
  trainingSlots: TrainingSlot[];
  registrationStartDate: Date;
  registrationEndDate: Date;
  price: number;
  maxMembers: number;
  minAge: number;
  maxAge: number;
  remainingSlots: number;
}
