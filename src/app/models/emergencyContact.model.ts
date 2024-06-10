export interface EmergencyContact {
  firstname: string;
  lastname: string;
  relationToMember: 'parent|grand-parent|relative|other';
  phoneNumber: string;
}