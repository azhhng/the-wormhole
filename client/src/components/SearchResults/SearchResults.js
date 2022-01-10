import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './SearchResults.css';
import Card from "../Card/Card";

// TODO: make search results comply with Google's branding guidelines

const SearchResults = () => {

    const { parameters } = useParams();
    const [cards, setCards] = useState([]);
    const selectedColor = "#ed7355";

    useEffect(() => {
        const filter = document.querySelector('#generalFilter');
        filter.style.background = selectedColor;

        const search = (parameters) => {
            parameters = parameters.replace(" ", "+");

            let searchURL = String(parameters);
            fetchURL(searchURL, "normal");
        }
        search(parameters);

    }, [parameters, setCards])

    const fetchURL = (searchURL, type) => {
        searchURL = '/get-search-results/' + searchURL + "/" + type;
        fetch(searchURL)
            .then(response => response.json())
            .then(result => {
                var len = 0;

                try {
                    len = Object.keys(result["items"]).length;
                }
                catch {
                    len = 0;
                }
                var i = 0;

                var cardResults = [];

                // go through search results and display them
                while (i < len) {
                    console.log(result["items"][i]);

                    let bookDictionary = {};

                    bookDictionary["id"] = result["items"][i]["id"];

                    // catch if book does not have a thumbnail
                    try {
                        bookDictionary["img"] = result["items"][i]["volumeInfo"]["imageLinks"]["thumbnail"];
                    }
                    catch {
                        bookDictionary["img"] = "none";
                    }

                    bookDictionary["title"] = result["items"][i]["volumeInfo"]["title"];

                    // catch if book does not have an author
                    try {
                        // format multiple authors
                        if (result["items"][i]["volumeInfo"]["authors"].length > 1) {
                            let authorList = "";
                            for (var author in result["items"][i]["volumeInfo"]["authors"]) {
                                authorList += result["items"][i]["volumeInfo"]["authors"][author];
                                authorList += " & ";
                            }
                            bookDictionary["author"] = authorList;
                        }

                        else {
                            bookDictionary["author"] = result["items"][i]["volumeInfo"]["authors"];
                        }

                    }
                    catch {
                        bookDictionary["author"] = "No Author found";
                    }

                    bookDictionary["description"] = result["items"][i]["volumeInfo"]["description"];
                    bookDictionary["pages"] = result["items"][i]["volumeInfo"]["pageCount"];

                    try {
                        let identifier = result["items"][i]["volumeInfo"]["industryIdentifiers"][0]["identifier"];
                        bookDictionary["identifier"] = identifier;
                        bookDictionary["identifier_type"] = result["items"][i]["volumeInfo"]["industryIdentifiers"][0]["type"];
                        console.log(result["items"][i]["volumeInfo"]["industryIdentifiers"][0]["type"])
                        console.log(result["items"][i]["volumeInfo"]["industryIdentifiers"][0]["identifier"])
                    }
                    catch {
                        console.log("identifier not found")
                        bookDictionary["identifier"] = "notfound";
                        bookDictionary["identifier_type"] = "notfound";
                    }

                    cardResults.push(bookDictionary);
                    i += 1;

                }
                setCards(cardResults);
            })
    }
    const filterTo = (parameters, type) => {
        parameters = parameters.replace(" ", "+");

        let afilter = document.querySelector('#authorFilter');
        afilter.style.background = "#fff";
        let tfilter = document.querySelector('#titleFilter');
        tfilter.style.background = "#fff";
        let gefilter = document.querySelector('#genreFilter');
        gefilter.style.background = "#fff";
        let gfilter = document.querySelector('#generalFilter');
        gfilter.style.background = "#fff";

        let filter;

        // change fetch URL depending on what user filters to
        if (type === "author") {
            filter = document.querySelector('#authorFilter');

        }
        else if (type === "title") {
            filter = document.querySelector('#titleFilter');
        }

        else if (type === "genre") {
            filter = document.querySelector('#genreFilter');
        }

        else {
            filter = document.querySelector('#generalFilter');
        }
        filter.style.background = selectedColor;
        fetchURL(String(parameters), type);
    }

    return (
        <div className="search-container">
            <h2>
                Search Results For: {parameters.replace("+", " ")}
            </h2>
            <h3 className="filter-title">
                Filter to Only:
            </h3>
            <h3 className="filter" onClick={() => filterTo(parameters, "general")} id="generalFilter">
                General
            </h3>
            <h3 className="filter" onClick={() => filterTo(parameters, "title")} id="titleFilter">
                Title
            </h3>
            <h3 className="filter" onClick={() => filterTo(parameters, "author")} id="authorFilter">
                Author
            </h3>
            <h3 className="filter" onClick={() => filterTo(parameters, "genre")} id="genreFilter">
                Genre
            </h3>
            <div className="result-container">
                {cards.map((card) => (
                    <Card key={card.id} card={card} />
                ))}
            </div>
        </div>

    )
}

export default SearchResults