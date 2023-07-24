from config import db, IntegrityError, SM

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

    favorites = db.relationship('Favorite', backref='lake')
    reviews = db.relationship('Review', backref='lake')
    edits = db.relationship('Edited', backref='lake')
    fish = db.relationship('FishLake', backref='lake')
    messages = db.relationship('Message', backref='lake')

    def __repr__(self):
        return f'(Lake: {self.name})'