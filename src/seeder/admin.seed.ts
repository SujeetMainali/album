import { AppDataSource } from "../config/database.config";
import { Auth } from "../entities/auth.entity";
import { type IAdmin } from "../interface/admin.interface";
import BcryptHelper from "../helpers/bcrypt.helper";
import { admins } from "../constant/admin";

const AuthRepo = AppDataSource.getRepository(Auth);

async function seedAdmin(admin: IAdmin): Promise<void> {
  try {
    const existingAdmin = await AuthRepo.createQueryBuilder("admin")
      .where("email = :email", { email: admin.email })
      .getOne();
    if (existingAdmin) {
      console.log(`Skipping ${admin.email} admin, already exists`);
      return;
    }
    const newAuth = AuthRepo.create({
      email: admin.email,
      username: admin.username,
      role: admin.role,
      phoneNumber: admin.phoneNumber,
      firstName: admin.firstName,
      middleName: admin.middleName,
      lastName: admin.lastName,
    });

    newAuth.password = await new BcryptHelper().hash(admin.password);

    await AuthRepo.save(newAuth);
    console.log(`Added ${admin.email} admin to database`);
  } catch (error) {
    console.log(`Failed to seed ${admin.email} admin 💣`);
    console.error(error);
  }
}

async function seedAdmins(admins: IAdmin[]): Promise<void> {
  try {
    await AppDataSource.initialize();
    for (const admin of admins) {
      await seedAdmin(admin);
    }
  } catch (error) {
    console.log("Failed to seed admin 💣");
    console.error(error);
  } finally {
    process.exit(0);
  }
}

const args = process.argv[2];
if (!args) {
  console.error("Please provide an argument");
  process.exit(1);
} else if (args === "seed") {
  seedAdmins(admins);
} else {
  console.error("Invalid argument");
  process.exit(1);
}
