from server.config import db, SM, validates, re

class Fish(db.Model, SM):
    __tablename__ = 'fish'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    wiki = db.Column(db.String)
    image = db.Column(db.String)
    start_season =  db.Column(db.Integer, db.CheckConstraint('start_season <= end_season'))
    end_season = db.Column(db.Integer, db.CheckConstraint('end_season >= start_season'))
    min_length = db.Column(db.Integer)
    max_length = db.Column(db.Integer)
    daily_limit = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    lake_fish = db.relationship('FishLake', backref='fish', cascade='all, delete-orphan')
    # edits = db.relationship('Edit', backref='fish', cascade='all, delete-orphan')

    serialize_rules = ('-lake_fish.fish',)

    @validates('name')
    def valid_name(self, key, name):
        if re.search('^[a-zA-Z\s-]+$', name) is not None:
            return name
        raise ValueError('Invalid name. Please use only letters from A to Z (both lowercase and uppercase).')
    
    @validates('min_length', 'daily_limit')
    def valid_nums(self, key, value):
        if isinstance(value, int):
            return value
        raise ValueError('Limits must be a number')
    
    @validates('max_length')
    def valid_lengths(self, key, max_length):

        if self.min_length == 0 or max_length == 0:
            return max_length
        
        if max_length <= self.min_length:
            raise ValueError('Invalid Min Length.')
        return max_length
    
    @validates('end_season')
    def valid_seasons(self, key, end_season):
        if (end_season == 0 and self.start_season == 0) or (
            end_season > self.start_season and self.start_season != 0):
            return end_season
        else:
            raise ValueError('Invalid Seasons.')

    def __repr__(self):
        return f'(Fish: {self.name})'