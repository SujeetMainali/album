import { Role } from "../constant/enums";

export interface IAdmin {
  email: string;
  phoneNumber: string;
  username: string;
  password: string;
  role: Role;
  firstName: string;
  middleName: string;
  lastName: string;
}
