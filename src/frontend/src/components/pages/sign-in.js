import React, { Component } from 'react';
import { Link } from "react-router-dom";

import Login from '../auth/login'

import signInPicture from '../../../static/assets/images/pages/home-picture.jpg';

export default class SignIn extends Component {
    constructor(props){
        super(props);
        this.handleSuccessfulSignIn = this.handleSuccessfulSignIn.bind(this);
        this.handleUnSuccessfulSignIn = this.handleUnSuccessfulSignIn.bind(this);
    }
    handleSuccessfulSignIn(){
        this.props.handleSuccessfulLogin();
        if (localStorage.length>1) {//if the shopping cart has some items. First item is webpack-dev-server
            this.props.history.push("/shopping-cart"); //redirect to the cart
        } else {
            this.props.history.push("/"); //if not, redirect home
        }
    }
    handleUnSuccessfulSignIn(){
        this.props.handleUnSuccessfulLogin();
    }
    render(){
        return (
            <div className='page-wrapper'>
                <div className='page-text'>
                    <h2>Sign in</h2>
                    <Login
                    handleSuccessfulSignIn = {this.handleSuccessfulSignIn}
                    handleUnSuccessfulSignIn = {this.handleUnSuccessfulSignIn}
                    />
                    <Link className = 'link' to="/sign-up">Are you new in Dr. Book's office? Sign up here!</Link>
                </div>
                <div className='page-img'>
                    <img src={signInPicture}/>
                </div>
            </div>
        );
    }
}