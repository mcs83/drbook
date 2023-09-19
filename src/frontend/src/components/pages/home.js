import React from 'react';



import MoodCheckbox from '../book-management/mood-checkbox';

export default function Home(props) {

    return (
        <div>
            <div className='page-wrapper'>
                <div>
                    <h1>Are you having a bad time?</h1>
                    <h2>Do you need inspiration, calm or support?</h2>
                    <h3>Dr. Book prescribes the perfect book for you.
                    Tell him how you feel (you can choose several emotions). 
                    Listed below are the books and comics that will suit you best... 
                    without any adverse side effects. </h3>
                </div>
            </div>
            <MoodCheckbox cartBooksCount={props.cartBooksCount}/>
        </div>
    );

}