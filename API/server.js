import express from "express";
import cors from "cors";
import { MongoDBDatabase } from "./src/database/dbconfig.js";
import morgan from "morgan";
import { userRouter } from "./src/routes/userRouter.js";

const app = express();
const PORT = 3010;

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//Database
MongoDBDatabase();

//routes
app.use("/api/v1/users", userRouter);

app.listen(PORT, (error) => {
  error
    ? console.log("Server error")
    : console.log(`server connected at http://localhost:${PORT}`);
});
