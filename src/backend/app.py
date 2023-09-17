from flask import Flask, request, jsonify, session, make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_ , DateTime
from sqlalchemy import JSON as JSON_SQLite
from flask_marshmallow import Marshmallow
from flask_session import Session #to do the logout and erase all the cookies
from flask_migrate import Migrate
from flask_cors import CORS
from datetime import datetime  #Work with dates
import os
import stripe

stripe.api_key = 'sk_test_51NppD6LqgY1TI3sm7eiAxVuM1w0CKpthi3Ta0W6HZhOqWEyyLLvd2GK6FIhqg0DuSMKkCze79mc6AJCO4B0SXTBC00ZxA2fUDi'#secret key

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem' #saves session in the file sistem
app.config['SECRET_KEY'] = 'secretkey' #to use session and get the cookies created
app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # 'None' SameSite not applied for session cookies
app.config['SESSION_COOKIE_SECURE'] = True  # activates Secure for HTTPS
Session(app)

# Configure CORS to allow connection from localhost:3000 and 4000
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:4000"], "supports_credentials": True}})

#SQLlite database creation
basedir = os.path.abspath(os.path.dirname(__file__)) #app base directory
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'+os.path.join(basedir, 'app.sqlite')
db = SQLAlchemy(app)
ma = Marshmallow(app)
migrate = Migrate(app, db)

#Creation of the schema for the database table 1
class Book(db.Model): #Table 1: Books, each book has this structure:
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), unique=False)
    author = db.Column(db.String(150), unique=False)
    year =  db.Column(db.Integer, unique=False)
    description = db.Column(db.String(600), unique=False)
    pages = db.Column(db.Integer, unique=False)
    price = db.Column(db.Float, unique=False)
    stripe_price = db.Column(db.String(40), unique=True) #ID for Stripe integration
    mood = db.Column(db.String(200), unique=False)

    def __init__(self,title, author, year, pages, price, stripe_price, mood, description):
        self.title = title
        self.author = author
        self.year = year
        self.pages = pages
        self.price = price
        self.stripe_price = stripe_price
        self.mood = mood
        self.description = description

class BookSchema(ma.Schema): #schema
    class Meta:
        fields = ('id','title','author','year', 'pages', 'price', 'stripe_price', 'mood','description')

class User(db.Model): #Table 2: User registration and login. Each use has this structure:
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

    def __init__(self,email, password):
        self.email = email
        self.password = password

class UserSchema(ma.Schema): #schema
    class Meta:
        fields = ('id','email','password')

class Order(db.Model): #Table 3: Orders
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, unique=False)
    quantity = db.Column(JSON_SQLite, unique=False)
    date = db.Column(DateTime)
    full_name = db.Column(db.String(100), unique=False)
    address = db.Column(db.String(100), unique=False)
    city = db.Column(db.String(50), unique=False)
    postal_code = db.Column(db.String(10), unique=False)
    total_price = db.Column(db.Float, unique=False)

    def __init__(self, user_id, quantity, date, full_name, address, city, postal_code, total_price):
        self.user_id = user_id
        self.quantity = quantity
        self.date = date
        self.full_name = full_name
        self.address = address
        self.city = city
        self.postal_code = postal_code
        self.total_price = total_price

class OrderSchema(ma.Schema): #schema
    class Meta:
        fields = ('id','user_id','quantity','date', 'full_name', 'address', 'city','postal_code', 'total_price')

book_schema = BookSchema()
books_schema = BookSchema(many=True)
user_schema = UserSchema()
users_schema = UserSchema(many=True)
order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)

#Endpoint to create a new book
@app.route('/book', methods=['POST'])
def add_book():
    title = request.json['title']
    author = request.json['author']
    year = request.json['year']
    pages = request.json['pages']
    price = request.json['price']
    stripe_price = request.json['stripe_price']
    mood = request.json['mood']
    description = request.json['description']

    new_book = Book(title, author, year, pages, price, stripe_price, mood, description)

    db.session.add(new_book)
    db.session.commit()#open connection and save

    book = db.session.get(Book, new_book.id) #to return the new book created id
    return book_schema.jsonify(book)

#Endpoint to query all books
@app.route('/books', methods=['GET'])
def get_books():
    all_books = Book.query.all()
    result = books_schema.dump(all_books)
    return jsonify(result)

#Endpoint for querying a single book
@app.route('/book/<id>', methods=['GET'])
def get_book(id):
    book = db.session.get(Book, id)
    return book_schema.jsonify(book)

#Endpoint to modify a book by ID (name and stripeID)
@app.route('/book/modify/<id>', methods=['PUT'])
def modify_book(id):
    book = db.session.get(Book, id) #requested book
    data = request.get_json() #JSON data from request
    if 'title' in data:
            book.title = data['title']
    if 'stripe_price' in data:
            book.stripe_price = data['stripe_price']
    db.session.commit()#open connection and save
    return book_schema.jsonify(book)
    

#Endpoint for querying multiple or unique moods in all books
@app.route('/select', methods=['GET']) #exaple: /select?mood=sad&mood=overwhelmed (must contain sad or overwhelmed)
def select_mood_books():
    requested_moods = request.args.getlist('mood') #getlist returns a list of requested moods
    filters = [Book.mood.like(f"%{requested_mood}%") for requested_mood in requested_moods] #filter looks for a mood inside each mood string (moods are separated by commas)
    query_books_mood = Book.query.filter(or_(*filters))#the query accept OR statements, to include all the possible results containing any requested mood
    result_mood =  query_books_mood.all()
    result_moods = books_schema.dump(result_mood)
    return (result_moods)

# Endpoint for deleting a book
@app.route('/book/<id>', methods=["DELETE"])
def book_delete(id):
    book = db.session.get(Book, id)
    db.session.delete(book)
    db.session.commit()
    return book_schema.jsonify(book)

# Endpoint for displaying an array of books by id -> shopping cart
@app.route('/books/request', methods=['GET'])
def get_books_by_ids():
    book_ids = request.args.getlist('id')  #ID list: /books/request?id=1&id=10
    books = Book.query.filter(Book.id.in_(book_ids)).all() #find the books by id
    result = books_schema.dump(books)#obtain all the requested books
    return jsonify({'books': result})

# Endpoint for creating a new User: Sign up
@app.route('/signup', methods=['POST'])
def signup_user():
    # code to validate and add user to database goes here
    email= request.json['email']
    password = request.json['password']

    user = User.query.filter_by(email=email).first() # if this returns a user, then the email already exists in database

    if user: # if a user is found
        return ("user already exists")

    new_user = User(email, password)# else, the new user is going to be saved in the User database

    db.session.add(new_user)  # add the new user to the database
    db.session.commit()#open connection and save

    return jsonify({"message": "Successful signup"})
  
#Endpoint for login an existing user in the database
@app.route('/login', methods=['POST'])
def login_user():
    #login data
    email= request.json['email']
    password = request.json['password']

    requested_user = User.query.filter_by(email=email).first()# check if the user actually exists
    requested_password = User.query.filter_by(password=password).first()# check if the password of the user is OK
    if not (requested_user and requested_password): 
        return jsonify({"message": "Incorrect credentials"}), 401  # Non authorized
    else:
    # if the above check passes, then we know the user has the right credentials
     session['user_id'] = requested_user.id #creates the session
     return jsonify({"message": "Successful login"})
    
#Endpoint to logout an user    
@app.route('/logout', methods=['POST'])
def logout_user():
    # Erases the session of the current user
    session.pop('user_id', None)
    session.clear()
    response = make_response(jsonify({"message": "Successful logout"}))
    response.set_cookie('session', expires=0)
    return response

#Endpoint to query all users
@app.route('/users', methods=['GET'])
def get_all_users():
    all_users = User.query.all()
    users = users_schema.dump(all_users)
    return jsonify(users)

#Endpoint to check if the user is authenticated
@app.route('/check-auth', methods=['GET'])
def check_auth():
    if 'user_id' in session:
        # user is authenticated, it returns the information
        user_id = session['user_id']
        return jsonify({"authenticated": True, "user_id":user_id})
    else:
        # user not authenticated
        return jsonify({"authenticated": False})
    
# Endpoint for deleting a user in the User database
@app.route('/users/<id>', methods=["DELETE"])
def delete_user(id):
    user = db.session.get(User, id)# 'db.session' instead of 'User.query' for legacy issues
    db.session.delete(user)
    db.session.commit()

    return user_schema.jsonify(user)

#Endpoint to store an order
@app.route('/order', methods=['POST'])
def add_order():
    user_id = session['user_id']
    quantity = request.json['quantity']
    date = datetime.now()
    full_name = request.json['full_name']
    address = request.json['address']
    city = request.json['city']
    postal_code = request.json['postal_code']
    total_price = request.json['total_price']

    new_order = Order(user_id, quantity, date, full_name, address, city, postal_code, total_price)

    db.session.add(new_order)
    db.session.commit()#open connection and save

    order = db.session.get(Order, new_order.id) #to return the new book created id
    return order_schema.jsonify(order)

# Endpoint for deleting a order
@app.route('/order/<id>', methods=["DELETE"])
def order_delete(id):
    order = db.session.get(Order, id)
    db.session.delete(order)
    db.session.commit()
    return order_schema.jsonify(order)

#Endpoint for querying all the orders of the authenticated user
@app.route('/orders/history', methods=['GET'])
def get_orders_history():
    all_orders = Order.query.filter_by(user_id = session['user_id'])
    orders = orders_schema.dump(all_orders)
    all_books = [] #new list for the selected books
   # See all the orders and obtain all the associated books
    for order in all_orders:
        #the value of the quantity key is the id of each book in the shopping cart
        books_by_order = Book.query.filter(Book.id.in_(order.quantity.keys())).all()
        books = books_schema.dump(books_by_order)
        all_books.extend(books) #extends the list
    return jsonify({"orders": orders, "books": all_books})

#Endpoint for crerating the Stripe payment link
@app.route('/checkout', methods=['POST'])
def create_stripe_payment_link():
  try:
        data = request.json #from React
        # Verify that it contains 'line_items'
        if 'line_items' in data:
            # Create the Stripe payment link with the parameter 'line_items'
            payment_link = stripe.PaymentLink.create(
                line_items = data['line_items'], 
                shipping_options =[{"shipping_rate": 'shr_1NqAwdLqgY1TI3sm7mcKdTHP'}],#flat rate: 5$
                after_completion={"type": "redirect", "redirect": {"url": "http://localhost:3000/successful-payment"}},
            )
            return payment_link.url, 200
        else:
            return jsonify({'error': 'bad Stripe link request'}), 400
 
  except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)