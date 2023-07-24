from config import db, SM, IntegrityError

class Fish(db.Model, SM):
    __tablename__ = 'fish'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    min_length = db.Column(db.Integer)
    max_length = db.Column(db.Integer)
    daily_limit = db.Column(db.Integer)
    status = db.Column(db.String(9), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    lakes = db.relationship('FishLake', backref='fish')
    edits = db.relationship('Edit', backref='fish')

    serialize_rules = ('-lakes.fish', 'edits.lake')

    def __repr__(self):
        return f'(Fish: {self.name})'