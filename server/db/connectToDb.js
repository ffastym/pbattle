/**
 * @author Yuriy Matviyuk
 */
import mongoose from "mongoose";

const dbRoute = "mongodb://localhost:27017/battle";

mongoose.connect(dbRoute, { useNewUrlParser: true });

const connectToDb = () => {
    const db = mongoose.connection;

    db.once("open", () => console.log("connected to the database"));

    // checks if connection with the database is successful
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
};

export default connectToDb;
