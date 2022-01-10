import './Card.css';
import React from 'react';

//TODO: make description have a pop up that displays the whole description
export class Card extends React.Component {

    toCardProfile() {
        let titleFormat = String(this.props.card.title).replace(" ", "+")
        window.location.href = "/book/" + this.props.card.identifier + "/" + titleFormat;
    }

    render() {
        return (
            <div className="card">
                <img onClick={() => this.toCardProfile()} src={this.props.card.img} alt="Avatar" />
                <div className="container">
                    <h1 onClick={() => this.toCardProfile()} className="card-title">{this.props.card.title}</h1>
                    <p>Author(s): {this.props.card.author}</p>
                    <p>Pages: {this.props.card.pages}</p>
                </div>
            </div>
        )
    }
}

export default Card