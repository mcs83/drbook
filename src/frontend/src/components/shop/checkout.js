import React, { Component } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';

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
        //fetches the content of the shopping cart
       const { books, quantities, token } = this.props;
       this.setState({ books, quantities, token })//now the shopping cart items and the token are loaded
       this.calculateTotalAmount(books, quantities);//calculates the total price of the order
    }

    componentDidUpdate(prevProps) {
        //compares new and previous props
        if (prevProps.books !== this.props.books || prevProps.quantities !== this.props.quantities || prevProps.token !== this.props.token) {
          const { books, quantities, token } = this.props;
      
          //updates the state with the new props
          this.setState({ books, quantities, token });

          this.calculateTotalAmount(books, quantities);
        }
      }
       
    calculateTotalAmount = (books, quantities) => {
        //calculates the total amount to pay 
        let totalPrice = 0;
        books.forEach((book) => {
            const quantity = quantities[book.id];
            totalPrice += book.price * quantity;
        });
        this.setState({
            totalAmount: Number((totalPrice + this.state.shippingPrice).toFixed(2)) //keeps track of the total amount in the state with 2 decimals
        }); 
    }   
        
    submitOrder(orderId){ //order id goes to the url os successful-payment page when the user pays, so that order status changes to completed
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
      
        axios({
          method: "POST",
          url:"https://mcs83.pythonanywhere.com/checkout",
          data: {order, orderId}
        }) 
        .then(response => {
          const responseUrl = response.data; //answer of Stripe
          window.location.href = responseUrl; //redirects to the Stripe link
          this.clearData();
        
        })
        .catch(error => {
          console.log(error);
            this.setState({
              errorText:'An error ocurred requesting the payment link!'
          }); 
        });
    }
    
  
     //stores a the order with draft status 
    sendOrderData = (event) => { 
      event.preventDefault(); //not to refresh the page
      const { quantities, fullName, address, city, postalCode, totalAmount, token } = this.state;
      const orderData= {
        quantity: quantities,
        full_name: fullName,
        address: address,
        city: city,
        postal_code: postalCode,
        total_price: totalAmount,
        status: "draft"
      }
      const decodedToken = jwt.decode(token);//decodes the token to access the expiration date
     
      if(decodedToken && decodedToken.exp * 1000 < Date.now()){ //if the token has expired
        this.setState({
          errorText:'Your session has expired. Please log out and then log in again.'
        });
      }else{
            axios({
              method: "POST",
              url:"https://mcs83.pythonanywhere.com/order",
              headers: { //authentication information must be sent like this for JWT token aknowledgement
                Authorization: 'Bearer ' + token
              }, data: orderData
            })
            .then((response) => {
              this.submitOrder(response.data.id); 
            }).catch((error) => {
              if (error.response) {
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
                  this.setState({
                    errorText:'An error occurred saving your data!'
                }); 
              }
            })
          }
      }
  
   clearData() {
    this.setState({
      books: [],
      quantities:{},
      totalAmount: 0,
      errorText:"",
      fullName: "",
      address: "",
      city: "",
      postalCode: ""
    });
    //empty the shopping cart that was kept in the local storage but don't erase the authorization token
    
    for (let key in localStorage){
      if (key === 'token') {
        localStorage.setItem(key, localStorage.getItem(key));
  
      }else{   
        localStorage.removeItem(key);
      }
    }
  }

  handleChange(event){  
    this.setState({
        [event.target.name]: event.target.value, //for all the inputs
        errorText:"" //cleans the previous error
    });
  }
render(){
  return (
  <div className='form-wrapper'>
      <div>
          <h3>Summary of your order:</h3>
          <ul>
              {this.state.books.map((book, index) => (
              <li key={book.id}>
                  <span>Book {index+1}: "{book.title}"</span>
                  <span> x {this.state.quantities[book.id]}</span> = $ {Number(book.price * this.state.quantities[book.id]).toFixed(2)}
              </li>
              ))} 
              <h4>Shipping: $ {this.state.shippingPrice}</h4>
              <h3>Total: $ {this.state.totalAmount}</h3>
          </ul>
      </div>
        <p style={{color:'#ff6341', fontSize:'1.2em'}}>{this.state.errorText}</p>
          <form className= 'form-wrapper-inputs' onSubmit={(event) => this.sendOrderData(event)}>
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
    );
  }
}