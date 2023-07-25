from config import Flask, session, db, request, render_template, Migrate, IntegrityError
from models.favorite import Favorite
from models.edit import Edit
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
            # Try to fix rules=('-_password_hash'),
            return user.to_dict(), 200
        
    return {'error': 'Username or Password is incorrect'}, 403

@app.post('/signup')
def signup():
    data = request.get_json()

    try:
        user = User(
            username=data.get('username')
        )

        user.password_hash = data.get('password')

        db.session.add(user)
        db.session.commit()

        session['user_id'] = user.id

        if user.Admin:
            session['is_admin'] = user.Admin

        return user.to_dict(), 201
    
    except (ValueError, IntegrityError) as e:
        return {'errors': [str(e)]}, 400

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

        try:
            lake = Lake(
                name = data.get('name'),
                address1 = data.get('address1'),
                address2 = data.get('address2'),
                city = data.get('city'),
                state = data.get('state'),
                zip_code = data.get('zip')
            )

            db.session.add(lake)
            db.session.commit()

            return lake.to_dict(), 201
        
        except (ValueError, IntegrityError) as e:
            return {'error': [str(e)]}, 400



if __name__ == '__main__':
    app.run(port=5555, debug=True)