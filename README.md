# Contact Manager

A modern, responsive web application for managing contacts built with Flask and MongoDB.

## Features

- **Dashboard**: Overview of total contacts and recent additions
- **Add Contacts**: Modal-based form for adding new contacts
- **Contact Directory**: Searchable table of all contacts
- **Edit/Delete**: Inline editing and deletion with confirmation
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Clock**: Live date and time display

## Tech Stack

- **Backend**: Flask (Python)
- **Database**: MongoDB
- **Frontend**: HTML5, CSS3, JavaScript (ES6)
- **Styling**: Custom CSS with glassmorphism effects

## Prerequisites

- Python 3.7+
- MongoDB (local installation or MongoDB Atlas)
- pip (Python package manager)

## Installation

1. **Clone or download the project**:
   ```bash
   cd your-project-directory
   ```

2. **Install Python dependencies**:
   ```bash
   pip install flask pymongo
   ```

3. **Set up MongoDB**:
   - For local MongoDB: Ensure MongoDB is running on `localhost:27017`
   - For MongoDB Atlas: Update the connection string in `app.py`

4. **Configure the database**:
   - Open `app.py`
   - Update the `MONGO_URI` variable with your MongoDB connection string
   - Default: `mongodb://localhost:27017/contactdb`

## Running the Application

1. **Start the Flask server**:
   ```bash
   python app.py
   ```

2. **Open your browser**:
   - Navigate to `http://localhost:5000`
   - The Contact Manager dashboard will load

## Usage

### Adding Contacts
- Click "Add Contact" from the sidebar or dashboard
- Fill in the form fields (all fields are required)
- Click "Save Contact" to add to the database

### Viewing Contacts
- Use the "Directory" section to see all contacts
- Search by name, email, or phone number

### Editing Contacts
- Click the "Edit" button next to any contact
- Modify the information in the modal
- Click "Update Contact" to save changes

### Deleting Contacts
- Click the "Delete" button next to any contact
- Confirm the deletion in the popup

## API Endpoints

- `GET /api/contacts` - Retrieve all contacts
- `POST /api/contacts` - Add a new contact
- `PUT /api/contacts/<id>` - Update an existing contact
- `DELETE /api/contacts/<id>` - Delete a contact

## Project Structure

```
contact-manager/
├── app.py                 # Flask application
├── templates/
│   └── index.html         # Main HTML template
├── static/
│   ├── script.js          # Frontend JavaScript
│   └── style.css          # Stylesheet
└── README.md             # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.