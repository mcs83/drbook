import React from 'react';
import { useState} from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from "react-router-dom";
import axios from "axios";

import signInPicture from '../../../static/assets/images/pages/home-picture.jpg';

function Login(props) {

    const [loginForm, setloginForm] = useState({
      email: "",
      password: "",
      errorText:""
    })
    const history = useHistory();

    function logIn(event) {
      axios
      .post("http://localhost:5000/token",
        {
          email: loginForm.email,
          password: loginForm.password
         },
      )
      .then((response) => {
        props.setToken(response.data.access_token)//comes from app.js via props
        if (localStorage.length>1) {//if the shopping cart has some items. First item is webpack-dev-server
          history.push("/shopping-cart"); //redirect to the cart
        } else {
          history.push("/"); //if not, redirect home
        }
      }).catch((error) => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
          if(error.response.status === 401){//unauthorized 
            updateErrorText("Wrong email or password!");
          }else{
            updateErrorText("An error occurred!");
          }
        }
      }) 

      setloginForm(({
        email: "",
        password: "",
        errorText:""
      }))

      event.preventDefault()
    }

    function handleChange(event) { 
      const {value, name} = event.target
      setloginForm(prevNote => ({//sets the email and password
          ...prevNote, [name]: value})
    )}

    function updateErrorText(newErrorText) {//sets the error text
        setloginForm(prevLoginForm => ({
          ...prevLoginForm,
          errorText: newErrorText
        }));
    }
  
    return (
      <div className='page-wrapper'>
        <div className='page-text'>
          <div className='form-wrapper'>
            <h2>Login</h2>
            <p style={{color:'#ff6341', fontSize:'1.2em'}}>{loginForm.errorText}</p>
              <form className= "form-wrapper-inputs">
              <label htmlFor="email-info">Email: </label>
                <input className= 'form-wrapper-input-email' onChange={handleChange} 
                      type="email"
                      name="email" 
                      id="email-info-login"
                      placeholder="Email" 
                      value={loginForm.email} />
                <label htmlFor="password-info">Password: </label>
                <input className= 'form-wrapper-input-password' onChange={handleChange} 
                      type="password"
                      name="password" 
                      id="password-info-login"
                      placeholder="Password" 
                      value={loginForm.password} />
              <div>
                <button className='btn' onClick={logIn}>Login</button>
            </div>
            </form>
          </div>
          <Link className = 'link' to="/sign-up">Are you new in Dr. Book's office? Sign up here!</Link>
        </div>
        <div className='page-img'>
            <img src={signInPicture}/>
        </div>
    </div>
      
    );
}export default Login;

