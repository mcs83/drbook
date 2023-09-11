from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_ , ForeignKey
from sqlalchemy.orm import relationship
from flask_marshmallow import Marshmallow
from flask_cors import CORS
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secretkey' #to use session and get the cookies created
app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # 'None' SameSite not applied for session cookies
app.config['SESSION_COOKIE_SECURE'] = True  # activates Secure for HTTPS


# Configure CORS to allow connection from localhost:3000 and 4000
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:4000"], "supports_credentials": True}})

#SQLlite database creation
basedir = os.path.abspath(os.path.dirname(__file__)) #app base directory
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'+os.path.join(basedir, 'app.sqlite')
db = SQLAlchemy(app)
ma = Marshmallow(app)

#Creation of the schema for the database table 1
class Book(db.Model): #Table 1: Books, each book has this structure:
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), unique=False)
    author = db.Column(db.String(150), unique=False)
    year =  db.Column(db.Integer, unique=False)
    description = db.Column(db.String(600), unique=False)
    pages = db.Column(db.Integer, unique=False)
    price = db.Column(db.Float, unique=False)
    mood = db.Column(db.String(200), unique=False)

    def __init__(self,title, author, year, pages, price, mood, description):
        self.title = title
        self.author = author
        self.year = year
        self.pages = pages
        self.price = price
        self.mood = mood
        self.description = description

class BookSchema(ma.Schema): #schema
    class Meta:
        fields = ('id','title','author','year', 'pages', 'price', 'mood','description')

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

book_schema = BookSchema()
books_schema = BookSchema(many=True)
user_schema = UserSchema()
users_schema = UserSchema(many=True)

#Endpoint to create a new book
@app.route('/book', methods=['POST'])
def add_book():
    title = request.json['title']
    author = request.json['author']
    year = request.json['year']
    pages = request.json['pages']
    price = request.json['price']
    mood = request.json['mood']
    description = request.json['description']

    new_book = Book(title, author, year, pages, price, mood, description)

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
    
@app.route('/logout', methods=['POST'])
def logout_user():
      # Erases the session of the current user
    session.pop('user_id', None)
    return jsonify({"message": "Successful logout"})

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

if __name__ == '__main__':
    app.run(debug=True)