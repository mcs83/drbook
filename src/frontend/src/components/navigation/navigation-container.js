import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import {withRouter} from 'react-router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NavigationComponent = props => {
    const [cartItemCount, setCartItemCount] = useState(0);
    
    const dynamicLink = (route, linkText) => {//to render each link
        if(route ==="/shopping-cart"){
            return(
                <div className = "nav-link-wrapper">
                        <NavLink to={route} activeClassName="nav-link-active">
                            <FontAwesomeIcon icon = "cart-shopping"/>
                            <span style={{ position: 'relative', top: '-8px', fontSize: '0.8em', margin:'2px'}}>
                            {cartItemCount}
                            </span>
                        </NavLink>
                    </div>
            );
        }else if(route ==="/sign-in"){
            return(
                <div className = "nav-link-wrapper">
                    <NavLink to={route} activeClassName="nav-link-active">{linkText}  
                    <FontAwesomeIcon icon = "sign-in-alt"/>
                    </NavLink>
                </div>
            );
        }else if(route ==="/sign-out"){
            return(
                <div className = "nav-link-wrapper">
                   <a onClick={handleSignOut}>{linkText}<FontAwesomeIcon icon = "sign-out-alt"/></a>
                </div>
            );
        }else{
            return(
                <div className="nav-link-wrapper">
                <NavLink to={route} activeClassName="nav-link-active">{linkText}
                </NavLink>
                </div>
            );
        }
      };
      useEffect(() => {
        const cartQuantitiesCount = () => {
        const allQuantities = {};
        let sumQuantity =0; //to display the number of items in the shopping cart
        // for all the keys in localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i); //current key
            // ensure that the key is a number
            if (!isNaN(key)) {
                const bookId = parseInt(key, 10); // convert the key in a number
                const quantity = JSON.parse(localStorage.getItem(key)); // obtain and parse the quantity
                // add the book and the quantity to the object
                allQuantities[bookId] = quantity;
                sumQuantity += quantity;//total number of books in the shopping cart
            }
        }
        return sumQuantity;
    };
    // Call the cartQuantitiesCount function to get the updated count
    const itemCount = cartQuantitiesCount();

    // Update the cartItemCount state with the item count
    setCartItemCount(itemCount);
  }, []); // Empty dependency array ensures this effect runs once on mount

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
            <div className='left-side'>
                {dynamicLink("/", "Home")}
                {dynamicLink("/about-drbook", "About")}
            </div>
            <div className='right-side'>
                {dynamicLink("/shopping-cart", "Shopping cart")}
                {props.loggedInStatus === "LOGGED_IN" ? dynamicLink("/sign-out", "Sign out ") : dynamicLink("/sign-in", "Sign in ") }
                {props.loggedInStatus === "LOGGED_IN" ? dynamicLink("/orders", "Orders"):null}
            </div>
        </div>
    );
};
export default withRouter(NavigationComponent); //merged component
