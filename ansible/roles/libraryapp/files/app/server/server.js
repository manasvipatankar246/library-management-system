const express = require("express");
const cors = require("cors");

const db = require("./db/database");
const booksRouter = require("./books");
const membersRouter = require("./members");
const transactionsRouter = require("./transactions");
const dashboardRouter = require("./dashboard");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/books", booksRouter);
app.use("/api/members", membersRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/dashboard", dashboardRouter);

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Library Management System API is running"
    });
});

app.listen(PORT, () => {
    console.log(
        `Library Management System server running at http://localhost:${PORT}`
    );
});