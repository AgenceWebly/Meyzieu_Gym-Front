import { Member } from "./member.model";

export interface User {
  id: number;
  lastname: string;
  firstname: string;
  address: string;
  phoneNumber: string | null;
  email: string;
  occupation: string | null;
  roles: string[];
  members: Member[];
  ribUrl: string | null;
}
