const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const URI = process.env.MONGO_URL || "";

const connectDB = async () => {
    try {
        await mongoose.connect(URI, {
            dbName: "phenomenon",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected via mongoose!");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;