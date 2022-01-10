import './CreateAccount.css';

const CreateAccount = () => {

    const createAccount = () => {

        //TODO: make sure email is valid

        let email = String(document.getElementById('email-form').value);
        let username = String(document.getElementById('username-form').value);
        let password = String(document.getElementById('password-form').value);
        let confirmPassword = String(document.getElementById('confirm-password-form').value);

        if (email === "" || username === "" || password === "" || confirmPassword === "") {
            console.log("Please fill out all fields.");
            return;
        }

        if (password.length < 0) { // change this to 8 later
            console.log("Password length has to be 8 or longer.");
            return;
        }

        if (password !== confirmPassword) {
            console.log("Passwords do not match.");
            return;
        }

        fetch('/create-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, email }),
        })
            .then(response => {
                return response.text();
            })
            .then(data => {
                console.log(data);
                if (JSON.parse(data)["code"] === "23505") {
                    console.log("23505 error code");
                    console.log("Your username is already taken.");
                }
                else {
                    console.log("Your account has been successfully created.");
                }
            });
    }

    return (
        <div className="signup-container">
            <div className="user-info-container">
                <div>
                    <form className="user-form">
                        <input type="text" id="email-form" name="email/" placeholder="Email..."></input>
                    </form>
                </div>
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
                <div>
                    <form className="user-form">
                        <input type="password" id="confirm-password-form" name="password/" placeholder="Confirm Password..."></input>
                    </form>
                </div>
            </div>
            <button onClick={() => createAccount()} className="account-button">
                <span>Create Account</span>
            </button>
        </div>

    )
}

export default CreateAccount