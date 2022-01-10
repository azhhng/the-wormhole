import './UserProfile.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const UserProfile = () => {
    const { username } = useParams();
    const [userData, setUserData] = useState({});

    useEffect(() => {
        fetch('http://localhost:3001/get-user/' + String(username), {
            method: 'GET'
        })
            .then(response => {
                return response.text();
            })
            .then(data => {
                let dataJSON = JSON.parse(data);
                setUserData(dataJSON);

                // set books read
                let booksRead = document.getElementById('books-read')
                booksRead.textContent += String(Object.keys(dataJSON["books_read"]).length);
            });
    }, [username])

    const getInfo = () => {
        console.log(userData["username"]);
        console.log(userData["books_read"]);

        let text = "";

        for (const key in userData["books_read"]) {
            text += key;
            text += " Rating: "
            text += userData["books_read"][key]["rating"]
            text += " | "
        }
        document.getElementById('placeholder').value = text;
    }

    return (
        <div>
            <div className="user-header">
                <h3>{userData["username"]}</h3>

                <h3 id="books-read">Books Read: </h3>
                <button onClick={() => getInfo()} id="info-button">
                    <h3>Get Info</h3>
                </button>
                <textarea className="placeholder-table" id="placeholder" spellCheck="false" defaultValue="press button to see your book and their ratings"></textarea>
            </div>
        </div>
    )
}


export default UserProfile