import React , { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import {withRouter} from 'react-router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import logo from "../../../static/assets/images/logo/logo-drbook.png";

const NavigationComponent = props => {
    const[isOpen, setIsOpen] = useState(false); //toggle the menu
    
    const dynamicLink = (route, linkText) => {//to render each link
        if(route ==="/shopping-cart"){
            return(
                    <NavLink to={route} activeClassName="nav-link-active">
                        <FontAwesomeIcon icon = "cart-shopping"/>
                        <span style={{ position: 'relative', top: '-8px', fontSize: '0.8em', margin:'2px'}}>
                        {props.cartQuantitiesCount} 
                        </span>
                    </NavLink>
            //cartQuantitiesCount is the number of books items to display in the cart icon
            );
        }else if(route ==="/sign-in"){
            return(
                    <NavLink to={route} activeClassName="nav-link-active">{linkText}  
                    <FontAwesomeIcon icon = "sign-in-alt"/>
                    </NavLink>
            );
        }else if(route ==="/sign-out"){
            return(
                   <a onClick={handleSignOut}>{linkText}<FontAwesomeIcon icon = "sign-out-alt"/></a>
            );
        }else{
            return(
                <NavLink to={route} activeClassName="nav-link-active">{linkText}
                </NavLink>
            );
        }
      };

    const handleSignOut = () => {
        axios
          .post("http://localhost:5000/logout", { withCredentials: true })
          .then(response => {
            if (response.data.message === "Successful logout") {//successful logout
              props.handleSuccessfulLogout();
              props.history.push("/");
            }console.log(response)
            return response.data;
          })
          .catch(error => {
            console.log("Error signing out", error);
          });
      };
    return (
        <div className = "nav-wrapper">
            <div className='nav-logo'>
            <NavLink to="/" activeClassName="nav-link-active"><img src={logo}/>
                </NavLink>
            </div>
            <div className={`nav-items ${isOpen && "open"}`}>
                {dynamicLink("/about-drbook", "About Dr. Book")}
                {dynamicLink("/shopping-cart", "Shopping cart")}
                {props.loggedInStatus === "LOGGED_IN" ? dynamicLink("/sign-out", "Sign out ") : dynamicLink("/sign-in", "Sign in ") }
                {props.loggedInStatus === "LOGGED_IN" ? dynamicLink("/orders", "My orders"):null}
            </div>
            <div className={`nav-toggle ${isOpen && "open"}`} onClick={() => setIsOpen(!isOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
};
export default withRouter(NavigationComponent); //merged component <div className={`nav-items ${isOpen && "open"}`}> <div className={`nav-toggle ${isOpen && "open"}`} onClick={() => setIsOpen(!isOpen)}>