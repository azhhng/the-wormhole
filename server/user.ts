export class User {
    private username: string;
    private prompts: {};
    private user_model;
    // private userLists: {};
    // private userClubs: {};
    // private followers: {};
    // private following: {};
    // date of birth required, 18+ books?? private dob: String;

    constructor(u: string) {
        this.username = u;
        this.prompts = {};

        this.user_model = require('./postgresql/user_model');
    }

    public setPrompts(p: {}): string {
        this.prompts = p;

        return this.user_model.setPrompts(p, this.getUsername())
            .then((response: any) => {
                return "prompts added";
            })
            .catch((error: any) => {
                return "prompts not added"
            })
    }

    public getPrompts(): {} {
        return this.prompts;
    }

    public getUsername(): string {
        return this.username;
    }

    public getUser(username: string) {
        if (username === this.getUsername()) {
            console.log("this is the user's profile")

            return this.user_model.getUser(this.getUsername())
                .then((response: any) => {
                    return response[0];
                })
                .catch((error: any) => {
                    console.log(error)
                    return "did not get user"
                })
        }

        else {
            console.log("this is not the user's profile")

            return this.user_model.getUser(username)
                .then((response: any) => {
                    return response[0];
                })
                .catch((error: any) => {
                    console.log(error)
                    return "did not get user"
                })
        }

    }

    public addBookRead(identifier: string, identifier_type: string, rating: number, review: string): string {
        console.log("user wants to add " + identifier + " as read");

        let bookRead: any = {};
        bookRead[identifier] = { "identifier_type": identifier_type, "rating": rating, "review": review };

        // add this to psql
        return this.user_model.addBookRead(bookRead, this.getUsername())
            .then((response: any) => {
                return "book added";
            })
            .catch((error: any) => {
                return "book not added";
            })

    }

    public deleteBookRead(identifier: string): string {
        console.log("user wants to delete " + identifier + " as read");

        // add this to psql
        return this.user_model.deleteBookRead(identifier, this.getUsername())
            .then((response: any) => {
                return "book deleted";

            })
            .catch((error: any) => {
                return "book not deleted";
            })

    }

    async getBookActivity(identifier: string): Promise<string> {
        console.log("user wants to get their book activity for " + identifier);

        // get book activity
        return this.user_model.getBookActivity(identifier, this.getUsername())
            .then((response: any) => {
                return response;
            })
            .catch((error: any) => {
                return "book activity not gotten";
            })
    }

    async deleteUser(username: string): Promise<string> {
        console.log("user wants to delete their profile")

        if (username === this.getUsername()) {
            return this.user_model.getBookActivity(this.getUsername())
                .then((response: any) => {
                    return response;
                })
                .catch((error: any) => {
                    return "book activity not gotten";
                })
        }
        else {
            return "this is the incorrect username";
        }

    }

}