# HotelHub

HotelHub is a web application designed to streamline the process of listing and reviewing hotels. With HotelHub, users can explore various hotel listings, leave reviews, and interact with other users. This project is built using Node.js, Express.js, MongoDB, and Passport.js for authentication.

## Direct link
**Check out the deployed project [here](https://hotelhub-86n8.onrender.com/listings).**
## Features

- **User Authentication:** Users can sign up, log in, and log out securely using Passport.js with a local strategy.
- **Hotel Listings:** Users can view a list of hotels available for review.
- **Hotel Details:** Users can view detailed information about each hotel, including reviews left by other users.
- **Reviews:** Users can leave reviews for hotels, including ratings and comments.
- **Flash Messages:** Flash messages are displayed for success and error notifications.
- **Error Handling:** Custom error handling middleware ensures smooth error handling throughout the application.
- **Session Management:** Session management is implemented using Express Session and Connect-Mongo for session storage.
- **Responsive Design:** The application is designed to be responsive and accessible across various devices.

## Installation

```sh
# Clone the repository:
git clone https://github.com/yourusername/HotelHub.git

# Navigate to the project directory:
cd HotelHub

# Install dependencies:
npm install
 ```
##Create a .env file in the root directory and define the following variables:
```sh
NODE_ENV=development
PORT=8080
ATLASDB=your_mongodb_connection_string
SECRET=your_session_secret
 ```
## Usage
```sh
node index.js
 ```
## Contributing
Contributions are welcome! If you find any bugs or have suggestions for improvements, please feel free to open an issue or submit a pull request.

## Acknowledgements
- **Express.js:** Web application framework for Node.js
- **MongoDB:** NoSQL database used for data storage
- **Passport.js:** Authentication middleware for Node.js
- **EJS:** Embedded JavaScript templates for rendering views
- **Bootstrap:** Front-end framework for responsive design
## Contact
For inquiries, please contact abk33916@gmail.com
