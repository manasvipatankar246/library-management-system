const express = require("express");
const router = express.Router();

const db = require("./db/database");

// Issue a book
router.post("/issue", (req, res) => {
    const { book_id, member_id, due_date } = req.body;

    if (!book_id || !member_id || !due_date) {
        return res.status(400).json({
            success: false,
            message: "Book, member and due date are required"
        });
    }

    // Validate due date
    const today = new Date()
        .toISOString()
        .split("T")[0];

    if (due_date < today) {
        return res.status(400).json({
            success: false,
            message: "Due date cannot be earlier than today"
        });
    }

    db.get(
        "SELECT * FROM books WHERE id = ?",
        [book_id],
        (err, book) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (!book) {
                return res.status(404).json({
                    success: false,
                    message: "Book not found"
                });
            }

            if (book.available_quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Book is currently unavailable"
                });
            }

            db.get(
                "SELECT * FROM members WHERE id = ?",
                [member_id],
                (err, member) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    if (!member) {
                        return res.status(404).json({
                            success: false,
                            message: "Member not found"
                        });
                    }

                    const issueDate = new Date()
                        .toISOString()
                        .split("T")[0];

                    db.run(
                        `
                        INSERT INTO transactions
                        (book_id, member_id, issue_date, due_date, status)
                        VALUES (?, ?, ?, ?, 'Issued')
                        `,
                        [
                            book_id,
                            member_id,
                            issueDate,
                            due_date
                        ],
                        function (err) {
                            if (err) {
                                return res.status(400).json({
                                    success: false,
                                    message: err.message
                                });
                            }

                            db.run(
                                `
                                UPDATE books
                                SET available_quantity =
                                    available_quantity - 1
                                WHERE id = ?
                                `,
                                [book_id],
                                (err) => {
                                    if (err) {
                                        return res.status(500).json({
                                            success: false,
                                            message: err.message
                                        });
                                    }

                                    res.status(201).json({
                                        success: true,
                                        message: "Book issued successfully",
                                        transactionId: this.lastID,
                                        issueDate: issueDate,
                                        dueDate: due_date
                                    });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

// Return a book
router.post("/return/:id", (req, res) => {
    const transactionId = req.params.id;

    db.get(
        "SELECT * FROM transactions WHERE id = ?",
        [transactionId],
        (err, transaction) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (!transaction) {
                return res.status(404).json({
                    success: false,
                    message: "Transaction not found"
                });
            }

            if (transaction.status === "Returned") {
                return res.status(400).json({
                    success: false,
                    message: "Book has already been returned"
                });
            }

            const returnDate = new Date()
                .toISOString()
                .split("T")[0];

            const dueDate = new Date(transaction.due_date);
            const actualReturnDate = new Date(returnDate);

            let fine = 0;

            if (actualReturnDate > dueDate) {
                const difference =
                    actualReturnDate - dueDate;

                const overdueDays =
                    Math.ceil(
                        difference /
                        (1000 * 60 * 60 * 24)
                    );

                fine = overdueDays * 5;
            }

            db.run(
                `
                UPDATE transactions
                SET return_date = ?,
                    fine = ?,
                    status = 'Returned'
                WHERE id = ?
                `,
                [
                    returnDate,
                    fine,
                    transactionId
                ],
                function (err) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    db.run(
                        `
                        UPDATE books
                        SET available_quantity =
                            available_quantity + 1
                        WHERE id = ?
                        `,
                        [transaction.book_id],
                        (err) => {
                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message: err.message
                                });
                            }

                            res.json({
                                success: true,
                                message: "Book returned successfully",
                                returnDate: returnDate,
                                fine: fine
                            });
                        }
                    );
                }
            );
        }
    );
});

// All transaction history
router.get("/", (req, res) => {
    const sql = `
        SELECT
            transactions.id,
            books.title AS book_title,
            members.name AS member_name,
            transactions.issue_date,
            transactions.due_date,
            transactions.return_date,
            transactions.fine,
            transactions.status
        FROM transactions
        JOIN books
            ON transactions.book_id = books.id
        JOIN members
            ON transactions.member_id = members.id
        ORDER BY transactions.id DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            transactions: rows
        });
    });
});

// Currently issued books
router.get("/issued", (req, res) => {
    const sql = `
        SELECT
            transactions.id,
            books.title AS book_title,
            members.name AS member_name,
            transactions.issue_date,
            transactions.due_date
        FROM transactions
        JOIN books
            ON transactions.book_id = books.id
        JOIN members
            ON transactions.member_id = members.id
        WHERE transactions.status = 'Issued'
        ORDER BY transactions.id DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            transactions: rows
        });
    });
});

// Returned books
router.get("/returned", (req, res) => {
    const sql = `
        SELECT
            transactions.id,
            books.title AS book_title,
            members.name AS member_name,
            transactions.issue_date,
            transactions.due_date,
            transactions.return_date,
            transactions.fine
        FROM transactions
        JOIN books
            ON transactions.book_id = books.id
        JOIN members
            ON transactions.member_id = members.id
        WHERE transactions.status = 'Returned'
        ORDER BY transactions.id DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            transactions: rows
        });
    });
});

// Overdue transactions
router.get("/overdue", (req, res) => {
    const today = new Date()
        .toISOString()
        .split("T")[0];

    const sql = `
        SELECT
            transactions.id,
            books.title AS book_title,
            members.name AS member_name,
            transactions.issue_date,
            transactions.due_date,
            transactions.status
        FROM transactions
        JOIN books
            ON transactions.book_id = books.id
        JOIN members
            ON transactions.member_id = members.id
        WHERE transactions.status = 'Issued'
          AND transactions.due_date < ?
        ORDER BY transactions.due_date ASC
    `;

    db.all(sql, [today], (err, rows) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            overdue: rows
        });
    });
});

module.exports = router;