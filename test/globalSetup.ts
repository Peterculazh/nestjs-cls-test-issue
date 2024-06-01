import * as dotenv from "dotenv";
import { TestDB } from "./db/TestDB";
import * as path from "path";

export default async (): Promise<void> => {
  dotenv.config({ path: path.resolve(__dirname, "../.env.test.local") });
  const db = new TestDB();
  // dropping DB in case of already existing
  await db.dropDB();

  await db.createDB();

  await db.runMigration(false);
};
