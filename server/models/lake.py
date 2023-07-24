from config import db, SM, validates, re

lake_fish = db.Table( 'lake_fish',
    db.Column('lake_id', db.Integer, db.ForeignKey('lakes.id'), primary_key=True),
    db.Column('fish_id', db.Integer, db.ForeignKey('fish.id'), primary_key=True)
)

class Lake(db.Model, SM):
    __tablename__ = 'lakes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    address1 = db.Column(db.String, nullable=False)
    address2 = db.Column(db.String)
    city = db.Column(db.String(20))
    state = db.Column(db.String(14))
    zip_code = db.Column(db.Integer(6), nullable=False)
    status = db.Column(db.String(9), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    favorites = db.relationship('Favorite', backref='lake', cascade='all, delete-orphan')
    reviews = db.relationship('Review', backref='lake')
    edits = db.relationship('Edited', backref='lake', cascade='all, delete-orphan')
    fish = db.relationship('lake_fish', backref='lake', cascade='all, delete-orphan')
    messages = db.relationship('Message', backref='lake', cascade='all, delete-orphan')

    serialize_rules = ('-favorites.lake', '-reviews.lake', '-edits.lake', '-fish.lake', '-messages.lake')

    @validates('name')
    def validate_name(self, key, name):
        if re.search('^[a-zA-Z]+$', name) is not None:
            return name
        raise ValueError('Invalid name. Please use only letters from A to Z (both lowercase and uppercase).')
    
    @validates('zip_code')
    def validate_zip(self, key, zip_code):
        if isinstance(zip_code, int) and len(str(zip_code)) == 5:
            return zip_code
        raise ValueError('Invalid Zip Code')

    def __repr__(self):
        return f'(Lake: {self.name})'