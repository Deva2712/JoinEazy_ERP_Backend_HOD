import { Sequelize } from "sequelize";
import logger from "../utils/logger.js";

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT || 5432,
    dialect: process.env.DATABASE_DIALECT || "postgres",
    logging: (msg) => logger.debug(msg),
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: process.env.NODE_ENV === "production"
        ? { require: true, rejectUnauthorized: false }
        : false,
    },
  }
);

export const connectDB = async () => {
  await sequelize.authenticate();
  logger.info("PostgreSQL connected via Sequelize");
  if (process.env.NODE_ENV === "development") {
    try {
      await sequelize.query(`
        ALTER TABLE cohort_assignments 
        ALTER COLUMN marks DROP DEFAULT,
        ALTER COLUMN marks TYPE FLOAT USING marks::double precision,
        ALTER COLUMN marks SET DEFAULT 10
      `);
    } catch (e) {
      // already correct type, ignore
    }
    await sequelize.sync({ alter: true });
    logger.info("Database synced");
  }
};

export default sequelize;
