import React, { Component } from 'react';
import axios from 'axios';

import Book from './book';

export default class LibraryBooks extends Component {
    constructor(props){
        super(props);
        this.state ={
            isLoading: false,
            data:[] //initial state: no books
        };

     this.getAllBooks = this.getAllBooks.bind(this);
     this.showAllBooks = this.showAllBooks.bind(this);
    }
    getAllBooks(){ //gets all the books from API
        axios
        .get("http://localhost:5000/books")
        .then(response => {
          this.setState({
            data: response.data
          });
        })
        .catch(error => {
          console.log(error);
        });
      }
   
   showAllBooks(){
        return this.state.data.map(item => {//maps all the data with the props
            return <Book key={item.id} 
            item = {item} cartBooksCount={this.props.cartBooksCount}/>;//refresh the books added to cart and pass to app.js
        });
    }
   componentDidMount(){
    this.getAllBooks(); //after the component is mounted
   }
    render() {
        if(this.state.isLoading){
            return <div>Loading...</div>
        }
     
        return (
            <div>
               {this.showAllBooks()}
            </div>
        );
    }
}