from config import db, SM, validates

class FishLake(db.Model, SM):
    __tablename__ = 'fish_lakes'

    id  = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String, nullable=False, default='pending')
    lake_id = db.Column(db.Integer, db.ForeignKey('lakes.id'), nullable=False)
    fish_id = db.Column(db.Integer, db.ForeignKey('fish.id'), nullable=False)

    serialize_rules = ('-fish.lake_fish', '-lake.lake_fish')

    @validates('status')
    def valid_status(self, key, status):
        if status == 'pending' or status == 'approved':
            return status
        raise ValueError('Status must be approved or pending')

    def __repr__(self):
        return f'(fish_lake {self.id})'
