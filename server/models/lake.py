from config import db, SM, validates, re

class Lake(db.Model, SM):
    __tablename__ = 'lakes'
    __table_args__ = (db.CheckConstraint('LENGTH(address1) >= 3'),)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    address1 = db.Column(db.String, nullable=False, unique=True)
    city = db.Column(db.String)
    state = db.Column(db.String)
    zip_code = db.Column(db.String, nullable=False)
    status = db.Column(db.String, nullable=False, default='pending')
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    favorites = db.relationship('Favorite', backref='lake', cascade='all, delete-orphan')
    reviews = db.relationship('Review', backref='lake')
    edits = db.relationship('Edit', backref='lake', cascade='all, delete-orphan')
    fish = db.relationship('FishLake', backref='lake', cascade='all, delete-orphan')
    messages = db.relationship('Message', backref='lake', cascade='all, delete-orphan')

    serialize_rules = ('-favorites', '-reviews', '-edits.lake', '-fish.lake', '-messages')

    @validates('status')
    def valid_status(self, key, status):
        if status == 'pending' or status == 'approved':
            return status
        raise ValueError('Status must be approved or pending')

    # @validates('name')
    # def validate_name(self, key, name):
    #     if re.search('^[a-zA-Z][a-zA-Z\s\-]+[a-zA-Z]$', name) is not None:
    #         return name
    #     raise ValueError('Invalid name. Please use only letters from A to Z (both lowercase and uppercase).')
    
    @validates('zip_code')
    def validate_zip(self, key, zip_code):
        if len(str(zip_code)) == 5:
            return zip_code
        raise ValueError('Invalid Zip Code')

    def __repr__(self):
        return f'(Lake: {self.name})'