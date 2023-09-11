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

library.add(faMinus, faPlus, faTrash, faSignInAlt, faSignOutAlt,faCopyright, faMarker,faStethoscope, faBook, faCartShopping, faChevronRight);//revisar todossss-trash

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loggedInStatus: "NOT_LOGGED_IN"
    };
    this.handleSuccessfulLogin = this.handleSuccessfulLogin.bind(this);
    this.handleUnSuccessfulLogin = this.handleUnSuccessfulLogin.bind(this);
    this.handleSuccessfulLogout = this.handleSuccessfulLogout.bind(this);
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
      }
    }).catch(error=>{
      console.log("Error", error);
    });
  }
  
  componentDidMount(){
    this.checkLoginStatus();
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
              <Route exact path="/shopping-cart" component ={ShoppingCart}/>
              <Route exact path="/library" component ={Library}/>
              <Route exact path="/sign-up" component ={SignUp}/>
              <Route path="/sign-in" render={props=>(//access to the props
                <SignIn 
                  {...props} //overwrite and pass functions
                  handleSuccessfulLogin={this.handleSuccessfulLogin}
                  handleUnSuccessfulLogin={this.handleUnSuccessfulLogin}
                />
              )}/>
              <Route component ={NoMatch}/> 
            </Switch>
          </div>
        </Router>
        <div className='footer'>Thanks for visiting DrBook on {moment().format("MMM Do YYYY")} - Copyright Dr. Book Inc. <FontAwesomeIcon icon = "copyright" style={{color: "#f56241",}}/> </div>
      </div>
    );
  }
}
