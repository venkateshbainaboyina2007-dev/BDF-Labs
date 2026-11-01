const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path')

const app = express();
let db = null
const dbPath = path.join(__dirname, "database.db")

app.use(express.json());

const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        app.listen(3000, () => {
            console.log('Server is running at http://localhost:3000');
        });

    } catch (error) {
        console.log(`Database Error: ${error.message}`);
        process.exit(1);
    }
};


initializeDBAndServer();

// API - 1
app.get('/books/', async (request, response) => {
            const getBooksQuery = `SELECT * FROM book`
            const getBooksQueryresult = await db.all(getBooksQuery)
            response.send(getBooksQueryresult)
});

// API - 2
app.get('/books/:bookId/', async (request, response) => {
    const {bookId} = request.params;
    const getBookQuery = `SELECT * FROM book WHERE id = ${bookId}`;
    const getBookQueryresult = await db.get(getBookQuery);
    response.send(getBookQueryresult);
});

// API - 3
app.post('/books/', async (request, response) => {
    const {title, author, price, pages} = request.body;
    const addBookQuery = `
        INSERT INTO book (title, author, price, pages)
        VALUES ('${title}', '${author}', '${price}', '${pages}')
    `;
    const dbResponse = await db.run(addBookQuery);

    response.send({
        message: 'Book added successfully',
        bookId: dbResponse.lastID
    });
});

// API - 4
app.put('/books/:bookId/', async (request, response) => {
    const {bookId} = request.params;
    const {title, author, price, pages} = request.body;
    const updateBookQuery = `
        UPDATE book
        SET title = '${title}', author = '${author}', price = '${price}', pages = '${pages}'
        WHERE id = ${bookId}
    `;
    await db.run(updateBookQuery);
    response.send('Book updated successfully');
});

// API - 5
app.delete('/books/:bookId/', async (request, response) => {
    const {bookId} = request.params;
    const deleteBookQuery = `
        DELETE FROM book
        WHERE id = ${bookId}
    `;
    await db.run(deleteBookQuery);
    response.send('Book deleted successfully');
});