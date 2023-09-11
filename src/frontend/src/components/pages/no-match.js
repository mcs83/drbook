import React from "react";
import { Link } from 'react-router-dom';

import logoPicture from "../../../static/assets/images/logo/logo-drbook.png";

export default function() {//page for non existing urls
    return (
        <div className="page-wrapper">
             <div className='page-text'>
                <h2>Sorry, that page does not exist.</h2>
                <Link className="link" to="/">Do you want to return to the home page?</Link>
            </div>
                <div className='page-img'>
                    <img src={logoPicture}/>
                </div>
        </div>
    );
}