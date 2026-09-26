const express = require("express");
const router = express.Router();

const db = require("./db/database");

// Register a new member
router.post("/", (req, res) => {
    const { name, email, phone } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            success: false,
            message: "Name and email are required"
        });
    }

    const sql = `
        INSERT INTO members (name, email, phone)
        VALUES (?, ?, ?)
    `;

    db.run(
        sql,
        [name, email, phone || null],
        function (err) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Member registered successfully",
                memberId: this.lastID
            });
        }
    );
});

// Get all members
router.get("/", (req, res) => {
    db.all(
        "SELECT * FROM members ORDER BY id DESC",
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                members: rows
            });
        }
    );
});

// Search members
router.get("/search", (req, res) => {
    const search = `%${req.query.q || ""}%`;

    const sql = `
        SELECT * FROM members
        WHERE name LIKE ?
           OR email LIKE ?
           OR phone LIKE ?
        ORDER BY id DESC
    `;

    db.all(
        sql,
        [search, search, search],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                members: rows
            });
        }
    );
});

// Update member
router.put("/:id", (req, res) => {
    const { name, email, phone } = req.body;

    const sql = `
        UPDATE members
        SET name = ?,
            email = ?,
            phone = ?
        WHERE id = ?
    `;

    db.run(
        sql,
        [name, email, phone || null, req.params.id],
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
                    message: "Member not found"
                });
            }

            res.json({
                success: true,
                message: "Member updated successfully"
            });
        }
    );
});

// Delete member
router.delete("/:id", (req, res) => {
    db.run(
        "DELETE FROM members WHERE id = ?",
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
                    message: "Member not found"
                });
            }

            res.json({
                success: true,
                message: "Member deleted successfully"
            });
        }
    );
});

module.exports = router;