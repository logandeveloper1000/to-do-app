# To-Do List App

This is a full-featured, responsive To-Do List application built with React and Firebase. It supports user authentication via email/password and Google, with real-time task synchronization and full CRUD functionality.

## Live Demo

You can view the live project at:  
https://user-to-do-app.netlify.app/

## Features

- User authentication (Email/Password and Google Sign-In)
- Real-time data syncing using Firebase Firestore
- Create, edit, complete, and delete tasks
- Tasks are separated into "Your Tasks" and "Completed Tasks" sections
- Fully responsive design with a clean, modern UI
- Account deletion with automatic removal of all associated tasks
- Modal-based success and error feedback

## Technologies Used

- React
- Firebase Authentication
- Firebase Firestore (NoSQL database)
- React Router
- Custom CSS styling

## Project Structure

```
src/
├── components/
│   ├── MessageModal.js
│   └── TodoList.js
├── pages/
│   ├── Login.js
│   └── Signup.js
├── firebase.js
├── App.js
├── index.js
└── index.css
```

## Getting Started

### Prerequisites

- Node.js and npm
- Firebase project with Authentication and Firestore enabled

### Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com/)
2. Enable Authentication (Email/Password and Google Sign-In)
3. Enable Firestore Database
4. Create a web app and copy the Firebase config
5. Paste your config into `firebase.js` in the project

### Run Locally

Clone the repository and install dependencies:

```
git clone https://github.com/your-username/to-do-app.git
cd logan-to-do-list
npm install
npm start
```

## Firestore Security Rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/todos/{todoId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## License

This project is open-source and available under the MIT License.
