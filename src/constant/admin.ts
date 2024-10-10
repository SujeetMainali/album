import { IAdmin } from "../interface/admin.interface";
import { Role } from "./enums";
export const admins: IAdmin[] = [
  {
    email: "sudoadmin@gmail.com",
    username: "Sudo_Admin",
    phoneNumber: "9864837565",
    password: "Admin@123",
    role: Role.ADMIN,
    firstName: "Information Care",
    middleName: "Pvt.",
    lastName: "Ltd.",
  },
];
