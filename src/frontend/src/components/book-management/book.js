import React from 'react';
import bookCoverImagesUrlsArray from "./book-cover-images-urls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Book({ item }) {
   
    const addToCart = (book) => {
        const currentQuantity = getCurrentQuantity(book.id);
        localStorage.setItem(book.id, currentQuantity + 1);//storage of the book id and its quantity
      };
      const getCurrentQuantity = (id) => {
        const quantity = localStorage.getItem(id);
        return quantity ? parseInt(quantity) : 0; //if the user clicks twice, the quantity will be 2
    };
      
    const { id, title, author, year, description, pages, mood, price} = item;



    return (
        <div className="web-item-wrapper">
            <div className="web-item-img">
                <img src={bookCoverImagesUrlsArray[id - 1]} alt={title} />
            </div>
            <div className="web-item-text">
                <div className="web-item-text-column-left">
                    <p className="title">{title}</p>
                    <p>
                        <FontAwesomeIcon icon="marker" style={{ color: "#f56241" }} /> {author} in {year}
                    </p>
                    <p className="description">
                        <FontAwesomeIcon icon="chevron-right" style={{ color: "#f56241" }} /> {description}
                    </p>
                    <p>
                        <FontAwesomeIcon icon="book" style={{ color: "#f56241" }} /> {pages} pages
                    </p>
                    <p>
                        <FontAwesomeIcon icon="stethoscope" style={{ color: "#f56241" }} /> {mood}
                    </p>
                </div>
                <div className="web-item-text-column-right">
                    <p className="price">$ {price}</p>
                    <button className="btn" onClick={() => addToCart(item)}>Add to the shopping cart</button>
                </div>
            </div>
        </div>
    );
}
