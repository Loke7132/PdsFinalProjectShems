from app import app, models

if __name__ == '__main__':
    # Initialize the database
    models.init_db()
    
    # Run the application
    app.run(port=8000,debug=True)
