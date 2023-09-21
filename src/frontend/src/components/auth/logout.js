import React from 'react';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from 'react-router-dom';

function Logout(props) {

  const history = useHistory();

  function logOut() {
    axios
    .post("http://localhost:5000/logout")
    .then((response) => {
       props.removeToken();//via props from app.js
       history.push("/");
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })}

    return(
      //{logMeOut}
     <a onClick={logOut}>Log out <FontAwesomeIcon icon = "sign-out-alt"/></a>
    )
}

export default Logout;

