import "dotenv/config.js";
import app from "./app.js";
import sequelize from "./config/db.js";
import "./models/index.js";

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");
    await sequelize.sync({ alter: true }); 
    console.log("Models synchronized");

    app.listen(PORT, () => {
      console.log(`Server:  http://localhost:${PORT}`);
      console.log(`Swagger: http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error("Server start error:", err);
    process.exit(1);
  }
})();
