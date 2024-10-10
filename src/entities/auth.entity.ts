import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import Base from "./base.entity";
import { Role } from "../constant/enums";

@Entity("auth")
export class Auth extends Base {
  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "middle_name", nullable: true })
  middleName: string;

  @Column({ name: "last_name" })
  lastName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ name: "phone_number", nullable: true })
  phoneNumber: string;

  @Column({
    unique: true,
  })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.ADMIN,
  })
  role: Role;

  @Column({ name: "is_blocked", default: false })
  isBlocked: boolean;

  @Column({ name: "reset_attempts", type: "int", default: 0 })
  resetAttempts: number;

  @Column({
    name: "last_reset_attempt",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  lastResetAttempt: Date;
}
