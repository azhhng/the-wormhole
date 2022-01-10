export class Book {
    private id: String;
    private reviews: {}; // {"alice": {"review": "i love this book", "rating": 5}, "bobby": {"review": "i hate this book", "rating": 1}}
    private average_rating: number;
    // future implementation private lists_the_book_is_in = {}

    constructor(id: String) {
        this.id = id;
        this.reviews = {}
        this.average_rating = 2.5;
    }

    async getGoogleInfo(): Promise<{ [info: string]: string }> {
        console.log("calling Google API");
        let searchURL = 'https://www.googleapis.com/books/v1/volumes?q=' + this.id + '&key=' + process.env.GOOGLE_BOOKS_API_KEY;

        return fetch(searchURL)
            .then(response => response.json())
            .then(result => {
                let data: { [info: string]: string } = {};
                let bookInfo = {};
                try {
                    // make sure ISBN is a match first
                    for (var key of Object.keys(result["items"])) {
                        let resultISBN = String(result["items"][key]["volumeInfo"]["industryIdentifiers"][0]["identifier"]).replace("OCLC:", "");
                        if (resultISBN === this.id) {
                            bookInfo = result["items"][key];
                        }
                    }
                }
                catch {
                    // if for some reason Google Books API could not retrieve the id
                    return { "error": "IDNOTFOUND" };
                }

                data["title"] = bookInfo["volumeInfo"]["title"];

                try {
                    data["icon"] = bookInfo["volumeInfo"]["imageLinks"]["thumbnail"];
                }

                catch {
                    data["icon"] = "ICONNOTFOUND";
                }

                data["author"] = String(bookInfo["volumeInfo"]["authors"]).replace(",", ", ");
                data["genre"] = bookInfo["volumeInfo"]["categories"];
                data["pages"] = bookInfo["volumeInfo"]["pageCount"];
                data["desc"] = bookInfo["volumeInfo"]["description"];
                data["error"] = "good";

                return data;
            })
    }
}