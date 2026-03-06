const dotenv = require("dotenv");
dotenv.config();

const connectToMongo = require("./config/db.config.js");
const express = require("express");
var cors = require("cors");

const routes = require("./routes/index.Routes.js");
const cleanupExpiredOTP = require("./jobs/cleanupExpiredOTP.jobs.js");

//connecting with database
connectToMongo();
const app = express();
const port = process.env.PORT || 3001;

// needed for res

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "https://notex-mola.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// 👈 explicitly handle preflight
app.options("*", cors());

// Available Routes
app.use("/api", routes);

app.listen(port, () => {
  console.log(`NoteX backend listening at http://localhost:${port}`);
});

//clean up job
(async () => {
  await cleanupExpiredOTP();
  const timeFor30min = 30 * 60 * 1000;
  setInterval(cleanupExpiredOTP, timeFor30min);
})();
