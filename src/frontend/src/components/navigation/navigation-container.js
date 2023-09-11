import React from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import {withRouter} from 'react-router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NavigationComponent = props => {
    
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
}
    const handleSignOut = () => {
        axios
          .post("http://localhost:5000/logout", { withCredentials: true })
          .then(response => {
            if (response.status === 200) {//successful logout
              props.history.push("/");
              props.handleSuccessfulLogout();
            }
            return response.data;
          })
          .catch(error => {
            console.log("Error signing out", error);
          });
      };
    return (
        <div className = "nav-wrapper">
            <div className='left-side'>
                <div className = "nav-link-wrapper">
                    <NavLink exact to="/" activeClassName="nav-link-active">
                        Home
                    </NavLink>
                </div>
                <div className = "nav-link-wrapper">
                    <NavLink to="/about-drbook" activeClassName="nav-link-active">
                        About
                    </NavLink>
                </div>
            </div>
            <div className='right-side'>
                <div className = "nav-link-wrapper">
                        <NavLink to="/shopping-cart" activeClassName="nav-link-active">
                        <FontAwesomeIcon icon = "cart-shopping"/>
                        {cartQuantitiesCount()}
                        </NavLink>
                    </div>
                    <div className = "nav-link-wrapper">
                      {props.loggedInStatus === "LOGGED_IN" ? (<a onClick={handleSignOut}>Sign Out <FontAwesomeIcon icon = "sign-out-alt"/></a>) :  <NavLink to="/sign-in" activeClassName="nav-link-active">
                        Sign In  <FontAwesomeIcon icon = "sign-in-alt"/></NavLink>}
                    </div>
            </div>
        </div>
    );
};
export default withRouter(NavigationComponent); //merged component