const express = require("express");

const app = express();

const connectDB = require("./config/db");

const postRoutes = require("./routes/posts");

app.use(express.json());
app.use(postRoutes);
app.use((err, req, res, next) => {
    if (err.name === "ValidationError") {
        res.status(400).send("Invalid Request");
    }
    res.status(500).send("Internal Server Error");
})

connectDB();
app.listen(5000, () => {
    console.log("This server is listening on port 5000...");
})