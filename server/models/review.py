from config import db, SM, IntegrityError

class Review(db.Model, SM):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)
    text = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    user_id = db.Column(db.Integer, db.Foreignkey('users.id'), nullable=False)
    lake_id = db.Column(db.Integer, db.Foreignkey('lakes.id'), nullable=False)

    serialize_rules = ('-user.reviews', '-lake.reviews')

    def __repr__(self):
        return f'(Review: {self.id})'

