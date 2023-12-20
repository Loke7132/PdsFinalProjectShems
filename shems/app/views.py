from flask import Flask, jsonify, request
from flask_restful import Api,reqparse
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from app.models import create_user, get_user_by_id,authenticate_user,create_service_location,get_service_locations,get_service_location_by_id,update_service_location,delete_service_location,list_device_types,add_device,remove_device,get_devices,create_device_usage,get_device_usage,monthly_energy_consumption_trend,energy_consumption_vs_sqft,peak_energy_usage_hours,avg_daily_energy_consumption_per_location
from app import app
from ulid import ULID
import pymysql
import datetime 
import random 

api = Api(app)
jwt = JWTManager(app)

parser = reqparse.RequestParser()
parser.add_argument('username', help='This field cannot be blank', required=True)
parser.add_argument('password', help='This field cannot be blank', required=True)


def get_db():
    db = pymysql.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        db=app.config['MYSQL_DB'],
        cursorclass=pymysql.cursors.DictCursor
    )
    return db

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not all([username, password]):
        return jsonify({'message': 'All required fields must be provided'}), 400

    user = authenticate_user(username, password)

    if user:
        print("user",user)
        access_token = create_access_token(identity=user['id'], additional_claims={'username': user['username']})
        return jsonify({'message': 'Login successful', 'access_token': access_token}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    username = data.get('username')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')
    password = data.get('password')
    address = data.get('address')
    city = data.get('city')
    state = data.get('state')
    zipcode = data.get('zipcode')

    if not all([username, first_name, last_name, email, password, address, city, state, zipcode]):
        return jsonify({'message': 'All required fields must be provided'}), 400

    user_id = ULID()
    user_id,error_message = create_user(user_id,username, first_name, last_name, email, password, address, city, state, zipcode)
    print(user_id,error_message)
    if user_id is not None:
        return {'id': str(user_id), 'username': username, 'email': email}, 201
    else:
        return {'message': error_message}, 409

@app.route('/me', methods=['GET'])
@jwt_required()  
def get_user():
    current_user_id = get_jwt_identity()
    print(current_user_id)
    if current_user_id:
        user = get_user_by_id(current_user_id)

        if user:
            return jsonify(user)
        else:
            return jsonify({'message': 'User not found'}), 404
    else:
        return jsonify({'message': 'Unauthorized'}), 401
 
@app.route('/monthly_energy_consumption_trend',methods=['GET'])
@jwt_required()
def monthly_energy_trend():
    current_user_id = get_jwt_identity()
    trend = monthly_energy_consumption_trend(current_user_id)
    return jsonify(trend)


@app.route('/energy_consumption_vs_sqft',methods=['GET'])
@jwt_required()
def energy_consumption_sqft():
    current_user_id = get_jwt_identity()
    data = energy_consumption_vs_sqft(current_user_id)
    return jsonify(data)

@app.route('/peak_energy_usage_hours',methods=['GET'])
@jwt_required()
def peak_energy_hours():
    current_user_id = get_jwt_identity()
    data = peak_energy_usage_hours(current_user_id)
    return jsonify(data)

@app.route('/avg_daily_energy_consumption_per_location',methods=['GET'])
@jwt_required()
def avg_daily_energy_consum_per_location():
    current_user_id = get_jwt_identity()
    data = avg_daily_energy_consumption_per_location(current_user_id)
    return jsonify(data)

@app.route('/service_locations', methods=['POST'])
@jwt_required()
def new_service_location():
    data = request.get_json()
    address = data.get('address')
    city = data.get('city')
    state = data.get('state')
    zipcode = data.get('zipcode')
    bedrooms = data.get('bedrooms')
    takeover_date = data.get('takeover_date')
    squarefoot = data.get('squarefoot')
    occupants = data.get('occupants')

    if not all([address, city, state, zipcode, bedrooms, takeover_date, squarefoot, occupants]):
        return jsonify({'message': 'All required fields must be provided'}), 400

    current_user_id = get_jwt_identity()
    service_location_id = ULID()

    try:
        create_service_location(service_location_id, current_user_id, address, city, state, zipcode, bedrooms, takeover_date, squarefoot, occupants)
    except Exception as e:
        return jsonify({'message': 'An error occurred while creating service location'}), 500
    
    return jsonify({'message': 'Service location created',"id":str(service_location_id)}), 201

@app.route('/service_locations', methods=['GET'])
@jwt_required()
def service_locations():
    current_user_id = get_jwt_identity()
    service_locations=get_service_locations(current_user_id)
    return jsonify(service_locations), 200

@app.route('/service_locations/<service_location_id>', methods=['GET'])
@jwt_required()
def service_location(service_location_id):
    current_user_id = get_jwt_identity()
    service_locations=get_service_location_by_id(current_user_id,service_location_id)
    return jsonify(service_locations), 200

@app.route('/service_locations/<service_location_id>', methods=['PUT'])
@jwt_required()
def edit_service_location(service_location_id):
    data = request.get_json()
    address = data.get('address')
    city = data.get('city')
    state = data.get('state')
    zipcode = data.get('zipcode')
    bedrooms = data.get('bedrooms')
    takeover_date = data.get('takeover_date')
    squarefoot = data.get('squarefoot')
    occupants = data.get('occupants')

    if not all([address, city, state, zipcode, bedrooms, takeover_date, squarefoot, occupants]):
        return jsonify({'message': 'All required fields must be provided'}), 400

    current_user_id = get_jwt_identity()
    try:
        update_service_location(current_user_id,service_location_id,address, city, state, zipcode, bedrooms, takeover_date, squarefoot, occupants)
    except Exception as e:
        return jsonify({'message': 'An error occurred while updating service location'}), 500

    service_locations=get_service_location_by_id(current_user_id,service_location_id)
    return jsonify(service_locations), 200
    
@app.route('/service_locations/<service_location_id>', methods=['DELETE'])
@jwt_required()
def remove_service_location(service_location_id):
    current_user_id = get_jwt_identity()
    try:
        delete_service_location(current_user_id,service_location_id)
    except Exception as e:
        return jsonify({'message': 'An error occurred while deleting service location'}), 500

    return jsonify({'message': 'Service location deleted'}), 200


@app.route('/device_types', methods=['GET'])
@jwt_required()
def device_types():
    device_types=list_device_types()
    return jsonify(device_types), 200


@app.route('/service_locations/<service_location_id>/device', methods=['POST'])
@jwt_required()
def new_device(service_location_id):
    data = request.get_json()
    device_type_id = data.get('device_type_id')
    device_name = data.get('device_name')
    
    if not all([device_type_id, device_name]):
        return jsonify({'message': 'All required fields must be provided'}), 400

    try: 
        add_device(device_type_id,service_location_id,device_name)
        return jsonify({'message': 'Device added'}), 201
    except Exception as e:
        return jsonify({'message': 'An error occurred while adding device'}), 500

@app.route('/service_locations/<service_location_id>/devices', methods=['GET'])
@jwt_required()
def devices(service_location_id):
    try:
        devices=get_devices(service_location_id)
        return jsonify(devices), 200
    except Exception as e:
        return jsonify({'message': 'An error occurred while getting devices'}), 500
    
@app.route('/service_locations/<service_location_id>/device/<device_id>', methods=['DELETE'])
@jwt_required()
def delete_device(service_location_id,device_id):
    try:
        remove_device(device_id)
        return jsonify({'message': 'Device deleted'}), 200
    except Exception as e:
        return jsonify({'message': 'An error occurred while deleting device'}), 500


labels=['energy_use','switch_on','switch_off','door_open','door_close']

@app.route('/populate_usage', methods=['POST'])
@jwt_required()
def create_dummy_usage_data():
    user_id = get_jwt_identity()
    try:
        locations = get_service_locations(user_id)
        for location in locations:
            devices = get_devices(location['id'])
            for device in devices:
                create_device_usage(device['id'])
        return jsonify({'message': 'Usage data created'}), 201
    except Exception as e:
        return jsonify({'message': 'An error occurred while creating usage data'}), 500  

@app.route('/service_locations/<service_location_id>/devices/<device_id>/usage', methods=['GET'])
@jwt_required()
def get_usage(service_location_id,device_id):
    try:
        usage=get_device_usage(device_id)
        return jsonify(usage), 200
    except Exception as e:
        return jsonify({'message': 'An error occurred while getting usage data'}), 500

if __name__ == '__main__':
    app.run(debug=True)

