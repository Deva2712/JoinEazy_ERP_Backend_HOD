import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/database/connection.js";
import "./src/database/associations.js";
import logger from "./src/utils/logger.js";

const PORT = process.env.PORT || 6060;

// Connect to database then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`HOD Backend running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
    });
  })
  .catch((err) => {
    logger.error("Failed to connect to database:", err);
    process.exit(1);
  });
