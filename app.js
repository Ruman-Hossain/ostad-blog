const express = require("express");
const router = require("./src/routes/api");
const app = new express();
require("dotenv").config();
const logger = require("./src/utils/logger");
const connectToDatabase = require('./src/utils/connect');

// SECURITY MIDDLEWARE IMPORT
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//SECURITY MIDDLEWARE IMPLEMENT
app.use(helmet());
app.use(xss());
app.use(cors());
app.use(mongoSanitize());
app.use(hpp());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Request Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 second
  max: 100, //Limit each IP to 100 request per Windows
});

//MongoDB Database Connection
connectToDatabase();

app.use("/api/v1", router);

//Undefined Route
app.use("*", (req, res) => {
  res.status(404).json({ status: "Failed", data: "Route Not Found" });
});

module.exports = app;
