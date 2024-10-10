import { AppDataSource } from "../config/database.config";
import { Message } from "../constant/messages";
// import { type ResetPasswordDTO, type UpdatePasswordDTO } from "../dto/auth.dto";
import { Auth } from "../entities/auth.entity";
import BcryptHelper from "./../helpers/bcrypt.helper";
import HttpException from "../helpers/HttpException.helper";
import { RegisterUserDTO } from "../dtos/auth.dto";
import { generateUserName } from "../helpers/userName.helper";
class AuthService {
  constructor(
    public readonly authRepo = AppDataSource.getRepository(Auth),
    public readonly bcryptService = new BcryptHelper()
  ) {}

  async register(data: RegisterUserDTO): Promise<string> {
    const { email, password, phoneNumber, firstName, middleName, lastName } =
      data;
    const isEmailExist = await this.isEmailExist(email);
    const isPhoneNumberExist = await this.isPhoneNumberExist(phoneNumber);
    if (isEmailExist || isPhoneNumberExist)
      throw HttpException.conflict(Message.userExists);
    const userName = generateUserName(firstName);
    const hashedPassword = await this.bcryptService.hash(password);
    const auth = this.authRepo.create({
      email,
      password: hashedPassword,
      phoneNumber,
      username: userName,
      firstName,
      middleName,
      lastName,
    });
    await this.authRepo.save(auth);
    return "Registered successfully";
  }

  async login(data: { username: string; password: string }): Promise<Auth> {
    const auth = await this.authRepo
      .createQueryBuilder("auth")
      .where(
        "auth.username = :username OR auth.email = :email OR auth.phoneNumber = :phoneNumber",
        {
          username: data.username,
          email: data.username,
          phoneNumber: data.username,
        }
      )
      .select([
        "auth.id",
        "auth.username",
        "auth.email",
        "auth.password",
        "auth.role",
      ])
      .getOne();

    if (!auth) throw HttpException.notFound(Message.invalidCredentials);
    const isPasswordMatched = await this.bcryptService.compare(
      data.password,
      auth.password
    );
    if (!isPasswordMatched)
      throw HttpException.notFound(Message.invalidCredentials);
    return auth;
  }

  async myInfo(id: string): Promise<Auth> {
    const query = this.authRepo
      .createQueryBuilder("auth")
      .where("auth.id = :id", { id })
      .select([
        "auth.id",
        "auth.email",
        "auth.username",
        "auth.role",
        "auth.phoneNumber",
      ]);
    const auth = await query.getOne();

    if (!auth) throw HttpException.notFound(Message.notFound);

    return auth;
  }

  async getById(id: string): Promise<Auth> {
    const auth = await this.authRepo
      .createQueryBuilder("auth")
      .where("auth.id = :id", { id })
      .select([
        "auth.id",
        "auth.email",
        "auth.username",
        "auth.allowedFeature",
        "auth.role",
      ])

      .getOne();

    if (!auth) throw HttpException.notFound(Message.notFound);
    return auth;
  }

  async isEmailExist(email: string): Promise<boolean> {
    const auth = await this.authRepo.findOne({
      where: { email },
    });
    return !!auth;
  }

  async isUsernameExist(username: string): Promise<boolean> {
    const auth = await this.authRepo.findOne({
      where: { username },
    });
    return !!auth;
  }

  async isPhoneNumberExist(phoneNumber: string): Promise<boolean> {
    const auth = await this.authRepo.findOne({
      where: { phoneNumber },
    });
    return !!auth;
  }
}

export default AuthService;
