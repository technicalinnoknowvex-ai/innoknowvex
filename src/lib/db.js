import postgres from "postgres";
import boxen from "boxen";
import chalk from "chalk";

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);

async function initDB() {
  try {
    await sql`SELECT 1`; // simple test query
    console.log(
      boxen(chalk.green.bold("DB CONNECTED"), {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "green",
        backgroundColor: "black",
      })
    );
  } catch (error) {
    console.log(
      boxen(chalk.red.bold("DB CONNECTION FAILED"), {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "red",
        backgroundColor: "black",
      })
    );
    console.error(error);
  }
}

initDB();

export default sql;
