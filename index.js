import dotenv from "dotenv";
import database from "./src/configs/db.configs";
import express from "express";
import initRoutes from "./src/routes/init.routes";

const cors = require("cors");
dotenv.config();

app.get("/", (req, res) => {
  res.send("Hey this is my API running 🥳");
});

const app = express();
app.use(express.json());
app.use(cors());

database.connectDatabase();

initRoutes(app);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
