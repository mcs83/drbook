import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import thanksPicture from '../../../static/assets/images/pages/thanks.jpg';

export default class SuccessfulPayment extends Component {
   
    constructor(props) {
        super(props);
        this.state = {
          errorText: '',
        };
        this.changeOrderStatus = this.changeOrderStatus.bind(this);
      }

      componentDidMount() {
        this.changeOrderStatus();
      }

      changeOrderStatus() {//change order status to completed, we know that the user has paid because Stripe redirects to this page
        const queryParams = new URLSearchParams(window.location.search);
        const orderId = queryParams.get("id"); // the id of current order is in the URL given by checkout.js
        const {token}= this.props;
        const decodedToken = jwt.decode(token);//decodes the token to access the expiration date
     
        if(decodedToken && decodedToken.exp * 1000 < Date.now()){
         //if the token has expired
         this.setState({
            errorText: 'Session expired. Please log out and log in again',
          });
        }else{
            axios({
                method: "POST",
                url:"https://mcs83.pythonanywhere.com/order-status",
                headers: { //authentication information must be sent like this for JWT token aknowledgement
                Authorization: 'Bearer ' + token
                }, data: {'id': orderId}
            })
          .then((response) => {
          //Now the order is saved
          
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
        }
        render() {
            return (
            <div className='page-wrapper'>
                <div className='page-text'>
                    <h2>Successful payment</h2>
                    <p>Thanks for your purchase!</p>
                    <p style={{color:'#ff6341', fontSize:'1.2em'}}>{this.state.errorText}</p>
                    <Link className="link" to="./orders">See my order history</Link> 
                </div>
                <div className='page-img'>
                    <img src={thanksPicture}/>
                </div>
            </div>
            );
        }

}