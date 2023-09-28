import React, { Component } from 'react';
import axios from 'axios';

import ordersPicture from '../../../static/assets/images/pages/orders.jpg';

export default class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            books:[],
            errorText:''
        };
        this.requestOrdersHistory= this.requestOrdersHistory.bind(this);
        this.displayDate= this.displayDate.bind(this);
    }

    componentDidMount() {
        this.requestOrdersHistory();
    }
    
    displayDate(date) {
        const dateTime = new Date(date);
        const datePart = dateTime.toLocaleDateString();//day info
        const timePart = dateTime.toLocaleTimeString(); //hours info
        return `${datePart} ${timePart}`;
    } 
   
    requestOrdersHistory(){  
        axios({
            method: "GET",
            url:"https://mcs83.pythonanywhere.com/orders-history",
            headers: { //authentication information must be sent like this for JWT token aknowledgement
              Authorization: 'Bearer ' + this.props.token
            } 
          }) 
          .then((response) => {
            const res =response.data
            this.setState({
                orders: response.data.orders, // the API responds with two arrays of objects
                books: response.data.books
            })
          }).catch((error) => {
            if (error.response) {
              console.log(error.response)
              console.log(error.response.status)
              console.log(error.response.headers)
              this.setState({
                errorText: 'Error loading data'
              });
            }
          })
    }

render(){
    return (
        <div className='page-wrapper'>
          <div className='page-text'>
            <h2>Your order history</h2>
            <p style={{color:'#ff6341', fontSize:'1.2em'}}>{this.state.errorText}</p>
          <ul>
             {this.state.orders.map((order, index) => (
             <li key={order.id}>
                <h3>Order n.{index + 1}</h3>
                <p>Date: {this.displayDate(order.date)} </p>
                <p>Address: {order.full_name} - {order.address}, {order.city}</p>
                <p>Total price: $ {order.total_price}</p>
                <h4>Books:</h4>
                <ul>
                    {order.quantity && //a nested map to relate each book with each order via Quantities array
                    Object.keys(order.quantity).map((bookId) => { //the keys in quantities are the book IDs
                        const book = this.state.books.find( //values in quantities are the number of each book ID (key)
                        (book) => book.id === parseInt(bookId, 10)
                        );
                        if (book) {
                        return (
                            <li key={book.id}>
                            "{book.title}" (Quantity: {order.quantity[bookId]}) 
                            </li>
                        );
                        }
                        return null;
                    })}
                </ul>
             </li> ))}
         </ul>
     </div>
    <div className='page-img'>
        <img src={ordersPicture}/>
    </div>
</div>
);
}
}