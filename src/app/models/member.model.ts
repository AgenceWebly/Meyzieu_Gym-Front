import { EmergencyContact } from "./emergencyContact.model";

export interface Member {
  id: number;
  firstname: string;
  lastname: string;
  birthdate: Date;
  gender: 'male' | 'female';
  school: string;
  isPhotoApproved: boolean;
  isTransportApproved: boolean;
  isFirstAidApproved: boolean;
  isAllowedToLeave: boolean;
  profilePictureUrl: string;
  relationToMember: 'parent|grand-parent|relative|other';
  emergencyContacts: EmergencyContact[];
}