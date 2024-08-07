import { EmergencyContact } from './emergencyContact.model';
import { Registration } from './registration.model';

export interface Member {
  id: number;
  firstname: string;
  lastname: string;
  birthdate: Date;
  gender: 'male' | 'female';
  school: string;
  photoApproved: boolean;
  transportApproved: boolean;
  firstAidApproved: boolean;
  allowedToLeave: boolean;
  profilePictureUrl: string;
  relationToMember: 'father|mother|relative';
  emergencyContacts: EmergencyContact[];
  registrations: Registration[];
  registrationStatus: string;
  registrationId: number;
  guardians: any;
}
