import React from 'react';
import { Link } from "react-router-dom";

import thanksPicture from '../../../static/assets/images/pages/thanks.jpg';

export default function(props) {
const {token} = props;
    return (
    <div className='page-wrapper'>
        <div className='page-text'>
            <h2>Successful payment</h2>
            <p>Thanks for your purchase!</p>
            <Link className="link" to={{pathname: '/orders', 
                state: {token}//passes the data of the token in the state of the link
                }}>See my order history</Link> 
        </div>
        <div className='page-img'>
            <img src={thanksPicture}/>
        </div>
    </div>
    );

}