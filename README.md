# React + Python Backend Application

A full-stack application with a React frontend and Python Flask backend.

## Project Structure

```
.
├── frontend/          # React application
│   ├── src/
│   ├── public/
│   └── package.json
└── backend/           # Flask API server
    ├── app.py
    └── requirements.txt
```

## Prerequisites

- Node.js (v14 or higher)
- Python 3.8+
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python3 -m venv venv
```

3. Activate the virtual environment:
- On macOS/Linux:
```bash
source venv/bin/activate
```
- On Windows:
```bash
venv\Scripts\activate
```

4. Install Python dependencies:
```bash
pip install -r requirements.txt
```

5. Run the Flask server:
```bash
python app.py
```

The backend server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The React app will open in your browser at `http://localhost:3000`

## API Endpoints

The backend provides the following endpoints:

- `GET /api/hello` - Returns a hello message with timestamp
- `GET /api/data` - Returns a list of sample items
- `POST /api/echo` - Echoes back the JSON data sent to it

## Features

- React frontend with hooks (useState, useEffect)
- Flask backend with CORS enabled
- Example GET and POST requests
- Real-time data fetching from backend
- Clean separation of frontend and backend

## Development

### Running Both Servers

You'll need two terminal windows:

Terminal 1 (Backend):
```bash
cd backend
source venv/bin/activate  # On macOS/Linux
python app.py
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

## Technologies Used

### Frontend
- React 18
- JavaScript (ES6+)
- Fetch API

### Backend
- Python 3
- Flask
- Flask-CORS

## License

MIT