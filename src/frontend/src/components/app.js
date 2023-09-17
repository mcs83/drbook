import React, { Component } from 'react';
import moment from 'moment';
import axios from 'axios'
import{
  BrowserRouter as Router,
  Switch,
  Route
}from 'react-router-dom';


import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash, faSignInAlt, faSignOutAlt, faCopyright, faMarker, faStethoscope, faBook, faCartShopping, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import NavigationContainer from './navigation/navigation-container';
import Home from './pages/home';
import About from './pages/about';
import ShoppingCart from './pages/shopping-cart';
import SignIn from './pages/sign-in';
import NoMatch from './pages/no-match';
import Library from './pages/library';
import SignUp from './auth/signup';
import Checkout from './pages/checkout';
import SuccessfulPayment from './pages/successful-payment';
import Orders from './pages/orders';



library.add(faMinus, faPlus, faTrash, faSignInAlt, faSignOutAlt,faCopyright, faMarker,faStethoscope, faBook, faCartShopping, faChevronRight);//revisar todossss-trash

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loggedInStatus: "NOT_LOGGED_IN",
    };
    this.handleSuccessfulLogin = this.handleSuccessfulLogin.bind(this);
    this.handleUnSuccessfulLogin = this.handleUnSuccessfulLogin.bind(this);
    this.handleSuccessfulLogout = this.handleSuccessfulLogout.bind(this);
    this.authorizedRoutes = this.authorizedRoutes.bind(this);
    this.checkLoginStatus = this.checkLoginStatus.bind(this);
    }

  handleSuccessfulLogin(){
    this.setState({
      loggedInStatus: "LOGGED_IN"
    });
  }
  handleUnSuccessfulLogin(){
    this.setState({
      loggedInStatus: "NOT_LOGGED_IN"
    });
  }
  handleSuccessfulLogout(){
    this.setState({
      loggedInStatus: "NOT_LOGGED_IN"
    }); 
    const cookieName = "session"; 
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;SameSite=None; Secure`;
  }
  checkLoginStatus(){
   return axios
   .get("http://localhost:5000/check-auth", {withCredentials: true}
    ).then(response=>{
      const loggedIn = response.data.authenticated; //Successful login or not successful
      const loggedInStatus = this.state.loggedInStatus;

    //If loggedIn and status LOGGED_IN -> return data
      if (loggedIn && loggedInStatus === "LOGGED_IN"){
        return loggedIn;
        // If loggedIn status NOT_LOGGED_IN -> update state
      }else if (loggedIn && loggedInStatus === "NOT_LOGGED_IN"){
        this.setState({ loggedInStatus: "LOGGED_IN"});
        // If not loggedIn status LOGGED_IN -> update state
      }else if (!loggedIn && loggedInStatus === "LOGGED_IN"){
        this.setState({ loggedInStatus: "NOT_LOGGED_IN"});
      }console.log("loggedInresponse", loggedIn);
      console.log("loggedInStatus", this.state.loggedInStatus);
    }).catch(error=>{
      console.log("Error", error);
    });
  }
  
  componentDidMount(){
    this.checkLoginStatus();
  }
  authorizedRoutes(){
    return[ //not to access in the navigation bar if the user is not logged in
      <Route key={"successfulPaymentPage"} path="/successful-payment" component ={SuccessfulPayment}/>,
      <Route key={"ordersPage"} path="/orders" component ={Orders}/>,
      <Route key={"checkoutPage"} path="/checkout" component ={Checkout}/>];
  }

  render() {
    return (
      <div className='container'>
        <Router>
          <div>
            <NavigationContainer 
              loggedInStatus={this.state.loggedInStatus}
              handleSuccessfulLogout={this.handleSuccessfulLogout}
            />
            <Switch>
              <Route exact path="/" component ={Home}/>
              <Route path="/about-drbook" component ={About}/>
              <Route path="/shopping-cart" render={(props) => (
               <ShoppingCart loggedInStatus={this.state.loggedInStatus} //access loggedInStatus via props
                      {...props}/>)}/>
              <Route path="/library" component ={Library}/>
              <Route exact path="/sign-up" component ={SignUp}/>
              <Route path="/sign-in" render={(props)=>(//access to the props
                <SignIn 
                  {...props} //overwrite and pass functions
                  handleSuccessfulLogin={this.handleSuccessfulLogin}
                  handleUnSuccessfulLogin={this.handleUnSuccessfulLogin}
                />
              )}/>
               {this.state.loggedInStatus === "LOGGED_IN" ? this.authorizedRoutes() : null}
              <Route component ={NoMatch}/> 
            </Switch>
          </div>
        </Router>
        <div className='footer'>Thanks for visiting DrBook on {moment().format("MMM Do YYYY")} - Copyright Dr. Book Inc. <FontAwesomeIcon icon = "copyright" style={{color: "#f56241",}}/> </div>
      </div>
    );
  }
}