const API = "/api";


// -----------------------------
// Navigation
// -----------------------------

function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    document.getElementById(sectionId).classList.add("active");

    if (sectionId === "dashboard") {
        loadDashboard();
    }

    if (sectionId === "books") {
        loadBooks();
    }

    if (sectionId === "members") {
        loadMembers();
    }

    if (sectionId === "issue") {
        loadIssuedBooks();
    }

    if (sectionId === "transactions") {
        loadTransactions();
    }
}


// -----------------------------
// Dashboard
// -----------------------------

async function loadDashboard() {

    const response = await fetch(`${API}/dashboard`);
    const data = await response.json();

    if (!data.success) {
        return;
    }

    document.getElementById("totalBooks").textContent =
        data.dashboard.totalBooks;

    document.getElementById("availableBooks").textContent =
        data.dashboard.availableBooks;

    document.getElementById("issuedBooks").textContent =
        data.dashboard.issuedBooks;

    document.getElementById("totalMembers").textContent =
        data.dashboard.totalMembers;

    document.getElementById("overdueBooks").textContent =
        data.dashboard.overdueBooks;

    document.getElementById("totalTransactions").textContent =
        data.dashboard.totalTransactions;
}


// -----------------------------
// Books
// -----------------------------

async function loadBooks() {

    const response = await fetch(`${API}/books`);
    const data = await response.json();

    displayBooks(data.books || []);
}


function displayBooks(books) {

    const container = document.getElementById("booksList");

    if (books.length === 0) {
        container.innerHTML = "<p>No books found.</p>";
        return;
    }

    container.innerHTML = books.map(book => `
        <div class="item">

            <h3>${book.title}</h3>

            <p><strong>ID:</strong> ${book.id}</p>

            <p><strong>Author:</strong>
                ${book.author}
            </p>

            <p><strong>Category:</strong>
                ${book.category || "N/A"}
            </p>

            <p><strong>ISBN:</strong>
                ${book.isbn || "N/A"}
            </p>

            <p><strong>Total:</strong>
                ${book.quantity}
            </p>

            <p><strong>Available:</strong>
                ${book.available_quantity}
            </p>

        </div>
    `).join("");
}


async function searchBooks() {

    const query =
        document.getElementById("bookSearch").value;

    if (!query.trim()) {
        loadBooks();
        return;
    }

    const response = await fetch(
        `${API}/books/search?q=${encodeURIComponent(query)}`
    );

    const data = await response.json();

    displayBooks(data.books || []);
}


document.getElementById("bookForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const book = {

            title:
                document.getElementById("bookTitle").value,

            author:
                document.getElementById("bookAuthor").value,

            isbn:
                document.getElementById("bookISBN").value,

            category:
                document.getElementById("bookCategory").value,

            quantity:
                Number(
                    document.getElementById("bookQuantity").value
                )
        };

        const response = await fetch(`${API}/books`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(book)
        });

        const data = await response.json();

        alert(data.message);

        if (data.success) {

            this.reset();

            loadBooks();

            loadDashboard();
        }
    });


// -----------------------------
// Members
// -----------------------------

async function loadMembers() {

    const response =
        await fetch(`${API}/members`);

    const data =
        await response.json();

    displayMembers(data.members || []);
}


function displayMembers(members) {

    const container =
        document.getElementById("membersList");

    if (members.length === 0) {

        container.innerHTML =
            "<p>No members found.</p>";

        return;
    }

    container.innerHTML = members.map(member => `
        <div class="item">

            <h3>${member.name}</h3>

            <p>
                <strong>ID:</strong>
                ${member.id}
            </p>

            <p>
                <strong>Email:</strong>
                ${member.email}
            </p>

            <p>
                <strong>Phone:</strong>
                ${member.phone || "N/A"}
            </p>

            <p>
                <strong>Registered:</strong>
                ${member.registration_date}
            </p>

        </div>
    `).join("");
}


async function searchMembers() {

    const query =
        document.getElementById("memberSearch").value;

    if (!query.trim()) {

        loadMembers();

        return;
    }

    const response =
        await fetch(
            `${API}/members/search?q=${encodeURIComponent(query)}`
        );

    const data =
        await response.json();

    displayMembers(data.members || []);
}


document.getElementById("memberForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const member = {

            name:
                document.getElementById("memberName").value,

            email:
                document.getElementById("memberEmail").value,

            phone:
                document.getElementById("memberPhone").value
        };

        const response =
            await fetch(`${API}/members`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(member)
            });

        const data =
            await response.json();

        alert(data.message);

        if (data.success) {

            this.reset();

            loadMembers();

            loadDashboard();
        }
    });


// -----------------------------
// Issue Book
// -----------------------------

document.getElementById("issueForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const transaction = {

            book_id:
                Number(
                    document.getElementById("issueBookId").value
                ),

            member_id:
                Number(
                    document.getElementById("issueMemberId").value
                ),

            due_date:
                document.getElementById("dueDate").value
        };

        const response =
            await fetch(
                `${API}/transactions/issue`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(transaction)
                }
            );

        const data =
            await response.json();

        document.getElementById("issueMessage").innerHTML =
            `<p>${data.message}</p>`;

        if (data.success) {

            this.reset();

            loadIssuedBooks();

            loadDashboard();
        }
    });


// -----------------------------
// Issued Books
// -----------------------------

async function loadIssuedBooks() {

    const response =
        await fetch(`${API}/transactions/issued`);

    const data =
        await response.json();

    const container =
        document.getElementById("issuedList");

    if (!data.transactions ||
        data.transactions.length === 0) {

        container.innerHTML =
            "<p>No books are currently issued.</p>";

        return;
    }

    container.innerHTML = data.transactions.map(transaction => `
        <div class="item">

            <h3>${transaction.book_title}</h3>

            <p>
                <strong>Member:</strong>
                ${transaction.member_name}
            </p>

            <p>
                <strong>Issue Date:</strong>
                ${transaction.issue_date}
            </p>

            <p>
                <strong>Due Date:</strong>
                ${transaction.due_date}
            </p>

            <button
                onclick="returnBook(${transaction.id})">
                Return Book
            </button>

        </div>
    `).join("");
}


async function returnBook(transactionId) {

    const response =
        await fetch(
            `${API}/transactions/return/${transactionId}`,
            {
                method: "POST"
            }
        );

    const data =
        await response.json();

    alert(
        `${data.message}\nFine: ₹${data.fine || 0}`
    );

    if (data.success) {

        loadIssuedBooks();

        loadDashboard();
    }
}


// -----------------------------
// LIB-6 Transaction History
// -----------------------------

// Load all transactions
async function loadTransactions() {

    const response =
        await fetch(`${API}/transactions`);

    const data =
        await response.json();

    displayTransactions(
        data.transactions || []
    );
}


// Load currently issued transactions
async function loadIssuedTransactions() {

    const response =
        await fetch(`${API}/transactions/issued`);

    const data =
        await response.json();

    displayTransactions(
        data.transactions || []
    );
}


// Load returned transactions
async function loadReturnedTransactions() {

    const response =
        await fetch(`${API}/transactions/returned`);

    const data =
        await response.json();

    displayTransactions(
        data.transactions || []
    );
}


// Load overdue transactions
async function loadOverdueTransactions() {

    const response =
        await fetch(`${API}/transactions/overdue`);

    const data =
        await response.json();

    displayTransactions(
        data.overdue || []
    );
}


// Display transaction information
function displayTransactions(transactions) {

    const container =
        document.getElementById("transactionsList");

    if (!transactions ||
        transactions.length === 0) {

        container.innerHTML =
            "<p>No transactions found.</p>";

        return;
    }

    container.innerHTML = `
        <table>

            <tr>
                <th>ID</th>
                <th>Book</th>
                <th>Member</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Fine</th>
                <th>Status</th>
            </tr>

            ${transactions.map(transaction => `
                <tr>

                    <td>
                        ${transaction.id}
                    </td>

                    <td>
                        ${transaction.book_title}
                    </td>

                    <td>
                        ${transaction.member_name}
                    </td>

                    <td>
                        ${transaction.issue_date}
                    </td>

                    <td>
                        ${transaction.due_date}
                    </td>

                    <td>
                        ${transaction.return_date || "-"}
                    </td>

                    <td>
                        ₹${transaction.fine || 0}
                    </td>

                    <td>
                        ${transaction.status || "Overdue"}
                    </td>

                </tr>
            `).join("")}

        </table>
    `;
}


// -----------------------------
// Load dashboard on startup
// -----------------------------

loadDashboard();