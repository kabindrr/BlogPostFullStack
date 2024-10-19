import express from "express";
import { MongoDBDatabase } from "./src/database/dbconfig.js";

const app = express();
const PORT = 3010;

//Database
MongoDBDatabase();

app.listen(PORT, (error) => {
  error
    ? console.log("Server error")
    : console.log(`server connected at http://localhost:${PORT}`);
});
