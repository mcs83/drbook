import React , { useState} from 'react';
import { NavLink } from 'react-router-dom';
import {withRouter} from 'react-router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import logo from "../../../static/assets/images/logo/logo-drbook.png";
import Logout from '../auth/logout';

const NavigationComponent = props => {
    const[isOpen, setIsOpen] = useState(false); //toggle the mobile menu-> show the X or the hamburger menu (thre bars)
    
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
        }else if(route ==="/login"){
            return(
               
                <NavLink to={route} activeClassName="nav-link-active">{linkText}  
                <FontAwesomeIcon icon = "sign-in-alt"/>
                </NavLink>
            );
        }else if(route ==="/logout"){
            return(
                <Logout removeToken={props.removeToken} />
            );
        }else{
            return(
                <NavLink to={route} activeClassName="nav-link-active">{linkText}
                </NavLink>
            );
        }
      };

    return (
        <div className = "nav-wrapper">
            <div className='nav-header'>
                <div className='nav-logo'>
                    <NavLink to="/" activeClassName="nav-link-active"><img src={logo}/>
                    </NavLink>
                </div>
                <div className='nav-cart'>
                    {dynamicLink("/shopping-cart", "Shopping cart")}
                </div>
                <div className='nav-auth'>
                    {!props.token && props.token!=="" && props.token!== undefined? dynamicLink("/login", "Login ") : dynamicLink("/logout", "Logout ") }
                </div>
            </div>
            <div className={`nav-items ${isOpen && "open"}`}>
                {dynamicLink("/about-drbook", "About Dr. Book")}
                {!props.token && props.token!=="" && props.token!== undefined? null : dynamicLink("/orders", "My orders")}
            </div>
            <div className={`nav-toggle ${isOpen && "open"}`} onClick={() => setIsOpen(!isOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
};
export default withRouter(NavigationComponent); //merged component 