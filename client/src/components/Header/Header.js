import './Header.css';
import searchICON from '../images/search-64.png';
import { useEffect } from 'react';

const Header = () => {
    useEffect(() => {
        // handles if user submits search by enter key
        document.getElementById('search-terms').addEventListener('keypress', function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                toSearch();
            }
        })

        // handles if user submits search by button
        document.getElementById("search-button").addEventListener("click", function (e) {
            e.preventDefault()
            toSearch()
        });
    })

    const toSearch = () => {
        // get text in search box
        let searchTerms = String(document.getElementById('search-terms').value);
        if (!searchTerms) {
            console.log("you did not search anything");
            return;
        }
        else if (searchTerms === "") {
            console.log("you did not search anything");
            return;
        }
        searchTerms = searchTerms.replace(" ", "+");
        window.location.href = "/search/" + searchTerms;
    }
    const toHome = () => {
        window.location.href = "/";
    }
    const toProfile = () => {
        console.log("hello")
        // get current username
        fetch('http://localhost:3001/get-current-user')
            .then(response => response.json())
            .then(result => {
                // if user is not signed in
                if (result === `you need to sign in`) {
                    console.log(result);
                }
                // else go to profile
                else {
                    window.location.href = "/profile/" + result;
                }
            });
    }

    const createAccount = () => {
        window.location.href = "/create-account";
    }

    const signIn = () => {
        window.location.href = "/sign-in";
    }

    return (
        <div className="header">
            <h1 className="logo-text" onClick={() => toHome()}>
                Welcome to The Wormhole...
            </h1>
            <div className='searchbar-container'>
                <form className="searchbar">
                    <input type="text" id="search-terms" placeholder="Search...a book/author/genre"></input>
                    <button onClick={() => toSearch()} id="search-button">
                        <img id="search-icon" src={searchICON} alt="ponyo" />
                    </button>
                </form>
            </div>
            <div className="header-planet" onClick={() => signIn()} id="sign-in"><h3>Sign In</h3></div>
            <div className="header-planet" onClick={() => createAccount()} id="create-account"><h3>Create Account</h3></div>
            <div className="header-planet" onClick={() => toProfile()} id="profile"><h3>Profile</h3></div>
        </div>
    );
}

export default Header