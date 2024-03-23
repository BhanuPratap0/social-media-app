# SocioSync - Social Media Platform

Welcome to the official repository of SocioSync, a full-fledged social media platform built with the MERN stack (MongoDB, Express.js, React, Node.js). Our application offers a comprehensive set of features that allow users to connect, share, and interact online. Experience SocioSync live: [https://sociosync.netlify.app/](https://sociosync.netlify.app/)

## Features

SocioSync provides a rich social media experience with features including:

- **User Authentication**: Secure sign-up/sign-in processes with password encryption.
- **Profile Customization**: Users can set up and customize their profiles, adding personal details and profile pictures.
- **Posts & Sharing**: Users can create posts, share images, and updates with friends or publicly.
- **Comments & Likes**: Interactive features that allow users to engage with content by commenting on posts and liking them.
- **Friend System**: Users can send, receive, and manage friend requests.
- **Search & Discover**: Find and connect with friends or explore content based on interests.

## Technologies

This project is implemented with the MERN stack, providing a seamless full-stack JavaScript experience:

- **MongoDB**: A document database used to store application data.
- **Express.js**: A web application framework for Node.js, used for building our RESTful APIs.
- **React**: A JavaScript library for building user interfaces, powering our front-end.
- **Node.js**: A JavaScript runtime environment that executes JavaScript code server-side, hosting our backend logic.

Additionally, the project employs various libraries and tools for development, including Mongoose for MongoDB object modeling, React Router for navigation, and many more.

## Getting Started

To run SocioSync locally, follow these steps:

### Prerequisites

Ensure you have Node.js and npm installed on your machine. MongoDB should be set up for local development or you can use MongoDB Atlas for a cloud-based solution.

### Installation

1. Clone the repository to your local machine:
    ```
    git clone https://github.com/your-username/sociosync.git
    ```
2. Navigate to the project directory:
    ```
    cd sociosync
    ```
3. Install the required dependencies for the server and client:
    - For the server:
        ```
        npm install
        ```
    - For the client, navigate to the client directory then install dependencies:
        ```
        cd client
        npm install
        ```

### Configuration

Create a `.env` file in the root directory of the project and add the necessary environment variables:
MONGO_URI=<Your_MongoDB_URI>
JWT_SECRET=<Your_JWT_Secret>


### Running the Application

1. Start the backend server:
    ```
    npm start
    ```
2. In a new terminal, navigate to the client directory and start the React app:
    ```
    cd client
    npm start
    ```

Your app should now be running on `http://localhost:3000`.

## Contributing

We welcome contributions to SocioSync! If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## Links

- Project homepage: [https://sociosync.netlify.app/](https://sociosync.netlify.app/)
- Repository: https://github.com/BhanuPratap0/social-media-app-frontend
- Issue tracker: https://github.com/BhanuPratap0/social-media-app/issues
  - In case of sensitive bugs like security vulnerab ilities, please contact singh28986@gmail.com. We value your effort to improve the security and privacy of this project!


SocioSync - Connecting the world, one post at a time.
