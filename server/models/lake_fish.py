from config import db, SM

class FishLake(db.Model, SM):
    __tablename__ = 'fish_lakes'

    id  = db.Column(db.Integer, primary_key=True)
    lake_id = db.Column(db.Integer, db.ForeignKey('lakes.id'), nullable=False)
    fish_id = db.Column(db.Integer, db.ForeignKey('fish.id'), nullable=False)

    serialize_rules = ('-fish.lake', '-lake.fish')

    def __repr__(self):
        return f'(fish_lake {self.id})'
