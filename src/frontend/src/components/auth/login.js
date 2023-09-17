import React, { Component } from 'react';
import axios from 'axios';

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            email:"",
            password:"",
            errorText:""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event){
        axios
        .post("http://localhost:5000/login", //session creation
        {
                email: this.state.email,
                password: this.state.password
        },
        { withCredentials: true }
        ).then(response =>{
            if(response.data.message === "Successful login"){
                this.props.handleSuccessfulSignIn();
            }else{
                this.setState({
                    errorText:"Wrong email or password"
                   
                }); 
                this.props.handleUnSuccessfulSignIn();
                   
            }
        }).catch(error=>{
            this.setState({
                errorText:"An error ocurred"
            }); 
            this.props.handleUnSuccessfulSignIn();
        });

        event.preventDefault(); //not to refresh the page- email password

    }
    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value, //for email and password
            errorText:"" //cleans the previous error
        });
    }

    render() {
        return (
            <div className='form-wrapper'>
                <div>{this.state.errorText}</div>
                <form className= 'form-wrapper-inputs' onSubmit={this.handleSubmit}>
                    <label>Email: </label>
                    <input className= 'form-wrapper-input-email' type='email' 
                    name='email' 
                    placeholder='Your email' 
                    value={this.state.email} 
                    onChange={this.handleChange}/>

                    <label>Password: </label>
                    <input className= 'form-wrapper-input-password'type='password'
                    name='password' 
                    placeholder='Your password' 
                    value={this.state.password} 
                    onChange={this.handleChange}/>

                    <div>
                        <button className='btn' type='submit'>Login</button>
                    </div>
                </form>
            </div>
        );
    }
}