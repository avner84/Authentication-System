const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routers/index");
const connectToDatabase = require("./utils/databaseConnect");

const { port: PORT, origin } = require("./config/default");

const app = express();

// Middleware for logging requests
app.use((req, res, next) => {
  const { method, url } = req;
  console.log(`Received ${method} request to ${url}`);
  next();
});

app.use(express.json());
app.use(cookieParser());

// Configure CORS with an options object
app.use(
  cors({
    origin, // Allows requests only from the origin defined in the configuration file
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Specifies the allowed request methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specifies the allowed headers
    credentials: true, // Allows the use of credentials like cookies
  })
);

app.use(routes);

// Error Handling Middleware: Handles any errors that occur in the application
app.use((error, req, res, next) => {
  console.log(error);
  const { statusCode = 500, message, data } = error;
  res.status(statusCode).json({ message, data });
});

app.listen(PORT || 8080, async () => {
  await connectToDatabase(); // Attempt to connect to the database
  console.log(`Server is running on port ${PORT || 8080}`);
});
