import chalk from "chalk";
import { DotenvConfig } from "../config/env.config";
import { Logger } from "../config/logger.config";
import { EnvironmentModes } from "../constant/enums";

const log = console.log;

class Print {
  static error(message: string): void {
    if (DotenvConfig.NODE_ENV === EnvironmentModes.DEVELOPMENT)
      log(chalk.red("ERROR: ", message));
    else Logger.error(message);
  }

  static info(message: string): void {
    if (DotenvConfig.NODE_ENV === EnvironmentModes.DEVELOPMENT)
      log(chalk.green("INFO: ", message));
    else Logger.info(message);
  }

  static warn(message: string): void {
    if (DotenvConfig.NODE_ENV === EnvironmentModes.DEVELOPMENT)
      log(chalk.bgRed("WARNING: ", message));
    else Logger.warn(message);
  }

  static debug(message: any): void {
    if (DotenvConfig.NODE_ENV === EnvironmentModes.DEVELOPMENT)
      log(chalk.blue("DEBUG: ", message));
    else Logger.debug(message);
  }
}

export default Print;
