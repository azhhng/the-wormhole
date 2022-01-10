const Pool = require('pg').Pool;
const argon2 = require('argon2');
const dotenv = require('dotenv');
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const connectionString = `postgresql://${process.env.PSQL_DATABASE_USERNAME}:${process.env.PSQL_DATABASE_PASSWORD}@${process.env.PSQL_DATABASE_HOST}:${process.env.PSQL_DATABASE_PORT}/${process.env.PSQL_DATABASE_NAME}`;

// comment out ssl in development
const pool = new Pool({
    connectionString: isProduction ? process.env.HEROKU_POSTGRESQL_CYAN_URL : connectionString,
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
});

const getUsers = () => {
    return new Promise(function (resolve, reject) {
        pool.query('SELECT * FROM "users";', (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getUser = (username) => {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT * FROM "users" WHERE username = $1`, [username], (error, results) => {
            if (error) {
                console.log(error);
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const signIn = (body) => {
    return new Promise(function (resolve, reject) {
        const { username, password } = body;
        // get hashedPassword
        pool.query(`SELECT password FROM "users" WHERE username = $1`, [username], (error, results) => {
            if (error) {
                reject(error)
            }
            // check that password is correct
            verifyPassword(results.rows[0]["password"], password).then((successful) => {
                if (successful) {
                    resolve("login successful");
                }
                else {
                    reject("login not successful");
                }
            });
        })
    })
}

const createUser = (body) => {
    console.log("creating new user")
    return new Promise(function (resolve, reject) {
        const { username, password, email } = body;

        hashPassword(password).then((hash) => {
            pool.query('INSERT INTO "users" (username, email, password, books_read) VALUES ($1, $2, $3, $4) RETURNING *', [username, email, hash, {}], (error, results) => {
                if (error) {
                    reject(error)
                }
                resolve(results)
            })
        });

    })
}

const deleteUser = (username) => {
    return new Promise(function (resolve, reject) {
        pool.query(`DELETE FROM "users" WHERE username = $1`, [username], (error, results) => {
            if (error) {
                console.log(error);
                reject(error)
            }
            resolve(results)
        })

    });
}

const setPrompts = (prompts, username) => {
    return new Promise(function (resolve, reject) {
        pool.query(`UPDATE "users" SET prompts=$1 WHERE username=$2`, [prompts, username], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results)
        })
    });
}

const addBookRead = (bookJSON, username) => {
    // check if book is in the json
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT books_read::jsonb ? $1 FROM "users" where username=$2;`, [Object.keys(bookJSON)[0], username], (error, results) => {
            if (error) {
                console.log(error);
                reject(error);
            }

            // if book is in json
            if (results.rows[0]['?column?'] === true) {
                // TODO: retrieve the rating or review and put it in the new json
                // delete the json 
                console.log("book is in json")

                pool.query(`UPDATE "users" SET books_read=books_read::jsonb - $1 where username=$2`, [Object.keys(bookJSON)[0], username], (error, results) => {
                    if (error) {
                        reject(error)
                    }
                    // then set new rating and review

                    pool.query(`UPDATE "users" SET books_read=books_read::jsonb || $1::jsonb WHERE username=$2`, [bookJSON, username], (error, results) => {
                        if (error) {
                            reject(error)
                        }
                        resolve(results)
                    })
                })
            }
            // if book is not in the json
            else {
                console.log("book is not in json")

                pool.query(`UPDATE "users" SET books_read=books_read::jsonb || $1::jsonb WHERE username=$2`, [bookJSON, username], (error, results) => {
                    if (error) {
                        reject(error)
                    }
                    resolve(results)
                })
            }
        })
    });
}

const deleteBookRead = (bookIdentifier, username) => {
    // check if book is in the json
    return new Promise(function (resolve, reject) {
        pool.query(`UPDATE "users" SET books_read=books_read::jsonb - $1 where username=$2`, [bookIdentifier, username], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results)
        })
    });
}

const getBookActivity = (bookIdentifier, username) => {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT books_read::jsonb->$1 FROM "users" WHERE username=$2`, [bookIdentifier, username], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows)
        })
    });
}

const getReadList = (username) => {

    return new Promise(function (resolve, reject) {
        pool.query(`SELECT books_read FROM "users" WHERE username = $1`, [username], (error, results) => {
            if (error) {
                console.log(error)
                reject(error)
            }
            resolve(results.rows)
        })
    });
}

// argon2 functions
async function hashPassword(password) {
    try {
        return await argon2.hash(password, {
            type: argon2.argon2id
        });
    } catch {
        console.log('error hashing password');
    }
}

async function verifyPassword(hashedPassword, password) {
    return await argon2.verify(hashedPassword, password);
}

module.exports = {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    setPrompts,
    signIn,
    addBookRead,
    deleteBookRead,
    getBookActivity,
    getReadList
}