import { TestDB } from "./db/TestDB";

export default async (): Promise<void> => {
  const db = new TestDB();

  await db.dropDB();
};
