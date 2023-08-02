from config import db, SM, validates, re

class Fish(db.Model, SM):
    __tablename__ = 'fish'

    # add a season
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    min_length = db.Column(db.Integer)
    max_length = db.Column(db.Integer)
    daily_limit = db.Column(db.Integer)
    status = db.Column(db.String, nullable=False, default='pending')
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    lake_fish = db.relationship('FishLake', backref='fish', cascade='all, delete-orphan')
    # edits = db.relationship('Edit', backref='fish', cascade='all, delete-orphan')

    serialize_rules = ('-lake_fish.fish',)
    #validate to make sure max is more then min
    @validates('status')
    def valid_status(self, key, status):
        if status == 'pending' or status == 'approved':
            return status
        raise ValueError('Status must be approved or pending')

    @validates('name')
    def valid_name(self, key, name):
        if re.search('^[a-zA-Z\s-]+$', name) is not None:
            return name
        raise ValueError('Invalid name. Please use only letters from A to Z (both lowercase and uppercase).')
    
    @validates('min_length', 'max_length', 'daily_limit')
    def valid_nums(self, key, value):
        if isinstance(value, int):
            return value
        raise ValueError('Limits must be a number')

    def __repr__(self):
        return f'(Fish: {self.name})'