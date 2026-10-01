const express = require("express");

const app = express();

const connectDB = require("./config/db");

const postRoutes = require("./routes/posts");

const userRoutes = require("./routes/user");

app.use(express.json());
app.use(postRoutes);



console.log("userRoutes:", userRoutes);
console.log("userRoutes type:", typeof userRoutes);

app.use(userRoutes);
app.use((err, req, res, next) => {
    console.log(err);
    if (err.name === "ValidationError") {
        console.log(err);
        res.status(400).send("Invalid Request");
        return;
    }
    res.status(500).send("Internal Server Error");
})

connectDB();
app.listen(5000, () => {
    console.log("This server is listening on port 5000...");
})