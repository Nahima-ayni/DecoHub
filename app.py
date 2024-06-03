#!/usr/bin/python3
from flask import Flask, render_template, redirect, flash, url_for, request, jsonify, session as flask_session
from flask_sqlalchemy import SQLAlchemy
import MySQLdb
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Email, Length, ValidationError, EqualTo
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os
from models import User  # Import your User model
from database import session as db_session  # Import your database session

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
app.secret_key = 'your_secret_key'

app.static_folder = 'static'
app.static_url_path = '/static'

# Configure SQLAlchemy database URI using environment variable
SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')
print(f"Database URI: {SQLALCHEMY_DATABASE_URI}")

app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# Configure Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# User loader for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    return db_session.query(User).get(int(user_id))

# Define the registration form
class RegisterForm(FlaskForm):
    first_name = StringField('First Name', validators=[InputRequired(), Length(min=1, max=50)])
    last_name = StringField('Last Name', validators=[InputRequired(), Length(min=1, max=50)])
    phone_number = StringField('Phone Number', validators=[InputRequired(), Length(min=1, max=20)])
    email = StringField('Email', validators=[InputRequired(), Email()])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=8, max=255)])
    confirm_password = PasswordField('Confirm Password', validators=[InputRequired(), EqualTo('password', message='Passwords must match')])
    submit = SubmitField('Register')

    def validate_email(self, email):
        existing_user_email = db_session.query(User).filter_by(email=email.data).first()
        if existing_user_email:
            raise ValidationError('That email address is already registered.')

# Define the login form
class LoginForm(FlaskForm):
    email = StringField('Email', validators=[InputRequired(), Email()])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=8, max=255)])
    submit = SubmitField('Login')

# Routes
@app.route('/')
def landing_page():
    return render_template('index.html')

@app.route('/DecoHub')
def index():
    return render_template('deco.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        new_user = User(first_name=form.first_name.data, last_name=form.last_name.data, phone_number=form.phone_number.data, email=form.email.data, password=hashed_password)
        db_session.add(new_user)
        db_session.commit()
        flash('Registration successful. Please login.')
        return redirect(url_for('login'))
    return render_template('register.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = db_session.query(User).filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user)
            return redirect(url_for('index'))
        else:
            flash('Invalid email or password. Please try again.', 'error')
    return render_template('login.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/profile')
@login_required
def profile():
    return render_template('profile.html', user=current_user)

@app.route('/category/<category_name>')
def category(category_name):
    products = []  # assuming you have a list of products for each category
    return render_template('category.html', category_name=category_name, products=products)

@app.route('/cart', methods=['GET', 'POST'])
@login_required
def cart():
    if request.method == 'POST':
        if 'clear_all' in request.form:
            flask_session.pop('cart', None)  # Clear the cart session
            return redirect(url_for('cart'))

        if 'update_quantity' in request.form:
            item_index = int(request.form['item_index'])
            new_quantity = int(request.form['new_quantity'])
            cart = flask_session.get('cart', [])
            if 0 <= item_index < len(cart):
                cart[item_index]['quantity'] = new_quantity
                flask_session['cart'] = cart
                # Recalculate total cost, tax, and shipping
                total = sum(item['price'] * item['quantity'] for item in cart)
                tax = total * 0.1
                shipping = 15
                return jsonify({'success': True, 'total': total, 'tax': tax, 'shipping': shipping})
            return jsonify({'success': False})

        if 'remove_item' in request.form:
            item_index = int(request.form['item_index'])
            cart = flask_session.get('cart', [])
            if 0 <= item_index < len(cart):
                removed_item = cart.pop(item_index)
                flask_session['cart'] = cart
                print(f"Removed item: {removed_item['name']}")
                return jsonify({'success': True})
            return jsonify({'success': False})

        product_name = request.form['product_name']
        product_price = int(request.form['product_price'])
        cart = flask_session.get('cart', [])

        if cart:  # Check if the cart is not empty
            total = sum(item['price'] * item['quantity'] for item in cart)
            tax = total * 0.1
            shipping = 15
        else:
            total = 0
            tax = 0
            shipping = 0
        # Check if the product already exists in the cart
        existing_item = next((item for item in cart if item['name'] == product_name and item['price'] == product_price), None)

        if existing_item:
            # If the product exists, increment its quantity
            existing_item['quantity'] += 1
        else:
            # If the product doesn't exist, add a new item to the cart
            cart.append({'name': product_name, 'price': product_price, 'quantity': 1})

        flask_session['cart'] = cart
        return redirect(url_for('cart'))

    cart = flask_session.get('cart', [])
    total = sum(item['price'] * item['quantity'] for item in cart)
    tax = total * 0.1
    shipping = 15
    return render_template('cart.html', cart=cart, total=total, tax=tax, shipping=shipping)

@app.route('/checkout', methods=['GET'])
def checkout():
    cart = flask_session.get('cart', [])
    if not cart:
        return redirect(url_for('empty_cart'))
    return render_template('checkout.html')

@app.route('/empty_cart')
def empty_cart():
    return render_template('empty_cart.html')

if __name__ == '__main__':
    app.run(debug=True)
