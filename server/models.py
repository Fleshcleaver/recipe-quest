from extensions import db
from datetime import date

def get_rank(level):
    if level >= 15:
        return "👑 Executive Chef"
    elif level >= 10:
        return "⭐ Head Chef"
    elif level >= 6:
        return "👨‍🍳 Sous Chef"
    elif level >= 3:
        return "🍳 Home Chef"
    else:
        return "🥄 Line Cook"

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    xp = db.Column(db.Integer, default=0)
    level = db.Column(db.Integer, default=1)

    recipes = db.relationship('Recipe', back_populates='user', cascade='all, delete-orphan')
    cook_logs = db.relationship('CookLog', back_populates='user', cascade='all, delete-orphan')

    def add_xp(self, amount=25):
        self.xp += amount
        self.level = (self.xp // 100) + 1

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'xp': self.xp,
            'level': self.level,
            'rank': get_rank(self.level),
            'xp_to_next_level': 100 - (self.xp % 100)
        }


class Recipe(db.Model):
    __tablename__ = 'recipes'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(300))
    ingredients = db.Column(db.Text, nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    cook_time = db.Column(db.Integer)  # in minutes
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship('User', back_populates='recipes')
    cook_logs = db.relationship('CookLog', back_populates='recipe', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'ingredients': self.ingredients,
            'instructions': self.instructions,
            'cook_time': self.cook_time,
            'user_id': self.user_id,
            'times_cooked': len(self.cook_logs)
        }


class CookLog(db.Model):
    __tablename__ = 'cook_logs'

    id = db.Column(db.Integer, primary_key=True)
    cooked_on = db.Column(db.Date, default=date.today)
    notes = db.Column(db.String(300))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'), nullable=False)

    user = db.relationship('User', back_populates='cook_logs')
    recipe = db.relationship('Recipe', back_populates='cook_logs')

    def to_dict(self):
        return {
            'id': self.id,
            'cooked_on': str(self.cooked_on),
            'notes': self.notes,
            'user_id': self.user_id,
            'recipe_id': self.recipe_id,
            'recipe_title': self.recipe.title
        }