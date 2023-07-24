from config import db, Bcrypt, SM
from sqlalchemy.ext.hybrid import hybrid_property

bcrypt = Bcrypt()

class User(db.Model, SM):
    __tablename__ = 'Users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)
    Admin = db.Column(db.Boolean, default=False)
    points = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    favorites = db.relationship('Favorite', backref='user')
    edits = db.relationship('Edit', backref='user')
    reviews = db.relationship('Review', backref='user')
    messages = db.relationship('Message', backref='user')

    serialize_rules = ('-favorites.user', '-edits.user', '-reviews.user', '-messages.user')

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Cannot access password hash')
    
    @password_hash.setter
    def password_hash(self, password):
        hashed_password = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = hashed_password.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
    def __repr__(self):
        return f'(User: {self.username})'

