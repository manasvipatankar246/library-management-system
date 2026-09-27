const express = require("express");
const router = express.Router();

const db = require("./db/database");

router.get("/", (req, res) => {
    const queries = {
        totalBooks: "SELECT COUNT(*) AS count FROM books",
        totalMembers: "SELECT COUNT(*) AS count FROM members",
        totalIssued: `
            SELECT COUNT(*) AS count
            FROM transactions
            WHERE status = 'Issued'
        `,
        availableBooks: `
            SELECT COALESCE(SUM(available_quantity), 0) AS count
            FROM books
        `,
        overdueBooks: `
            SELECT COUNT(*) AS count
            FROM transactions
            WHERE status = 'Issued'
            AND due_date < date('now')
        `,
        totalTransactions: `
            SELECT COUNT(*) AS count
            FROM transactions
        `
    };

    db.get(queries.totalBooks, [], (err, books) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        db.get(queries.totalMembers, [], (err, members) => {
            if (err) return res.status(500).json({ success: false, message: err.message });

            db.get(queries.totalIssued, [], (err, issued) => {
                if (err) return res.status(500).json({ success: false, message: err.message });

                db.get(queries.availableBooks, [], (err, available) => {
                    if (err) return res.status(500).json({ success: false, message: err.message });

                    db.get(queries.overdueBooks, [], (err, overdue) => {
                        if (err) return res.status(500).json({ success: false, message: err.message });

                        db.get(queries.totalTransactions, [], (err, transactions) => {
                            if (err) return res.status(500).json({ success: false, message: err.message });

                            res.json({
                                success: true,
                                dashboard: {
                                    totalBooks: books.count,
                                    availableBooks: available.count,
                                    issuedBooks: issued.count,
                                    totalMembers: members.count,
                                    overdueBooks: overdue.count,
                                    totalTransactions: transactions.count
                                }
                            });
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;