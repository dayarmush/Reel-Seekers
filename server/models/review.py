from config import db, SM, IntegrityError

class Review(db.Model, SM):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)
    text = db.Column(db.String)

    user_id = db.Column(db.Integer, db.Foreignkey('users.id'), nullable=False)
    lake_id = db.Column(db.Integer, db.Foreignkey('lakes.id'), nullable=False)

    def __repr__(self):
        return f'(Review: {self.id})'

