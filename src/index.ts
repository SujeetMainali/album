import { createServer } from "http";
import app from "./config/app.config";
import { AppDataSource } from "./config/database.config";
import { DotenvConfig } from "./config/env.config";
import Print from "./helpers/print.helper";

function listen() {
  const PORT = DotenvConfig.PORT;
  const httpServer = createServer(app);
  httpServer.listen(PORT);
  Print.info(`🚀 Server is listening on port ${DotenvConfig.PORT}`);
}

AppDataSource.initialize()
  .then(async () => {
    Print.info(`🚀 Database successfully connected`);
    listen(); // Start the server
  })
  .catch((err) => {
    Print.error(`❌ Database connection failure - ${err?.message}`);
  });
