const express = require("express");
const router = express.Router();

const db = require("./db/database");

// Add a new member
router.post("/", (req, res) => {
    const { name, email, phone } = req.body;

    // Validate required fields and email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !emailPattern.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Valid name and email are required"
        });
    }

    const sql = `
        INSERT INTO members (name, email, phone)
        VALUES (?, ?, ?)
    `;

    db.run(sql, [name, email, phone], function (err) {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            message: "Member added successfully",
            memberId: this.lastID
        });
    });
});

// Get all members
router.get("/", (req, res) => {
    db.all(
        `SELECT * FROM members ORDER BY id DESC`,
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
    const search = req.query.q || "";

    const sql = `
        SELECT * FROM members
        WHERE name LIKE ?
        OR email LIKE ?
        OR phone LIKE ?
        ORDER BY id DESC
    `;

    const value = `%${search}%`;

    db.all(sql, [value, value, value], (err, rows) => {
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
    });
});

// Update member
router.put("/:id", (req, res) => {
    const { name, email, phone } = req.body;
    const { id } = req.params;

    // Validate required fields and email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !emailPattern.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Valid name and email are required"
        });
    }

    const sql = `
        UPDATE members
        SET name = ?, email = ?, phone = ?
        WHERE id = ?
    `;

    db.run(sql, [name, email, phone, id], function (err) {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            message: "Member updated successfully"
        });
    });
});

// Delete member
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.run(
        `DELETE FROM members WHERE id = ?`,
        [id],
        function (err) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
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