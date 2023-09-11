import React, { Component } from 'react';
import axios from 'axios';

import Book from './book';

import angryPicture from "../../../static/assets/images/moods/angry.png"
import sadPicture from "../../../static/assets/images/moods/sad.png"
import overwhelmedPicture from "../../../static/assets/images/moods/overwhelmed.png"
import frustratedPicture from "../../../static/assets/images/moods/frustrated.png"
import emotionalPicture from "../../../static/assets/images/moods/emotional.png"
import anxiousPicture from "../../../static/assets/images/moods/anxious.png"

export default class MoodCheckbox extends Component {
  constructor() {
    super();
    this.state = { //initial state of the checkbox
      angry: false, //moods and if they are checked or not
      frustrated: false,
      sad: false,
      anxious: false,
      emotional: false,
      overwhelmed: false,
      data: [] //query data is empty at first: no selected books
    };
    // this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.getSelectedBooks = this.getSelectedBooks.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  showSelectedBooks() {//shows the selected books on the screen
    if (this.state.data.length == 0) {
      return <h3>Don't be shy. Just try the most typical moods you feel and take a look to the suggested book pills!</h3> // Message to display when no mood is selected
    }
    return this.state.data.map(item => {//maps all the data with the props
      return <Book key={item.id}
        item={item} />;
    });
  }

  getSelectedBooks() { //get the selected books from API, according to the checked moods in the checkbox 
    const selectedMoods = Object.entries(this.state)//selects the actual state of the checkbox
      .filter(([mood, checked]) => checked === true)//selects only the checked moods
      .map(([mood]) => `mood=${encodeURIComponent(mood)}`);//creates the substring mood=sad
    if (selectedMoods.length == 0) {
      this.setState({
        data: [], //is the user after some selections, erases all the selections don't show anything
      });

    } else {
      const queryString = selectedMoods.join('&');//joins in there are multiple queries: mood=sad&mood=frustrated
      axios
        .get(`http://localhost:5000/select?${queryString}`)// example: http://localhost:5000/select?mood=sad&mood=overwhelmed
        .then(response => {
          this.setState({
            data: response.data,
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  // Handles the changes in the checkbox: if checked, then previous state is the opposite of the actual
  handleItemClick = (itemName) => {
    this.setState((prevState) => ({
      [itemName]: !prevState[itemName]
    }),
      //stores the requested mood name and if it is checked or not
      () => {//call this way to send the current state to gelSelectedBooks, not the previous state
        this.getSelectedBooks(); //calls this function only when one mood is checked
      });
  }


  render() {
    const { angry, emotional, sad, frustrated, overwhelmed, anxious } = this.state;

    return (
      <div className='mood-ckeckbox-wrapper'>
        <div>
          <div className={`mood-checkbox-image-wrapper ${angry ? 'selected' : ''}`}//if it is selected, the scss &.selected gets activated
            onClick={() => this.handleItemClick('angry')} >
            <img src={angryPicture} />
            <div className="text">Angry</div>
          </div>
          <div className={`mood-checkbox-image-wrapper ${emotional ? 'selected' : ''}`}
            onClick={() => this.handleItemClick('emotional')} >
            <img src={emotionalPicture} />
            <div className="text">Emotional</div>
          </div>
          <div className={`mood-checkbox-image-wrapper ${frustrated ? 'selected' : ''}`}
            onClick={() => this.handleItemClick('frustrated')} >
            <img src={frustratedPicture} />
            <div className="text">Frustrated</div>
          </div>
          <div className={`mood-checkbox-image-wrapper ${overwhelmed ? 'selected' : ''}`}
            onClick={() => this.handleItemClick('overwhelmed')} >
            <img src={overwhelmedPicture} />
            <div className="text">Overwhelmed</div>
          </div>
          <div className={`mood-checkbox-image-wrapper ${sad ? 'selected' : ''}`}
            onClick={() => this.handleItemClick('sad')} >
            <img src={sadPicture} />
            <div className="text">Sad</div>
          </div>
          <div className={`mood-checkbox-image-wrapper ${anxious ? 'selected' : ''}`}
            onClick={() => this.handleItemClick('anxious')} >
            <img src={anxiousPicture} />
            <div className="text">Anxious</div>
          </div>
        </div>
        <div>
          {this.showSelectedBooks()}
        </div>
      </div>

    );
  }
}

