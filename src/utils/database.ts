import mongoose from "mongoose";
import logger from "./logger";

export async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    logger.info("Connect to database");
  } catch (e) {
    logger.error(e, "Failed to connect to database. Goodbye");
    process.exit(1);
  }
}

export async function disconnectFromDatabase() {
  await mongoose.connection.close();

  logger.info("Disconnect from database");

  return;
}
