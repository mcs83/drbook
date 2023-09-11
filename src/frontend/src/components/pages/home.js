import React from 'react';


import logoPicture from "../../../static/assets/images/logo/logo-drbook.png";

import MoodCheckbox from '../book-management/mood-checkbox';

export default function() {

    return (
        <div>
            <div className='home-introduction-wrapper'>
                <div className='home-introduction-text'>
                    <h1>Are you having a bad time?</h1>
                    <h2>Do you need inspiration, calm or support?</h2>
                    <h3>Dr. Book prescribes the perfect book for you.
                    Tell him how you feel (you can choose several emotions). 
                    Listed below are the books and comics that will suit you best... 
                    without any adverse side effects. </h3>
                </div>
                <div className='home-introduction-img'>
                    <img src={logoPicture}/>
                </div>
            </div>
            <MoodCheckbox/>
        </div>
    );

}