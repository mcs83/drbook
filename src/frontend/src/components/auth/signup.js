import React, { Component } from 'react';
import axios from 'axios';

import signInPicture from '../../../static/assets/images/pages/sign-up.jpg';

export default class SignUp extends Component {
    constructor(props){
        super(props);
        this.state = {
            email:"",
            password:"",
            errorText:""
        }
        this.handleChangeSignUp = this.handleChangeSignUp.bind(this);
        this.handleSubmitSignUp = this.handleSubmitSignUp.bind(this);
    }

    handleSubmitSignUp(event){
        axios
        .post('https://mcs83.pythonanywhere.com/signup', //adds a new user and redirects the user to the login page
            {   email: this.state.email,
                password: this.state.password
            },
            { withCredentials: true }
        ).then(response =>{
            if(response.data.message === 'Successful signup'){
                this.props.history.push('/login'); //redirects to login page
            }else{
                this.setState({
                    errorText:'Wrong email syntax or the user already exists!'  
                }); 
            }
        }).catch(error=>{
            this.setState({
                errorText:'An error ocurred!'
            }); 
        });

        event.preventDefault(); //not to refresh the page- email password

    }
    handleChangeSignUp(event){
        this.setState({
            [event.target.name]: event.target.value, //for email and password
            errorText:"" //cleans the previous error
        });
    }

    render() {
        return (
            <div className='page-wrapper'>
                <div className='page-text'>
                    <h2>Sign up</h2>
                    <h3>After registering with your email and password, you will be automatically redirected to the login page.</h3>
                    <p style={{color:'#ff6341', fontSize:'1.2em'}}>{this.state.errorText}</p>
                    <div className='form-wrapper'>
                        <form className= 'form-wrapper-inputs' onSubmit={this.handleSubmitSignUp}>
                                <label htmlFor='email-info'>Email: </label>
                                <input type='email' 
                                name='email' 
                                id='email-info'
                                placeholder='Your email' 
                                value={this.state.email} 
                                onChange={this.handleChangeSignUp}/>

                                <label htmlFor='password-info'>Password: </label>
                                <input type='password'
                                name='password' 
                                id='password-info'
                                placeholder='Your password' 
                                value={this.state.password} 
                                onChange={this.handleChangeSignUp}/>
                                <div>
                                    <button className='btn' type='submit'>Sign Up</button>
                                </div>
                         </form>
                    </div>
                </div>
                <div className='page-img'>
                    <img src={signInPicture}/>
                </div>
            </div>
        );
    }
}