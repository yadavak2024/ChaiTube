
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db/index.js";
import { app } from "./app.js";

// Load .env from the backend folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, "../.env")
});

// Check whether Cloudinary credentials are loaded
console.log(
    "Cloudinary API key loaded:",
    Boolean(process.env.CLOUDINARY_API_KEY)
);

// Connect to MongoDB and start the server
connectDB()
    .then(() => {
        const PORT = process.env.PORT || 8000;

        app.listen(PORT, () => {
            console.log(`⚙️ Server is running at port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
    });
