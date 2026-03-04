const dotenv = require("dotenv");
dotenv.config();

const connectToMongo = require("./config/db.config.js");
const express = require("express");
var cors = require("cors");

const routes = require("./routes/index.Routes.js");

//connecting with database
connectToMongo();
const app = express();
const port = process.env.PORT || 3001;

// needed for res
app.use(cors());
app.use(express.json());

// Available Routes
app.use("/api", routes);

app.listen(port, () => {
  console.log(`NoteX backend listening at http://localhost:${port}`);
});
