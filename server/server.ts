import { Application } from "express";
import { Server as HTTPServer } from "http";
import { Axios } from "axios";
import * as express from "express";
import { User } from "./user";

export class WormholeServer {
    private httpServer: HTTPServer;
    private app: Application;
    private axios: Axios;
    private user_model;
    private book_model;
    private current_user: User | undefined;

    private readonly DEFAULT_PORT = 3001;

    constructor() {
        // read .env file
        const dotenv = require('dotenv');
        dotenv.config();

        this.app = require('express')();
        this.app.use(express.json());
        this.axios = require('axios');
        this.user_model = require('./postgresql/user_model');
        this.book_model = require('./postgresql/book_model');

        this.app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
            res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
            next();
        });

        this.httpServer = require('http').createServer(this.app);
        this.configureRoutes();
    }

    private configureRoutes(): void {
        this.app.get('/', function (req, res) {
            res.json("hello from server.ts");
        });

        this.app.post('/create-user', (req, res) => {
            if (this.current_user !== undefined) {
                return res.json("you are already signed in");
            }

            this.user_model.createUser(req.body)
                .then((response: any) => {
                    let username = req.body.username;

                    this.current_user = new User(username);
                    res.status(200).send(response);
                })
                .catch((error: any) => {
                    res.status(500).send(error);
                })
        });

        this.app.post('/sign-in', (req, res) => {
            if (this.current_user !== undefined) {
                res.status(200).send("you are already signed in");
                return;
            }

            this.user_model.signIn(req.body)
                .then((response: any) => {
                    // set current user
                    const { username, password } = req.body
                    this.current_user = new User(username);
                    res.status(200).send(response);
                })
                .catch((error: any) => {
                    res.status(500).send(error);
                })
        });

        this.app.get('/get-user/:username', (req, res) => {
            if (this.current_user === undefined) {
                return res.json("you need to sign in");
            }
            this.current_user.getUser(req.params.username)
                .then((response: any) => {
                    res.status(200).send(response);
                })
                .catch((error: any) => {
                    res.status(500).send(error);
                })
        });

        this.app.get('/get-current-user', (req, res) => {
            if (this.current_user === undefined) {
                return res.json("you need to sign in");
            }
            res.json(this.current_user.getUsername());
        });

        this.app.post('/book-read', (req, res) => {
            if (this.current_user === undefined) {
                return res.json("you need to sign in");
            }
            let message = this.current_user.addBookRead(req.body.identifier, req.body.identifier_type, req.body.rating, req.body.review);
            res.status(200).send(message);
        });

        this.app.post('/delete-book-read', (req, res) => {
            if (this.current_user === undefined) {
                return res.json("you need to sign in");
            }
            let message = this.current_user.deleteBookRead(req.body.identifier);
            res.status(200).send(message);
        });

        this.app.get('/get-book-activity/:identifier', (req, res) => {
            if (this.current_user === undefined) {
                return res.json("you need to sign in");
            }

            this.current_user.getBookActivity(req.params.identifier).then((message) => {
                res.json(message);
            });
        });

        // get search results
        this.app.get('/get-search-results/:parameters/:type', (req, res) => {

            let url: string;

            // change fetch URL depending on what user filters to
            if (req.params.type === "author") {
                url = 'https://www.googleapis.com/books/v1/volumes?q=+inauthor:' + req.params.parameters + '&key=' + process.env.GOOGLE_BOOKS_API_KEY;

            }
            else if (req.params.type === "title") {
                url = 'https://www.googleapis.com/books/v1/volumes?q=+intitle:' + req.params.parameters + '&key=' + process.env.GOOGLE_BOOKS_API_KEY;
            }

            else if (req.params.type === "genre") {
                url = 'https://www.googleapis.com/books/v1/volumes?q=+subject:' + req.params.parameters + '&key=' + process.env.GOOGLE_BOOKS_API_KEY;
            }

            else {
                url = 'https://www.googleapis.com/books/v1/volumes?q=' + req.params.parameters + '&key=' + process.env.GOOGLE_BOOKS_API_KEY;
            }

            this.axios.get(url)
                .then((response: any) => {
                    res.status(200).send(response["data"]);
                })
                .catch((error: any) => {
                    console.log(error);
                    res.status(500).send(error);
                })
        });

        this.app.get('/get-google-info/:identifier', (req, res) => {
            this.book_model.getGoogleInfo(req.params.identifier)
                .then((response: any) => {
                    res.status(200).send(response);
                })
                .catch((error: any) => {
                    res.status(500).send(error);
                })
        });
    }

    public listen(callback: (port: number) => void): void {
        this.httpServer.listen(this.DEFAULT_PORT, () => {
            callback(this.DEFAULT_PORT);
        });
    }
}