# YOPWebProject (YOP)

Your Own Planet is an interactive travel journal platform that allows users to document and share their travel experiences through map interactions. Users can create personal accounts, record their journeys with specific locations, and add detailed entries including photos and descriptions for each place they've visited.

## Features

- User Authentication
  - Create personal account
  - Secure login/logout functionality
  - Profile management

- Interactive Journey Recording
  - Create new journeys
  - Select locations directly on the map
  - Add detailed entries for each location:
    - Photos
    - Text descriptions
    - Timestamps
    - Geographic coordinates

- Map Integration
  - Interactive Google Maps interface
  - Visual representation of journey locations
  - Click-to-add location functionality

- Journey Management
  - View all personal journeys
  - Add/Edit journey details
  - Delete journeys
  - Search through journey records

## User Interaction Flow
1. User creates an account/logs in
2. Views personal dashboard with all recorded journeys
3. Can create a new journey:
   - Select location on map
   - Add photos and descriptions
   - Save journey details
4. Can view, edit, or delete existing journeys
5. Search through personal travel records

## Tech Stack

### Frontend
* React.js (https://reactjs.org/)
  - Frontend JavaScript library
  - Component-based UI development
* Google Maps API (https://developers.google.com/maps)
  - Interactive map integration
  - Geographical data visualization
* Axios for HTTP requests (https://axios-http.com/)
  - Handles API requests to backend
  - Data fetching and state updates

### Backend
* Node.js (https://nodejs.org/)
  - Cross-platform runtime environment
  - Built on Chrome's V8 JavaScript engine
* Express.js (https://www.expresjs.org/)
  - Web application framework for Node.js
  - Handles routing and middleware integration
* MongoDB (https://www.mongodb.com/)
  - Stores data in flexible, JSON-like documents
  - Provides high scalability and flexibility
* JWT for authentication (https://jwt.io/)
  - Secure user authentication
  - Token-based session management

## Setup and Installation

1. Clone the repository
```bash
git clone https://github.com/Zhouyuxin4/YOP-Milestone2.git
```

2. Install backend dependencies
```bash
cd YOPWebProject
npm install
```

3. Start the backend server
```bash
cd server
node server.js
```

5. Start the frontend application
```bash
cd ..
cd client
npm start
```

## API Endpoints
### User Routes

GET /users - Get All Users

GET /users/:userName - Get User by Username

POST /users - Create New User

DELETE /users/:userName - Delete User

PUT /users/:username - Update user profile

GET /users/:userName/search - Search User's Journeys


### Journey Routes

GET /journeys/:username - Get all journeys

GET /journeys/:userName/:journeyId- Get all journeys of one person

POST /journeys/:username - Create new journey

DELETE /journeys/:username/:journeyId - Delete journey

PUT /journeys/:journeyId - update journey

### Journey Details Routes

GET /details/:username/:journeyId/allDetails - Get all detail information of one journey  

GET /details/:username/:journeyId/:detailId -  Get one detail information of one journey 

POST /details/:userName/:journeyId/createDetails - Add journey detail

PUT /details/:userName/:journeyId/:detailId/update - Update detail

DELETE /details/:userName/:journeyId/:detailId - Delete detail


## Team Members

Xiyu Fan - [Backend Developer/Database management and backend develop]

Yuxin Zhou - [Frontend Developer/Frontend develop]

Wenwen Han - [Frontend Developer/Frontend develop]

## Acknowledgments

Google Maps API for location services

MongoDB Atlas for database hosting

## License
This project is available for use under the MIT License.

