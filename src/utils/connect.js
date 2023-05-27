const mongoose = require("mongoose");
const logger = require("./logger");

const connectToDatabase = async () => {
  const maxRetries = 5; // Maximum number of retries
  let retries = 0; // Counter for retries

  while (retries < maxRetries) {
    try {
      const URI = "mongodb+srv://learnmongo:learnmongo@learnmongo.b6ij2g4.mongodb.net/blog";

      mongoose.set("strictQuery", true);
      await mongoose.connect(URI, {
        keepAlive: true,
        connectTimeoutMS: 60000, // Increased timeout to 60 seconds
        retryWrites: true,
        w: "majority",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log("Database Connection Successful!");
      logger.log("info", "Database Connection Successful!");
      break; // Exit the loop if the connection is successful
    } catch (error) {
      console.log(`\n ${retries} Connection attempt ${retries + 1} failed. Retrying...`);
      logger.log("error",error);
      retries++;
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Delay for 5 seconds before retrying
    }
  }

  if (retries === maxRetries) {
    console.log("Max connection retries reached. Failed to establish database connection.");
    logger.log("error", "Max connection retries reached. Failed to establish database connection.");
  }
};

module.exports = connectToDatabase;
