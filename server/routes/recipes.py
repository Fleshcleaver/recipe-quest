from flask import Blueprint, request, jsonify
from extensions import db
from models import Recipe
from flask_jwt_extended import jwt_required, get_jwt_identity

recipes_bp = Blueprint('recipes', __name__)

@recipes_bp.route('/recipes', methods=['GET'])
@jwt_required()
def get_recipes():
    user_id = get_jwt_identity()
    recipes = Recipe.query.filter_by(user_id=user_id).all()
    return jsonify([r.to_dict() for r in recipes]), 200


@recipes_bp.route('/recipes', methods=['POST'])
@jwt_required()
def create_recipe():
    user_id = get_jwt_identity()
    data = request.get_json()

    recipe = Recipe(
        title=data['title'],
        description=data.get('description', ''),
        ingredients=data['ingredients'],
        instructions=data['instructions'],
        cook_time=data.get('cook_time'),
        user_id=user_id
    )
    db.session.add(recipe)
    db.session.commit()
    return jsonify(recipe.to_dict()), 201


@recipes_bp.route('/recipes/<int:id>', methods=['GET'])
@jwt_required()
def get_recipe(id):
    user_id = get_jwt_identity()
    recipe = Recipe.query.filter_by(id=id, user_id=user_id).first()
    if not recipe:
        return jsonify({'error': 'Recipe not found'}), 404
    return jsonify(recipe.to_dict()), 200


@recipes_bp.route('/recipes/<int:id>', methods=['PATCH'])
@jwt_required()
def update_recipe(id):
    user_id = get_jwt_identity()
    recipe = Recipe.query.filter_by(id=id, user_id=user_id).first()
    if not recipe:
        return jsonify({'error': 'Recipe not found'}), 404

    data = request.get_json()
    for field in ['title', 'description', 'ingredients', 'instructions', 'cook_time']:
        if field in data:
            setattr(recipe, field, data[field])

    db.session.commit()
    return jsonify(recipe.to_dict()), 200


@recipes_bp.route('/recipes/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_recipe(id):
    user_id = get_jwt_identity()
    recipe = Recipe.query.filter_by(id=id, user_id=user_id).first()
    if not recipe:
        return jsonify({'error': 'Recipe not found'}), 404

    db.session.delete(recipe)
    db.session.commit()
    return jsonify({'message': 'Recipe deleted'}), 200