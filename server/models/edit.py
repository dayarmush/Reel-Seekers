from config import db, SM

class Edit(db.Model, SM):
    __tablename__ = 'edits'

    id = db.Column(db.Integer, primary_key=True)
    what = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    fish_id  = db.Column(db.Integer, db.ForeignKey('fish.id'))
    lake_id = db.Column(db.Integer, db.ForeignKey('lakes.id'))

    serialize_rules = ('-user.edits', '-fish.edits', '-lakes.edits')

    def __repr__(self):
        return f'(Edit: {self.id})'
    