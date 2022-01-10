import React, { useEffect } from 'react'
import './SignIn.css'

function SignIn() {

    useEffect(() => {
        // handles if user submits sign in by enter key
        document.getElementById('password-form').addEventListener('keypress', function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                signIn();
            }
        })
    }, [])

    const signIn = () => {
        let username = String(document.getElementById('username-form').value);
        let password = String(document.getElementById('password-form').value);

        fetch('/sign-in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
        })
            .then(response => {
                return response.text();
            })
            .then(data => {
                console.log(data);
            });
    }

    return (

        <div className="signin-container">
            <div className="user-info-container">
                <div>
                    <form className="user-form">
                        <input type="text" id="username-form" name="username/" placeholder="Username..."></input>
                    </form>
                </div>
                <div>
                    <form className="user-form">
                        <input type="password" id="password-form" name="password/" placeholder="Password..."></input>
                    </form>
                </div>
            </div>
            <button onClick={() => signIn()} className="account-button">
                <span>Sign In</span>
            </button>
        </div>
    )
}

export default SignIn
