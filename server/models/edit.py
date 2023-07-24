from config import db, SM, IntegrityError

class Edit(db.Model, SM):
    __tablename__ = 'edits'

    id = db.Column(db.Integer, primary_key=True)
    what = db.Column(db.String)

    user_id = db.Column(db.Integer, db.Foreignkey('users.id'))
    fish_id  = db.Column(db.Integer, db.Foreignkey('fish.id'))
    lake_id = db.Column(db.Integer, db.Foreignkey('lakes.id'))

    serialize_rules = ('-user.edits', '-fish.edits', '-lakes.edits')

    def __repr__(self):
        return f'(Edit: {self.id})'
    