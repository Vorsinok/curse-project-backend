import app from "./app.js";
import sequelize from "./config/sequelize.js";
import { ENV } from "./config/env.js";
import "./models/User.js";
import "./models/Item.js";
import "./models/Inventory.js";
import"./models/InventoryAccess.js"


const PORT = ENV.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL (Neon)");


    await sequelize.sync({ alter: true });
    console.log("Database synced successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
})();
