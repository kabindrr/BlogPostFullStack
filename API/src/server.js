import express from "express";


const app = express();
const PORT = 3001;

app.listen(PORT, (error) => {
  error
    ? console.log("Server error")
    : console.log(`server connected at http://localhost:${PORT}`);
});
