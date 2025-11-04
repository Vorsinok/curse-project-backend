import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, 
    },
  },
  logging: false,
});
try {
  await sequelize.authenticate();
  console.log("Connected to PostgreSQL (Neon)");
} catch (error) {
  console.error("Database connection failed:", error);
}

export default sequelize;
