import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import { testDatabaseConnection } from "./config/database.test";

const PORT = process.env.PORT || 5000;

async function startServer(): Promise<void> {
  try {
    await testDatabaseConnection();

    app.listen(PORT, () => {
      console.log(`✓ Warranty Arbiter API running on port ${PORT}`);
      console.log(`✓ http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server because database connection failed.");
    process.exit(1);
  }
}

startServer();