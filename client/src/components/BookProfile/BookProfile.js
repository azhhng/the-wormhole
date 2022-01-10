import React, { useEffect, useRef } from 'react'
import './BookProfile.css'
import { useParams } from 'react-router-dom';
import leftFilledStar from '../images/filled-left.png';
import rightFilledStar from '../images/filled-right.png';
import leftStar from '../images/left-star.png';
import rightStar from '../images/right-star.png';

function BookProfile() {
    const { identifier, title } = useParams();
    const bookInfo = useRef("");
    // has clicked Finish button
    const clicked = useRef(false);
    const starRating = useRef(0);
    const signedIn = useRef(true);

    useEffect(() => {
        console.log(title)
        // call PostgreSQL for Books to get the book reviews

        // call PostgreSQL for Users to get their rating and review
        fetch('http://localhost:3001/get-book-activity/' + String(identifier))
            .then(response => {
                return response.text();
            })
            .then(data => {
                let dataJSON = JSON.parse(data);
                console.log(dataJSON)
                // if user is not signed in
                if (dataJSON === "you need to sign in") {
                    console.log("hello")
                    signedIn.current = false;
                }

                else {
                    if (dataJSON[0]["?column?"] === null) {
                        console.log("user has not logged book");
                    }
                    else {
                        console.log(dataJSON[0]["?column?"]);
                        var readButton = document.querySelector("#read-button");
                        readButton.firstChild.textContent = "Finished";

                        starRating.current = dataJSON[0]["?column?"]["rating"];
                        if (dataJSON[0]["?column?"]["rating"] !== 0) {
                            var rating = dataJSON[0]["?column?"]["rating"];

                            if (rating === 0.5) {
                                fillStar("#star1L");
                            }
                            else if (rating === 1) {
                                fillStar("#star1R");
                            }
                            else if (rating === 1.5) {
                                fillStar("#star2L");
                            }
                            else if (rating === 2) {
                                fillStar("#star2R");
                            }
                            else if (rating === 2.5) {
                                fillStar("#star3L");
                            }
                            else if (rating === 3) {
                                fillStar("#star3R");
                            }
                            else if (rating === 3.5) {
                                fillStar("#star4L");
                            }
                            else if (rating === 4) {
                                fillStar("#star4R");
                            }
                            else if (rating === 4.5) {
                                fillStar("#star5L");
                            }
                            else if (rating === 5) {
                                fillStar("#star5R");
                            }

                            clicked.current = true;

                        }
                    }
                }
            });

        // call Google Books API for info
        fetch("http://localhost:3001/get-google-info/" + identifier)
            .then(response => response.json())
            .then(result => {
                if (result["error"] === "IDNOTFOUND") {
                    console.log("book not found")
                }
                else {
                    bookInfo.current = result;
                    console.log(bookInfo.current);
                    let title = document.querySelector('#title');
                    title.textContent += bookInfo.current["title"];

                    let icon = document.querySelector('#book-icon');

                    try {
                        icon.src = bookInfo.current["icon"];
                    }

                    catch {
                        console.log("no thumbnail sorry");
                    }

                    let author = document.querySelector('#author');
                    author.textContent += "By: " + String(bookInfo.current["author"]).replace(",", ", ");

                    let genre = document.querySelector('#genre');
                    genre.textContent += "Genre: " + bookInfo.current["genre"];

                    let pages = document.querySelector('#pages');
                    pages.textContent += "Pages: " + bookInfo.current["pages"];

                    let desc = document.querySelector('#description');
                    desc.textContent += bookInfo.current["desc"];
                }
            })
    })


    const fillStar = (starID) => {
        // set back to default first
        unfillStarHelper("#star1");
        unfillStarHelper("#star2");
        unfillStarHelper("#star3");
        unfillStarHelper("#star4");
        unfillStarHelper("#star5");

        var starPicture = leftFilledStar;

        if (starID === "#star1L") {
            let icon = document.querySelector(starID);
            icon.src = starPicture;
        }

        else if (starID === "#star1R") {
            fillStarHelper(starID);
        }

        else if (starID === "#star2L") {
            fillStarHelper("#star1");
            let icon = document.querySelector(starID);
            icon.src = starPicture;
        }

        else if (starID === "#star2R") {
            fillStarHelper("#star1");
            fillStarHelper("#star2");
        }

        else if (starID === "#star3L") {
            fillStarHelper("#star1");
            fillStarHelper("#star2");
            let icon = document.querySelector(starID);
            icon.src = starPicture;
        }

        else if (starID === "#star3R") {
            fillStarHelper("#star1");
            fillStarHelper("#star2");
            fillStarHelper("#star3");
        }

        else if (starID === "#star4L") {
            fillStarHelper("#star1");
            fillStarHelper("#star2");
            fillStarHelper("#star3");

            let icon = document.querySelector(starID);
            icon.src = starPicture;
        }

        else if (starID === "#star4R") {
            fillStarHelper("#star1");
            fillStarHelper("#star2");
            fillStarHelper("#star3");
            fillStarHelper("#star4");
        }

        else if (starID === "#star5L") {
            fillStarHelper("#star1");
            fillStarHelper("#star2");
            fillStarHelper("#star3");
            fillStarHelper("#star4");

            let icon = document.querySelector(starID);
            icon.src = starPicture;
        }

        else if (starID === "#star5R") {
            fillStarHelper("#star1");
            fillStarHelper("#star2");
            fillStarHelper("#star3");
            fillStarHelper("#star4");
            fillStarHelper("#star5");
        }

    }

    const unfillStar = (starID) => {
        // if book has a rating, set it back to the rating instead of empty stars
        if (starRating.current !== 0) {
            unfillStarHelper("#star1");
            unfillStarHelper("#star2");
            unfillStarHelper("#star3");
            unfillStarHelper("#star4");
            unfillStarHelper("#star5");

            if (starRating.current === 0.5) {
                fillStar("#star1L");
            }
            else if (starRating.current === 1) {
                fillStar("#star1R");
            }
            else if (starRating.current === 1.5) {
                fillStar("#star2L");
            }
            else if (starRating.current === 2) {
                fillStar("#star2R");
            }
            else if (starRating.current === 2.5) {
                fillStar("#star3L");
            }
            else if (starRating.current === 3) {
                fillStar("#star3R");
            }
            else if (starRating.current === 3.5) {
                fillStar("#star4L");
            }
            else if (starRating.current === 4) {
                fillStar("#star4R");
            }
            else if (starRating.current === 4.5) {
                fillStar("#star5L");
            }
            else if (starRating.current === 5) {
                fillStar("#star5R");
            }

            return;
        }

        var starPicture = leftStar;

        if (starID === "#star1L") {
            let icon = document.querySelector(starID);
            icon.src = starPicture;
        }

        else if (starID === "#star1R") {
            unfillStarHelper(starID);
        }

        else if (starID === "#star2L") {
            unfillStarHelper("#star1");
            let icon = document.querySelector(starID);
            icon.src = starPicture;
        }

        else if (starID === "#star2R") {
            unfillStarHelper("#star1");
            unfillStarHelper("#star2");
        }

        else if (starID === "#star3L") {
            unfillStarHelper("#star1");
            unfillStarHelper("#star2");
            let icon = document.querySelector(starID);
            icon.src = starPicture;
        }

        else if (starID === "#star3R") {
            unfillStarHelper("#star1");
            unfillStarHelper("#star2");
            unfillStarHelper("#star3");
        }

        else if (starID === "#star4L") {
            unfillStarHelper("#star1");
            unfillStarHelper("#star2");
            unfillStarHelper("#star3");

            let icon = document.querySelector(starID);
            icon.src = starPicture;
        }

        else if (starID === "#star4R") {
            unfillStarHelper("#star1");
            unfillStarHelper("#star2");
            unfillStarHelper("#star3");
            unfillStarHelper("#star4");
        }

        else if (starID === "#star5L") {
            unfillStarHelper("#star1");
            unfillStarHelper("#star2");
            unfillStarHelper("#star3");
            unfillStarHelper("#star4");

            let icon = document.querySelector(starID);
            icon.src = starPicture;
        }

        else if (starID === "#star5R") {
            unfillStarHelper("#star1");
            unfillStarHelper("#star2");
            unfillStarHelper("#star3");
            unfillStarHelper("#star4");
            unfillStarHelper("#star5");
        }
    }

    const fillStarHelper = (starID) => {
        let starName = String(starID).replace("L", "").replace("R", "");

        var leftPicture;
        var rightPicture;

        leftPicture = leftFilledStar;
        rightPicture = rightFilledStar;

        let left = document.querySelector(starName + "L");
        left.src = leftPicture;
        let right = document.querySelector(starName + "R");
        right.src = rightPicture;
    }

    const unfillStarHelper = (starID) => {
        let starName = String(starID).replace("L", "").replace("R", "");

        var leftPicture;
        var rightPicture;

        leftPicture = leftStar;
        rightPicture = rightStar;

        let left = document.querySelector(starName + "L");
        left.src = leftPicture;
        let right = document.querySelector(starName + "R");
        right.src = rightPicture;
    }

    const rateBook = (userRating) => {
        if (signedIn.current) {

            var rating;

            if (userRating === "#star1L") {
                rating = 0.5;
            }

            else if (userRating === "#star1R") {
                rating = 1;
            }

            else if (userRating === "#star2L") {
                rating = 1.5;
            }

            else if (userRating === "#star2R") {
                rating = 2;
            }

            else if (userRating === "#star3L") {
                rating = 2.5;
            }

            else if (userRating === "#star3R") {
                rating = 3;
            }

            else if (userRating === "#star4L") {
                rating = 3.5;
            }

            else if (userRating === "#star4R") {
                rating = 4;
            }

            else if (userRating === "#star5L") {
                rating = 4.5;
            }

            else if (userRating === "#star5R") {
                rating = 5;
            }

            fetch('http://localhost:3001/book-read', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identifier: String(identifier),
                    identifier_type: String(bookInfo.current["identifier_type"]),
                    rating: rating,
                    review: ""
                }),
            })
                .then(response => {
                    return response.text();
                })
                .then(data => {
                    console.log(data);
                });
            var readButton = document.querySelector("#read-button");
            starRating.current = rating;
            fillStar(userRating);
            readButton.firstChild.textContent = "Finished";
            clicked.current = true;
        }
    }

    const toggleRead = () => {
        if (signedIn.current) {

            var readButton = document.querySelector("#read-button");

            if (clicked.current) {
                unread();
                readButton.firstChild.textContent = "Finish";
                clicked.current = false;
            } else {
                read();
                readButton.firstChild.textContent = "Finished";
                clicked.current = true;
            }
        }
    }

    const read = () => {
        console.log("read()");
        fetch('http://localhost:3001/book-read', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identifier: String(identifier),
                identifier_type: String(bookInfo.current["identifier_type"]),
                rating: 0,
                review: ""
            }),
        })
            .then(response => {
                return response.text();
            })
            .then(data => {
                console.log(data);
                if (data === `"you need to sign in"`) {
                    console.log("you need to sign in");
                }
            });
    }

    const unread = () => {
        console.log("unread()");
        fetch('http://localhost:3001/delete-book-read', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identifier: String(identifier),
                identifier_type: String(bookInfo.current["identifier_type"]),
            }),
        })
            .then(response => {
                return response.text();
            })
            .then(data => {
                console.log(data);
                starRating.current = 0;
                unfillStarHelper("#star1");
                unfillStarHelper("#star2");
                unfillStarHelper("#star3");
                unfillStarHelper("#star4");
                unfillStarHelper("#star5");
            });
    }
    const wantToRead = () => {
        console.log("user wants to read book");
    }

    return (

        <div className="book-profile-container">
            <div className="icon-container">
                <div className="book-icon">
                    <img alt="could not find thumbnail :(" id="book-icon" />
                </div>
            </div>

            <div className="info-container">
                <div className="basic-info" id="basic-info">
                    <h2 className="descriptor-label" id="title"> </h2>
                    <h3 className="descriptor-label" id="author"> </h3>
                    <h3 className="descriptor-label" id="genre"> </h3>
                    <h3 className="descriptor-label" id="pages"> </h3>
                </div>
                <div className="description-container">
                    <h3> <span className="profile-highlight">Description</span></h3>
                    <h3 id="description"> </h3>
                </div>
            </div>

            <div className="user-action-container">
                <h3 className="label-highlight" id="rate-title">Rate and Review.</h3>

                <img onMouseOver={() => fillStar("#star1L")} onMouseLeave={() => unfillStar("#star1L")} onClick={() => rateBook("#star1L")} src={leftStar} alt="" className="star-icon" id="star1L" />
                <img onMouseOver={() => fillStar("#star1R")} onMouseLeave={() => unfillStar("#star1R")} onClick={() => rateBook("#star1R")} src={rightStar} alt="" className="star-icon" id="star1R" />

                <img onMouseOver={() => fillStar("#star2L")} onMouseLeave={() => unfillStar("#star2L")} onClick={() => rateBook("#star2L")} src={leftStar} alt="" className="star-icon" id="star2L" />
                <img onMouseOver={() => fillStar("#star2R")} onMouseLeave={() => unfillStar("#star2R")} onClick={() => rateBook("#star2R")} src={rightStar} alt="" className="star-icon" id="star2R" />

                <img onMouseOver={() => fillStar("#star3L")} onMouseLeave={() => unfillStar("#star3L")} onClick={() => rateBook("#star3L")} src={leftStar} alt="" className="star-icon" id="star3L" />
                <img onMouseOver={() => fillStar("#star3R")} onMouseLeave={() => unfillStar("#star3R")} onClick={() => rateBook("#star3R")} src={rightStar} alt="" className="star-icon" id="star3R" />

                <img onMouseOver={() => fillStar("#star4L")} onMouseLeave={() => unfillStar("#star4L")} onClick={() => rateBook("#star4L")} src={leftStar} alt="" className="star-icon" id="star4L" />
                <img onMouseOver={() => fillStar("#star4R")} onMouseLeave={() => unfillStar("#star4R")} onClick={() => rateBook("#star4R")} src={rightStar} alt="" className="star-icon" id="star4R" />

                <img onMouseOver={() => fillStar("#star5L")} onMouseLeave={() => unfillStar("#star5L")} onClick={() => rateBook("#star5L")} src={leftStar} alt="" className="star-icon" id="star5L" />
                <img onMouseOver={() => fillStar("#star5R")} onMouseLeave={() => unfillStar("#star5R")} onClick={() => rateBook("#star5R")} src={rightStar} alt="" className="star-icon" id="star5R" />

                <button id="read-button" onClick={() => toggleRead()} className="user-action-button">
                    <h3>Finish</h3>
                </button>
                <button onClick={() => wantToRead()} className="user-action-button">
                    <h3>Want to Read</h3>
                </button>
            </div>

        </div>
    )
}

export default BookProfile
