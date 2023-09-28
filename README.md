
# Welcome to Dr Book


![Dr. Book Logo](/src/frontend/static/favicon.ico)


---

**Project Overview**

**Live at**: https://dr-book.netlify.app/  

**Backend and frontend repository**: https://github.com/mcs83/drbook

Dr. Book is an innovative online responsive shop application designed to recommend books and comics to uplift your spirits during challenging times, without any adverse side effects. This project is a result of the Bottega University Full Stack course.

---


## Introduction
Dr. Book is an online shop application that recommends books and comics to help you overcome your lowest moments, without any adverse side effects.

You can authenticate in the system, purchase the suggested books, and access your order history.

The **languages and technologies** of the project are:
- Backend
    - Python (Flask)
    - SqlAlchemy and Marsmallow for SQLite database
- Frontend
    - React
    - SCSS amd media queries for responsive design

## Development in localhost
1. Frontend      
Change the base url in all Axios calls to: <code>http://localhost:5000</code>   
Then, execute the following commands in the terminal, in the <code>DrBook/src/frontend</code> directory:    

    <code> npm install moment axios @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome react-router-dom jsonwebtoken</code> 

    <code>npm run start</code> 
2. Backend    
   Change the base URL in the call to the _successfull-payment_ page with:   <code>http://localhost:3000</code>  
    Then, execute the following commands in the terminal, in the <code>DrBook/src/backend</code> directory:  

    <code>pipenv shell</code>  

    <code>pip install stripe Flask Flask-SQLAlchemy flask-marshmallow marshmallow-sqlalchemy flask-cors Flask-Migrate flask_jwt_extended Flask-Session</code>  

    <code>python app.py</code>
## Deployment
DrBook is **deployed** in:
1. **_Netlify_**  (frontend): https://dr-book.netlify.app/
    > **IMPORTANT**: after running in the terminal the command  
 <code>npm run build</code> in the <code>DrBook/src/frontend</code> directory, the folder _dist_ is created.     
Drag and drop this folder to Netlify manuals deploys section of your profile, but first create a new file in _dist_. Name the file **_redirects**, with this content inside: <code>/*    /index.html  200</code>. This file will overcome the Netlify routing error when <code>react-router-dom</code> v.5 is used in the code.
2. **_Pythonanywhere_** (backend): https://mcs83.pythonanywhere.com/ until Tuesday 26 December 2023
  
    To deploy the python code, first create a free profile in _Phytonanywhere_ and access the _+ Add a new web app_ link in the _Web_ tab of your profile. Select _Flask_ and _Python 3.10_. 

    After that, navigate to the _Consoles_ tab and open a bash console. Write these commands to create a virtual environment and load the libraries.
  
    <code>mkvirtualenv flaskenv --python=python3.10</code>  

    <code>workon flaskenv</code>  

    <code>pip install stripe Flask-SQLAlchemy flask-marshmallow marshmallow-sqlalchemy flask-cors Flask-Migrate flask_jwt_extended Flask-Session</code>
  
    Then, copy the _app.py_ file under _mysite_ in _Files_ tab. Erase the sample file provided by the website.

    Finally, go to the _Web_ tab and change the options:
    - Virtualenv: change the name to <code>flaskenv</code>
    - Security: select <code>Force HTTPS</code> option
    - Code: change inside the _WSGI configuration file_ the last line like this:  

        <code>from app import app as application</code>
    - Reload: reload the app



### Test data
You can create a new user under _/sign-up_, but you can also try an existing user, who has already made some purchases.
- User
  - email: user@doctorbook.com 
  - password: drbook
- Credit card
  - number: 4242 4242 4242 4242  
  - exp. date: any date in the future 
  - CCV: any three numbers  
    
# How to Use Dr. Book

## Backend Overview
The backend of Dr. Book is composed of a central Python application using Flask, <code>app.py</code>, along with three SQLite databases: Book, Order, and User.

- **Book Database**: contains all relevant data for each medicinal book in Dr. Book.
- **User Database**: stores user email and password information for authentication.
- **Order Database**: records data for each completed and paid purchase, allowing users to access their order history upon login.

## Frontend Structure
The frontend code is organized within the `src/frontend/components` directory. Here's a breakdown of the structure:

- **app.js**: the main application file.
- Folders:
  - **auth**: contains components related to user authentication.
  - **book-management**: Includes components for book management and recommendation.
  - **navigation**: houses the navigation menu.
  - **pages**: stores the individual pages displayed to users.
  - **shop**: manages the generation of Stripe payment gateway links and order storage.

## Image and Style Organization
Images are stored in the `static/assets/images` directory, organized into folders for easy access. Styles are organized within the `style` directory, categorized by components. Here's a brief overview of some special style-related files:

- **media-queries.scss**: contains style changes for responsive design on small screens.
- **main.scss**: imports and combines all style files.
- **base.scss**: the foundational style sheet.
- **mixins.scss**: defines basic styles for links, buttons, and lists.

## Main functions

| Page                  | Functionality                       | Description                                                                                           |
|-----------------------|------------------------------------|-------------------------------------------------------------------------------------------------------|
| HOME                  | Mood Selection                      | Users can select from six different mood states using checkboxes on the homepage.                   |
|                       |                                    | - Implemented in `mood-checkbox.js`.                                                                 |
|                       |                                    | - The `getSelectedBooks()` function collects selected moods and queries the API for book listings.  |
|                       |                                    | - Selection is dynamic; moods can be toggled on and off, updating the book list automatically.       |
|                       | Adding Books to Cart                | Each book displayed includes an "Add to Cart" button.                                                  |
|                       |                                    | - Double-clicking adds two units of the book to the cart.                                              |
| NAVIGATION BAR        | Cart Icon Auto-Update               | The shopping cart icon in the navigation menu updates automatically to display the book count.       |
|                       |                                    | - Enabled by the `cartBooksCount()` function in `app.js`.                                             |
|                       |                                    | - Recalculates the cart content whenever a related component registers a change.                     |
| ABOUT DR. BOOK        | Adding Books from "About Dr. Book"  | Users can also add books from the "About Dr. Book" page, which displays a complete book list.         |
|                       |                                    | - Accessible by clicking a specific button.                                                            |
|                       |                                    | - The primary purpose of Dr. Book is to recommend books, not to display all available options.       |
| CART                  | View Cart Summary                   | Users can click the cart icon to view a summary of all selected books.                                  |
|                       |                                    | - Books can be incremented, decremented, or removed from the list.                                      |
|                       |                                    | - Users can fill the cart without registration; selections are stored in local storage.               |
|                       | Registration and Login              | To proceed with a purchase, users can register or log in via the menu or the cart link.                |
|                       |                                    | - Users can choose to be redirected to the signup page by clicking a button.                             |
|                       |                                    | - Upon registration, a JWT token is created and stored in local storage.                                |
|                       |                                    | - The token is passed as props to components from `app.js` via the `token-provider.js` functional component. |
|                       |                                    | - `token-provider.js` also provides functions to delete and generate tokens in the `use-token.js` parent component. |
| CHECKOUT              | Process Shopping Cart               | The `getShoppingCart()` function updates the component's state with the following information:         |
|                       |                                    | - `books`: An object with information about each selected book, sourced from the API.                |
|                       |                                    | - `quantities`: A JSON object where keys are book IDs and values are the quantities of each book requested. |
|                       |                                    | - `token`: The JWT token for authentication (required for checkout).                                   |
|                       | Order Submission                   | Clicking the "Submit" button first triggers the `sendOrderData` function to save the order with a "draft" status. Once the order is successfully saved, the `submitOrder` function is activated to send a secure payment link request to Stripe. |
|                       |                                    | - Error Handling: If the token has expired, an error message is displayed. If not, the user is redirected to the Stripe payment link, and the order is saved with `sendOrderData()`. |
|                       | Successful Payment                 | After a successful payment, Python redirects to the `successful-payment.js` component using the `after_completion` code: |
|                       |                                    | - `{"type": "redirect", "redirect": {"url": "https://dr-book.netlify.app/successful-payment"}}`.   |
| MY ORDERS             | Request Order History              | Users can request historical order information and shipping details via the `requestOrdersHistory()` function. Only completed orders are displayed. |
|                       |                                    | - The order status changes to "completed" upon reaching the `successful-payment.js` component. |

  
    
      
      React starter code provided for the students of the Bottega Code School
Fork from es6-webpack2-starter
