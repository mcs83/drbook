import React from 'react';
import { Link } from "react-router-dom";

import aboutUsPicture from '../../../static/assets/images/pages/about-us.jpg';

export default function() {

    return (
    <div className='page-wrapper'>
        <div className='page-text'>
            <h2>About Dr Book</h2>
            <p>You may be wondering how Dr. Book came to be. Well, I was very fed up with the typical readings and bestsellers. Furthermore, the ups and downs of life prevented me from finishing a book and I was sadly giving up reading.</p>
            <p>One fine day I started in a book club in Barakaldo, and suddenly a world of new possibilities opened up. Classics, comics, historical novels, fantasy novels, manga, detective stories, curiosities and philosophy books from all 
                around the world. With the advice of literature blogs and the guidance of psychologists, I want to present these exceptional medicines to you. Enjoy!</p>
            <Link className = 'link' to="/">Return to Home Page </Link>
            <Link className = 'link' to="/library">See the complete Book Pharmacy</Link>
        </div>
        <div className='page-img'>
            <img src={aboutUsPicture}/>
        </div>
    </div>
    );

}