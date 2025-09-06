const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");

const authRoutes = require("./routes/auth.js");
const lotRoutes = require("./routes/lot.js");
const bidRoutes = require("./routes/bid.js");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/lots", lotRoutes);
app.use("/bids", bidRoutes);

/* MONGOOSE SETUP */
const PORT = 3002;
mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "Dream_Nest",
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((err) => console.log(`${err} did not connect`));
