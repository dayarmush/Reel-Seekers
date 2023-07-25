from config import db, Bcrypt, SM, validates
from sqlalchemy.ext.hybrid import hybrid_property

bcrypt = Bcrypt()

class User(db.Model, SM):
    __tablename__ = 'users'
    __table_args__ = (db.CheckConstraint('LENGTH(username) >= 5'),)

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)
    Admin = db.Column(db.Boolean, default=False)
    points = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    favorites = db.relationship('Favorite', backref='user', cascade='all, delete-orphan')
    edits = db.relationship('Edit', backref='user', cascade='all, delete-orphan')
    reviews = db.relationship('Review', backref='user')
    messages = db.relationship('Message', backref='user', cascade='all, delete-orphan')

    serialize_rules = ('-favorites.user', '-edits.user', '-reviews.user', '-messages.user')

    @validates('username')
    def valid_username(self, key, username):
        if len(username) >= 5:
            return username
        raise ValueError('Username must have 5 letters')

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Cannot access password hash')
    
    @password_hash.setter
    def password_hash(self, password):
        if len(password) <= 4:
            raise ValueError('Password must have 4 letters')
        
        hashed_password = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = hashed_password.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
    def __repr__(self):
        return f'(User: {self.username})'

