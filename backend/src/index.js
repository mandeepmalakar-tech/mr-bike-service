import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";

dotenv.config({
    path: "./.env",
});

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("API is running....");
});

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
        // handle server erros
        app.on("error", (error) => {
            console.log(`Error occured: ${error.message}`);
            throw error; // exit the server
        });
    })
    .catch((error) => {
        console.log(`Error while connecting to database: ${error.message}`);
    });
