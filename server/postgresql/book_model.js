const Pool = require('pg').Pool
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const connectionString = `postgresql://${process.env.PSQL_DATABASE_USERNAME}:${process.env.PSQL_DATABASE_PASSWORD}@${process.env.PSQL_DATABASE_HOST}:${process.env.PSQL_DATABASE_PORT}/${process.env.PSQL_DATABASE_NAME}`;

// comment out ssl in development
const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
});

const getGoogleInfo = (identifier) => {
    return new Promise(function (resolve, reject) {

        console.log("calling Google API");
        let searchURL = 'https://www.googleapis.com/books/v1/volumes?q=' + identifier + '&key=' + process.env.GOOGLE_BOOKS_API_KEY;

        axios.get(searchURL)
            .then((response) => {
                let result = response["data"];
                let data = {};
                let bookInfo = {};
                try {
                    // make sure identifier is a match first
                    for (var key of Object.keys(result["items"])) {
                        let resultISBN = String(result["items"][key]["volumeInfo"]["industryIdentifiers"][0]["identifier"]);
                        if (resultISBN === identifier) {
                            bookInfo = result["items"][key];
                        }
                    }
                }
                catch {
                    // if for some reason Google Books API could not match the identifier
                    reject({ "error": "IDNOTFOUND" });
                    return;
                }

                try {
                    data["title"] = bookInfo["volumeInfo"]["title"];
                }

                catch {
                    reject({ "error": "IDNOTFOUND" });
                    return;
                }

                try {
                    data["icon"] = bookInfo["volumeInfo"]["imageLinks"]["thumbnail"];
                }

                catch {
                    data["icon"] = "ICONNOTFOUND";
                }

                data["identifier_type"] = bookInfo["volumeInfo"]["industryIdentifiers"][0]["type"];
                data["author"] = String(bookInfo["volumeInfo"]["authors"]).replace(",", ", ");
                data["genre"] = bookInfo["volumeInfo"]["categories"];
                data["pages"] = bookInfo["volumeInfo"]["pageCount"];
                data["desc"] = bookInfo["volumeInfo"]["description"];
                data["error"] = "good";

                resolve(data);
            })
            .catch((error) => {
                console.log(error);
                reject(error)
            })
    })
}


const getBooks = () => {
    return new Promise(function (resolve, reject) {
        pool.query('SELECT * FROM "books";', (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getBook = (bookTitle) => {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT * FROM "books" WHERE username = $1`, [bookTitle], (error, results) => {
            if (error) {
                console.log(error)
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

module.exports = {
    getBooks,
    getBook,
    getGoogleInfo
}