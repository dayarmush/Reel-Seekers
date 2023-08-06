from config import Flask, session, db, request, render_template, Migrate, IntegrityError
from models.favorite import Favorite
# from models.edit import Edit
from models.fish import Fish
from models.lake import Lake
from models.message import Message
from models.review import Review
from models.user import User
from models.lake_fish import FishLake
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Change to true before deployment
app.json.compact = False

migrate = Migrate(app, db)

db.init_app(app)

# Uncomment before deployment (route for react)
# @app.route('/')
# def index():
#     return render_template()

@app.post('/login')
def login():
    username = request.get_json()['username']
    password = request.get_json()['password']

    user = User.query.filter_by(username=username).first()
        
    if user:
        if user.authenticate(password):
            session['user_id'] = user.id
            if user.Admin:
                session['is_admin'] = user.Admin
            # Try to fix rules=('-_password_hash'),
            return user.to_dict(), 200
        
    return {'error': 'Username or Password is incorrect'}, 403

@app.post('/signup')
def signup():
    data = request.get_json()

    try:
        user = User(
            username=data.get('username'),
            Admin=True
        )

        user.password_hash = data.get('password')

        db.session.add(user)
        db.session.commit()

        session['user_id'] = user.id

        if user.Admin:
            session['is_admin'] = user.Admin

        return user.to_dict(), 201
    
    except (ValueError, IntegrityError) as e:
        return {'error': [str(e)]}, 400

@app.delete('/logout')
def logout():

    if session.get('user_id') is None:
        return {'error': 'You are not signed in'}, 403
    
    session.clear()
    return {}, 200

@app.route('/lakes', methods=['GET', 'POST'])
def lakes_route():

    if request.method == 'GET':
        lakes = Lake.query.all()

        return [l.to_dict() for l in lakes], 200
    
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        try:
            lake = Lake(
                name = data.get('name'),
                address1 = data.get('address1'),
                lat=data.get('lat'),
                lng=data.get('lng'),
                city = data.get('city'),
                state = data.get('state'),
                zip_code = data.get('zip_code')
            )

            db.session.add(lake)
            db.session.commit()

            return lake.to_dict(), 201
        
        except (ValueError, IntegrityError) as e:
            return {'error': [str(e)]}, 400

@app.route('/lakes/<int:id>', methods=['PATCH', 'DELETE', 'GET'])
def lakes_by_id(id):
    lake = Lake.query.filter_by(id=id).first()

    if not lake:
        return {'error': 'No lake found. Please try again'}, 404
    
    if request.method == 'GET':
        return lake.to_dict(), 200
    
    if request.method == 'DELETE':

        db.session.delete(lake)
        db.session.commit()

        return {}, 204
    
    if request.method == 'PATCH':

        data = request.get_json()

        try:
            for key in data:
                setattr(lake, key, data[key])

            db.session.add(lake)
            db.session.commit()

            return lake.to_dict(), 200
        
        except (ValueError, IntegrityError) as e:
            return {'error': [str(e)]}, 400
        

# Maybe add get route for fish
@app.post('/fish')
def add_fish():
    data = request.get_json()
    
    try:
        fish = Fish(
            name = data.get('name'),
            min_length = data.get('min_length'),
            max_length = data.get('max_length'),
            daily_limit = data.get('daily_limit'),
            wiki=data.get('wiki')
        )

        db.session.add(fish)
        db.session.commit()

        return fish.to_dict(), 201
    
    except (ValueError, IntegrityError) as e:
        return {'error': [str(e)]}, 400

@app.route('/fish_by_name/<string:name>')
def fish_by_name(name):
    fish = Fish.query.filter(db.func.lower(Fish.name) == name.lower()).first()

    if not fish:
        return {'error': 'No fish found. Please try again'}, 404
    
    return fish.to_dict(), 200

@app.route('/fish/<int:id>', methods=['PATCH', 'DELETE'])
def fish_by_id(id):
    fish = Fish.query.filter_by(id=id).first()

    if not fish:
        return {'error': 'No fish found. Please try again'}, 404

    if request.method == 'DELETE':
        
        db.session.delete(fish)
        db.session.commit()

        return {}, 204
    
    if request.method == 'PATCH':
        data = request.get_json()

        try:
            for key in data:
                setattr(fish, key, data[key])

            db.session.add(fish)
            db.session.commit()

            return fish.to_dict(), 200
        
        except (ValueError, IntegrityError) as e:
            return {'error': [str(e)]}, 400
            
@app.post('/reviews')
def add_review():
    data = request.get_json()

    try:
        review = Review(
            rating=data.get('rating'),
            text=data.get('text'),
            user_id=data.get('user_id'),
            lake_id=data.get('lake_id')
        )

        db.session.add(review)
        db.session.commit()

        return review.to_dict(), 201
    
    except (ValueError, IntegrityError) as e:
        return {'error': [str(e)]}, 400
    
@app.delete('/reviews/<int:id>')
def delete_review(id):
    review = Review.query.filter_by(id=id).first()

    if not review:
        return {'error': 'No review found. Please try again'}, 404
    
    db.session.delete(review)
    db.session.commit()

    return {}, 204

@app.post('/messages')
def add_message():
    data = request.get_json()

    try:
        message = Message(
            text=data.get('text'),
            user_id=data.get('user_id'),
            lake_id=data.get('lake_id')
        )

        db.session.add(message)
        db.session.commit()

        return message.to_dict(), 201
    
    except (ValueError, IntegrityError) as e:
        return {'error': [str(e)]}, 400

@app.delete('/messages/<int:id>')
def delete_message(id):
    message = Message.query.filter_by(id=id).first()

    if not message:
        return {'error': "No message found. Please try again"}, 404
    
    db.session.delete(message)
    db.session.commit()

    return {}, 204

@app.post('/lake_fish')
def add_lake_fish():
    data = request.get_json()

    try:
        lf = FishLake(
            lake_id=data.get('lake_id'),
            fish_id=data.get('fish_id')
        )

        db.session.add(lf)
        db.session.commit()

        return lf.to_dict(), 201
    
    except (ValueError, IntegrityError) as e:
        return {'error': [str(e)]}, 400
    
@app.delete('/lake_fish/<int:id>')
def delete_lake_fish(id):
    connection = FishLake.query.filter_by(id=id).first()

    if not connection:
        return {'error': 'No connection found'}, 404
    
    db.session.delete(connection)
    db.session.commit()

    return {}, 204

@app.get('/check_session')   
def check_session():

    if session.get('user_id') is not None:
        user = User.query.filter_by(id=session.get('user_id')).first()
        return user.to_dict(), 200
    
    return {'error': 'Not logged in'}, 400

@app.post('/favorites')
def add_favorite():
    data = request.get_json()

    try:
        newFave = Favorite(
            user_id=data.get('user_id'),
            lake_id=data.get('lake_id')
        )

        db.session.add(newFave)
        db.session.commit()

        return newFave.to_dict(), 200
    
    except (ValueError, IntegrityError) as e:
        return {'error': [str(e)]}, 400
    
@app.delete('/favorites/<int:id>')
def remove_favorite(id):
    fave = Favorite.query.filter_by(id=id).first()

    if not fave:
        return {'error': 'No fave found. Please try again.'}, 404
    
    db.session.delete(fave)
    db.session.commit()

    return {}, 204

# excluded_endpoints = ['logout', 'lakes_route', 'lakes_by_id',
#                        'add_fish', 'fish_by_id', 'add_review', 
#                        'delete_review', 'add_message', 'delete_message', 'add_lake_fish']

# @app.before_request
# def check_login():
#     if request.endpoint in excluded_endpoints:
#         # Allow the request to proceed for excluded endpoints
#         return

#     user_id = session.get('user_id')
#     user = User.query.filter_by(id=user_id).first()

#     if not user:
#         return {'status': 'not authorized'}, 403



if __name__ == '__main__':
    app.run(port=5555, debug=True)