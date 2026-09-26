const express = require("express");
const router = express.Router();

const db = require("./db/database");

// Add a new book
router.post("/", (req, res) => {
    const {
        title,
        author,
        isbn,
        category,
        quantity
    } = req.body;

    if (!title || !author || !quantity) {
        return res.status(400).json({
            success: false,
            message: "Title, author and quantity are required"
        });
    }

    const sql = `
        INSERT INTO books
        (title, author, isbn, category, quantity, available_quantity)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [title, author, isbn || null, category || null, quantity, quantity],
        function (err) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Book added successfully",
                bookId: this.lastID
            });
        }
    );
});

// Get all books
router.get("/", (req, res) => {
    db.all("SELECT * FROM books ORDER BY id DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            books: rows
        });
    });
});

// Search books
router.get("/search", (req, res) => {
    const search = `%${req.query.q || ""}%`;

    const sql = `
        SELECT * FROM books
        WHERE title LIKE ?
           OR author LIKE ?
           OR isbn LIKE ?
           OR category LIKE ?
        ORDER BY id DESC
    `;

    db.all(
        sql,
        [search, search, search, search],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                books: rows
            });
        }
    );
});

// Update a book
router.put("/:id", (req, res) => {
    const {
        title,
        author,
        isbn,
        category,
        quantity,
        available_quantity
    } = req.body;

    const sql = `
        UPDATE books
        SET title = ?,
            author = ?,
            isbn = ?,
            category = ?,
            quantity = ?,
            available_quantity = ?
        WHERE id = ?
    `;

    db.run(
        sql,
        [
            title,
            author,
            isbn || null,
            category || null,
            quantity,
            available_quantity,
            req.params.id
        ],
        function (err) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Book not found"
                });
            }

            res.json({
                success: true,
                message: "Book updated successfully"
            });
        }
    );
});

// Delete a book
router.delete("/:id", (req, res) => {
    db.run(
        "DELETE FROM books WHERE id = ?",
        [req.params.id],
        function (err) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Book not found"
                });
            }

            res.json({
                success: true,
                message: "Book deleted successfully"
            });
        }
    );
});

module.exports = router;