import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import bookCoverImagesUrlsArray from "../book-management/book-cover-images-urls";

export default class ShoppingCart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [], //books added to the shopping cart
            loading: false,
            quantities: 0
        };
        this.getShoppingCart = this.getShoppingCart.bind(this);
        this.removeFromCart = this.removeFromCart.bind(this);
        this.changeQuantity = this.changeQuantity.bind(this);

    }

    componentDidMount() {
        this.getShoppingCart();
    }
    removeFromCart(id) {
        localStorage.removeItem(id);
        this.getShoppingCart();//refresh
    }
    
    changeQuantity(id, quantity) {
        if (quantity <= 0) {
            this.removeFromCart(id);
        }
        else {
            localStorage.setItem(id, quantity);
        }
        this.getShoppingCart();//refresh

    }
    getShoppingCart() { //get the selected books from API, according to the selected book in the shopping cart 
        // allBooks storages the selected books and quantities
        const allQuantities = {};

        // for all the keys in localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i); //current key

            // ensure that the key is a number
            if (!isNaN(key)) {
                const bookId = parseInt(key, 10); // convert the key in a number
                const quantity = JSON.parse(localStorage.getItem(key)); // obtain and parse the quantity

                // add the book and the quantity to the object
                allQuantities[bookId] = quantity;
            }
        }
        console.log('todosloslibros', allQuantities);
        let queryString = ''; //initialize the query string
        //obtain the query string
        for (const bookId in allQuantities) {
            if (queryString !== '') {
                //if there is any query id, add "&"
                queryString += '&';
            }
            //add the book id to the query
            queryString += `id=${bookId}`;
        }
        console.log("querystring", queryString);
        axios
            .get(`http://localhost:5000/books/request?${queryString}`)// example: http://localhost:5000/books/request?id=9&id=4
            .then(response => {
                this.setState({
                    books: response.data.books,
                    quantities: allQuantities,//storages quantities in the state
                    loading: false
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
    render() {
        const { books, quantities, loading } = this.state;

        if (loading) {
            return <p>Loading...</p>;
        }

        return (
            <div className='page-wrapper'>
                <div className='page-text'>
                    <h2>Voilà your shopping cart</h2>
                    <h3>This is the beginning of a better stage in your life.</h3>
                    {books.map((item, index) => (
                        <div className="cart-item" key={item.id}>
                            <div className="cart-item-info">
                                <p>Title: {item.title}</p>
                                <p>Author: {item.author}</p>
                                <p>Price: ${item.price}</p>
                                <p>
                                    Quantity: 
                                    <button className="btn-small" onClick={() => this.changeQuantity(item.id, quantities[item.id] - 1)}><FontAwesomeIcon icon="minus" style={{ fontSize: '10px'}}/>
                                    </button>
                                    {quantities[item.id]}
                                    <button className="btn-small" onClick={() => this.changeQuantity(item.id, quantities[item.id] + 1)}><FontAwesomeIcon icon="plus" style={{ fontSize: '10px'}}/>
                                     </button>
                                </p>
                                <button className="btn" onClick={() => this.removeFromCart(item.id)}><FontAwesomeIcon icon="trash" /> </button>
                            </div>
                            <div className="cart-item-image">
                                <img src={bookCoverImagesUrlsArray[item.id - 1]} alt={item.title} />
                            </div>
                        </div>
                    ))}
                    <Link className='link' to="/">Return to Home Page </Link>
                </div>
            </div>
        );
    }
}
