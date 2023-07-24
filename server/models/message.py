from config import db, SM, IntegrityError

class Message(db.Model, SM):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Integer, nullable=False)

    user_id = db.Column(db.Integer, db.Foreignkey('user.id'), nullable=False)
    lake_id = db.Column(db.Integer, db.Foreignkey('lakes.id'), nullable=False)

    def __repr__(self):
        return f'(Message: {self.id})'