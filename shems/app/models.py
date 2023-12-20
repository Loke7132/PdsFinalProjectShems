from app import app
import pymysql
import bcrypt
import logging
import random 

logging.basicConfig(level=logging.ERROR)

def get_db():
    return pymysql.connect(
        host=app.config['MYSQL_HOST'],
        port=app.config['MYSQL_PORT'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        db=app.config['MYSQL_DB'],
        cursorclass=pymysql.cursors.DictCursor
    )


def init_db():
    connection = get_db()
    try:
        with connection.cursor() as cursor:
            # Initialize the users table
            create_users_table = """
                CREATE TABLE IF NOT EXISTS users (
                    id VARCHAR(50) PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    first_name VARCHAR(50) NOT NULL,
                    last_name VARCHAR(50) NOT NULL,
                    email VARCHAR(120) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    address VARCHAR(255) NOT NULL,
                    city VARCHAR(50) NOT NULL,
                    state VARCHAR(50) NOT NULL,
                    zipcode VARCHAR(10) NOT NULL
                )
            """
            cursor.execute(create_users_table)

            # Initialize the service_locations table
            create_service_locations_table = """
                CREATE TABLE IF NOT EXISTS service_locations (
                    id VARCHAR(50) PRIMARY KEY,
                    user_id VARCHAR(50) NOT NULL,
                    address VARCHAR(255) NOT NULL,
                    city VARCHAR(50) NOT NULL,
                    state VARCHAR(50) NOT NULL,
                    zipcode VARCHAR(10) NOT NULL,
                    bedrooms INT,
                    takeover_date DATE,
                    squarefoot INT,
                    occupants INT,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            """
            cursor.execute(create_service_locations_table)

            # Initialize devices types table
            create_device_types_table = """
                CREATE TABLE IF NOT EXISTS device_types (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(50) NOT NULL,
                    model VARCHAR(50) NOT NULL,
                    model_number VARCHAR(50) NOT NULL,
                    UNIQUE KEY unique_device (name, model, model_number)
                )
            """
            cursor.execute(create_device_types_table)

            # populate device types table
            populate_device_types_table = """
                INSERT IGNORE INTO device_types (name, model, model_number)
                VALUES
                    ('Thermostat', 'Nest', 'T3007ES'),
                    ('Thermostat', 'Ecobee', 'EB-STATE3LT-02'),
                    ('Thermostat', 'Honeywell', 'RTH9585WF'),
                    ('Thermostat', 'Emerson', 'UP500W'),
                    ('Thermostat', 'Honeywell', 'RTH6580WF'),
                    ('Thermostat', 'Honeywell', 'RTH7600D'),
                    ('Thermostat', 'Honeywell', 'RTH2300B'),
                    ('Thermostat', 'Honeywell', 'RTH221B'),
                    ('Thermostat', 'Honeywell', 'RTH111B'),
                    ('Refrigerator', 'Samsung', 'RF28R7351SG'),
                    ('Refrigerator', 'LG', 'LFXS26973S'),
                    ('Refrigerator', 'GE', 'GSS25GSHSS'),
                    ('Air Conditioner', 'Frigidaire', 'FFRE0533S1'),
                    ('Air Conditioner', 'LG', 'LW8016ER'),
                    ('Air Conditioner', 'Frigidaire', 'FFRA0511R1'),
                    ('TV', 'Samsung', 'UN55RU7100FXZA'),
                    ('TV', 'LG', '55UM7300PUA'),
                    ('TV', 'TCL', '55S425'),
                    ('TV', 'Toshiba', '55LF711U20'),
                    ('Toaster', 'Cuisinart', 'CPT-180P1'),
                    ('Toaster', 'Hamilton Beach', '22720'),
                    ('Toaster', 'Oster', 'TSSTTRJBG1'),
                    ('Toaster', 'Cuisinart', 'CPT-122'),
                    ('Microwave', 'Toshiba', 'EM131A5C-BS'),
                    ('Microwave', 'Panasonic', 'NN-SN966S')
            """
            cursor.execute(populate_device_types_table)

            # Initialize devices table
            create_devices_table = """
                CREATE TABLE IF NOT EXISTS devices (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    device_name VARCHAR(50) NOT NULL,
                    device_type INT NOT NULL,
                    location_id VARCHAR(50) NOT NULL,
                    FOREIGN KEY (location_id) REFERENCES service_locations(id),
                    FOREIGN KEY (device_type) REFERENCES device_types(id)
                )
            """
            cursor.execute(create_devices_table)

            # Initialize Energy prices table
            create_energy_prices_table = """
                CREATE TABLE IF NOT EXISTS energy_prices (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    zipcode VARCHAR(10) NOT NULL,
                    pricePerKWH FLOAT NOT NULL,
                    hours_from INT NOT NULL,
                    hours_to INT NOT NULL
                )
            """
            cursor.execute(create_energy_prices_table)

            # populate energy prices table
            populate_energy_prices_table = """
                INSERT IGNORE INTO energy_prices (zipcode, pricePerKWH, hours_from, hours_to)
                VALUES
                    ('90001', 10.18, 12, 18),
                    ('90001', 20.18, 4, 12),
                    ('90001', 30.18, 18, 24),
                    ('90001', 50.23, 0, 12),
                    ('90002', 10.58, 12, 18),
                    ('90002', 10.58, 4, 12),
                    ('90002', 10.58, 18, 24),
                    ('90002', 10.58, 0, 12),
                    ('90003', 10.58, 12, 18),
                    ('90003', 10.58, 4, 12),
                    ('90003', 10.58, 18, 24),
                    ('90003', 10.58, 0, 12),
                    ('90004', 6.58, 12, 18),
                    ('90004', 6.58, 4, 12),
                    ('90004', 6.58, 18, 24),
                    ('90004', 6.58, 0, 12)
                """
            cursor.execute(populate_energy_prices_table)

            # Initialize energy usage table
            create_energy_usage_table = """
                CREATE TABLE IF NOT EXISTS energy_usage (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    device_id INT NOT NULL,
                    energy_usage FLOAT NOT NULL,
                    energy_label VARCHAR(50) NOT NULL,
                    time_stamp DATETIME NOT NULL,
                    FOREIGN KEY (device_id) REFERENCES devices(id)
                )
            """
            cursor.execute(create_energy_usage_table)

        connection.commit()
    finally:
        connection.close()

def list_device_types():
    connection = get_db()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT * FROM device_types"
            cursor.execute(sql)
            result = cursor.fetchall()
            return result
    finally:
        connection.close()

def get_user_by_id(user_id):
    connection = get_db()
    try:
        with connection.cursor() as cursor:
            sql = f"SELECT id, username, first_name, last_name, email,address,city,state,zipcode FROM users WHERE id = %s"
            cursor.execute(sql, (user_id,))
            result = cursor.fetchone()
            return result
    finally:
        connection.close()

def create_user(user_id,username, first_name, last_name, email, password, address, city, state, zipcode):
    connection = get_db()
    try:
        with connection.cursor() as cursor:
            # Check if the username or email already exists
            check_query = "SELECT * FROM users WHERE username = %s OR email = %s"
            cursor.execute(check_query, (username, email))
            existing_user = cursor.fetchone()

            if existing_user:
                return None,"Username or email already exists"
            
            # Hash the password
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

            # Insert the new user into the users table
            insert_user_query = "INSERT INTO users (id,username, first_name, last_name, email, password,address,city,state,zipcode) VALUES (%s,%s, %s, %s, %s, %s,%s,%s,%s,%s)"
            cursor.execute(insert_user_query, (user_id,username, first_name, last_name, email, hashed_password,address,city,state,zipcode))
            connection.commit()
            
            return user_id, None  # Return user_id and no error
    except Exception as e:
        logging.error(f"Error creating user: {e}")
        connection.rollback()
        return None,e
    finally:
        connection.close()

def create_service_location(service_location_id,user_id, address, city, state, zipcode, bedrooms, takeover_date, squarefoot, occupants):
    connection = get_db()
    try:
        with connection.cursor() as cursor:
            # Insert service location details into the service_locations table
            insert_location_query = """
                INSERT INTO service_locations (id,user_id, address, city, state, zipcode, bedrooms, takeover_date, squarefoot, occupants)
                VALUES (%s,%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_location_query, (service_location_id,user_id, address, city, state, zipcode, bedrooms, takeover_date, squarefoot, occupants))
            connection.commit()
    except Exception as e:
        logging.error(f"Error creating service location: {e}")
        connection.rollback()
        raise e # Re-raise the exception to propagate it up the call stack
    finally:
        connection.close()

def get_service_locations(user_id):
    connection = get_db()
    try:
        with connection.cursor() as cursor:
            sql = f"SELECT * FROM service_locations WHERE user_id = %s"
            cursor.execute(sql, (user_id,))
            result = cursor.fetchall()
            return result
    finally:
        connection.close()

def get_service_location_by_id(user_id,service_location_id):
    connection = get_db()
    try:
        with connection.cursor() as cursor:
            sql = f"SELECT * FROM service_locations WHERE user_id = %s AND id = %s"
            cursor.execute(sql, (user_id,service_location_id))
            result = cursor.fetchone()
            return result
    finally:
        connection.close()

def update_service_location(user_id,service_location_id, address, city, state, zipcode, bedrooms, takeover_date, squarefoot, occupants):
    connection = get_db()
    try:
        with connection.cursor() as cursor:
            # Update service location details in the service_locations table
            update_location_query = """
                UPDATE service_locations
                SET address = %s, city = %s, state = %s, zipcode = %s, bedrooms = %s, takeover_date = %s, squarefoot = %s, occupants = %s
                WHERE user_id = %s AND id = %s
            """
            cursor.execute(update_location_query, (address, city, state, zipcode, bedrooms, takeover_date, squarefoot, occupants,user_id,service_location_id))
            connection.commit()
    except Exception as e:
        logging.error(f"Error updating service location: {e}")
        connection.rollback()
        raise e # Re-raise the exception to propagate it up the call stack
    finally:
        connection.close()

def delete_service_location(user_id,service_location_id):
    connection = get_db()
    try:
        with connection.cursor() as cursor:
            # Delete service location details from the service_locations table
            delete_location_query = """
                DELETE FROM service_locations
                WHERE user_id = %s AND id = %s
            """
            cursor.execute(delete_location_query, (user_id,service_location_id))
            connection.commit()
    except Exception as e:
        logging.error(f"Error deleting service location: {e}")
        connection.rollback()
        raise e # Re-raise the exception to propagate it up the call stack
    finally:
        connection.close()


def add_device(device_type_id, service_location_id, device_name):
    connection = get_db()
    try:
        with connection.cursor() as cursor:
            # Insert device details into the devices table
            insert_device_query = """
                INSERT INTO devices (device_type, location_id, device_name)
                VALUES (%s, %s, %s)
            """
            cursor.execute(insert_device_query, (device_type_id, service_location_id, device_name))
            connection.commit()
    except Exception as e:
        logging.error(f"Error adding device: {e}")
        connection.rollback()
        raise e # Re-raise the exception to propagate it up the call stack
    finally:
        connection.close()

def get_devices(service_location_id):
    connection = get_db()
    try:
        with connection.cursor() as cursor:
            sql = """
                SELECT devices.*, device_types.name AS device_type_name, device_types.model, device_types.model_number
                FROM devices
                JOIN device_types ON devices.device_type = device_types.id
                WHERE devices.location_id = %s
            """            
            cursor.execute(sql, (service_location_id,))
            result = cursor.fetchall()
            return result
    finally:
        connection.close()

def remove_device(device_id):
    connection = get_db()
    try:
        with connection.cursor() as cursor:
            # Delete device details from the devices table
            delete_device_query = """
                DELETE FROM devices
                WHERE id = %s
            """
            cursor.execute(delete_device_query, (device_id,))
            connection.commit()
    except Exception as e:
        logging.error(f"Error deleting device: {e}")
        connection.rollback()
        raise e # Re-raise the exception to propagate it up the call stack
    finally:
        connection.close()

q1="""INSERT INTO energy_usage (device_id, energy_usage, time_stamp, energy_label)
VALUES
(<deviceid>, 0.2, '2022-08-01 12:00:00', 'switched on'),
(<deviceid>, 0.6, '2022-08-01 12:15:00', 'energy use'),
(<deviceid>, 0.5, '2022-08-01 12:30:00', 'energy use'),
(<deviceid>, 0.1, '2022-08-01 12:45:00', 'energy use'),
(<deviceid>, 0, '2022-08-01 13:00:00', 'switched off'),
(<deviceid>, 0.4, '2022-08-01 12:00:00', 'energy use'), 
(<deviceid>, 4, '2022-09-01 12:00:00', 'switched on'),
(<deviceid>, 3, '2022-09-01 12:15:00', 'energy use'),
(<deviceid>, 2, '2022-09-01 12:30:00', 'energy use'),
(<deviceid>, 5, '2022-09-01 12:45:00', 'energy use'),
(<deviceid>, 0, '2022-09-01 13:00:00', 'switched off'),
(<deviceid>, 1, '2022-09-01 12:00:00', 'energy use'), 
(<deviceid>, 0.4, '2023-02-01 14:00:00', 'energy use'),
(<deviceid>, 0.6, '2023-02-01 14:15:00', 'energy use'),
(<deviceid>, 0.8, '2023-02-01 14:30:00', 'energy use'),
(<deviceid>, 0.5, '2023-02-01 14:45:00', 'energy use'),
(<deviceid>, 0.3, '2023-02-01 15:00:00', 'energy use'),
(<deviceid>, 0.2, '2023-02-01 15:15:00', 'energy use'),
(<deviceid>, 0.1, '2023-02-01 15:30:00', 'energy use'),
(<deviceid>, 0.4, '2023-02-01 15:45:00', 'energy use'),
(<deviceid>, 0.6, '2023-02-01 16:00:00', 'energy use'),
(<deviceid>, 0.8, '2023-02-01 16:15:00', 'energy use'),
(<deviceid>, 0.4, '2023-02-01 16:30:00', 'energy use'),
(<deviceid>, 0.6, '2023-02-01 16:45:00', 'energy use'),
(<deviceid>, 0.8, '2023-02-01 17:00:00', 'energy use'),
(<deviceid>, 0.5, '2023-02-01 17:15:00', 'energy use'),
(<deviceid>, 0.3, '2023-02-01 17:30:00', 'energy use'),
(<deviceid>, 0.2, '2023-02-01 17:45:00', 'energy use'),
(<deviceid>, 0.1, '2023-02-01 18:00:00', 'energy use')"""

q2="""INSERT INTO energy_usage (device_id, energy_usage, time_stamp, energy_label)
VALUES
(<deviceid>, 0.0, '2022-08-01 12:15:00', 'door opened'),
(<deviceid>, 0.1, '2022-08-01 12:30:00', 'energy use'),
(<deviceid>, 0.1, '2022-08-01 12:45:00', 'energy use'),
(<deviceid>, 0.2, '2022-08-01 13:00:00', 'energy use'),
(<deviceid>, 0.3, '2022-08-01 13:15:00', 'energy use'),
(<deviceid>, 0.2, '2022-08-01 13:30:00', 'energy use'),
(<deviceid>, 0.1, '2022-09-01 12:15:00', 'door opened'),
(<deviceid>, 0.2, '2022-09-01 12:30:00', 'energy use'),
(<deviceid>, 0.3, '2022-09-01 12:45:00', 'energy use'),
(<deviceid>, 0.4, '2022-09-01 13:00:00', 'energy use'),
(<deviceid>, 0.3, '2022-09-01 13:15:00', 'energy use'),
(<deviceid>, 0.2, '2022-09-01 13:30:00', 'energy use'),
(<deviceid>, 0.2, '2023-02-01 14:00:00', 'energy use'),
(<deviceid>, 0.4, '2023-02-01 14:15:00', 'energy use'),
(<deviceid>, 0.6, '2023-02-01 14:30:00', 'energy use'),
(<deviceid>, 0.3, '2023-02-01 14:45:00', 'energy use'),
(<deviceid>, 0.2, '2023-02-01 15:00:00', 'energy use'),
(<deviceid>, 0.1, '2023-02-01 15:15:00', 'energy use'),
(<deviceid>, 0.4, '2023-02-01 15:30:00', 'energy use'),
(<deviceid>, 0.3, '2023-02-01 15:45:00', 'energy use'),
(<deviceid>, 0.5, '2023-02-01 16:00:00', 'energy use'),
(<deviceid>, 0.2, '2023-02-01 16:15:00', 'energy use'),
(<deviceid>, 0.2, '2023-02-01 16:30:00', 'energy use'),
(<deviceid>, 0.4, '2023-02-01 16:45:00', 'energy use'),
(<deviceid>, 0.6, '2023-02-01 17:00:00', 'energy use'),
(<deviceid>, 0.3, '2023-02-01 17:15:00', 'energy use'),
(<deviceid>, 0.2, '2023-02-01 17:30:00', 'energy use'),
(<deviceid>, 0.1, '2023-02-01 17:45:00', 'energy use'),
(<deviceid>, 0.4, '2023-02-01 18:00:00', 'energy use')"""


q3 = """INSERT INTO energy_usage (device_id, energy_usage, time_stamp, energy_label)
VALUES
(<deviceid>, 0.3, '2022-08-01 13:45:00', 'energy use'),
(<deviceid>, 0.5, '2022-08-01 14:00:00', 'door closed'),
(<deviceid>, 0.1, '2022-08-01 12:00:00', 'energy use'),
(<deviceid>, 0.2, '2022-08-01 12:15:00', 'energy use'),
(<deviceid>, 0.0, '2022-08-01 12:30:00', 'switched off'),
(<deviceid>, 0.3, '2022-08-01 12:45:00', 'energy use'),
(<deviceid>, 0.4, '2022-09-01 13:45:00', 'energy use'),
(<deviceid>, 0.2, '2022-09-01 14:00:00', 'door closed'),
(<deviceid>, 0.1, '2022-09-01 12:00:00', 'energy use'),
(<deviceid>, 0.3, '2022-09-01 12:15:00', 'energy use'),
(<deviceid>, 0.2, '2022-09-01 12:30:00', 'switched off'),
(<deviceid>, 0.2, '2022-09-01 12:45:00', 'energy use'),
(<deviceid>, 0.4, '2023-02-01 14:00:00', 'energy use'),
(<deviceid>, 0.6, '2023-02-01 14:15:00', 'energy use'),
(<deviceid>, 0.8, '2023-02-01 14:30:00', 'energy use'),
(<deviceid>, 0.5, '2023-02-01 14:45:00', 'energy use'),
(<deviceid>, 0.3, '2023-02-01 15:00:00', 'energy use'),
(<deviceid>, 0.2, '2023-02-01 15:15:00', 'energy use'),
(<deviceid>, 0.1, '2023-02-01 15:30:00', 'energy use'),
(<deviceid>, 0.4, '2023-02-01 15:45:00', 'energy use'),
(<deviceid>, 0.6, '2023-02-01 16:00:00', 'energy use'),
(<deviceid>, 0.8, '2023-02-01 16:15:00', 'energy use'),
(<deviceid>, 0.4, '2023-02-01 16:30:00', 'energy use'),
(<deviceid>, 0.6, '2023-02-01 16:45:00', 'energy use'),
(<deviceid>, 0.8, '2023-02-01 17:00:00', 'energy use'),
(<deviceid>, 0.5, '2023-02-01 17:15:00', 'energy use'),
(<deviceid>, 0.3, '2023-02-01 17:30:00', 'energy use'),
(<deviceid>, 0.2, '2023-02-01 17:45:00', 'energy use'),
(<deviceid>, 0.1, '2023-02-01 18:00:00', 'energy use')"""

def create_device_usage(device_id):
    connection = get_db()
    try:
        with connection.cursor() as cursor:
            query = random.choice([q1,q2,q3])
            query = query.replace("<deviceid>", str(device_id))
            print(query)
            cursor.execute(query)
            connection.commit()
    except Exception as e:
        logging.error(f"Error creating device usage: {e}")
        connection.rollback()
        raise e # Re-raise the exception to propagate it up the call stack
    finally:
        connection.close()

def get_device_usage(device_id):
    connection = get_db()
    try:
        with connection.cursor() as cursor:
            # Retrieve device usage by device_id
            cursor.execute("SELECT * FROM energy_usage WHERE device_id = %s", (device_id,))
            device_usage = cursor.fetchall()
            return device_usage

    except Exception as e:
        logging.error(f"Error retrieving device usage: {e}")
        raise e
    finally:
        connection.close()

def monthly_energy_consumption_trend(user_id):
    connection = get_db()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""SELECT YEAR(time_stamp) AS Year, MONTH(time_stamp) AS Month, SUM(energy_usage) AS MonthlyEnergyConsumption
            FROM energy_usage
            WHERE device_id IN (SELECT id FROM devices WHERE location_id IN (SELECT id FROM service_locations WHERE user_id = %s))
            GROUP BY Year, Month
            ORDER BY Year, Month;
            """,user_id)
            monthly_energy_consumption = cursor.fetchall()
            return monthly_energy_consumption
    except Exception as e:
        logging.error()
        raise e
    finally:
        connection.close()

def energy_consumption_vs_sqft(user_id):
    connection = get_db()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""SELECT sl.squarefoot AS SquareFootage, SUM(eu.energy_usage) AS TotalEnergyConsumption
            FROM service_locations sl
            JOIN devices d ON sl.id = d.location_id
            JOIN energy_usage eu ON d.id = eu.device_id
            WHERE sl.user_id = %s
            GROUP BY sl.squarefoot;
            """,user_id)
            return cursor.fetchall()
    except Exception as e:
        logging.error()
        raise e
    finally:
        connection.close()

def peak_energy_usage_hours(user_id):
    connection = get_db()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""SELECT HOUR(time_stamp) AS HourOfDay, SUM(energy_usage) AS HourlyEnergyConsumption
            FROM energy_usage
            WHERE device_id IN (SELECT id FROM devices WHERE location_id IN (SELECT id FROM service_locations WHERE user_id = %s))
            GROUP BY HourOfDay
            ORDER BY HourOfDay;
            """,user_id)
            return cursor.fetchall()
    except Exception as e:
        logging.error()
        raise e
    finally:
        connection.close()

def avg_daily_energy_consumption_per_location(user_id):
    connection = get_db()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""SELECT sl.address AS Location, AVG(daily_energy) AS AverageDailyEnergyConsumption
                FROM (
                    SELECT eu.device_id, DATE(time_stamp) AS day, SUM(energy_usage) AS daily_energy
                    FROM energy_usage eu
                    JOIN devices d ON eu.device_id = d.id
                    WHERE d.location_id IN (SELECT id FROM service_locations WHERE user_id = %s)
                    GROUP BY eu.device_id, day
                ) AS daily_energy_data
                JOIN devices d ON daily_energy_data.device_id = d.id
                JOIN service_locations sl ON d.location_id = sl.id
                GROUP BY sl.address;
            """,user_id)
            return cursor.fetchall()
    except Exception as e:
        logging.error()
        raise e
    finally:
        connection.close()



def authenticate_user(username, password):
    connection = get_db()
    try:
        with connection.cursor() as cursor:
            # Retrieve user by username
            cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
            user = cursor.fetchone()

            if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
                return user
            else:
                return None

    except Exception as e:
        logging.error(f"Error authenticating user: {e}")
        raise e
    finally:
        connection.close()
