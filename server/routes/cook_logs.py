from flask import Blueprint, request, jsonify
from extensions import db
from models import CookLog, Recipe, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import date

cook_logs_bp = Blueprint('cook_logs', __name__)

@cook_logs_bp.route('/cook-logs', methods=['GET'])
@jwt_required()
def get_cook_logs():
    user_id = get_jwt_identity()
    logs = CookLog.query.filter_by(user_id=user_id).order_by(CookLog.cooked_on.desc()).all()
    return jsonify([log.to_dict() for log in logs]), 200


@cook_logs_bp.route('/cook-logs', methods=['POST'])
@jwt_required()
def create_cook_log():
    user_id = get_jwt_identity()
    data = request.get_json()

    # make sure the recipe belongs to this user
    recipe = Recipe.query.filter_by(id=data['recipe_id'], user_id=user_id).first()
    if not recipe:
        return jsonify({'error': 'Recipe not found'}), 404

    log = CookLog(
        cooked_on=date.fromisoformat(data['cooked_on']) if 'cooked_on' in data else date.today(),
        notes=data.get('notes', ''),
        user_id=user_id,
        recipe_id=recipe.id
    )
    db.session.add(log)

    # award XP to the user
    user = User.query.get(user_id)
    user.add_xp(25)

    db.session.commit()
    return jsonify({'log': log.to_dict(), 'user': user.to_dict()}), 201


@cook_logs_bp.route('/cook-logs/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_cook_log(id):
    user_id = get_jwt_identity()
    log = CookLog.query.filter_by(id=id, user_id=user_id).first()
    if not log:
        return jsonify({'error': 'Log not found'}), 404

    db.session.delete(log)
    db.session.commit()
    return jsonify({'message': 'Log deleted'}), 200