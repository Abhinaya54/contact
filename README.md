# Contact Manager

A modern contact management web application built with Flask and MongoDB. This project uses only Flask on the backend and HTML/CSS for the user interface.

## Requirements Covered

- **CRUD Operations**: Create, Read, Update, Delete contact records
- **User Interface**: Clean, responsive form and table UI for easy contact management
- **Data Validation**: Email and phone validation plus duplicate checks
- **Persistent Storage**: MongoDB for saved contact records

## Tech Stack

- **Backend**: Flask (Python)
- **Database**: MongoDB
- **Frontend**: HTML5, CSS3
- **Templating**: Jinja2
- **Styling**: Custom CSS

## Prerequisites

- Python 3.7 or newer
- MongoDB (local installation or MongoDB Atlas)
- pip

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Abhinaya54/contact.git
   cd contact
   ```

2. Install dependencies:
   ```bash
   pip install flask pymongo
   ```

3. Configure MongoDB:
   - For local MongoDB: make sure MongoDB is running on `localhost:27017`
   - For MongoDB Atlas: update the connection string in `app.py`

4. Update `app.py`:
   - Set the `MONGO_URI` to your MongoDB connection string
   - Example:
     ```python
     MONGO_URI = 'mongodb://localhost:27017/contactdb'
     ```

## Running the App

1. Start the Flask server:
   ```bash
   python app.py
   ```

2. Open the app in your browser:
   - `http://localhost:5000`

## Usage

### Add a Contact
- Fill in the contact form with first name, last name, email, phone, and address
- Click **Save Contact** to add it to the database

### Search Contacts
- Use the search box to filter contacts by name, email, phone, or address
- Click **Search** to view results
- Click **Clear** to remove the filter

### Edit a Contact
- Click **Edit** next to a contact
- Update the fields in the form
- Click **Update Contact** to save changes

### Delete a Contact
- Click **Delete** next to a contact
- Confirm the deletion if prompted

## Project Structure

```
contact/
├── app.py              # Flask application
├── templates/
│   └── index.html      # Main HTML template
├── static/
│   └── style.css       # CSS styles
└── README.md           # Project documentation
```

## Notes

- This repository is provided as a demo application.
- Live demo available at: https://full-one-xi.vercel.app/

## License

This project is open source and available under the MIT License.
