import React, { Component } from 'react';
import axios from 'axios';

import checkoutPicture from '../../../static/assets/images/pages/shopping-cart.jpg';

export default class Checkout extends Component {//for integration with Stripe payments
    constructor(props){
        super(props);
        this.state = {
            books: [],//books added to the shopping cart
            quantities:{},
            totalAmount: 0,
            errorText:"",
            fullName: "",
            address: "",
            city: "",
            postalCode: "",
            shippingPrice: 5, //flat rate 5$
            token:""
        };
        this.handleChange = this.handleChange.bind(this);
        this.submitOrder = this.submitOrder.bind(this);
        this.calculateTotalAmount = this.calculateTotalAmount.bind(this);
        this.clearData = this.clearData.bind(this);
        this.sendOrderData = this.sendOrderData.bind(this);
    }
  
    componentDidMount() {
        // Fetches the content of the shopping cart from the location sate when pressing the button
        const { location } = this.props; //obtains the location
        if (location && location.state) {
         const { books, quantities, token } = location.state;
          this.setState({ books, quantities, token },() =>{//now the shopping cart items and the token are loaded
          this.calculateTotalAmount(books, quantities);//calculates the total price of the order
          });
        }
    }
       
    calculateTotalAmount = (books, quantities) => {
        let totalPrice = 0;
        books.forEach((book) => {
            const quantity = quantities[book.id];
            totalPrice += book.price * quantity;
        });
        this.setState({
            totalAmount: totalPrice + this.state.shippingPrice//keeps track of the total amount in the estate
        }); 
    }   
        
    submitOrder = (event) => { 
        event.preventDefault(); //not to refresh the page
        const lineItems = []; //prepare data for creating a Stripe buy link: Stripeprice ID and quantity
        this.state.books.forEach((book) => {
            const bookQuantity = this.state.quantities[book.id];
            lineItems.push({
              price: book.stripe_price,
              quantity: bookQuantity,
            });
            return lineItems;
          });
          
        const order = { line_items: lineItems };

        axios
        .post("http://localhost:5000/checkout", order)
        .then(response => {
          const responseUrl = response.data; // answer of Stripe
          window.location.href = responseUrl; //redirects to the Stripe link
          this.sendOrderData(); //stores the order data in the API
        })
        .catch(error => {
          console.log(error);
        });
    }

    sendOrderData(){  
      const { books, quantities, fullName, address, city, postalCode, totalAmount, token } = this.state;

      const orderData= {
        quantity: quantities,
        full_name: fullName,
        address: address,
        city: city,
        postal_code: postalCode,
        total_price: totalAmount
      }
  
        axios({
          method: "POST",
          url:"http://localhost:5000/order",
          headers: { //authentication information must be sent like this for JWT token aknowledgement
            Authorization: 'Bearer ' + token
          }, data: orderData
        })
        .then((response) => {
          const res =response.data
          console.log("orderresponse",res);
          this.clearData(); //when the order is saved in the DB Orders, clears the local storage except for the token
        }).catch((error) => {
          if (error.response) {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)
          }
        })
  }
  
   clearData(){
    this.setState = {
      books: [],
      quantities:{},
      totalAmount: 0,
      errorText:"",
      fullName: "",
      address: "",
      city: "",
      postalCode: ""
    };
    //empty the shopping cart that was kept in the local storage but don't erase the authorization token
    console.log("estoy en el for casi");
    for (let key in localStorage){
      if (key === 'token') {
        localStorage.getItem(key);
        console.log("estoy en el if de no borrar");
      }else{   
        localStorage.removeItem(key);
      }
    } console.log("he salido del for");
  }

  handleChange(event){  
    this.setState({
        [event.target.name]: event.target.value, //for all the inputs
        errorText:"" //cleans the previous error
    });
}
render(){
  return (
    <div className='page-wrapper'>
        <div className='page-text'>
            <h2>Checkout</h2> 
            <div>
              <h3>Summary of your order:</h3>
              <ul>
                  {this.state.books.map((book, index) => (
                  <li key={book.id}>
                      <span>Book {index+1}: "{book.title}"</span>
                      <span> x {this.state.quantities[book.id]}</span> = $ {book.price * this.state.quantities[book.id]}
                  </li>
                  ))} 
                  <h4>Shipping: $ {this.state.shippingPrice}</h4>
                  <h3>Total: $ {this.state.totalAmount}</h3>
              </ul>
            </div>
            <div className='form-wrapper'>
                <div>{this.state.errorText}</div>
                <form className= 'form-wrapper-inputs' onSubmit={(event) => this.submitOrder(event, this.state.books, this.state.quantities)}>
                    <label htmlFor='full-name'>Name and surname: </label>
                    <input type='text' 
                    name='fullName' 
                    id='full-name'
                    placeholder='Your full name' 
                    value={this.state.fullName} 
                    onChange={this.handleChange}
                    required/>

                    <label htmlFor='address-info'>Address: </label>
                    <input type='text' 
                    name='address' 
                    id='address-info'
                    placeholder='Your address' 
                    value={this.state.address} 
                    onChange={this.handleChange}
                    required/>

                    <label htmlFor='city-info'>City: </label>
                    <input type='text' 
                    name='city' 
                    id='city-info'
                    placeholder='Your city' 
                    value={this.state.city} 
                    onChange={this.handleChange}
                    required/>

                    <label htmlFor='postal-code'>Postal code: </label>
                    <input type='text' 
                    name='postalCode' 
                    id='postal-code'
                    placeholder='P.C.' 
                    value={this.state.postalCode} 
                    onChange={this.handleChange}
                    required/>

                    <div>
                        <button className='btn' type='submit'>Submit data</button>
                    </div>
                </form> 
            </div>
         </div>
      <div className='page-img'>
        <img src={checkoutPicture}/>
      </div>
    </div>
    );
  }
}


