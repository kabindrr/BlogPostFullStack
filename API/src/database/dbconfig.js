import mongoose from "mongoose";

const uri = "mongodb://localhost:27017/PersonalBlog";

export const MongoDBDatabase = () => {
  try {
    mongoose.connect(uri);
    console.log("Database connected with MongoDb");
  } catch (error) {
    console.log(error.message);
  }
};
