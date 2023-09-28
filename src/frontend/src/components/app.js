import React, { Component } from 'react';
import moment from 'moment';
import{
  BrowserRouter as Router,
  Switch,
  Route
}from 'react-router-dom';
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash, faSignInAlt, faSignOutAlt, faCopyright, faMarker, faStethoscope, faBook, faCartShopping, faChevronRight} from "@fortawesome/free-solid-svg-icons";

import NavigationContainer from './navigation/navigation-container';
import Home from './pages/home';
import About from './pages/about';
import ShoppingCart from './pages/shopping-cart';
import NoMatch from './pages/no-match';
import Library from './pages/library';
import SignUp from './auth/signup';
import Orders from './pages/orders';
import {TokenProvider} from './auth/token-provider';
import Login from './auth/login';
import Logout from './auth/logout';
import SuccessfulPayment from './pages/successful-payment';


library.add(faMinus, faPlus, faTrash, faSignInAlt, faSignOutAlt,faCopyright, faMarker,faStethoscope, faBook, faCartShopping, faChevronRight);

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      cartQuantitiesCount: 0, //number of books in the cart
    };
    this.authorizedRoutes = this.authorizedRoutes.bind(this);
    this.cartBooksCount = this.cartBooksCount.bind(this);

  }

  cartBooksCount = () => {
    const allQuantities = {};
    let sumQuantity = 0;

    // Loop through localStorage numeric keys to calculate total quantity
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (!isNaN(key)) {
        const bookId = parseInt(key, 10);
        const quantity = JSON.parse(localStorage.getItem(key));

        allQuantities[bookId] = quantity;
        sumQuantity += quantity;
      }
    }

    // Update cartItemCount in the state
    this.setState({
      cartQuantitiesCount: sumQuantity,
    });
  }
  
  componentDidMount(){
    this.cartBooksCount();
  }

  authorizedRoutes(token){
    return[ //not to access via the navigation bar if the user is not logged in
      <Route key={"successfulPaymentPage"} path="/successful-payment/" render={(props) => (
        <SuccessfulPayment
        token={token}
        {...props}/>
      )}/>,
      <Route key={"ordersPage"} path="/orders" render={(props) => (
        <Orders
        token={token}
        {...props}/>
      )}/>];
  }

  render() {
    return (
      <div className='container'>
        <TokenProvider>
         {(token, removeToken, setToken) => (//receives the token value and functions
          <Router>
              <NavigationContainer 
                cartQuantitiesCount={this.state.cartQuantitiesCount}//goes to the shooping cart icon in navbar
                removeToken={removeToken} //for Logout
                token={token} // for authentication
                setToken={setToken} // for Login
              />
              <Switch>
                <Route exact path="/" render={(props) => (
                  <Home 
                    cartBooksCount={this.cartBooksCount} //access cartBooksCount function via props
                  {...props}/>
                )}/>
                <Route path="/about-drbook" component ={About}/>
                <Route path="/shopping-cart" render={(props) => (
                  <ShoppingCart 
                    token={token}
                    cartBooksCount={this.cartBooksCount} 
                  {...props}/>
                )}/>
                <Route path="/library" render={(props) => (
                    <Library 
                    cartBooksCount={this.cartBooksCount} //access cartBooksCount function via props
                    {...props}/>
                )}/>
                <Route exact path="/sign-up" component ={SignUp}/>
                <Route path="/login" render={(props)=>(//access to the props
                  <Login 
                    setToken={setToken}
                    token={token}    
                    {...props}/>
                )}/> 
                <Route path="/logout" render={(props)=>(//access to the props
                  <Logout
                    removeToken={removeToken}   
                    {...props}/>
                )}/> 
                {!token && token!=="" && token!== undefined? null: (this.authorizedRoutes(token, this.state.books, this.state.quantities))}
                <Route component ={NoMatch}/> 
              </Switch>
           </Router>
        )}
        </TokenProvider>
        <div className='footer'>Thanks for visiting DrBook on {moment().format("MMM Do YYYY")} - Copyright Dr. Book Inc. <FontAwesomeIcon icon = "copyright" style={{color: "#f56241"}}/> </div>   
      </div>
    );
  }
}