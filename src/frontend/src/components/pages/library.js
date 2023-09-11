import React from 'react';
import { Link } from "react-router-dom";

import LibraryBooks from '../book-management/library-books';
import libraryPicture from '../../../static/assets/images/pages/library.jpg';

export default function() {

    return (
        <div>
            <div className='page-wrapper'>
                <div className='page-text'>
                    <h2>Find your Book Pills</h2>
                    <h3>Dr Book welcomes you to his office.</h3>
                    <p>On this page you will find the complete list of their remedies. 
                        Check them out and add them to your shopping cart if you think they might help you or any of your friends.</p>
                    <Link className = 'link' to="/">Return to Home Page </Link>
                </div>
                <div className='page-img'>
                    <img src={libraryPicture}/>
                </div>
            </div>
                <LibraryBooks/>
        </div>
    );

}