import { Course } from './course.model';
import { Member } from './member.model';

export interface Registration {
  id: number;
  member: Member;
  course: Course;
  registrationFee: number;
  paymentMethod: string;
  paymentStatus: string;
  registrationStatus: string;
  registrationDate: Date;
  healthCertificateFileUrl: string;
  healthCertificateRequired: boolean;
}
