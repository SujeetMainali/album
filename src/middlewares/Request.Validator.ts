import { plainToClass, type ClassConstructor } from "class-transformer";
import { validate, type ValidationError } from "class-validator";
import { type NextFunction, type Request, type Response } from "express";
import HttpException from "../helpers/HttpException.helper";

// * to get the nested object error
const getValidationMessage = (errors: ValidationError[], message: string[]) => {
  errors.forEach((err) => {
    if (err.children && err.children?.length > 0) {
      getValidationMessage(err.children, message);
    } else {
      if (err.constraints) {
        Object.values(err.constraints).forEach((value) => {
          message.push(value);
        });
      }
    }
  });
};

export default class RequestValidator {
  static validate = <T extends object>(classInstance: ClassConstructor<T>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      // *Convert body to class instance
      const convertedObject = plainToClass(classInstance, req.body);
      // *Validate the class instance
      const validationMessages: string[] = [];
      const errors = await validate(convertedObject, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length !== 0) {
        // *Sanitize the error
        getValidationMessage(errors, validationMessages);
        // Always send first validation message to the frontend
        next(HttpException.forbidden(validationMessages[0]));
      }
      next();
    };
  };
}
