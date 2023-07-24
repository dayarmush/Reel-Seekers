from config import db, SM, validates

class Message(db.Model, SM):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    user_id = db.Column(db.Integer, db.Foreignkey('user.id'), nullable=False)
    lake_id = db.Column(db.Integer, db.Foreignkey('lakes.id'), nullable=False)

    serialize_rules = ('-user.messages', '-lake.messages')

    @validates('text')
    def validate__text(self, key, text):
        if len(text) >= 1:
            return text
        raise ValueError('Cannot send empty message')

    def __repr__(self):
        return f'(Message: {self.id})'