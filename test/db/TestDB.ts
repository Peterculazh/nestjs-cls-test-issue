import { exec } from "child_process";
import { Client } from "pg";

export class TestDB {
  private databaseUrl: string;
  private dbName: string;

  constructor() {
    this.databaseUrl = process.env.TEST_DB_URL!;
    if (!this.databaseUrl) {
      throw new Error("TEST_DB_URL not set in environment variables");
    }
    this.dbName = process.env.DATABASE_NAME!;
  }

  public async createDB(silent?: boolean) {
    const client = new Client({
      connectionString: this.databaseUrl,
    });

    try {
      await client.connect();
      await client.query(`CREATE DATABASE ${this.dbName}`);
      if (!!silent) {
        console.log(`Database ${this.dbName} created`);
      }
    } catch (error) {
      console.error("Error creating database:", error);
      throw error;
    } finally {
      await client.end();
    }
  }

  public async dropDB(silent?: boolean) {
    const client = new Client({
      connectionString: this.databaseUrl,
    });

    try {
      await client.connect();
      await client.query(`DROP DATABASE IF EXISTS ${this.dbName}`);
      if (!!silent) {
        console.log(`Database ${this.dbName} dropped`);
      }
    } catch (error) {
      console.error("Error dropping database:", error);
      throw error;
    } finally {
      await client.end();
    }
  }

  public async runMigration(silent?: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      exec("npx prisma migrate deploy", (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          reject(error);
          return;
        }
        if (stderr) {
          console.error(`Stderr: ${stderr}`);
          reject(new Error(stderr));
          return;
        }
        if (!!silent) {
          console.log(`Stdout: ${stdout}`);
        }
        resolve();
      });
    });
  }

  public async initializeDB(silent?: boolean): Promise<void> {
    await this.dropDB();
    await this.createDB();
    await this.runMigration(silent);
  }
}
